import { AppError } from "../../util/Error.util";
import { Response, Request } from "express";
import { imagesService } from "./images.service";

export const uploadImageCloudinary = async (req: Request, res: Response) => {
  try {
    const { file } = req;
    if (!file) {
      throw new AppError("File buffer is undefined", 400);
    }

    const blob = new Blob([file.buffer], { type: file.mimetype });
    const imgUrl = await imagesService.uploadToCdn(blob);
    console.log("imgUrl:", imgUrl)
    res.status(200).json({ imgUrl });
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
