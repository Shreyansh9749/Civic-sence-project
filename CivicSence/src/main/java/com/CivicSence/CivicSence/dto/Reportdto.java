package com.CivicSence.CivicSence.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reportdto {
    private Long id;

    private String category;
    private String street;
    private String landmark;
    private String city;
    private String pincode;



    private byte[] fileData;


    private String description;

    private Double latitude;
    private Double longitude;

    private String reporterName;
    private String reporterEmail;
    private String status;


}
