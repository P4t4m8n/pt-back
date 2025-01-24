import { Router } from "express";
import { createTrainee, getTrainees } from "./trainee.controller";

export const traineeRoutes = Router();

traineeRoutes.get("/", getTrainees);
traineeRoutes.post("/create", createTrainee);
