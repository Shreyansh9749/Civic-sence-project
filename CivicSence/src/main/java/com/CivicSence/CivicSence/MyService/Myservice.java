package com.CivicSence.CivicSence.MyService;

import com.CivicSence.CivicSence.dto.Reportdto;
import com.CivicSence.CivicSence.entity.Report;
import com.CivicSence.CivicSence.repo.Repo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class Myservice {

    @Autowired
    private Repo repo;


//creating a hashmap to store the department name as the key and department id as values;




    //    trying to implement the reportdto here
private Reportdto convertToDto(Report report){
    Reportdto reportdto=new Reportdto();
    BeanUtils.copyProperties(report,reportdto);
    return reportdto;
}
    private Report convertToentity(Reportdto reportdto){
        Report report=new Report();
        BeanUtils.copyProperties(reportdto,report);
        report.setDepartmentid(1);
        return report;
    }

    public List<Reportdto> getReports(String reporterEmail, String category, String status, String search) {
        if (reporterEmail != null && !reporterEmail.isEmpty()) {
            return repo.findByReporterEmailAndOptionalFilters(reporterEmail, category, status).stream().map(this::convertToDto).collect(Collectors.toList());
        } else {
            return repo.findWithFilters(category, status, search).stream().map(this::convertToDto).collect(Collectors.toList());
        }
    }
    public Reportdto saveReport(Reportdto reportdto, MultipartFile file) throws IOException {

        if (file != null && !file.isEmpty()) {
            reportdto.setFileData(file.getBytes());
        }
        reportdto.setStatus("Submitted");
        Map<String,Integer>deptList=new HashMap<>();
        deptList.put("waste",1);
        deptList.put("pothole",2);
        deptList.put("others",3);
        Report report=convertToentity(reportdto);
       if( deptList.containsKey(report.getCategory())){
           report.setDepartmentid(deptList.get(report.getCategory()));
       }
        repo.save(report );

        return reportdto;
    }
    public ResponseEntity<List<Reportdto>> getAllReports(){
        System.out.println("inside admin report *********************");

        return ResponseEntity.ok( repo.findAll().stream().map(this::convertToDto).collect(Collectors.toList()));
    }
    public ResponseEntity<Reportdto> getDescription(Long id){
        return repo.findById(id)
                .map(entity -> ResponseEntity.ok(convertToDto(entity)))
                .orElse(ResponseEntity.notFound().build());

    }

//   not changed to the report dto because we are updating the data
    public Reportdto updateReport(Long id,Report report,MultipartFile file) throws IOException {
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
        Map<String,Integer>deptList=new HashMap<>();
        deptList.put("waste",1);
        deptList.put("pothole",2);
        deptList.put("other",3);
        if( deptList.containsKey(existing.getCategory())){
            existing.setDepartmentid(deptList.get(existing.getCategory()));
        }
        return convertToDto(repo.save(existing));
    }
    public void deleteReport(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Report not found with id " + id);
        }
        repo.deleteById(id);
    }
    public Reportdto updateStatus(Long id, Map<String,String> body){
        Report report = repo.findById(id).orElseThrow(() -> new RuntimeException("Report not found"));
        Reportdto reportdto =convertToDto(report);

        String status = body.get("status");
        reportdto.setStatus(status.toLowerCase());

        return convertToDto(repo.save(convertToentity(reportdto)));
    }
    public ResponseEntity<byte[]> getReportImage(@PathVariable Long id) {
        return repo.findById(id)
                .filter(report -> report.getFileData() != null)
                .map(report -> ResponseEntity.ok()
                        .header("Content-Type", "image/jpeg")
                        .body(report.getFileData()))
                .orElse(ResponseEntity.notFound().build());
    }








//    public Report saveReport(Report report, MultipartFile file) throws IOException {
//
//        if (file != null && !file.isEmpty()) {
//            report.setFileData(file.getBytes());
//        }
//        report.setStatus("Submitted");
//        return repo.save(report);
//    }

//    public List<Report> getReports(String reporterEmail, String category, String status, String search) {
//        if (reporterEmail != null && !reporterEmail.isEmpty()) {
//            return repo.findByReporterEmailAndOptionalFilters(reporterEmail, category, status);
//        } else {
//            return repo.findWithFilters(category, status, search);
//        }
//    }
//    public ResponseEntity<List<Report>> getAllReports(){
//        System.out.println("inside admin report *********************");
//        return ResponseEntity.ok(repo.findAll());
//    }
//    public ResponseEntity<Report> getDescription(Long id){
//        return repo.findById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//    public Report updateReport(Long id,Report report,MultipartFile file) throws IOException {
//        // Fetch the existing report from DB
//        Report existing = repo.findById(id)
//                .orElseThrow(() -> new RuntimeException("Report not found"));
//
//        // Update fields manually to avoid overwriting everything
//        existing.setCategory(report.getCategory());
//        existing.setStreet(report.getStreet());
//        existing.setLandmark(report.getLandmark());
//        existing.setCity(report.getCity());
//        existing.setPincode(report.getPincode());
//        existing.setDescription(report.getDescription());
//        existing.setLatitude(report.getLatitude());
//        existing.setLongitude(report.getLongitude());
//        existing.setReporterName(report.getReporterName());
//        existing.setReporterEmail(report.getReporterEmail());
//
//        // Update file only if new file uploaded
//        if (file != null && !file.isEmpty()) {
//            existing.setFileData(file.getBytes());
//        }
//
//        return repo.save(existing);
//    }
//    public void deleteReport(Long id) {
//        if (!repo.existsById(id)) {
//            throw new RuntimeException("Report not found with id " + id);
//        }
//        repo.deleteById(id);
//    }
//    public Report updateStatus(Long id, Map<String,String> body){
//        Report report = repo.findById(id).orElseThrow(() -> new RuntimeException("Report not found"));
//        String status = body.get("status");
//        report.setStatus(status.toLowerCase());
//        return repo.save(report);
//    }
//    public ResponseEntity<byte[]> getReportImage(@PathVariable Long id) {
//        return repo.findById(id)
//                .filter(report -> report.getFileData() != null)
//                .map(report -> ResponseEntity.ok()
//                        .header("Content-Type", "image/jpeg")
//                        .body(report.getFileData()))
//                .orElse(ResponseEntity.notFound().build());
//    }
}
