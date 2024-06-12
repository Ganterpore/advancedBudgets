# Overview
Advanced Budgets is a sveltekit app with a postgres database, deploying to Vercel.

It is used for tracking spending and managing budgets for an individual.

# Technical Overview
Standard sveltekit structure, pages of the app are managed from the routes. 
Reusable functions are in lib, with reusable components in lib/components.
Each page in routes will have the standard sveltekit files, as well as a types file to describe the unique types for the 
space, and a model file which describes the model in the database. They may also have some area specific components.

# Startup
```shell
npm run db
npm run migrate:up
npm run dev
```

# Deployments
To deploy the current version in a staging environment
```shell
vercel
```
To deploy to production, push up your branch, get it approved and merge to master.
The application should automatically deploy when merged with master.

# Working with the database
```shell
# Create a docker image running the DB with the current migrations
npm run db 
# Stop that docker image and db
npm run db-close

npm run migrate:make $migration_name # create a new migration
npm run migrate:up # run all new migrations
npm run migrate:down # rollback a migration
```