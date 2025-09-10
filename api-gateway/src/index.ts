import express from "express";
import morgan from "morgan";
import cors from "cors";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import jwt from "jsonwebtoken";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const services = {
  auth: "http://localhost:4001",
  posts: "http://localhost:4002",
  qa: "http://localhost:4003",
};

const authenticateGateway = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "your-super-secret-key",
      (err, user) => {
        if (!err && user && typeof user !== "string") {
          req.headers["x-user-id"] = user.userId;
        }
        next();
      }
    );
  } else {
    next();
  }
};

app.use(authenticateGateway);

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: services.auth,
    changeOrigin: true,
    on: {
      proxyReq: fixRequestBody,
    },
  })
);

app.use(
  "/api/posts",
  createProxyMiddleware({
    target: services.posts,
    changeOrigin: true,
    on: {
      proxyReq: fixRequestBody,
    },
  })
);

app.use(
  "/api/qa",
  createProxyMiddleware({
    target: services.qa,
    changeOrigin: true,
    on: {
      proxyReq: fixRequestBody,
    },
  })
);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
