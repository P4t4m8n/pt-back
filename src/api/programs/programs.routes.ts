import { Router } from "express";
import {
  getProgramById,
  getProgramsByUser,
  saveProgram,
} from "./programs.controller";

export const programRoutes = Router();

programRoutes.get("/user", getProgramsByUser);
programRoutes.get("/:id", getProgramById);
programRoutes.post("/save", saveProgram);
