import { Router } from "express";
import { createPersonalTraining } from "./personal-training.controller";

export const personalTrainingRoutes = Router();
personalTrainingRoutes.post("/create", createPersonalTraining);
