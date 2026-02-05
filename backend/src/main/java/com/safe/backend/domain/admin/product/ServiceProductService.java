package com.safe.backend.domain.admin.product;

import com.safe.backend.domain.admin.product.dto.ServiceProductRequest;
import com.safe.backend.domain.admin.product.dto.ServiceProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ServiceProductService {

    private final ServiceProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ServiceProductResponse> findAll() {
        return productRepository.findAll().stream()
                .map(ServiceProductResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ServiceProductResponse create(ServiceProductRequest request) {
        ServiceProduct product = ServiceProduct.of(
                request.getName(),
                request.getPriceType() != null ? request.getPriceType() : com.safe.backend.domain.admin.product.PriceType.FREE,
                request.getSummary() != null ? request.getSummary() : "",
                request.getDescription() != null ? request.getDescription() : ""
        );
        if (request.getBaseCategoryId() != null) {
            product.setBaseCategoryId(request.getBaseCategoryId());
        }
        if (request.getMainImage() != null) {
            product.setMainImage(request.getMainImage());
        }
        if (request.getStatus() != null) {
            product.update(
                    product.getName(),
                    product.getPriceType(),
                    product.getSummary(),
                    product.getDescription(),
                    product.getMainImage(),
                    request.getStatus()
            );
        }
        return new ServiceProductResponse(productRepository.save(product));
    }

    @Transactional
    public ServiceProductResponse update(Long id, ServiceProductRequest request) {
        ServiceProduct product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));
        product.update(
                request.getName(),
                request.getPriceType() != null ? request.getPriceType() : com.safe.backend.domain.admin.product.PriceType.FREE,
                request.getSummary(),
                request.getDescription(),
                request.getMainImage(),
                request.getStatus()
        );
        return new ServiceProductResponse(product);
    }

    @Transactional
    public ServiceProductResponse toggleActive(Long id) {
        ServiceProduct product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));
        product.toggleActive();
        return new ServiceProductResponse(product);
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("존재하지 않는 상품입니다.");
        }
        productRepository.deleteById(id);
    }
}
