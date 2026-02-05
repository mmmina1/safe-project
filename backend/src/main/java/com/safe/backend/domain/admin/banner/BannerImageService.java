package com.safe.backend.domain.admin.banner;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class BannerImageService {

    private static final String BANNERS_SUBDIR = "banners";
    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5MB
    private static final String[] ALLOWED_CONTENT_TYPES = {
            "image/jpeg", "image/png", "image/gif", "image/webp"
    };

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    /**
     * 이미지 파일을 저장하고 접근 URL 경로를 반환합니다.
     * @return 예: "/uploads/banners/abc-123.jpg"
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

        Path basePath = Paths.get(uploadDir).resolve(BANNERS_SUBDIR).toAbsolutePath();
        Files.createDirectories(basePath);

        String ext = getExtension(contentType);
        String filename = UUID.randomUUID().toString() + ext;
        Path target = basePath.resolve(filename);
        Files.copy(file.getInputStream(), target);

        return "/uploads/" + BANNERS_SUBDIR + "/" + filename;
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
