import { Router } from "express";
import {
  createTraining,
  getTrainingById,
  getTrainings,
  updateTraining,
} from "./training.controller";

export const trainingRoutes = Router();

trainingRoutes.get("/", getTrainings);
trainingRoutes.get("/:id", getTrainingById);
trainingRoutes.post("/edit", createTraining);
trainingRoutes.put("/edit/:id", updateTraining);
