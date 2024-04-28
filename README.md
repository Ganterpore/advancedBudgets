## Working with the database

```shell
# Create a docker image running the DB with the current migrations
npm run local-docker-db 
# Stop that docker image and db
npm run local-docker-db-close

npm run migrate:make $migration_name # create a new migration
npm run migrate:up # run all new migrations
npm run migrate:down # reset the database
```