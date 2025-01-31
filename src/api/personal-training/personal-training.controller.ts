import { Request, Response } from "express";
import { AppError } from "../../util/Error.util";
import { personalTrainingService } from "./personal-training.service";
import { videoService } from "../video/video.service";
import { TVideoDto } from "../../types/video.type";

export const createPersonalTraining = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("data:", data);
    //TODO add validation and sanitization

    const instructionVideos = data.instructionVideos.map(
      async (v: TVideoDto | Blob) => {
        if ((v as TVideoDto)?.id) {
          return v as TVideoDto;
        }

        const video = await videoService.uploadToCdn(v as Blob);
        return video;
      }
    );

    const pt = await personalTrainingService.create({
      ...data,
      instructionVideos,
    });
    res.status(201).json(pt);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
