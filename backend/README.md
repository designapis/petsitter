# PetSitterDemoBackend
Backend for the Pet Sitter Demo Application for the OpenAPI Book

## Running 

```sh
DB_URL=mongodb://<host>/<db> npm start
```

## Environment variables
-  `DB_URL` (required) the mongodb connection string, must include a database segement. (see: https://docs.mongodb.com/manual/reference/connection-string/)
