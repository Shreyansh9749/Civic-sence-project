package com.CivicSence.CivicSence.controller;


import com.CivicSence.CivicSence.MyService.Myservice;
import com.CivicSence.CivicSence.dto.Reportdto;
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

    @Autowired
    private Myservice myservice;

    @PostMapping("/api/reports")
    public Reportdto saveReport( @RequestPart("report") Reportdto reportdto, @RequestPart MultipartFile file) throws IOException {
        System.out.println("inside controller **************************");
        return myservice.saveReport(reportdto,file);
    }

    @GetMapping("/api/reports")

    public List<Reportdto> getReports(
            @RequestParam(required = false) String reporterEmail,
            @RequestParam(required = false, defaultValue = "") String category,
            @RequestParam(required = false, defaultValue = "") String status,
            @RequestParam(required = false, defaultValue = "") String search
    ) {

            return myservice.getReports(reporterEmail,category, status, search);

    }

    @GetMapping("/api/admin/reports")
    public ResponseEntity<List<Reportdto>> getAllReports(){
        return myservice.getAllReports();
    }

    @GetMapping("/api/admin/reports/{id}")
    public ResponseEntity<Report> getDescription(@PathVariable Long id){
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/api/reports/{id}")
    public ResponseEntity<Reportdto> getDesc(@PathVariable Long id){
        return myservice.getDescription(id);
    }
    @PutMapping("/api/reports/{id}")
    public Reportdto updateReport(
            @PathVariable Long id,
            @RequestPart("report") Report report,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {


        return myservice.updateReport(id,report,file);
    }

    @DeleteMapping("/api/reports/{id}")
    public void deleteReport(@PathVariable Long id) {
       myservice.deleteReport(id);
    }

    @PutMapping("/api/reports/{id}/status")
    public Reportdto updateStatus(@PathVariable Long id, @RequestBody Map<String,String> body){

        return myservice.updateStatus(id, body);
    }

    @GetMapping("/api/admin/reports/{id}/image")
    public ResponseEntity<byte[]> getReportImage(@PathVariable Long id) {
       return myservice.getReportImage(id);
    }
//
//    @GetMapping()
//    public List<Report>

}
