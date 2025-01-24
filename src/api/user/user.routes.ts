import { Router } from "express";
import { getUsers } from "./user.controller";

export const userRoutes = Router();
userRoutes.get("/", getUsers);
