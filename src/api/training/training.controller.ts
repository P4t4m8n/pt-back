import { Request, Response } from "express";

import { asyncLocalStorage } from "../../middlewares/localStorage.middleware";

import { AppError } from "../../util/Error.util";
import { trainingUtil } from "./training.util";

import { trainingService } from "./training.service";
export const getTrainings = async (req: Request, res: Response) => {
  try {
    const query = req.query;

    const filter = trainingUtil.sanitizeFilter(query);

    const trainings = await trainingService.get(filter);

    res.status(200).json(trainings);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};

export const getTrainingById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const training = await trainingService.getById(id);
    res.status(200).json(training);
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
    res.status(201).json(training);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};

export const updateTraining = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const user = asyncLocalStorage.getStore()?.loggedinUser;
    const trainerId = user?.trainer?.id;
    if (!trainerId) {
      throw AppError.create("Unauthorized", 401, true);
    }
    //TODO add validation and sanitization
    const training = await trainingService.update({ ...data, trainerId });
    res.status(200).json(training);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};

