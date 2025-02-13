//Core
import { Request, Response } from "express";
//Util
import { AppError } from "../../util/Error.util";
import { programUtil } from "./programs.util";
//Service
import { programService } from "./programs.service";
import { asyncLocalStorage } from "../../middlewares/localStorage.middleware";

export const getProgramsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const traineeId = asyncLocalStorage?.getStore()?.loggedinUser?.trainee?.id;

    if (!traineeId) {
      throw AppError.create("Not Authorized", 403);
    }

    const programs = await programService.get({ traineeId });
    res.status(200).json(programs);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};

export const getProgramById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const program = await programService.get({ id,includeTrainings:true });
    res.status(200).json(program);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
export const saveProgram = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;

    const dto = programUtil.sanitizeDto(data);

    if (!dto?.traineeId) {
      const traineeId =
        asyncLocalStorage?.getStore()?.loggedinUser?.trainee?.id;
      if (!traineeId) {
        throw AppError.create("Not Authorized", 403);
      }

      dto.traineeId = traineeId;
    }
    const validationErrors = programUtil.validateDto(dto);
    if (Object.keys(validationErrors).length) {
      throw AppError.create("Validation Error", 400, true, validationErrors);
    }
    const program = await programService.save(dto);
    res.status(200).json(program);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
