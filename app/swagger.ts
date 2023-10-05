import swaggerJSDoc from 'swagger-jsdoc';
import swaggerui from 'swagger-ui-express';
import { app } from '..';

export function swagger() {

    const swaggerOptions = {
        swaggerDefinition: {
            info: {
                title: 'Magazine Subscriptions API',
                version: '1.0.0',
                description: 'Express API for digital magazine subscriptions',
            },
        },
        apis: ['./routes/*.ts'],
    }
    const swaggerDocs = swaggerJSDoc(swaggerOptions);
    
    app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDocs));
}