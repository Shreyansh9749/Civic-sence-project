package com.CivicSence.CivicSence.repo;

import com.CivicSence.CivicSence.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Repo extends JpaRepository<Report,Long> {
    List<Report> findByReporterEmail(String reporterEmail);
}
