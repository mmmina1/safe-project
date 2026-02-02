package com.safe.backend.domain.admin.product;

import com.safe.backend.domain.admin.product.dto.ServiceProductRequest;
import com.safe.backend.domain.admin.product.dto.ServiceProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/products")
public class ServiceProductController {

    private final ServiceProductService productService;

    @GetMapping
    public ResponseEntity<List<ServiceProductResponse>> list() {
        return ResponseEntity.ok(productService.findAll());
    }

    @PostMapping
    public ResponseEntity<ServiceProductResponse> create(@RequestBody ServiceProductRequest request) {
        return ResponseEntity.ok(productService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceProductResponse> update(
            @PathVariable Long id,
            @RequestBody ServiceProductRequest request
    ) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ServiceProductResponse> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(productService.toggleActive(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok().build();
    }
}
