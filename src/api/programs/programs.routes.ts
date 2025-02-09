import { Router } from "express";
import { saveProgram } from "./programs.controller";

export const programRoutes = Router();

programRoutes.get("/user")
programRoutes.post("/save", saveProgram);
