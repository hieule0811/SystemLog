package com.client.Client.repository;

import com.client.Client.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, String> {
    List<Client> findByNameContainingIgnoreCase(String name);
    boolean existsByCode(String code);
    Optional<Client> findById(Long id);
    void deleteByCodeIn(List<String> codes);
    void deleteByIdIn(List<Long> ids);
    List<Client> findByCodeIn(List<String> codes);
    List<Client> findByIdIn(List<Long> ids);
    Optional<Client> findByCode(String code);
    @Query("SELECT c FROM Client c WHERE " +
            "CAST(c.id AS string) LIKE CONCAT('%', :keyword, '%') OR " +
            "CAST(c.createdAt AS string) LIKE CONCAT('%', :keyword, '%') OR " +
            "LOWER(c.createdBy) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "CAST(c.updatedAt AS string) LIKE CONCAT('%', :keyword, '%') OR " +
            "LOWER(c.updatedBy) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.code) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "CAST(c.birthday AS string) LIKE CONCAT('%', :keyword, '%') OR " +
            "LOWER(c.country) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.unloco) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.office_address) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.suburb) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.state) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "CAST(c.postal_code AS string) LIKE CONCAT('%', :keyword, '%') OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "CAST(c.status AS string) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Client> searchInAllColumns(@Param("keyword") String keyword);

}
