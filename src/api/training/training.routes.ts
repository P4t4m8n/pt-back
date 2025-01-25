import { Router } from "express";
import { createTraining, getTrainings } from "./training.controller";

export const trainingRoutes = Router();

trainingRoutes.get("/", getTrainings);
trainingRoutes.post("/edit", createTraining);
