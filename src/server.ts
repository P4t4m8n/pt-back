import express, { Request, Response } from "express";
import { setupAsyncLocalStorage } from "../middlewares/localStorage.middleware";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
//Option for adding sockets later, remove before deployment if not implemented
const server = http.createServer(app);

//Middleware
app.use(express.json());
//TODO?? build cookie parser and signed cookies, using library for now
app.use(cookieParser(process.env.COOKIE_SECRET));
//Local storage for easy access to user data in the back
app.use(setupAsyncLocalStorage);

//CORS
if (process.env.NODE_ENV === "production") {
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
app.use("/api/auth", authRoutes);

import { traineeRoutes } from "./api/trainee/trainee.routes";
app.use("/api/trainee", traineeRoutes);

import { userRoutes } from "./api/user/user.routes";
app.use("/api/user", userRoutes);

// import { programRoutes } from "./api/program/program.routes";
// app.use("/api/program", programRoutes);

// import { trainingRoutes } from "./api/training/training.routes";
// app.use("/api/training", trainingRoutes);

// import { personalTrainingRoutes } from "./api/personal-training/personal-training.routes";
// app.use("/api/personal-training", personalTrainingRoutes);

// import { exerciseRoutes } from "./api/exercise/exercise.routes";
// app.use("/api/exercise", exerciseRoutes);

// import { setsRoutes } from "./api/set/set.routes";
// app.use("/api/sets", setsRoutes);

// import { videoRoutes } from "./api/video/video.routes";
// app.use("/api/video", videoRoutes);

// Catch-all route
app.get("/**", (req: Request, res: Response) => {
  res.sendFile(path.resolve("/public/index.html"));
});
const port = process.env.PORT || 3030;

server.listen(port, () =>
  console.info(`Server ready at: http://localhost:${port}`)
);
