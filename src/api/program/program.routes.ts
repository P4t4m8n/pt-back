import { Router } from "express";
import { saveProgram } from "./program.controller";

export const programRoutes = Router();

programRoutes.post("/save", saveProgram);
