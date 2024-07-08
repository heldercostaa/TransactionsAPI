# TransactionsAPI

[![Maintainer](https://img.shields.io/badge/maintainer-%40heldercostaa-blue?logo=superuser&logoColor=white)](https://github.com/heldercostaa)
![Language](https://img.shields.io/badge/language-typescript-yellow?logo=ts-node&logoColor=white)
[![GitHub Workflow Status (main branch)](https://img.shields.io/github/actions/workflow/status/heldercostaa/TransactionsAPI/main.yml?branch=main&logo=dependabot&logoColor=white)](https://github.com/heldercostaa/TransactionsAPI)
[![Last commit](https://img.shields.io/github/last-commit/heldercostaa/TransactionsAPI.svg?logo=github&logoColor=white)](https://github.com/heldercostaa/TransactionsAPI/commits/main)

A very simple Node API about Transactions (deposits and withdraws), to integrate and experiment some Typescript libraries.

## Setup

```bash
cd ../TransactionsAPI
npm install
cp .env.example .env
cp .env.test.example .env.test
npm run knex -- migrate:latest
npm run dev
```

## Database

```bash
npm run knex -- migrate:make new-migration-name  # Creates new migration
npm run knex -- migrate:latest                   # Execute latest migrations
npm run knex -- migrate:rollback --all           # Reverts all migrations
```

## Tests

```bash
npm run test
```

## Tools

- **Fastify**: As web framework.
- **PostgreSQL**: As production database.
- **SQLite**: As simple initial database.
- **Knex**: For SQL query builder.
- **Zod**: For schema validation (.env, request body).
- **Vitest**: To write tests.
- **Supertest**: To help test the application without any port.
- **tsup**: To bundle the code.
- **commitlint**: To force conventional commits.
- **husky**: To force hooks before push (test and commit message).
- **commitizen**: To help build the commit messages.
