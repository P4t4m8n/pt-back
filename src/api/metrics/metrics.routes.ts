import { Router } from "express";
import { saveMetrics } from "./metrics.controller";


export const metricRoutes = Router();

metricRoutes.post("/edit", saveMetrics);