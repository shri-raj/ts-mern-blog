import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.ts";
import { setupSwagger } from "./swagger.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

//explain the above code in comments
// This code sets up an Express server for an authentication service.
// It imports necessary modules including express, dotenv for environment variables, cors for handling cross-origin requests, and custom routes and swagger setup.
// The dotenv.config() function loads environment variables from a .env file into process.env.
// An Express application instance is created and configured to use CORS and JSON body parsing middleware.
// The authentication routes are mounted at the /api/auth path.
// Swagger documentation is set up using the setupSwagger function.
// Finally, the server listens on a specified port (defaulting to 4001) and logs a message indicating that the service is running.
