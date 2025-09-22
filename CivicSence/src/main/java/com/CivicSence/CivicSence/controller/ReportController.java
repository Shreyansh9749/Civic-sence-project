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
import java.util.Map;

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
        report.setStatus("Submitted");
        return repo.save(report);
    }

    @GetMapping("/api/reports")
//    public ResponseEntity<List<Report>> getUserReports(@RequestParam String reporterEmail){
//        System.out.println("inside getuser report **************************************");
//        return ResponseEntity.ok(repo.findByReporterEmail(reporterEmail));
//    }
//    public List<Report> getReports(
//            @RequestParam String reporterEmail,
//            @RequestParam(required = false) String category,
//            @RequestParam(required = false) String status) {
//
//        return repo.findByReporterEmailAndOptionalFilters(reporterEmail, category, status);
//    }
    public List<Report> getReports(
            @RequestParam(required = false) String reporterEmail,
            @RequestParam(required = false, defaultValue = "") String category,
            @RequestParam(required = false, defaultValue = "") String status,
            @RequestParam(required = false, defaultValue = "") String search
    ) {
        if (reporterEmail != null && !reporterEmail.isEmpty()) {
            return repo.findByReporterEmailAndOptionalFilters(reporterEmail, category, status);
        } else {
            return repo.findWithFilters(category, status, search);
        }
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
    @GetMapping("/api/reports/{id}")
    public ResponseEntity<Report> getDesc(@PathVariable Long id){
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/api/reports/{id}")
    public Report updateReport(
            @PathVariable Long id,
            @RequestPart("report") Report report,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {
        // Fetch the existing report from DB
        Report existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        // Update fields manually to avoid overwriting everything
        existing.setCategory(report.getCategory());
        existing.setStreet(report.getStreet());
        existing.setLandmark(report.getLandmark());
        existing.setCity(report.getCity());
        existing.setPincode(report.getPincode());
        existing.setDescription(report.getDescription());
        existing.setLatitude(report.getLatitude());
        existing.setLongitude(report.getLongitude());
        existing.setReporterName(report.getReporterName());
        existing.setReporterEmail(report.getReporterEmail());

        // Update file only if new file uploaded
        if (file != null && !file.isEmpty()) {
            existing.setFileData(file.getBytes());
        }

        return repo.save(existing);
    }
    @DeleteMapping("/api/reports/{id}")
    public void deleteReport(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Report not found with id " + id);
        }
        repo.deleteById(id);
    }

    @PutMapping("/api/reports/{id}/status")
    public Report updateStatus(@PathVariable Long id, @RequestBody Map<String,String> body){
        Report report = repo.findById(id).orElseThrow(() -> new RuntimeException("Report not found"));
        String status = body.get("status");
        report.setStatus(status.toLowerCase());
        return repo.save(report);
    }

    @GetMapping("/api/admin/reports/{id}/image")
    public ResponseEntity<byte[]> getReportImage(@PathVariable Long id) {
        return repo.findById(id)
                .filter(report -> report.getFileData() != null)
                .map(report -> ResponseEntity.ok()
                        .header("Content-Type", "image/jpeg") // 👈 if only jpeg, else detect
                        .body(report.getFileData()))
                .orElse(ResponseEntity.notFound().build());
    }



}
