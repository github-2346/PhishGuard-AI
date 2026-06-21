package com.phishguard.api.services;

import com.phishguard.api.models.Report;
import com.phishguard.api.models.User;
import com.phishguard.api.repositories.ReportRepository;
import com.phishguard.api.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    public Report generateReport(String email, String reportDetails, String reportType,
                                  String riskLevel, String targetContent) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) throw new RuntimeException("User not found");

        Report report = Report.builder()
                .user(userOpt.get())
                .reportDetails(reportDetails)
                .reportType(reportType)
                .riskLevel(riskLevel)
                .targetContent(targetContent)
                .build();

        return reportRepository.save(report);
    }

    public List<Report> getUserReports(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) throw new RuntimeException("User not found");
        return reportRepository.findByUserIdOrderByCreatedAtDesc(userOpt.get().getId());
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }
}
