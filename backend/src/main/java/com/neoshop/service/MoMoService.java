package com.neoshop.service;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class MoMoService {

    @Value("${momo.partnerCode}")
    private String partnerCode;

    @Value("${momo.accessKey}")
    private String accessKey;

    @Value("${momo.secretKey}")
    private String secretKey;

    @Value("${momo.endpoint}")
    private String endpoint;

    @Value("${momo.redirectUrl}")
    private String redirectUrl;

    @Value("${momo.ipnUrl}")
    private String ipnUrl;

    private static final String HMAC_SHA256 = "HmacSHA256";

    // Tạo chuỗi HMAC SHA256 dạng hex
    private String signHmacSHA256(String data, String secretKey) throws Exception {
        Mac sha256HMAC = Mac.getInstance(HMAC_SHA256);
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), HMAC_SHA256);
        sha256HMAC.init(secretKeySpec);
        byte[] hash = sha256HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public String createPaymentUrl(UUID orderId, long amount, String orderInfo) {
        try {
            String requestId = UUID.randomUUID().toString();
            String stringOrderId = orderId.toString();
            String requestType = "captureWallet";
            String extraData = "";
            String finalRedirectUrl = redirectUrl;

            // Chuỗi chữ ký gốc
            String rawSignature = "accessKey=" + accessKey +
                    "&amount=" + amount +
                    "&extraData=" + extraData +
                    "&ipnUrl=" + ipnUrl +
                    "&orderId=" + stringOrderId +
                    "&orderInfo=" + orderInfo +
                    "&partnerCode=" + partnerCode +
                    "&redirectUrl=" + finalRedirectUrl +
                    "&requestId=" + requestId +
                    "&requestType=" + requestType;

            // Tạo chữ ký
            String signature = signHmacSHA256(rawSignature, secretKey);

            // Tạo body request JSON
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("partnerCode", partnerCode);
            requestBody.put("partnerName", "NeoShop");
            requestBody.put("storeId", "NeoShop");
            requestBody.put("requestId", requestId);
            requestBody.put("amount", amount);
            requestBody.put("orderId", stringOrderId);
            requestBody.put("orderInfo", orderInfo);
            requestBody.put("redirectUrl", finalRedirectUrl);
            requestBody.put("ipnUrl", ipnUrl);
            requestBody.put("lang", "vi");
            requestBody.put("requestType", requestType);
            requestBody.put("autoCapture", true);
            requestBody.put("extraData", extraData);
            requestBody.put("signature", signature);

            // Gửi request POST tới MoMo
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, entity, Map.class);

            @SuppressWarnings("unchecked")
            Map<String, Object> responseBody = (Map<String, Object>) response.getBody();

            if (responseBody != null && responseBody.containsKey("payUrl")) {
                return (String) responseBody.get("payUrl");
            } else {
                return finalRedirectUrl; // Fallback khi thất bại
            }
        } catch (Exception e) {
            log.error("Lỗi tạo URL thanh toán MoMo: {}", e.getMessage());
            return redirectUrl;
        }
    }

    public Map<String, Object> processIpn(Map<String, Object> requestBody,
            com.neoshop.service.OrderService orderService) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (requestBody == null || !requestBody.containsKey("orderId") || !requestBody.containsKey("resultCode")) {
                response.put("status", "error");
                return response;
            }

            String orderIdStr = (String) requestBody.get("orderId");
            int resultCode = (Integer) requestBody.get("resultCode");

            // Xác thực chữ ký tại đây nếu cần (bỏ qua cho sandbox)

            UUID orderId = UUID.fromString(orderIdStr);
            if (resultCode == 0) {
                orderService.updateOrderStatus(orderId, "PAID");
            } else {
                orderService.updateOrderStatus(orderId, "FAILED");
            }

            response.put("status", "success");
            return response;
        } catch (Exception e) {
            log.error("Lỗi xử lý MoMo IPN: {}", e.getMessage());
            response.put("status", "error");
            return response;
        }
    }
}
