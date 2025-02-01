import { Router } from "express";
import { getUserByTraineeId, getUsers } from "./user.controller";

export const userRoutes = Router();
userRoutes.get("/", getUsers);
userRoutes.get("/trainee/:traineeId", getUserByTraineeId);
