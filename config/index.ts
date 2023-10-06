require('dotenv').config()

export default {
    port: process.env.MAGAZINE_HUB_PORT,
    jwt_key: process.env.MAGAZINE_HUB_JWT_KEY,
    node_env: process.env.NODE_ENV,
}