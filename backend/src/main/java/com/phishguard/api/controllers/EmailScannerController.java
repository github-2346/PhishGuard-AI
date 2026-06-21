package com.phishguard.api.controllers;

import com.phishguard.api.services.EmailScanService;
import com.phishguard.api.services.ScanHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/scanner")
@CrossOrigin(origins = "*")
public class EmailScannerController {

    private final EmailScanService emailScanService;
    private final ScanHistoryService scanHistoryService;

    public EmailScannerController(EmailScanService emailScanService, ScanHistoryService scanHistoryService) {
        this.emailScanService = emailScanService;
        this.scanHistoryService = scanHistoryService;
    }

    @PostMapping("/email")
    public ResponseEntity<?> scanEmail(@RequestBody Map<String, String> request,
                                        Authentication authentication) {
        String content = request.get("content");
        if (content == null || content.isBlank()) {
            return ResponseEntity.badRequest().body("Email content is required");
        }

        try {
            Map<String, Object> result = emailScanService.analyzeEmail(content);

            // Auto-save to scan history if user is logged in
            if (authentication != null && authentication.isAuthenticated()) {
                String riskLevel = (String) result.get("riskLevel");
                try {
                    scanHistoryService.saveScanHistory(
                            authentication.getName(),
                            content.length() > 100 ? content.substring(0, 100) + "..." : content,
                            "EMAIL",
                            riskLevel != null ? riskLevel : "UNKNOWN"
                    );
                } catch (Exception ignored) {
                    // Don't fail the scan if history save fails
                }
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Email analysis failed: " + e.getMessage());
        }
    }
}
