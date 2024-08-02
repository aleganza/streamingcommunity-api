import axios from "axios";

import Parser from "../models/parser";
import { Result, Search, SubOrDub, Type } from "../models/types";

class StreamingCommunity extends Parser {
  override name = "StreamingCommunity";
  override baseUrl = "https://streamingcommunity.photos";
  override imagesUrl = "https://cdn.streamingcommunity.photos/images";
  override logo = "https://streamingcommunity.photos/icon/favicon-32x32.png";

  override async search(
    query: string,
    page: number = 1
  ): Promise<Search<Result>> {
    try {
      const res = await axios.get(`${this.baseUrl}/api/search?q=${query}`);

      // pagination ain't workin :(
      // const res = await axios.get(`${this.baseUrl}/api/search?q=${query}&page=${page}`);

      const getImageSource = (el: any, imageType: string) =>
        el.images.find((image: any) => image.type === imageType);

      const searchResult: Search<Result> = {
        currentPage: res.data.current_page,
        hasNextPage: res.data.current_page !== res.data.last_page,
        totalPages: res.data.last_page,
        totalResults: res.data.total,
        results: [],
      };

      res.data.data.forEach((el: any) =>
        searchResult.results.push({
          id: `${el.id}-${el.slug}`,
          title: el.name,
          type:
            el.type === "tv"
              ? Type.TV
              : el.type === "movie"
              ? Type.Movie
              : undefined,
          score: parseFloat(el?.score),
          subOrDub: el.sub_ita === 0 ? SubOrDub.DUB : SubOrDub.SUB,
          lastAirDate: el.last_air_date
            ? {
                year: el.last_air_date.split("-")[0],
                month: el.last_air_date.split("-")[1],
                day: el.last_air_date.split("-")[2],
              }
            : undefined,
          seasonsCount: el.seasons_count,
          cover: getImageSource(el, "cover")
            ? `${this.imagesUrl}/${getImageSource(el, "cover").filename}`
            : undefined,
          coverMobile: getImageSource(el, "coverMobile")
            ? `${this.imagesUrl}/${getImageSource(el, "coverMobile").filename}`
            : undefined,
          logo: getImageSource(el, "logo")
            ? `${this.imagesUrl}/${getImageSource(el, "logo").filename}`
            : undefined,
          poster: getImageSource(el, "poster")
            ? `${this.imagesUrl}/${getImageSource(el, "poster").filename}`
            : undefined,
          background: getImageSource(el, "background")
            ? `${this.imagesUrl}/${getImageSource(el, "background").filename}`
            : undefined,
        })
      );

      return searchResult;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default StreamingCommunity;
