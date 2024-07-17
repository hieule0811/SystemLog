package com.client.Client.repository;

import com.client.Client.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, String> {
    List<Client> findByNameContainingIgnoreCase(String name);
    boolean existsByCode(String code);
}
