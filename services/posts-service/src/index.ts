import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./utils/logger.ts";
import postRoutes from "./routes/posts.routes.ts";
import { setupSwagger } from "./swagger.ts";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4002;

app.use(cors());

app.use(express.json());

setupSwagger(app);

app.use("/", postRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", message: "Posts service is healthy" });
});

app.listen(port, () => {
  logger.info(`Posts service is now running on http://localhost:${port}`);
  logger.info(
    `API documentation for Posts service is available at http://localhost:${port}/api-docs`
  );
});

export default app;
