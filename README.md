# Tsumego.app

[![CI](https://github.com/cameron-martin/go/workflows/CI/badge.svg)](https://github.com/cameron-martin/go/actions?query=workflow%3ACI)

A web app for solving tsumego puzzles. Automatically gives you puzzles of the optimal difficulty.

[Open app](https://tsumego.app)

## Development

Create a file called `.env` in the root directory, filling in the missing values appropriately:

```
UI_HOST=http://localhost:8081
API_HOST=http://localhost:8080
COGNITO_CLIENT_ID=
COGNITO_WEB_URI=
COGNITO_REGION=
COGNITO_USER_POOL_ID=
DB_HOST=localhost
DB_USER=postgres
DB_NAME=postgres
```

Run & migrate the database using:

```sh
sudo docker-compose up
```

Run the other things using:

```sh
yarn dev
```
