package com.phishguard.api.controllers;

import com.phishguard.api.services.ScanHistoryService;
import com.phishguard.api.services.UrlScanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/scanner")
@CrossOrigin(origins = "*")
public class UrlScannerController {

    private final UrlScanService urlScanService;
    private final ScanHistoryService scanHistoryService;

    public UrlScannerController(UrlScanService urlScanService, ScanHistoryService scanHistoryService) {
        this.urlScanService = urlScanService;
        this.scanHistoryService = scanHistoryService;
    }

    @PostMapping("/url")
    public ResponseEntity<?> scanUrl(@RequestBody Map<String, String> request,
                                      Authentication authentication) {
        String url = request.get("url");
        if (url == null || url.isBlank()) {
            return ResponseEntity.badRequest().body("URL is required");
        }

        try {
            Map<String, Object> result = urlScanService.scanUrl(url);

            // Auto-save to scan history if user is logged in
            if (authentication != null && authentication.isAuthenticated()) {
                String riskLevel = (String) result.get("threatLevel");
                try {
                    scanHistoryService.saveScanHistory(
                            authentication.getName(),
                            url,
                            "URL",
                            riskLevel != null ? riskLevel : "UNKNOWN"
                    );
                } catch (Exception ignored) {
                    // Don't fail the scan if history save fails
                }
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Scan failed: " + e.getMessage());
        }
    }
}
