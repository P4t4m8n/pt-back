import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";
import path from "path";
import { NODE_ENV, COOKIE_SECRET, PORT } from "./config/env.config";
import { setupAsyncLocalStorage } from "./middlewares/localStorage.middleware";

const app = express();
//Option for adding sockets later, remove before deployment if not implemented
const server = http.createServer(app);

//Middleware
app.use(express.json());
//TODO?? build cookie parser and signed cookies, using library for now
app.use(cookieParser(COOKIE_SECRET));
//Local storage for easy access to user data in the back
app.use(setupAsyncLocalStorage);

//CORS
if (NODE_ENV === "production") {
  app.use(express.static(path.resolve("public")));
} else {
  const corsOptions: cors.CorsOptions = {
    origin: ["http://127.0.0.1:5173", "http://localhost:5173", "10.0.0.3:8081"],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

//Routes
import { authRoutes } from "./api/auth/auth.routes";
app.use("/api/v1/auth", authRoutes);

import { traineeRoutes } from "./api/trainee/trainee.routes";
app.use("/api/v1/trainees", traineeRoutes);

import { userRoutes } from "./api/user/user.routes";
app.use("/api/v1/users", userRoutes);

import { trainingRoutes } from "./api/training/training.routes";
app.use("/api/v1/trainings", trainingRoutes);

import { metricRoutes } from "./api/metrics/metrics.routes";
app.use("/api/v1/metrics", metricRoutes);

import { programRoutes } from "./api/program/program.routes";
app.use("/api/v1/programs", programRoutes);

import { videoRoutes } from "./api/video/video.routes";
app.use("/api/v1/videos", videoRoutes);

import { personalTrainingRoutes } from "./api/personal-training/personal-training.routes";
app.use("/api/v1/personal-trainings", personalTrainingRoutes);

// import { exerciseRoutes } from "./api/exercise/exercise.routes";
// app.use("/api/exercise", exerciseRoutes);

// import { setsRoutes } from "./api/set/set.routes";
// app.use("/api/sets", setsRoutes);

// Catch-all route
app.get("/**", (req: Request, res: Response) => {
  res.sendFile(path.resolve("./public/index.html"));
});

server.listen(PORT, () =>
  console.info(`Server ready at: http://localhost:${PORT}`)
);
