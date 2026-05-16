package com.samibentebbiche.ChallengeApp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class Challenge {
    @Id
    private Long id;

    private LocalDate eventDate;
    private String title;
    private String description;

    @Column(columnDefinition ="TEXT")
    private String textMarkDown;

    public Challenge(Long id, LocalDate eventDate, String title, String description) {
        this.id = id;
        this.eventDate = eventDate;
        this.title = title;
        this.description = description;
    }

    public Challenge() {
    }

    public String getTextMarkDown() {
        return textMarkDown;
    }

    public void setTextMarkDown(String textMarkDown) {
        this.textMarkDown = textMarkDown;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
