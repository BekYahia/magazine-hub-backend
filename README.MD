## Magazine Hub (Backend) - A Magazine Subscription Management System

### ISSUE:
I ran into an issue within the last hours, regards docker networks and services, I wasn't able to access the db service by the name in docker compose file, I will file a quick solution and update the repo ASAP.

 - [Frontend Repo](https://github.com/BekYahia/magazine-hub-frontend)
## Installation And Running:

- install dependencies
```bash
npm i
```

- rename .env.sample to .env
```bash
cp .env.sample .env
```
- Note that the default port is 3100, if you change it, make sure to change it in the frontend as well, in `vite.config.js` > `server.proxy`

- make sure you have docker installed

- run the DB and Adminer
```bash
docker-compose up db adminer
```
- access adminer on `localhost:8080` and login with the credentials in the .env file

- you add `-d` for detached mode `docker-compose up db adminer -d`

- run the backend
```bash
docker-compose up backend
```

- Finally, Migrate the database
```bash
npm run db
```
## TODO:
- [] implement Stripe for payments
- [] set a corn job to simulate the subscription expiration but sending the a magazine monthly depending on the `publication_date`
- [] Swagger (in progress)
- [] Permissions and Grafana for monitoring