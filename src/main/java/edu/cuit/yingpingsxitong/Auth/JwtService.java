package edu.cuit.yingpingsxitong.Auth;

import edu.cuit.yingpingsxitong.Entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
@RefreshScope
public class JwtService {
    @Value("${app.auth.jwt-secret}")
    private String jwtSecret;

    @Value("${app.auth.jwt-expiration-ms}")
    private long expirationMs;

    private SecretKey signingKey;

    @PostConstruct
    public void init() {
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(String.valueOf(user.getUserId()))
                .claim("username", user.getUsername())
                .claim("manager", user.getManager())
                .issuedAt(now)
                .expiration(expiresAt)
                .signWith(signingKey)
                .compact();
    }

    public Integer extractUserId(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Integer.valueOf(claims.getSubject());
        } catch (JwtException | IllegalArgumentException ex) {
            return null;
        }
    }
}
