# Tsumego.app

[![CI](https://github.com/cameron-martin/go/workflows/CI/badge.svg)](https://github.com/cameron-martin/go/actions?query=workflow%3ACI)

A web app for solving tsumego puzzles. Automatically gives you puzzles of the optimal difficulty.

[Open app](https://tsumego.app)

## Development

Run & migrate the database using:

```sh
sudo docker-compose up
```

Run the other things using:

```sh
yarn dev
```

Process games and produce ratings:

```sh
yarn task:rate
```
