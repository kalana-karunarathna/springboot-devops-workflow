package com.fms.config;

import com.fms.auth.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.CookieClearingLogoutHandler;

import java.util.LinkedHashMap;
import java.util.Map;

@Configuration
public class SecurityConfig {

    private final AuthService authService;
    private final String frontendUrl;

    public SecurityConfig(
            AuthService authService,
            @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl
    ) {
        this.authService = authService;
        this.frontendUrl = frontendUrl == null ? "http://localhost:5173" : frontendUrl.replaceAll("/+$", "");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            OAuth2AuthorizationRequestResolver authorizationRequestResolver
    ) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/oauth2/**", "/login/**").permitAll()
                .anyRequest().permitAll()
            )
            .oauth2Login(oauth -> oauth
                .authorizationEndpoint(authorization -> authorization
                    .authorizationRequestResolver(authorizationRequestResolver)
                )
                .successHandler((request, response, authentication) -> {
                    OAuth2User principal = (OAuth2User) authentication.getPrincipal();
                    authService.saveGoogleUser(
                        principal.getAttribute("name"),
                        principal.getAttribute("email")
                    );
                    response.sendRedirect(frontendHomeUrl());
                })
            )
            .logout(logout -> logout
                .invalidateHttpSession(true)
                .clearAuthentication(true)
                .deleteCookies("JSESSIONID")
                .addLogoutHandler(new CookieClearingLogoutHandler("JSESSIONID"))
                .logoutSuccessHandler((request, response, authentication) -> response.sendRedirect(frontendHomeUrl()))
            )
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    public OAuth2AuthorizationRequestResolver authorizationRequestResolver(
            ClientRegistrationRepository clientRegistrationRepository
    ) {
        DefaultOAuth2AuthorizationRequestResolver defaultResolver =
                new DefaultOAuth2AuthorizationRequestResolver(clientRegistrationRepository, "/oauth2/authorization");

        return new OAuth2AuthorizationRequestResolver() {
            @Override
            public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
                return customize(defaultResolver.resolve(request));
            }

            @Override
            public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientRegistrationId) {
                return customize(defaultResolver.resolve(request, clientRegistrationId));
            }

            private OAuth2AuthorizationRequest customize(OAuth2AuthorizationRequest request) {
                if (request == null) {
                    return null;
                }

                Map<String, Object> additionalParameters = new LinkedHashMap<>(request.getAdditionalParameters());
                additionalParameters.put("prompt", "select_account");

                return OAuth2AuthorizationRequest.from(request)
                        .additionalParameters(additionalParameters)
                        .build();
            }
        };
    }

    private String frontendHomeUrl() {
        return frontendUrl + "/";
    }
}
