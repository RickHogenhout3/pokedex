const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your Pokemon API',
      version: '1.0.0',
      description: 'API for retrieving Pokemon data',
    },
  },
  apis: ['server.js'], // Replace with the actual path to your Express file
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
