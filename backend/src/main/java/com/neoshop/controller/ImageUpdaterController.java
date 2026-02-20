package com.neoshop.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.jdbc.core.JdbcTemplate;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ImageUpdaterController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/api/internal/update-images")
    public String updateImages() {
        int steamCount = jdbcTemplate
                .update("UPDATE products SET image_url='/images/steam_wallet.png' WHERE title ILIKE '%Steam%'");
        int winCount = jdbcTemplate
                .update("UPDATE products SET image_url='/images/windows.png' WHERE title ILIKE '%Windows%'");
        int officeCount = jdbcTemplate.update(
                "UPDATE products SET image_url='/images/office.png' WHERE title ILIKE '%Office%' OR title ILIKE '%Microsoft%'");
        return String.format("Updated: Steam=%d, Win=%d, Office=%d", steamCount, winCount, officeCount);
    }
}
