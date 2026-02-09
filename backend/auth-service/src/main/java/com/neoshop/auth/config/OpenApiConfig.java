package com.neoshop.auth.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("NeoShop Auth Service API")
                        .version("1.0")
                        .description("Tài liệu API cho dịch vụ Xác thực và Người dùng của NeoShop.")
                        .contact(new Contact()
                                .name("NeoShop Support")
                                .email("support@neoshop.vn")));
    }
}
