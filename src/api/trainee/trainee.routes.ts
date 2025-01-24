import { Router } from "express";
import {
  createTrainee,
  getTraineeById,
  getTrainees,
} from "./trainee.controller";

export const traineeRoutes = Router();

traineeRoutes.get("/", getTrainees);
traineeRoutes.get("/:id", getTraineeById);
traineeRoutes.post("/create", createTrainee);
