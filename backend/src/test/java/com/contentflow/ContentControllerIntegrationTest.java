package com.contentflow;

import com.contentflow.dto.ContentRequestDto;
import com.contentflow.model.ContentStatus;
import com.contentflow.model.ContentType;
import com.contentflow.model.Platform;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ContentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/health should return UP status")
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"));
    }

    @Test
    @DisplayName("GET /api/contents/stats should return dynamic counts")
    void testStatsEndpoint() throws Exception {
        mockMvc.perform(get("/api/contents/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalContent").isNumber())
                .andExpect(jsonPath("$.data.draftsCount").isNumber())
                .andExpect(jsonPath("$.data.scheduledCount").isNumber())
                .andExpect(jsonPath("$.data.publishedCount").isNumber())
                .andExpect(jsonPath("$.data.weeklyOverview").isArray());
    }

    @Test
    @DisplayName("POST /api/contents should create content and persist to H2")
    void testCreateContentEndpoint() throws Exception {
        ContentRequestDto requestDto = new ContentRequestDto(
                "Integration Test Article",
                "Full markdown article body testing end-to-end persistence in Spring Boot and H2.",
                ContentType.BLOG_DRAFT,
                Platform.BLOG,
                ContentStatus.DRAFT,
                null,
                "integration,test",
                "QA Engineer"
        );

        mockMvc.perform(post("/api/contents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.title").value("Integration Test Article"))
                .andExpect(jsonPath("$.data.status").value("DRAFT"));
    }

    @Test
    @DisplayName("POST /api/contents should return 400 when title is missing")
    void testCreateContentValidationFailure() throws Exception {
        ContentRequestDto invalidDto = new ContentRequestDto(
                "", // empty title
                "Some body",
                ContentType.SOCIAL_POST,
                Platform.TWITTER_X,
                ContentStatus.DRAFT,
                null,
                null,
                null
        );

        mockMvc.perform(post("/api/contents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
