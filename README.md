# API de Gerenciamento de Pedidos

Esta é uma API Node.js para gerenciar pedidos, utilizando Express, MongoDB e Swagger para documentação interativa.

## Pré-requisitos

- Node.js instalado
- MongoDB instalado e rodando localmente na porta padrão (27017)

## Instalação

1. Clone o repositório
2. Execute `npm install` para instalar as dependências
3. Certifique-se de que o MongoDB está rodando
4. Execute `npm start` para iniciar o servidor na porta 3000

## Documentação Swagger

Após iniciar o servidor, acesse a documentação interativa em:
```
http://localhost:3000/api-docs
```

## Endpoints

### Criar Pedido
- **POST** `/order`
- Corpo da requisição: JSON conforme especificado
- Resposta: 201 Created com orderId

### Obter Pedido por ID
- **GET** `/order/:orderId`
- Resposta: JSON do pedido ou 404 se não encontrado

### Listar Todos os Pedidos
- **GET** `/order/list`
- Resposta: Array de pedidos

### Atualizar Pedido
- **PUT** `/order/:orderId`
- Corpo: JSON do pedido atualizado
- Resposta: Pedido atualizado ou 404

### Deletar Pedido
- **DELETE** `/order/:orderId`
- Resposta: Mensagem de sucesso ou 404

## Exemplo de Uso

Para criar um pedido, use o curl fornecido no desafio:

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

## Observações

- Certifique-se de que o MongoDB está conectado; caso contrário, a API não funcionará.
- Os dados são automaticamente transformados.
- A documentação Swagger é gerada automaticamente a partir do arquivo `swagger.json`.
