package com.phishguard.api.controllers;

import com.phishguard.api.models.User;
import com.phishguard.api.services.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // GET /api/admin/users — All users (ADMIN only)
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = adminService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch users: " + e.getMessage());
        }
    }

    // DELETE /api/admin/users/{id} — Delete user (ADMIN only)
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete user: " + e.getMessage());
        }
    }

    // GET /api/admin/analytics — Platform analytics (ADMIN only)
    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAnalytics() {
        try {
            Map<String, Object> analytics = adminService.getAnalytics();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch analytics: " + e.getMessage());
        }
    }

    // GET /api/admin/dashboard — Combined dashboard data (ADMIN only)
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboard() {
        try {
            Map<String, Object> analytics = adminService.getAnalytics();
            List<User> users = adminService.getAllUsers();

            Map<String, Object> dashboard = new java.util.HashMap<>();
            dashboard.put("analytics", analytics);
            dashboard.put("totalUsers", users.size());
            dashboard.put("recentUsers", users.stream().limit(5).toList());

            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch dashboard: " + e.getMessage());
        }
    }
}
