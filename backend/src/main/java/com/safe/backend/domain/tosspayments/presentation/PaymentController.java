package com.safe.backend.domain.tosspayments.presentation;

import com.safe.backend.domain.tosspayments.domain.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmPayment(@RequestBody Map<String, String> request) {
        log.info("결제 승인 요청 수신: orderId={}, amount={}", request.get("orderId"), request.get("amount"));
        String paymentKey = request.get("paymentKey");
        String orderId = request.get("orderId");
        String amount = request.get("amount");

        return paymentService.confirmPayment(paymentKey, orderId, amount);
    }
}
