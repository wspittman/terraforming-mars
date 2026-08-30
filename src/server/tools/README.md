# Terraforming-mars maintenance tools

Tool directory is for specific scripts for project maintenance.

Before use them build the project `npm run build`

... then run any of compilled scripts from build directory `node <path-to-the-toolname>.js`

It is possible to run these tools "directly" by using ts-node package

1. Install ts-node on your machine `npm install -g ts-node`
2. Run the desired script with `ts-node`.

## Export game

### Usage

```
npm run build
sh src/server/tools/export_game.sh <heroku-app-name>  <game id | player id | spectator id>
```

or

```
heroku pg:credentials:url --app <heroku-app-name>
POSTGRES_HOST=<postges:...> node build/src/tools/export_game.js <game id | player id | spectator id>
```

### Description

This tool extracts the entire history of a game from a database and stores it in the local filesystem database.

If you plan to extract from the local SQLite database, have no environment variables. If you're extracting
from PostgreSQL, use the `POSTGRES_HOST` environment variable. You cannot export from a local filesystem database.
You might as well then just run `cp -R`

(Read https://github.com/terraforming-mars/terraforming-mars/wiki/Databases#maintenance
to get advice on setting up your `POSTGRES_HOST` environment variable.)
