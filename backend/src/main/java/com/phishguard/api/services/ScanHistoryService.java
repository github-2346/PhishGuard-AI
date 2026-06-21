package com.phishguard.api.services;

import com.phishguard.api.models.ScanHistory;
import com.phishguard.api.models.User;
import com.phishguard.api.repositories.ScanHistoryRepository;
import com.phishguard.api.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ScanHistoryService {

    private final ScanHistoryRepository scanHistoryRepository;
    private final UserRepository userRepository;

    public ScanHistoryService(ScanHistoryRepository scanHistoryRepository, UserRepository userRepository) {
        this.scanHistoryRepository = scanHistoryRepository;
        this.userRepository = userRepository;
    }

    public ScanHistory saveScanHistory(String email, String content, String scanType, String riskLevel) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            ScanHistory history = new ScanHistory();
            history.setUser(userOpt.get());
            history.setContent(content);
            history.setScanType(scanType);
            history.setRiskLevel(riskLevel);
            history.setCreatedAt(LocalDateTime.now());
            return scanHistoryRepository.save(history);
        }
        throw new RuntimeException("User not found");
    }

    public List<ScanHistory> getUserScanHistory(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return scanHistoryRepository.findByUserIdOrderByCreatedAtDesc(userOpt.get().getId());
        }
        throw new RuntimeException("User not found");
    }
}
