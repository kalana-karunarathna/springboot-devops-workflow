package com.fms.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public String register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        Optional<User> existingUser = userRepository.findByEmail(normalizedEmail);

        if (existingUser.isPresent()) {
            return "User already exists";
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(normalizedEmail);
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        user.setProvider("LOCAL");

        userRepository.save(user);

        return "User registered successfully";
    }

    public String login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(normalizeEmail(request.getEmail()));

        if (userOpt.isEmpty()) {
            return "User not found";
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(request.getPassword())) {
            return "Invalid password";
        }

        return "Login successful";
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(normalizeEmail(email)).orElse(null);
    }

    public long getUserCount() {
        return userRepository.count();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User saveGoogleUser(String name, String email) {
        String normalizedEmail = normalizeEmail(email);
        Optional<User> existingUser = userRepository.findByEmail(normalizedEmail);

        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        User user = new User();
        user.setName(name);
        user.setEmail(normalizedEmail);
        user.setPassword("");
        user.setRole("USER");
        user.setProvider("GOOGLE");

        return userRepository.save(user);
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
