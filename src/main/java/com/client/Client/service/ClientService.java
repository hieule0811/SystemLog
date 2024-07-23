package com.client.Client.service;

import com.client.Client.dto.request.ClientUpdateRequest;
import com.client.Client.entity.Client;
import com.client.Client.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClientService {
    @Autowired
    private ClientRepository clientRepository;
//thêm client
//    public Client createClient(ClientCreationRequest request){
//        Client client = new Client();
//
//        if(clientRepository.existsByCode(request.getCode())){
//            throw new RuntimeException("Client existed");
//        }
//
//        client.setCode(request.getCode());
//        client.setName(request.getName());
//        client.setCountry(request.getCountry());
//        client.setCity(request.getCity());
//        client.setUnloco(request.getUnloco());
//        client.setOffice_address(request.getOffice_address());
//        client.setSuburb(request.getSuburb());
//        client.setState(request.getState());
//        client.setPostal_code(request.getPostal_code());
//        client.setEmail(request.getEmail());
//        client.setStatus(request.isStatus());
//
//        return clientRepository.save(client);
//    }
    public Client createClient(Client client) {
        if (clientRepository.existsById(client.getCode())) {
            throw new IllegalArgumentException("Client with code " + client.getCode() + " already exists");
        }
        return clientRepository.save(client);
    }
// xuất thông tin 1 client
    public Client getClient(String codeClient){
        return clientRepository.findById(codeClient).orElseThrow(()->new RuntimeException("Client with code " + codeClient + " not found"));
    }
// lọc theo từng chữ cái của name
    public List<Client> getClientsByName(String name){
        return clientRepository.findByNameContainingIgnoreCase(name);
    }
// xuat tất cả client
    public List<Client> getAllClient(){
        return clientRepository.findAll();
    }
// cập nhật thông tin client

    public Client updateClient(String codeClient, ClientUpdateRequest request){
        Client client = getClient(codeClient);

        client.setUpdatedAt(LocalDateTime.now());
        client.setUpdatedBy(request.getUpdatedBy());
        client.setName(request.getName());
        client.setCountry(request.getCountry());
        client.setCity(request.getCity());
        client.setUnloco(request.getUnloco());
        client.setOffice_address(request.getOffice_address());
        client.setSuburb(request.getSuburb());
        client.setState(request.getState());
        client.setPostal_code(request.getPostal_code());
        client.setEmail(request.getEmail());
        client.setStatus(request.isStatus());

        return clientRepository.save(client);
    }

    //xóa
    public void deleteClient(String codeClient){
         clientRepository.deleteById(codeClient);
    }
    // update lại id


}
