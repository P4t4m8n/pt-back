import { Router } from "express";
import { saveVideo } from "./video.controller";
import multer from "multer";

export const videoRoutes = Router();
//TODO add form parser middleware or move storage into Redis
//DO NOT RELEASE LIKE THIS MEMORY STORAGE IS NOT FOR PRODUCTION
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

videoRoutes.post("/edit", upload.single("video"), saveVideo);
