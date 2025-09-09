import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth Service API",
      version: "1.0.0",
      description: "API documentation for the Auth Service",
    },
    servers: [
      {
        url: "http://localhost:4001",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

// This code sets up Swagger documentation for an Express application.
// It imports the necessary modules, including swagger-jsdoc for generating Swagger specifications and swagger-ui-express for serving the Swagger UI.
// The options object defines the OpenAPI specification, including metadata such as the title, version, and description of the API, as well as the server URL.
// The apis field specifies the path to the route files where Swagger annotations are located.
// The specs variable generates the Swagger specification using the defined options.
// The setupSwagger function takes an Express application instance as an argument and sets up a route (/api-docs) to serve the Swagger UI with the generated specifications.
// This function can be called in the main application file to enable Swagger documentation for the API.
