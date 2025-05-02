# CSV Transact Validator


## Descrição
Receber um arquivo .csv contendo operações financeiras e validar essa operações. Registranto e salvando em um banco de dados as operações válidas e inválidas.

## Validações
- Valores Negativos: Operações com valores negativos são consideradas inválidas.
  
- Operações Duplicadas: Uma operação é duplicada se existir outra operação no arquivo com os mesmos valores de to, from, e amount. Tais operações são consideradas inválidas.
  
- Valores Suspeitos: Operações com valores acima de R$50.000,00 são marcadas como suspeitas, mas ainda válidas para inclusão no banco de dados.

## Executando o projeto
Execute o comando Docker abaixo para buildar pela primeira vez e subir a aplicação.
```bash
$ docker compose up
```
Acesse o Swagger da aplicação via: http://localhost:3000/api


## Tecnologias Utilizadas.
- NestJS
- Postgres
- Docker
