package com.phishguard.api.services;

import com.phishguard.api.models.User;
import com.phishguard.api.repositories.ReportRepository;
import com.phishguard.api.repositories.ScanHistoryRepository;
import com.phishguard.api.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ScanHistoryRepository scanHistoryRepository;
    private final ReportRepository reportRepository;

    public AdminService(UserRepository userRepository,
                        ScanHistoryRepository scanHistoryRepository,
                        ReportRepository reportRepository) {
        this.userRepository = userRepository;
        this.scanHistoryRepository = scanHistoryRepository;
        this.reportRepository = reportRepository;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Delete user by ID
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }

    // Platform analytics summary
    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        long totalUsers   = userRepository.count();
        long totalScans   = scanHistoryRepository.count();
        long totalReports = reportRepository.count();

        // Count threats from scan history (risk_level = HIGH)
        List<?> allHistory = scanHistoryRepository.findAll();
        long highRisk = allHistory.stream()
                .filter(h -> {
                    try {
                        var riskField = h.getClass().getDeclaredField("riskLevel");
                        riskField.setAccessible(true);
                        return "HIGH".equals(riskField.get(h));
                    } catch (Exception e) { return false; }
                }).count();

        analytics.put("totalUsers",    totalUsers);
        analytics.put("totalScans",    totalScans);
        analytics.put("totalReports",  totalReports);
        analytics.put("threatsBlocked", highRisk);
        analytics.put("detectionRate",  totalScans > 0 ? String.format("%.1f%%", (highRisk * 100.0 / totalScans)) : "0%");
        analytics.put("platformStatus", "Online");

        return analytics;
    }
}
