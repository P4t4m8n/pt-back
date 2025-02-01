import { Request, Response } from "express";
import { AppError } from "../../util/Error.util";
import { personalTrainingService } from "./personal-training.service";
import { personalTrainingUtil } from "./personal-training.util";

export const createPersonalTraining = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    //TODO add validation and sanitization
    const dto = personalTrainingUtil.sanitizeDto(data);
    console.log("dto:", dto)
    const errors = personalTrainingUtil.validateDto(dto);
    if (Object.keys(errors).length) {
      //TODO add validation errors to error class to return a json instead of massage
      AppError.create(`Invalid data-> ${JSON.stringify(errors)} `, 403);
      res.status(403).json({ ...errors });
      return;
    }

    const pt = await personalTrainingService.create(dto);
    res.status(201).json(pt);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
