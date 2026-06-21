package com.phishguard.api.controllers;

import com.phishguard.api.models.Report;
import com.phishguard.api.services.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // GET /api/reports — Get current user's reports
    @GetMapping
    public ResponseEntity<?> getUserReports(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        try {
            List<Report> reports = reportService.getUserReports(authentication.getName());
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST /api/reports/generate — Generate a new report from scan result
    @PostMapping("/generate")
    public ResponseEntity<?> generateReport(
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        try {
            Report report = reportService.generateReport(
                    authentication.getName(),
                    body.getOrDefault("reportDetails", ""),
                    body.getOrDefault("reportType", "URL_SCAN"),
                    body.getOrDefault("riskLevel", "LOW"),
                    body.getOrDefault("targetContent", "")
            );
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
