# Desenvolvimento

Rode o comando abaixo para iniciar a API localmente:

```shell
npm start dev
```

# Configurações

A partir do arquivo `.env.example` crie um arquivo `.env`.

## Banco de dados

A configuração do banco de dados se dá através dos seguintes campos. A configuração padrão para MySQL, omitindo usuário e senha.

```env
DATABASE_TYPE=mysql
DATABASE_NAME=stilo_kids
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_HOST=localhost
DATABASE_PORT=3306
```

# Documentação

Links das documentações essenciais para o desenvolvimento do projeto.

## NestJS

- <a href="https://docs.nestjs.com/first-steps">Overview</a>
- <a href="https://docs.nestjs.com/openapi/introduction">OpenAPI</a>
- <a href="https://docs.nestjs.com/fundamentals/testing">Testes</a>
- <a href="https://github.com/typestack/class-validator">Validação</a>

## TypeORM

O ORM utilizado nessa aplicação é o TypeORM, abaixo estão links para leitura e estudo:

- <a href="https://docs.nestjs.com/techniques/database">TypeORM com NestJS</a>
- <a href="https://typeorm.io/docs/entity/entities/">Entidades</a>
- <a href="https://typeorm.io/docs/data-source/data-source-options">Opções do Data Source</a>
- <a href="https://typeorm.io/docs/advanced-topics/migrations/">Migrações</a>
- <a href="https://typeorm.io/docs/advanced-topics/using-cli">CLI</a>
- <a href="https://typeorm.io/docs/advanced-topics/listeners-and-subscribers">Listeners e Subscribers</a>
- <a href="https://typeorm.io/docs/advanced-topics/indices">Índices</a>
- <a href="https://docs.nestjs.com/techniques/database#testing">Testes</a>

# Desenvolvimento

## Comandos

### Docker

Para iniciar o projeto, use o comando:

```shell
docker compose up --build
```

Para executar os comandos de rodar migração, reverter ou gerar e surtir efeito no container, primeiro entre no shell do container:

```shell
docker exec -it nestjs-api sh
```

### Comandos longos

Para criar uma entidade, utilize o comando abaixo:

```shell
npm run typeorm entity:create src/<módulo>/entities/<nome da entidade>
```

Para gerar uma migração, existem as duas opções:

```shell
// Cria uma nova migração do zero
npm run typeorm migration:create src/migrations/<nome da migração>

// Cria uma nova migração a partir de uma tabela existente
npm run typeorm migration:generate src/migrations/<nome da migração> -d src/config/typeorm.config.ts
```

Para rodar uma migração:

```shell
npm run typeorm -- migration:run -d src/config/typeorm.config.ts
```

Para reverter uma migração:

```shell
npm run typeorm migration:revert
```

Observação:

Pode ser preciso informar esse parâmetro -d seguido do path do dataSource. Também pode ser preciso usar esse `--` após o typeorm para o npm não pegar os argumentos errados.

### Comandos helpers

Para evitar ficar escrevendo esses comandos longos, utilize os seguintes:

```shell
node helper.js migration:run

node helper.js migration:create <nome da migração>

node helper.js migration:generate <nome da migração>

node helper.js entity:create <nome do módulo> <nome da entidade>

```
