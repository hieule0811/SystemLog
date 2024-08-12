package com.system.SystemLog.service;

import com.system.SystemLog.entity.Client;
import com.system.SystemLog.entity.FilterCriteria;
import com.system.SystemLog.exception.GlobalExceptionHandler;
import com.system.SystemLog.repository.ClientRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ClientService {
    @Autowired
    private ClientRepository clientRepository;
    public List<Client> getAllClients(){
        return clientRepository.findAll();
    }

    public Client getClientById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new GlobalExceptionHandler.ClientNotFoundException("Client not found with id: " + id));
    }
    public Client getClientByCode(String code) {
        return clientRepository.findByCode(code);
    }
    public List<Client> getClientsByName(String name) {
        return clientRepository.findByNameContainingIgnoreCase(name);
    }
    public List<Client> searchClients(String keyword) {
        return clientRepository.searchByKeyword(keyword);
    }
    public Client updateClient(Long id, Client updatedClient) {
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new GlobalExceptionHandler.ClientNotFoundException("Client not found with id: " + id));

        existingClient.setName(updatedClient.getName());
//        existingClient.setBirthdate(updatedClient.getBirthdate());
        existingClient.setCountry(updatedClient.getCountry());
        existingClient.setCity(updatedClient.getCity());
        existingClient.setUnloco(updatedClient.getUnloco());
        existingClient.setOfficeAddress(updatedClient.getOfficeAddress());
        existingClient.setSuburb(updatedClient.getSuburb());
        existingClient.setState(updatedClient.getState());
        existingClient.setPostalCode(updatedClient.getPostalCode());
        existingClient.setEmail(updatedClient.getEmail());
        existingClient.setTelephone(updatedClient.getTelephone());
        existingClient.setStatus(updatedClient.getStatus());
        existingClient.setUpdatedAt(LocalDateTime.now());
//        existingClient.setUpdatedAt(new java.util.Date());
        existingClient.setUpdatedBy(updatedClient.getUpdatedBy());
        return clientRepository.save(existingClient);
    }
    public Client updateClientByCode(String code, Client updatedClient) {
        Client existingClient = clientRepository.findByCode(code);

        existingClient.setName(updatedClient.getName());
//        existingClient.setBirthdate(updatedClient.getBirthdate());
        existingClient.setCountry(updatedClient.getCountry());
        existingClient.setCity(updatedClient.getCity());
        existingClient.setUnloco(updatedClient.getUnloco());
        existingClient.setOfficeAddress(updatedClient.getOfficeAddress());
        existingClient.setSuburb(updatedClient.getSuburb());
        existingClient.setState(updatedClient.getState());
        existingClient.setPostalCode(updatedClient.getPostalCode());
        existingClient.setEmail(updatedClient.getEmail());
        existingClient.setTelephone(updatedClient.getTelephone());
        existingClient.setStatus(updatedClient.getStatus());
//        existingClient.setUpdatedAt(new java.util.Date());
        existingClient.setUpdatedAt(LocalDateTime.now());
        existingClient.setUpdatedBy(updatedClient.getUpdatedBy());
        return clientRepository.save(existingClient);
    }
    public Client createClient(Client newClient) {
        return clientRepository.save(newClient);
    }
//    public void deleteClient(Long clientId) {
//        if (!clientRepository.existsById(clientId)) {
//            throw new GlobalExceptionHandler.ClientNotFoundException("Client not found with id: " + clientId);
//        }
//        clientRepository.deleteById(clientId);
//    }
    public void deleteClient(Long id, String updatedBy) {
    Client existingClient = clientRepository.findById(id)
            .orElseThrow(() -> new GlobalExceptionHandler.ClientNotFoundException("Client not found with id: " + id));

    existingClient.setUpdatedBy(updatedBy);
    clientRepository.save(existingClient);
    clientRepository.delete(existingClient);
    }

    public Long getClientIdByCode(String code) {
        Client client = clientRepository.findByCode(code);
        if (client != null) {
            return client.getId();
        } else {
            return null;
        }
    }
    public List<Client> filterEntities(List<FilterCriteria> filters) {
        return clientRepository.findByMultipleCriteria(filters);
    }
}
