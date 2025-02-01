import { Router } from "express";
import { savePersonalTraining } from "./personal-training.controller";

export const personalTrainingRoutes = Router();
personalTrainingRoutes.post("/create", savePersonalTraining);
personalTrainingRoutes.put("/update", savePersonalTraining);
