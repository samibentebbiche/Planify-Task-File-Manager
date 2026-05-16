package com.samibentebbiche.ChallengeApp;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

// CRUD
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

    //Optional<Challenge> findByMonthIgnoreCase(String month);

    @Query("SELECT c FROM Challenge c WHERE MONTH(c.eventDate) = :month")
    List<Challenge> findByMonth(@Param("month") int month);

    List<Challenge> findByEventDate(LocalDate eventDate);

}
