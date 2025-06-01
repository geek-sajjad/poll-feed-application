<h1 align="center">Poll feed application</h1>

---

## Start the server with docker compose

```bash
cp .env.example .env

docker compose up -d
```

### Start the server

Start the application in a Local

```bash

yarn install
yarn dev
```

> This starts a local server using `nodemon`, which automatically restarts the server when file changes are detected.
> The server will run on `http://localhost:8000`.

### Test the server

To verify the server is running:

1. Open your browser and navigate to `http://localhost:8000/health`.

```json
{ "success": true }
```

### Create the user database table

Create the necessary database tables by running the migrations:

```bash
yarn migration:run
```

### Running in dev mode

- Run `yarn dev` to start the application in development mode using [nodemon](https://www.npmjs.com/package/nodemon). It automatically reloads the server when file changes are detected. By default, the server will run on `http://localhost:8000`.

### Build

- Run `yarn build` to compile the project. The output files will be placed in the `build/` directory.
- Run `yarn start` to start the compiled project.
- Run `yarn type-check` to perform type checking.

### Migrations

- Run `yarn migration:run` to execute all pending migrations.
- Run `yarn migration:generate MigrationName` to generate a migration based on the current entity changes.
- Run `yarn migration:create MigrationName` to create an empty migration file.
- Run `yarn migration:revert` to undo the last executed migration. To revert multiple migrations, execute the command multiple times.

### Test

- Run `yarn test` to execute the unit and integration tests.
- Run `yarn test:coverage` to execute tests and generate a coverage report.

---

## Project Structure

| Name                                 | Description                                                                                                            |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **@types/**                          | Global types definitions                                                                                               |
| **build/**                           | Compiled source files will be placed here                                                                              |
| **coverage/**                        | Jest coverage results will be placed here                                                                              |
| **src/**                             | Source files                                                                                                           |
| **src/app/**                         | Application layer containing controllers, middlewares, and request handlers.                                           |
| **src/app/routers/**                 | REST API routers.                                                                                                      |
| **src/app/middlewares/**             | Custom Express middlewares for authentication, error handling, etc.                                                    |
| **src/app/request-handlers/**        | Handlers for processing API requests following the Clean Architecture principles. Organized into commands and queries. |
| **src/app/server.ts**                | Express server configuration and initialization.                                                                       |
| **src/container/**                   | Dependency Injection container setup with `InversifyJS`.                                                               |
| **src/core/**                        | Core utilities, interfaces, and helpers used across the project.                                                       |
| **src/domain/**                      | Domain layer containing business logic, models, and interfaces.                                                        |
| **src/domain/models/**               | Domain models representing business entities.                                                                          |
| **src/domain/repositories/**         | Interfaces for database operations.                                                                                    |
| **src/domain/services/**             | Interfaces for domain-level services (e.g., authentication, encryption).                                               |
| **src/domain/use-cases/**            | Use cases implementing business logic.                                                                                 |
| **src/infra/**                       | Infrastructure layer providing implementations for core and domain abstractions.                                       |
| **src/infra/auth/**                  | Authentication implementations                                                                                         |
| **src/infra/database/**              | Database configuration, models, and migrations.                                                                        |
| **src/infra/database/repositories/** | Concrete implementations of domain repository interfaces using TypeORM.                                                |
| **src/infra/id-generator/**          | UUID-based ID generator.                                                                                               |
| **src/infra/security/**              | Security utilities like password encryption.                                                                           |
| **src/infra/logger/**                | Logger implementations.                                                                                                |
| **src/tests/**                       | Test suite, including unit and end-to-end tests.                                                                       |
| **src/tests/e2e/**                   | End-to-end tests for API routes.                                                                                       |
| **src/tests/units/**                 | Unit tests for individual modules and layers.                                                                          |
| **src/tests/helpers/**               | Utilities for simplifying test setup and assertions.                                                                   |

---

## Environment Variables

| Name                   | Description                                                          | Optional | Default value                             |
| ---------------------- | -------------------------------------------------------------------- | -------- | ----------------------------------------- |
| NODE_ENV               | Specifies the environment (e.g., production, development, test).     | ❌       |                                           |
| HOST                   | Server host.                                                         | ✔️       | 0.0.0.0                                   |
| PORT                   | Server host port.                                                    | ✔️       | 8000                                      |
| DB_USER                | Database username.                                                   | ❌       |                                           |
| DB_HOST                | Database host.                                                       | ❌       |                                           |
| DB_NAME                | Database name.                                                       | ❌       |                                           |
| DB_PASSWORD            | Database password.                                                   | ❌       |                                           |
| DB_PORT                | Database host port.                                                  | ❌       |                                           |
| DB_HOST_PORT           | Database mapped port for accessing the database in Docker.           | ❌       |                                           |
| TEST_DB_HOST           | Test database host.                                                  | ❌       |                                           |
| TEST_DB_NAME           | Test database name.                                                  | ❌       |                                           |
| TEST_DB_PORT           | Test database host port.                                             | ❌       |                                           |
| TEST_DB_HOST_PORT      | Test database mapped port for accessing the test database in Docker. | ❌       |                                           |
| JWT_SECRET             | Secret used to encrypt JSON web tokens.                              | ❌       |                                           |
| JWT_EXPIRES_IN_SECONDS | Number of seconds before JWT tokens expire.                          | ✔️       | 86400                                     |
| CORS_ORIGIN_ALLOWED    | List of allowed origins for CORS.                                    | ✔️       | \*                                        |
| DB_LOGGING             | Enables or disables query logging in TypeORM.                        | ✔️       | false                                     |
| TYPEORM_ENTITIES       | Path to TypeORM entity files.                                        | ✔️       | src/infra/database/models/\*_/_.entity.ts |
| TYPEORM_MIGRATIONS     | Path to TypeORM migration files.                                     | ✔️       | src/infra/database/migrations/\*_/_.ts    |
| LOGGER_TYPE            | Specifies the type of logger to use                                  | ✔️       | console                                   |

### Creating a migration

To create a new migration, run the following command:

```bash
yarn migration:create MigrationName
```

This will create an empty migration file in src/infra/database/migrations/. A migration file contains two functions:

- `up`: Defines the changes to be applied to the database when the migration is executed.
- `down`: Defines how to revert the changes applied by the `up` function.

You must manually define the logic for both functions when creating an empty migration.

### Generating a migration

TypeORM also allows you to generate migrations automatically based on changes in your entities. To generate a migration:

```bash
yarn migration:generate MigrationName
```

This will create a migration file in `src/infra/database/migrations/`. The content of the migration will be automatically generated by comparing your updated entities with the current database schema.

**Exemple:**

1. Add a new property `firstName` to the `User` entity:

```typescript
@Column({ nullable: false, length: 20 })
firstName!: string;
```

2. Run:

```bash
yarn migration:generate AddFirstNameInUser
```

3. A migration will be generated to add the `firstName` column to the `users` table.

### Running migrations

To execute pending migrations and update your database schema:

```bash
yarn migration:run
```

This will run all migrations that have not yet been applied to the database.

### Reverting migrations

To revert the last executed migration, run:

```bash
yarn migration:revert
```

If you need to revert multiple migrations, you can execute this command multiple times. Each execution will revert one migration in reverse order of their execution.

---

## Tests

Tests are located in `src/tests`.

In this boilerplate, [Jest](https://jestjs.io/docs/getting-started) is used to execute the tests.

The tests are divided into two types: **end-to-end tests** and **unit tests**.

### Running Tests

- **Run all tests:**

```bash
yarn test
```

Execute this command in the `backend` container shell after running command `yarn docker:test:up`

- **Run tests with coverage:**

```bash
yarn test:coverage
```

- **Run a specific test file:** Add the name or path of the file after the command. For example:

```bash
yarn test auth
```
