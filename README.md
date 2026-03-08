# Order Management API

This is a Node.js API for managing orders, using Express, MongoDB, and Swagger for interactive documentation.

## Prerequisites

- Node.js installed
- MongoDB installed and running locally on the default port (27017)

## Installation

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Ensure MongoDB is running
4. Run `npm start` to start the server on port 3000

## Swagger Documentation

After starting the server, access the interactive documentation at:

http://localhost:3000/api-docs

## Endpoints

### Create Order
- **POST** `/order`
- Request body: JSON as specified
- Response: 201 Created with orderId

### Get Order by ID
- **GET** `/order/:orderId`
- Response: JSON of the order or 404 if not found

### List All Orders
- **GET** `/orders/list`
- Response: Array of orders

### Update Order
- **PUT** `/order/:orderId`
- Body: JSON of the updated order
- Response: Updated order or 404 error

### Delete Order
- **DELETE** `/order/:orderId`
- Response: Success message or 404 error

## Example of Use

To create an order, use the curl provided:

```bash
curl --location 'http://localhost:3000/order' \
--header 'Content-Type: application/json' \
--data '{
"numeroPedido": "v10089015vdb-01",
"valorTotal": 10000,
"dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
"items": [
{
"idItem": "2434",
"quantidadeItem": 1,
"valorItem": 1000
}
]
}'
```

## Notes

- Ensure MongoDB is connected; otherwise, the API will not work.

- Data is automatically transformed.

- Swagger documentation is automatically generated from the `swagger.json` file.
