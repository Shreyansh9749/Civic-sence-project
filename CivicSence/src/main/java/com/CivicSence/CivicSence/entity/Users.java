package com.CivicSence.CivicSence.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users {
    @Id
    private String username;
    private String password;
    private String role;
    private int department_id;

}
