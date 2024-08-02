import { Date, Images } from "../models/types";

export const parseDate = (rawDate: string): Date | undefined =>
  rawDate
    ? {
        year: parseInt(rawDate.split("-")[0]),
        month: parseInt(rawDate.split("-")[1]),
        day: parseInt(rawDate.split("-")[2]),
      }
    : undefined;

const getImageSource = (images: any, imageType: string) =>
  images.find((image: any) => image.type === imageType);

export const parseImages = (
  imagesUrl: string,
  images: any[]
): Images | undefined => ({
  cover: getImageSource(images, "cover")
    ? `${imagesUrl}/${getImageSource(images, "cover").filename}`
    : undefined,
  coverMobile: getImageSource(images, "coverMobile")
    ? `${imagesUrl}/${getImageSource(images, "coverMobile").filename}`
    : undefined,
  logo: getImageSource(images, "logo")
    ? `${imagesUrl}/${getImageSource(images, "logo").filename}`
    : undefined,
  poster: getImageSource(images, "poster")
    ? `${imagesUrl}/${getImageSource(images, "poster").filename}`
    : undefined,
  background: getImageSource(images, "background")
    ? `${imagesUrl}/${getImageSource(images, "background").filename}`
    : undefined,
});

export const parseIsHD = (rawIsHd: number): boolean | undefined =>
  rawIsHd === 0 ? false : rawIsHd === 1 ? true : undefined;
