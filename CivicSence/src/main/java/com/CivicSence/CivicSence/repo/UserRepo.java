package com.CivicSence.CivicSence.repo;

import com.CivicSence.CivicSence.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepo extends JpaRepository<Users,String> {
    @Query("""
            select u.department_id from Users u where u.username=:username
            
            """)
    int findDepartmentIdByUsername(String username);
}
