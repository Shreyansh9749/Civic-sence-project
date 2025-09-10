package com.CivicSence.CivicSence.controller;


import com.CivicSence.CivicSence.entity.Report;
import com.CivicSence.CivicSence.repo.Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin
public class ReportController {
    @Autowired
    private Repo repo;

    @PostMapping("/api/reports")
    public Report saveReport( @RequestPart("report") Report report, @RequestPart MultipartFile file) throws IOException {
        System.out.println("inside controller **************************");
        if (file != null && !file.isEmpty()) {
            report.setFileData(file.getBytes());
        }
        return repo.save(report);
    }

    @GetMapping("/api/reports")
    public ResponseEntity<List<Report>> getUserReports(@RequestParam String reporterEmail){
        System.out.println("inside getuser report **************************************");
        return ResponseEntity.ok(repo.findByReporterEmail(reporterEmail));
    }

    @GetMapping("/api/admin/reports")
    public ResponseEntity<List<Report>> getAllReports(){
        System.out.println("inside admin report *********************");
        return ResponseEntity.ok(repo.findAll());
    }

    @GetMapping("/api/admin/reports/{id}")
    public ResponseEntity<Report> getDescription(@PathVariable Long id){
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
