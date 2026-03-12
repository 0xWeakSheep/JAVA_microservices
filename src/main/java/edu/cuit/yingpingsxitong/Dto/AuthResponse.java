package edu.cuit.yingpingsxitong.Dto;

import edu.cuit.yingpingsxitong.Entity.User;

public record AuthResponse(String token, User user) {
}
