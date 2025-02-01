import { VideoFormat } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import { TVideo, TVideoDto } from "../../types/video.type";
import { AppError } from "../../util/Error.util";

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
  const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  if (!UPLOAD_PRESET || !CLOUD_NAME) {
    throw AppError.create("Upload preset or cloud name not found", 502);
  }

  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

  const formData = new FormData();
  formData.append("upload_preset", UPLOAD_PRESET);
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
  const CLOUD_NAME = process.env.CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;

  const DELETE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/destroy`;

  const res = await fetch(`${DELETE_URL}/${assetId}`, {
    method: "POST",
    body: JSON.stringify({
      assetId,
      api_key: API_KEY,
    }),
  });

  const result = await res.json();

  if (!result || result?.result !== "ok") {
    throw AppError.create("No return value", 502);
  }
};

export const videoService = { save, uploadToCdn, removeFromCdn };
