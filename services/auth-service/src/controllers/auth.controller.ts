// The code above is an implementation of authentication controllers for a Node.js application using Express, Prisma, JWT, Zod, and bcryptjs. It provides two main functionalities: user registration and user login.

// 1. **Imports**: The code imports necessary modules and types, including Express types for Request and Response, PrismaClient for database interactions, jwt for token generation, zod for schema validation, bcryptjs for password hashing, and a custom logger utility.
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcryptjs";
import logger from "../utils/logger.ts";

// 2. **Prisma Client**: An instance of PrismaClient is created to interact with the database.
const prisma = new PrismaClient();

// 3. **Schema Definitions**: Two Zod schemas are defined:
//    - `registerSchema`: Validates the registration data, ensuring the email is in a valid format, the password has a minimum length of 6 characters, and the name is optional.
//    - `loginSchema`: Validates the login data, ensuring the email is in a valid format and the password is provided.
const registerSchema = z.object({
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  name: z.string().optional(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z.string(),
});

// 4. **Register Function**: The `register` function handles user registration:
//    - It parses and validates the incoming request body against the `registerSchema`.
//    - The password is hashed using bcryptjs before storing it in the database.
//    - A new user is created in the database using Prisma.
//    - If successful, it logs the registration event and responds with a success message and the user ID.
//    - If validation fails, it responds with a 400 status and the validation issues. For other errors, it logs the error and responds with a 500 status.
// services/auth-service/src/controllers/auth.controller.ts

export const register = async (req: Request, res: Response) => {
  try {
    console.log("--> [1/5] Register function started.");

    const { email, name, password } = registerSchema.parse(req.body);
    console.log(
      `--> [2/5] Request body parsed successfully for email: ${email}`
    );

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("--> [3/5] Password hashed successfully.");

    console.log("--> [4/5] Attempting to create user in database...");
    const user = await prisma.user.create({
      data: { email, name: name ?? null, password: hashedPassword },
    });
    console.log(`--> [5/5] User created successfully with ID: ${user.id}`);

    logger.info(`User registered: ${user.email}`);
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod Validation Error:", error.issues);
      return res.status(400).json(error.issues);
    }
    console.error(
      "--> [ERROR] An error occurred in the register function:",
      error
    );
    logger.error(`Registration error: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 5. **Login Function**: The `login` function handles user login:
//    - It parses and validates the incoming request body against the `loginSchema`.
//    - It retrieves the user from the database based on the provided email.
//    - It compares the provided password with the stored hashed password using bcryptjs.
//    - If authentication is successful, it generates a JWT token containing the user ID and email, which expires in 1 hour.
//    - It logs the login event and responds with the generated token.
//    - If validation fails or credentials are invalid, it responds with appropriate status codes (400 for validation issues, 401 for invalid credentials). For other errors, it logs the error and responds with a 500 status.
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    logger.info(`User logged in: ${user.email}`);
    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(error.issues);
    }
    logger.error(`Login error:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Overall, this code provides a secure way to handle user registration and login, ensuring that passwords are hashed and that JWT tokens are used for session management.
// Note: Ensure that the environment variable `JWT_SECRET` is set for JWT token generation.
// Also, make sure to handle the PrismaClient connection lifecycle appropriately in a real application.
