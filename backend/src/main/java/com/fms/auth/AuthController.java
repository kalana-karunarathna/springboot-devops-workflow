package com.fms.auth;

import com.fms.common.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ApiResponse<String> register(@RequestBody RegisterRequest request) {
        String message = authService.register(request);

        if ("User registered successfully".equals(message)) {
            return new ApiResponse<>(true, message, null);
        }

        return new ApiResponse<>(false, message, null);
    }

    @PostMapping("/login")
    public ApiResponse<String> login(@RequestBody LoginRequest request) {
        String message = authService.login(request);

        if ("Login successful".equals(message)) {
            return new ApiResponse<>(true, message, null);
        }

        return new ApiResponse<>(false, message, null);
    }

    @GetMapping("/me")
    public ApiResponse<User> getCurrentUser(@RequestParam String email) {
        User user = authService.getUserByEmail(email);

        if (user == null) {
            return new ApiResponse<>(false, "User not found", null);
        }

        return new ApiResponse<>(true, "User fetched successfully", user);
    }

    @GetMapping("/google-user")
    public ApiResponse<Map<String, Object>> getGoogleUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User oauth2User)) {
            return ApiResponse.success("User not authenticated", Collections.emptyMap());
        }

        return ApiResponse.success("Google user fetched successfully", oauth2User.getAttributes());
    }

    @GetMapping("/admin/users")
    public ApiResponse<List<User>> getAllUsers() {
        return ApiResponse.success("Users fetched successfully", authService.getAllUsers());
    }

    @GetMapping("/admin/users/count")
    public ApiResponse<Long> getUserCount() {
        return ApiResponse.success("User count fetched successfully", authService.getUserCount());
    }
}
