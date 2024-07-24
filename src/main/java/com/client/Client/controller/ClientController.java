package com.client.Client.controller;

import com.client.Client.dto.request.ApiResponse;
import com.client.Client.dto.request.ClientUpdateRequest;
import com.client.Client.entity.Client;
import com.client.Client.service.ActivityLogService;
import com.client.Client.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/clients")
public class ClientController {
    @Autowired
    private ClientService clientService;
    @Autowired ActivityLogService activityLogService;
    // insert client
    @PostMapping
    public ResponseEntity<ApiResponse<Client>> createClient(@RequestBody @Valid Client client) {
        Client createdClient = clientService.createClient(client);
        ApiResponse<Client> apiResponse = new ApiResponse<>(true, "Client created successfully", createdClient);
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
    // xuất all client
    @GetMapping()
    ResponseEntity<List<Client>> getAllClient(){
        List <Client> client = clientService.getAllClient();
        return ResponseEntity.ok(client);
    }
    // tìm kiếm
        @GetMapping("/search/{name}")
    ResponseEntity<List<Client>> getClientsByName (@PathVariable String name){
        List <Client> client = clientService.getClientsByName(name);
        return ResponseEntity.ok(client);
    }

    //xuất 1 client bằng code
    @GetMapping("/code/{codeClient}")
    ResponseEntity<Client> getClientByCode(@PathVariable ("codeClient") String codeClient){
        Client client = clientService.getClient(codeClient);
        return ResponseEntity.ok(client);
    }
    //xuất 1 client bằng id
    @GetMapping("/id/{idClient}")
    ResponseEntity<Client> getClientById(@PathVariable ("idClient") Long idClient){
        Client client = clientService.getClientId(idClient);
        return ResponseEntity.ok(client);
    }

    //update 1 client bằng code
    @PutMapping("/code/{codeClient}")
    ResponseEntity<Client> updateClientByCode(@PathVariable ("codeClient") String codeClient, @RequestBody Client request){
        Client client = clientService.updateClientByCode(codeClient,request);
        return ResponseEntity.ok(client);
    }
    //update 1 client bằng id
    @PutMapping("/id/{idClient}")
    ResponseEntity<Client> updateClientById(@PathVariable ("idClient") Long idClient, @RequestBody Client request){
        Client client = clientService.updateClientById(idClient,request);
        return ResponseEntity.ok(client);
    }

    // update nhiều client bằng code
    @PutMapping("/updateByCodes")
    public ResponseEntity<String> updateClientsByCode(@RequestBody List<Client> clients) {
        clientService.updateClientsByCode(clients);
        return ResponseEntity.ok("Clients updated successfully");
    }

    // update nhiều client bằng ID
    @PutMapping("/updateById")
    public ResponseEntity<String> updateClients(@RequestBody List<Client> clients) {
        clientService.updateClientsById(clients);
        return ResponseEntity.ok("Clients updated successfully");
    }


    // delete client bằng code
    @DeleteMapping("/code/{codeClient}")
    public ResponseEntity<ApiResponse<Client>> deleteClient(@PathVariable String codeClient, @RequestHeader("editor") String editor) {
        Client client = clientService.getClient(codeClient);
        clientService.deleteClient(codeClient);
        activityLogService.logDeleteAction(editor, client.toString());
        ApiResponse<Client> apiResponse = new ApiResponse<>(true, "Client with code " + codeClient + " deleted successfully", null);
        return ResponseEntity.ok(apiResponse);
    }

    //// delete client bằng id
    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id, @RequestHeader("editor") String editor) {
        Client client = clientService.getClientId(id);
        clientService.deleteClientById(id);
        activityLogService.logDeleteAction(editor, client.toString());
        return ResponseEntity.ok().body("Client deleted successfully!");
    }

    // delete nhiều client cùng 1 lúc bằng code
    @DeleteMapping("/codes")
    public ResponseEntity<?> deleteClientsByCodes(@RequestBody List<String> codes,@RequestHeader("editor") String editor) {
        List<Client> clients = clientService.FindClientsByCodes(codes);
//        String dataOld = clients.stream()
//                .map(client -> client.toString()) // Cần tạo phương thức toString() cho Client
//                .collect(Collectors.joining(", "));
//        clientService.deleteClientsByCodes(codes);
//        activityLogService.logDeleteAction(editor, clients.toString());

        for (Client client : clients) {
            activityLogService.logDeleteAction(editor, client.toString());
            clientService.deleteClientsByCodes(codes);

        }
        return ResponseEntity.ok("Clients deleted successfully");
    }

    // delete nhiều client cùng 1 lúc bằng id
    @DeleteMapping("/ids")
    public ResponseEntity<?> deleteClientsById(@RequestBody List<Long> ids,@RequestHeader("editor") String editor) {
        List<Client> clients = clientService.FindClientsByIds(ids);
        for (Client client : clients) {
            activityLogService.logDeleteAction(editor, client.toString());
            clientService.deleteClientsByIds(ids);
        }
        return ResponseEntity.ok("Clients deleted successfully");
    }

}
