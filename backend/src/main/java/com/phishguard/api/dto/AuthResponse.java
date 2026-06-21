package com.phishguard.api.dto;

import lombok.Builder;
import lombok.Data;
import com.phishguard.api.models.Role;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private Role role;
}
