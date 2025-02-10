import { Router } from "express";
import { getProgramsByUser, saveProgram } from "./programs.controller";

export const programRoutes = Router();

programRoutes.get("/user", getProgramsByUser);
programRoutes.post("/save", saveProgram);
