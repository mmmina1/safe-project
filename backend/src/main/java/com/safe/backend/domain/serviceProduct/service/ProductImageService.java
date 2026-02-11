package com.safe.backend.domain.serviceProduct.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.safe.backend.domain.serviceProduct.entity.Product;
import com.safe.backend.domain.serviceProduct.repository.ProductRepository;
import com.safe.backend.global.s3.S3Uploader;

import lombok.RequiredArgsConstructor;

@Service("productMainImageService")
@RequiredArgsConstructor
@Transactional
public class ProductImageService {

    private final ProductRepository productRepository;
    private final S3Uploader s3Uploader;

    public String uploadMainImage(Long productId, MultipartFile file) throws Exception {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("product not found"));

        if (p.getMainImage() != null && !p.getMainImage().isBlank()) {
            s3Uploader.delete(extractKey(p.getMainImage()));
        }

        var up = s3Uploader.uploadWithKey(file, "products");
        p.changeMainImage(up.url());
        return up.url();
    }

    @Transactional(readOnly = true)
    public String getMainImage(Long productId) {
        return productRepository.findById(productId)
                .map(Product::getMainImage)
                .orElse(null);
    }

    public void deleteMainImage(Long productId) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("product not found"));

        if (p.getMainImage() != null && !p.getMainImage().isBlank()) {
            s3Uploader.delete(extractKey(p.getMainImage()));
        }
        p.changeMainImage(null);
    }

    private String extractKey(String url) {
        int i = url.indexOf(".amazonaws.com/");
        if (i == -1) i = url.indexOf(".amazonaws.com.cn/");
        if (i == -1) throw new IllegalArgumentException("not an s3 url: " + url);

        String key = url.substring(i + ".amazonaws.com/".length());
        int q = key.indexOf("?");
        return q >= 0 ? key.substring(0, q) : key;
    }

}
