import { Request, Response } from "express";

import { AppError } from "../../util/Error.util";
import { programUtil } from "./program.util";
import { programService } from "./program.service";
import { appendFile } from "fs";

export const saveProgram = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;

    const dto = programUtil.sanitizeDto(data);
    const errors = programUtil.validateDto(dto);
    if (Object.keys(errors).length) {
      AppError.create(`Invalid data-> ${JSON.stringify(errors)} `, 403);
      res.status(403).json({ ...errors });
      return;
    }

    const program = await programService.save(dto);
    res.status(200).json(program);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
