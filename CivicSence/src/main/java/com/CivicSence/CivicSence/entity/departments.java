package com.CivicSence.CivicSence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class departments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int d_id;
    private String departmentName;
}
