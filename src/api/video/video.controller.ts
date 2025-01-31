import { Request, Response } from "express";
import { AppError } from "../../util/Error.util";
import { videoService } from "./video.service";

export const saveVideo = async (req: Request, res: Response) => {
  try {
    const z = req.body;
    const { file } = req;

    if (!file) {
      throw new AppError("File buffer is undefined", 400);
    }
    const blob = new Blob([file.buffer], { type: file.mimetype });
    const dto = await videoService.uploadToCdn(blob);
    const video = await videoService.save(dto);

    res.status(200).json(video);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
