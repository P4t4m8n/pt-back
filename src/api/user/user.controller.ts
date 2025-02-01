import { Request, Response } from "express";
import { AppError } from "../../util/Error.util";
import { userUtil } from "./user.util";
import { userService } from "./user.service";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const query = req.query;
    const filter = userUtil.sanitizeFilter(query);
    const users = await userService.get(filter);

    res.status(200).json( users );
  } catch (error) {
    AppError.handleResponse(res, error);

  }
};


export const getUserByTraineeId = async (req: Request, res: Response) => {
  try {
    const traineeId = req?.params?.traineeId;
    const user = await userService.getByTraineeId(traineeId);

    res.status(200).json( user );
  } catch (error) {
    AppError.handleResponse(res, error);
  }
}