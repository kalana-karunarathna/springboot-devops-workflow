package com.fms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		// ⚠️ TEMPORARY — Member 4 will replace this with OAuth2 + roles
		http.csrf(csrf -> csrf.disable())
			.cors(Customizer.withDefaults())
			.authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
			.httpBasic(basic -> basic.disable())
			.formLogin(form -> form.disable());

		return http.build();
	}
}
