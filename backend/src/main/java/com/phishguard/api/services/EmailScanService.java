package com.phishguard.api.services;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class EmailScanService {

    private static final String[] PHISHING_KEYWORDS = {
            "urgent", "password", "verify", "account suspended", "click here", "confirm your",
            "update required", "limited time", "act now", "prize", "winner", "free",
            "congratulations", "wire transfer", "bank account", "social security", "ssn", "credit card"
    };

    public Map<String, Object> analyzeEmail(String content) {
        Map<String, Object> result = new HashMap<>();

        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Email content cannot be empty");
        }

        String lowerContent = content.toLowerCase();
        
        int keywordHits = 0;
        java.util.List<String> suspiciousKeywords = new java.util.ArrayList<>();
        for (String keyword : PHISHING_KEYWORDS) {
            if (lowerContent.contains(keyword)) {
                keywordHits++;
                suspiciousKeywords.add(keyword);
            }
        }

        boolean hasLinks = Pattern.compile("https?://\\S+", Pattern.CASE_INSENSITIVE).matcher(content).find();
        boolean hasUrgency = Pattern.compile("urgent|immediately|asap|now|today|expire|deadline", Pattern.CASE_INSENSITIVE).matcher(content).find();
        boolean hasCreds = Pattern.compile("password|username|login|verify|account|ssn|credit card", Pattern.CASE_INSENSITIVE).matcher(content).find();
        boolean hasSocial = Pattern.compile("dear customer|dear user|congratulations|you have been selected", Pattern.CASE_INSENSITIVE).matcher(content).find();

        int score = Math.min(95, (keywordHits * 12) + (hasLinks ? 15 : 0) + (hasUrgency ? 10 : 0) + (hasCreds ? 20 : 0));
        String level = score > 60 ? "HIGH" : (score > 30 ? "MEDIUM" : "LOW");

        result.put("scanId", "EML-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        result.put("riskLevel", level);
        result.put("riskScore", Math.max(score, 5));
        result.put("credentialRequest", hasCreds);
        result.put("urgencyDetected", hasUrgency);
        result.put("maliciousLinks", hasLinks && !level.equals("LOW"));
        result.put("socialEngineering", hasSocial);
        
        // Return max 8 keywords
        result.put("suspiciousKeywords", suspiciousKeywords.subList(0, Math.min(8, suspiciousKeywords.size())));

        String recommendation = "Email appears legitimate. No significant threats detected.";
        if (level.equals("HIGH")) {
            recommendation = "This email exhibits multiple phishing characteristics. Do not click any links or provide any information.";
        } else if (level.equals("MEDIUM")) {
            recommendation = "Suspicious patterns detected. Verify the sender before taking any action.";
        }
        result.put("recommendation", recommendation);

        Map<String, Integer> distribution = new HashMap<>();
        distribution.put("credentialTheft", hasCreds ? 45 : 5);
        distribution.put("urgencyManipulation", hasUrgency ? 30 : 5);
        distribution.put("maliciousLinks", hasLinks ? 15 : 0);
        distribution.put("socialEngineering", hasSocial ? 10 : 0);
        
        result.put("distribution", distribution);
        result.put("scannedAt", LocalDateTime.now().toString());

        return result;
    }
}
