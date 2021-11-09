package com.example.demo.report;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository
        extends JpaRepository<Report, Long> {
    @Query("" +
            "SELECT CASE WHEN COUNT(s) > 0 THEN " +
            "TRUE ELSE FALSE END " +
            "FROM Report s " +
            "WHERE s.email = ?1"
    )
    Boolean selectExistsEmail(String email);
}
