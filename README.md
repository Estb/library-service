# Library Service

## Quick Start

A ideia desse projeto foi criar um MicroServiço de catálogo de livros com opção de locação de livros e devolução.

Foi criado um sistema simples de login e autenticação para demonstração da funcionalidade de autenticação de rotas seguras.

O sistema de login é básico, os emails e senhas são estáticos, pois nao é o objetivo desse projeto demonstrar um sistema de login eficiente.

Para os módulos que exigem autenticação, foi utilizado Passport com JWT, você deve enviar um token Bearer que deve ser obtido no login.

Em uma situação real, esse microserviço deverá pedir autenticação ao Gateway central a qual solicitará por sua vez um token ao serviço de autenticação.


Para login utilize um dos usuarios abaixo


Para fins de test utilize esses usarios e senhas abaixo.

```
adm  => Usuario com permissões de administrador, pode fazer crud dos livros.

email: adm@teste.com.br
password: 654321

user => Usuario com permissões simples, pode apenas buscar livros, locar e devolver.

email: user@teste.com.br
password: 123456
```

### Requisitos funcionais
	- Você pode adicionar um novo livro a biblioteca
	- Você pode editar um  livro
	- Você pode remover o livro da biblioteca
	- Você pode recuperar uma lista com os livros disponíveis
	- Você pode buscar por livros (Os resultados são páginados)
	- Apenas pessoas com permissão podem: adicionar, editar remover livros
	- Clientes podem visualizar, buscar, locar e deveolver lirvos.


## Getting Started

#### Production
```
cd lirary-service
yarn install
yarn start
``` 


## Development
O modo develop é executado com Nodemon.
```
cd lirary-service
yarn install
yarn dev
```

## Test
Os testes são efetuados com Jest.
```
cd lirary-service
yarn install
yarn test
```

## Documentation

https://documenter.getpostman.com/view/8310828/TVRj4nu4


## live test environment

O ambiente de teste esta disponivel na platafoma Heroku no link abaixo.

https://library-service.herokuapp.com/


## DOCKER




 
