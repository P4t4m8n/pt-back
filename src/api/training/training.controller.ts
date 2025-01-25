import { Request, Response } from "express";
import { AppError } from "../../util/Error.util";
import { trainingUtil } from "./training.util";
import { trainingService } from "./training.service";
import { asyncLocalStorage } from "../../middlewares/localStorage.middleware";
export const getTrainings = async (req: Request, res: Response) => {
  try {
    const query = req.query;
    console.log("query:", query);

    const filter = trainingUtil.sanitizeFilter(query);

    const trainings = await trainingService.get(filter);

    res.status(200).json(trainings);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};

export const createTraining = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const user = asyncLocalStorage.getStore()?.loggedinUser;
    const trainerId = user?.trainer?.id;
    if (!trainerId) {
      throw AppError.create("Unauthorized", 401, true);
    }
    //TODO add validation and sanitization
    const training = await trainingService.create({ ...data, trainerId });
    console.log("training:", training);
    res.status(201).json(training);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
