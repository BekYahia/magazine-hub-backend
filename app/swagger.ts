import swaggerJSDoc from 'swagger-jsdoc';
import swaggerui from 'swagger-ui-express';
import { app } from '..';

export function swagger() {
    const swaggerOptions = {
        swaggerDefinition: {
            openapi: '3.0.2',
            info: {
                title: 'Magazine Subscriptions API',
                version: '1.0.0',
                description: `
Express API for digital magazine subscriptions
### General Workflow:
First, create a new user. Then, login and use the token you receive in the login response header \`x-auth-token\` to access the other endpoints.`,
            },
            servers: [
                {
                    url: `http://localhost:${process.env.MAGAZINE_HUB_PORT}/api`,
                    description: 'Development server',
                },
            ],
        },
        apis: ['./docs/*.yml', './routes/*.ts'],
    }
    const swaggerDocs = swaggerJSDoc(swaggerOptions);
    
    app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDocs));
}