import { VideoFormat } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import { TVideo, TVideoDto } from "../../types/video.type";
import { AppError } from "../../util/Error.util";
import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
} from "../../config/env.config";

const save = async (dto: TVideoDto): Promise<TVideo> => {
  const video = await prisma.video.upsert({
    where: { id: dto?.id || "" },
    update: {
      ...dto,
    },
    create: {
      ...dto,
    },
  });

  return video;
};

const uploadToCdn = async (file: Blob): Promise<TVideoDto> => {
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;

  const formData = new FormData();
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("file", file);
  formData.append("folder", "training");
  const res = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const result = await res.json();

  if (!result || !result?.url) {
    throw AppError.create("No return value", 502);
  }

  const video: TVideo = {
    duration: result?.duration,
    height: result?.height,
    width: result?.width,
    playbackUrl: result?.playback_url,
    url: result?.url,
    assetId: result?.asset_id,
    format: ((result?.format as string).toUpperCase() as VideoFormat) || "MKV", //Typescript is Fun :(
  };

  return video;
};

const removeFromCdn = async (assetId: string): Promise<void> => {
  const DELETE_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/destroy`;

  const res = await fetch(`${DELETE_URL}/${assetId}`, {
    method: "POST",
    body: JSON.stringify({
      assetId,
      api_key: CLOUDINARY_API_KEY,
    }),
  });

  const result = await res.json();

  if (!result || result?.result !== "ok") {
    throw AppError.create("No return value", 502);
  }
};

export const videoService = { save, uploadToCdn, removeFromCdn };
