package com.sms.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String auth = request.getHeader("Authorization");

        String token = null;

        // ✅ normal API calls (Postman/axios) use Authorization header
        if (auth != null && auth.startsWith("Bearer ")) {
            token = auth.substring(7);
        } else {
            // ✅ SSE EventSource cannot send headers → use ?token=
            token = request.getParameter("token");
        }

        if (token == null || token.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String email = jwtService.getEmail(token);
            String role = jwtService.getRole(token);

            String authority = (role != null && role.startsWith("ROLE_"))
                    ? role
                    : "ROLE_" + role;

            var authToken = new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    List.of(new SimpleGrantedAuthority(authority))
            );

            SecurityContextHolder.getContext().setAuthentication(authToken);

        } catch (Exception e) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}

/*package com.sms.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String auth = request.getHeader("Authorization");

        // ✅ token from header OR from query param (SSE)
        String token = null;
        if (auth != null && auth.startsWith("Bearer ")) {
            token = auth.substring(7);
        } else {
            token = request.getParameter("token");
        }

        // no token => continue
        if (token == null || token.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String email = jwtService.getEmail(token);
            String role = jwtService.getRole(token);

            // ✅ handle both "ADMIN" and "ROLE_ADMIN"
            String authority = (role != null && role.startsWith("ROLE_"))
                    ? role
                    : "ROLE_" + role;

            var authToken = new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    List.of(new SimpleGrantedAuthority(authority))
            );

            SecurityContextHolder.getContext().setAuthentication(authToken);

        } catch (Exception e) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}*/