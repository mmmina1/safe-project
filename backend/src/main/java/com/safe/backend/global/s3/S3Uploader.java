package com.safe.backend.global.s3;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.CannedAccessControlList;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class S3Uploader {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public UploadResult uploadWithKey(MultipartFile file, String dirName) throws IOException {

        String key = "products/" + UUID.randomUUID() + "_" + safe(file.getOriginalFilename());

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        PutObjectRequest putObjectRequest = new PutObjectRequest(
            bucket,
            key,
            file.getInputStream(),
            metadata
        );

        amazonS3.putObject(putObjectRequest);

        String url = amazonS3.getUrl(bucket, key).toString();
        return new UploadResult(url, key);
    }

    public void delete(String key) {
        if (key == null || key.isBlank()) return;
        amazonS3.deleteObject(bucket, key);
    }

    private String safe(String name) {
        return (name == null) ? "file" : name.replace("\\", "_").replace("/", "_");
    }

    public record UploadResult(String url, String key) {}
}
