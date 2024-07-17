package com.client.Client.controller;

import com.client.Client.dto.request.ApiResponse;
import com.client.Client.dto.request.ClientCreationRequest;
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

@RestController
@RequestMapping("/clients")
public class ClientController {
    @Autowired
    private ClientService clientService;
    @Autowired ActivityLogService activityLogService;
//    @PostMapping()
//    ResponseEntity<Client> createClient (@RequestBody ClientCreationRequest request){
//       Client client = clientService.createClient(request);
//        return ResponseEntity.ok(client);
//    }
//    @PostMapping()
//    public ResponseEntity<Client> createClient(@RequestBody @Valid Client client) {
//        try {
//            Client createdClient = clientService.createClient(client);
//            return ResponseEntity.status(HttpStatus.CREATED).body(createdClient);
//        } catch (IllegalArgumentException e) {
//            // Trả về ResponseEntity với HttpStatus.CONFLICT và thông báo lỗi trong phần thân phản hồi
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
//        }
//    }
@PostMapping
public ResponseEntity<ApiResponse<Client>> createClient(@RequestBody @Valid Client client) {
    try {
        Client createdClient = clientService.createClient(client);
        ApiResponse<Client> apiResponse = new ApiResponse<>(true, "Client created successfully", createdClient);
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    } catch (IllegalArgumentException e) {
        ApiResponse<Client> errorResponse = new ApiResponse<>(false, e.getMessage(), null);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }
}
    @GetMapping()
    ResponseEntity<List<Client>> getAllClient(){
        List <Client> client = clientService.getAllClient();
        return ResponseEntity.ok(client);
    }

    @GetMapping("/search/{name}")
    ResponseEntity<List<Client>> getClientsByName (@PathVariable String name){
        List <Client> client = clientService.getClientsByName(name);
        return ResponseEntity.ok(client);
    }

    @GetMapping("/{codeClient}")
    ResponseEntity<Client> getClient(@PathVariable ("codeClient") String codeClient){
        Client client = clientService.getClient(codeClient);
        return ResponseEntity.ok(client);
    }

    @PutMapping("/{codeClient}")
    ResponseEntity<Client> updateClient(@PathVariable ("codeClient") String codeClient, @RequestBody ClientUpdateRequest request){
        Client client = clientService.updateClient(codeClient,request);
        return ResponseEntity.ok(client);
    }

//    @DeleteMapping("/{codeClient}")
//    ResponseEntity<String> deleteClient (@PathVariable String codeClient,@RequestHeader("username") String username){
//        Client client = clientService.getClient(codeClient);
//        if(client != null){
//            clientService.deleteClient(codeClient);
//            activityLogService.logDeleteAction(username,client.toString());
//            return ResponseEntity.ok("Deleted success");
//        }else return ResponseEntity.ok("Client not  exist");
//    }
    @DeleteMapping("/{codeClient}")
    public ResponseEntity<ApiResponse<Client>> deleteClient(@PathVariable String codeClient, @RequestHeader("username") String username) {
        Client client = clientService.getClient(codeClient);
        clientService.deleteClient(codeClient);
        activityLogService.logDeleteAction(username, client.toString());
        ApiResponse<Client> apiResponse = new ApiResponse<>(true, "Client with code " + codeClient + " deleted successfully", null);
        return ResponseEntity.ok(apiResponse);
}
//    @DeleteMapping("/{codeClient}")
//    String deleteClient(@PathVariable ("codeClient") String codeClient){
//        clientService.deleteClient(codeClient);
//        return "Deleted success";
//    }
}
