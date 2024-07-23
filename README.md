POST CLIENT -->>>>>>>>>> POST: http://localhost:8080/clients
        {
        "code": "00100",
        "createdBy":"OPS SYD",
        "name": "John Doe",
        "birthday": "1985-07-19",
        "country": "USA",
        "city": "New York",
        "unloco": "USNYC",
        "office_address": "123 Main St",
        "suburb": "Manhattan",
        "state": "NY",
        "postal_code": 10001,
        "email": "john.doe@example.com",
        "status": true
    }


UPDATE CLIENT -->>>>>>>> PUT: http://localhost:8080/clients/00000
{   "updatedBy":"Linh ",
    "name": "Nguyễn Thị Phấn Lài",
    "birthday": "1985-07-19T17:00:00.000+00:00",
    "country": "USA",
    "city": "New York",
    "unloco": "USNYC",
    "office_address": "123 Main St",
    "suburb": "Manhattan",
    "state": "NY",
    "postal_code": 10001,
    "email": "john.doe@example.com",
    "status": true
}

DELETE CLIENT -->>>>>>>> DELETE: http://localhost:8080/clients/99999

{
   Header editor = name
}

================================================
SEARCH LOGS BY NAME-->>>>>>>>>>>>>>> GET: http://localhost:8080/logs/search/xxxx

DELETE BY CREATED_AT BETWENN DELETE: http://localhost:8080/logs/filterByTime/?startTime=2024-07-01T00:00:00&endTime=2024-07-18T00:00:00
FIND BY CREATED_AT BETWEEN GET: http://localhost:8080/logs/filterByTime?startTime=2024-07-01T00:00:00&endTime=2024-07-20T00:00:00






