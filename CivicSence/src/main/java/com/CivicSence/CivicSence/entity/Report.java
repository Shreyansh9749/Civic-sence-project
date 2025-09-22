package com.CivicSence.CivicSence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String street;
    private String landmark;
    private String city;
    private String pincode;


    @Column(columnDefinition = "BYTEA") // For PostgreSQL
    @JsonIgnore
    private byte[] fileData;

    @Lob
    private String description;

    private Double latitude;
    private Double longitude;

    private String reporterName;
    private String reporterEmail;
    private String status;


}
