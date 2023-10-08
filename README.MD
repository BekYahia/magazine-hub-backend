## Magazine Hub (Backend) - A Magazine Subscription Management System

 - [Frontend Repo](https://github.com/BekYahia/magazine-hub-frontend)

# Table of Contents:
- [Installation](#installation)
- [Running](#running)
- [Testing](#testing)
- [Documentation](#documentation)
- [TODO](#todo)

## Installation:

1) **Install Dependencies:**
    ```bash
    npm i
    ```

1) **Rename .env.sample to .env**
    ```bash
    cp .env.sample .env
    ```

    Copy the provided .env.sample file and rename it to .env for configuration.

1) **Configure Port**
    
    The default port is `3100`. If you change it, update the frontend configuration in `vite.config.js` > `server.proxy`
        - The Proxy in the frontend is a way to avoid CORS issues in development.

## Running:

1) **Database**
    
    Run **DB (MysQL)** and **Adminer** which is a DB Management Tool
    
    ```bash
    docker-compose up adminer
    ```

    Access Adminer at `localhost:8080` with credentials from `.env`
    
    Use `-d` for detached mode: `docker-compose up adminer -d`.

2) **Run the backend**

    ```bash
    docker-compose up backend
    ```

    Finally, Migrate the database
    ```bash
    npm run db:dev
    ```

## Testing:

Run the tests
```bash
npm run test
```

## Documentation:

Swagger is available at `localhost:3100/api-docs`
## TODO:
- [ ] Implement Stripe for payments
- [ ] Set a corn job to simulate the subscription experience buy sending the a magazine monthly depending on the `publication_date`
- [x] Swagger
- [ ] Permissions and Grafana for monitoring
- [ ] Email notifications