package com.system.SystemLog.controller;

import com.system.SystemLog.entity.Client;
import com.system.SystemLog.entity.FilterCriteria;
import com.system.SystemLog.exception.GlobalExceptionHandler;
import com.system.SystemLog.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/client")
@CrossOrigin(origins = "http://localhost:3000")
public class ClientController {
    @Autowired
    private ClientService clientService;

    @GetMapping()
    ResponseEntity<List<Client>> getAllClient(){
        List <Client> client = clientService.getAllClients();
        return ResponseEntity.ok(client);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClient(@PathVariable("id") Long id) {
        Client client = clientService.getClientById(id);
        return ResponseEntity.ok(client);
    }
    @GetMapping("/code")
    public ResponseEntity<Client> getClientByCode(@RequestParam("code") String code){
        Client client = clientService.getClientByCode(code);
        return ResponseEntity.ok(client);
    }
    @GetMapping("/search/{name}")
    public ResponseEntity<List<Client>> getClientsByName(@PathVariable String name) {
        List<Client> clients = clientService.getClientsByName(name);
        return ResponseEntity.ok(clients);
    }
    @GetMapping("/search")
    public ResponseEntity<List<Client>> searchClients(@RequestParam String keyword) {
        List<Client> clients = clientService.searchClients(keyword);
        return ResponseEntity.ok(clients);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id,@RequestBody Client client){
        Client updateClient = clientService.updateClient(id,client);
        return ResponseEntity.ok(updateClient);
    }
    @PutMapping("/code/{code}")
    public ResponseEntity<String> updateClient(@PathVariable String code,@RequestBody Client client){
        Client updateClient = clientService.updateClientByCode(code,client);
        return ResponseEntity.ok("Updated client successfully");
    }
    @PostMapping
    public ResponseEntity<String> createClient(@RequestBody Client client) {
        Client newClient = clientService.createClient(client);
        return ResponseEntity.ok("Created client successfully");
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClient(@PathVariable Long id) {
        try {
            clientService.deleteClient(id);
            return ResponseEntity.ok("Client deleted successfully");
        } catch (GlobalExceptionHandler.ClientNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/id/{code}")
    public ResponseEntity<Long> getClientIdByCode(@PathVariable String code) {
        Long clientId = clientService.getClientIdByCode(code);
        if (clientId != null) {
            return ResponseEntity.ok(clientId);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/filter")
    public ResponseEntity<List<Client>> filter(
            @RequestBody List<FilterCriteria> filters) {
        if (filters == null) {
            filters = new ArrayList<>();
        }
        List<Client> result = clientService.filterEntities(filters);
        return ResponseEntity.ok(result);
    }
}
