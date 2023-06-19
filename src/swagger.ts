import * as path from 'path';
import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Locale API',
        version: '1.0.0',
        description:`With Locale's API, users can access detailed data on Nigeria's regions, states, and local government areas (LGAs). `,
        contact: {
            name: 'Saheed Shittu',
            url: 'http://localhost:5050',
            email: 'shittusaheed01@gmail.com'
        }
    },
    servers: [
        {
            description: 'Dev Route',
            url: 'http://localhost:5050'
        },
        {
            description: 'Production Route',
            url: 'https://geolocatorng.onrender.com'
        }
    ],
    host: 'localhost:5050',
    schemes: ['http', 'https']
};

const options = {
    openapi: '3.0.0',
}

const firstEndpoint = path.join(__dirname, './app.js')
const secondEndpoint = path.join(__dirname, './routes/*.js')
const outputFile = path.join(__dirname,'./swagger-output.json');
const endpointFiles = [firstEndpoint, secondEndpoint];

swaggerAutogen(options)(outputFile, endpointFiles, doc);
