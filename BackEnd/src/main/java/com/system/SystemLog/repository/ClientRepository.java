package com.system.SystemLog.repository;

import com.system.SystemLog.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long>,ClientRepositoryCustom  {

    List<Client> findByNameContainingIgnoreCase(String name);

    @Query("SELECT c FROM Client c WHERE " +
            "LOWER(c.code) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.country) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.unloco) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.officeAddress) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.suburb) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.state) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(CAST(c.postalCode AS string)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.telephone) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "TO_CHAR(c.birthdate, 'DD/MM/YYYY') LIKE CONCAT('%', :keyword, '%') OR "+
            ":keyword = 'Active' AND c.status = true OR " +
            ":keyword = 'Inactive' AND c.status = false"
    )
    List<Client> searchByKeyword(@Param("keyword") String keyword);
    Client findByCode(String code);
}
