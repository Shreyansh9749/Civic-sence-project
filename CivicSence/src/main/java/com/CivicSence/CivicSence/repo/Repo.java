package com.CivicSence.CivicSence.repo;

import com.CivicSence.CivicSence.dto.Reportdto;
import com.CivicSence.CivicSence.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Repo extends JpaRepository<Report,Long> {
    List<Report> findByReporterEmail(String reporterEmail);


    @Query("SELECT r FROM Report r " +
            "WHERE LOWER(r.reporterEmail) = LOWER(:email) " +
            "AND (:category IS NULL OR :category = '' OR LOWER(r.category) = LOWER(:category)) " +
            "AND (:status IS NULL OR :status = '' OR LOWER(r.status) = LOWER(:status))")
    List<Report> findByReporterEmailAndOptionalFilters(
            @Param("email") String email,
            @Param("category") String category,
            @Param("status") String status
    );

    @Query("""
SELECT r FROM Report r
WHERE (:category IS NULL OR :category = '' OR LOWER(r.category) = LOWER(:category))
  AND (:status IS NULL OR :status = '' OR LOWER(r.status) = LOWER(:status))
  AND (:search IS NULL OR :search = '' OR LOWER(r.reporterName) LIKE LOWER(CONCAT('%',:search,'%')) 
      OR LOWER(r.reporterEmail) LIKE LOWER(CONCAT('%',:search,'%')))
""")
    List<Report> findWithFilters(
            @Param("category") String category,
            @Param("status") String status,
            @Param("search") String search
    );

    @Query("""
SELECT r FROM Report r
WHERE (:category IS NULL OR :category = '' OR LOWER(r.category) = LOWER(:category))
  AND (:status IS NULL OR :status = '' OR LOWER(r.status) = LOWER(:status))
  AND (r.departmentid=:departmentid)
  AND (:search IS NULL OR :search = '' OR LOWER(r.reporterName) LIKE LOWER(CONCAT('%',:search,'%')) 
      OR LOWER(r.reporterEmail) LIKE LOWER(CONCAT('%',:search,'%')))
""")
    public List<Report> findWithFiltersAndDepartmentId(String category, String status, String search, Integer departmentid);

}
