import { Request, Response } from "express";
import { AppError } from "../../util/Error.util";
import { traineeUtil } from "./trainee.util";
import { traineeService } from "./trainee.service";
import { asyncLocalStorage } from "../../middlewares/localStorage.middleware";

export const getTrainees = async (req: Request, res: Response) => {
  try {
    const query = req.query;

    const filter = traineeUtil.sanitizeFilter(query);

    const trainees = await traineeService.get(filter);
    res.status(200).json(trainees);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};

export const getTraineeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const trainee = await traineeService.getById(id);
    console.log("trainee:", trainee)
    res.status(200).json(trainee);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};

export const createTrainee = async (req: Request, res: Response) => {
  try {
    //TODO build a master trainer and move credentials into env. this ID is temporary
    const masterTrainer = "f12614e1-98c9-4e54-97e0-0d58c331b450";

    const data = req.body;
    const dto = traineeUtil.sanitizeDto(data);
    console.log("dto:", dto);

    const store = asyncLocalStorage.getStore();
    const loggedInUser = store?.loggedinUser;

    if (!dto.userId || !loggedInUser?.id) {
      throw AppError.create("Missing credentials", 400, true);
    }

    if (
      loggedInUser?.trainer?.id !== dto.trainerId &&
      loggedInUser.id !== dto.userId
    ) {
      throw AppError.create("Unauthorized", 401, true);
    }

    const id = await traineeService.create(dto);
    console.log("id:", id);
    res.status(201).json({ id });
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
