import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import logger from "../utils/logger.ts";
const prisma = new PrismaClient();

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  content: z.string().optional(),
});

const updatePostSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters long")
      .optional(),
    content: z.string().optional(),
  })
  .refine((data) => data.title || data.content, {
    message: "At least one of title or content must be provided",
  });

export const createPost = async (req: Request, res: Response) => {
  const userid = req.user?.userId;
  if (!userid) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }
  try {
    const { title, content } = postSchema.parse(req.body);
    const post = await prisma.post.create({
      data: { title, content, authorId: userid, published: true },
    });
    logger.info(`Post created with ID: ${post.id} by User ID: ${userid}`);
    res.status(201).json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(error.issues);
    }
    logger.error("Error creating post", { error });
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { author: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(posts);
  } catch (error) {
    logger.error("Error fetching posts", { error });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: { name: true, email: true } } },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    logger.error("Error fetching post by ID: ${req.params.id}", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const userid = req.user?.userId;
  if (!userid) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }
  try {
    const { id } = req.params;
    const posttoUpdate = await prisma.post.findUnique({ where: { id } });
    if (!posttoUpdate) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (posttoUpdate.authorId !== userid) {
      return res.status(403).json({ message: "Forbidden: Not the author" });
    }
    const data = updatePostSchema.parse(req.body);
    const updatedPost = await prisma.post.update({
      where: { id },
      data,
    });
    logger.info(`Post with ID: ${id} updated by User ID: ${userid}`);
    res.status(200).json(updatedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(error.issues);
    }
    logger.error("Error updating post with ID: ${req.params.id}", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const userid = req.user?.userId;
  if (!userid) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }
  try {
    const { id } = req.params;
    const posttoDelete = await prisma.post.findUnique({ where: { id } });
    if (!posttoDelete) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (posttoDelete.authorId !== userid) {
      return res.status(403).json({ message: "Forbidden: Not the author" });
    }
    await prisma.post.delete({ where: { id } });
    logger.info(`Post with ID: ${id} deleted by User ID: ${userid}`);
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting post with ID: ${req.params.id}", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
