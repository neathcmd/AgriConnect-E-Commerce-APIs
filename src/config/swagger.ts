import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Express API",
      version: "1.0.0",
      description: "API documentation for my Express + TypeScript project",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  // Adjust paths to your route files
  apis: ["./src/routes/*.ts"], 
};

const swaggerSpec = swaggerJsdoc(options);

// Helper to setup Swagger
export const setupSwagger = (app: Express) => {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
