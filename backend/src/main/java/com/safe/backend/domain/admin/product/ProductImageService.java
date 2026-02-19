package com.safe.backend.domain.admin.product;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service("adminProductImageService")
public class ProductImageService {

    private static final String PRODUCTS_SUBDIR = "products";
    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5MB
    private static final String[] ALLOWED_CONTENT_TYPES = {
            "image/jpeg", "image/png", "image/gif", "image/webp"
    };

    @Value("${aws.s3.bucket-name:}")
    private String bucketName;

    @Value("${aws.s3.region:ap-northeast-2}")
    private String region;

    @Value("${aws.s3.access-key:}")
    private String accessKey;

    @Value("${aws.s3.secret-key:}")
    private String secretKey;

    @Value("${aws.s3.enabled:false}")
    private boolean s3Enabled;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    /**
     * 이미지 파일을 저장하고 접근 URL 경로를 반환합니다.
     * S3가 활성화되어 있으면 S3에 저장, 아니면 로컬 저장소에 저장
     * @return 예: S3인 경우 "https://bucket.s3.region.amazonaws.com/products/abc-123.jpg"
     *            로컬인 경우 "/uploads/products/abc-123.jpg"
     */
    public String saveImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어 있습니다.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !isAllowedContentType(contentType)) {
            throw new IllegalArgumentException("허용된 이미지 형식이 아닙니다. (jpg, png, gif, webp)");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new IllegalArgumentException("파일 크기는 5MB 이하여야 합니다.");
        }

        String ext = getExtension(contentType);
        String filename = UUID.randomUUID().toString() + ext;
        String key = PRODUCTS_SUBDIR + "/" + filename;

        if (s3Enabled && bucketName != null && !bucketName.isEmpty()) {
            return uploadToS3(file, key, contentType);
        } else {
            return saveToLocal(file, filename);
        }
    }

    private String uploadToS3(MultipartFile file, String key, String contentType) throws IOException {
        try (S3Client s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build()) {

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(putObjectRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // S3 URL 반환
            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
        }
    }

    private String saveToLocal(MultipartFile file, String filename) throws IOException {
        java.nio.file.Path basePath = java.nio.file.Paths.get(uploadDir).resolve(PRODUCTS_SUBDIR).toAbsolutePath();
        java.nio.file.Files.createDirectories(basePath);
        java.nio.file.Path target = basePath.resolve(filename);
        java.nio.file.Files.copy(file.getInputStream(), target);
        return "/uploads/" + PRODUCTS_SUBDIR + "/" + filename;
    }

    private boolean isAllowedContentType(String contentType) {
        for (String allowed : ALLOWED_CONTENT_TYPES) {
            if (allowed.equalsIgnoreCase(contentType)) return true;
        }
        return false;
    }

    private String getExtension(String contentType) {
        if (contentType == null) return ".jpg";
        return switch (contentType.toLowerCase()) {
            case "image/png" -> ".png";
            case "image/gif" -> ".gif";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }
}
