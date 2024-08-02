import axios from "axios";
import { load } from "cheerio";

import Parser from "../models/parser";
import {
  Result,
  Search,
  Season,
  ShowInfo,
  SubOrDub,
  Trailer,
} from "../models/types";
import { parseDate, parseImages, parseIsHD } from "../utils/utils";

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
          type: el.type ?? undefined,
          score: parseFloat(el?.score),
          subOrDub: el.sub_ita === 0 ? SubOrDub.DUB : SubOrDub.SUB,
          lastAirDate: parseDate(el.last_air_date),
          seasonsCount: el.seasons_count ?? undefined,
          images: parseImages(this.imagesUrl, el.images),
        })
      );

      return searchResult;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  override fetchShowInfo = async (showId: string): Promise<ShowInfo> => {
    try {
      const res = await axios.get(`${this.baseUrl}/titles/${showId}`);
      const $ = load(res.data);

      const data = JSON.parse("" + $("#app").attr("data-page") + "").props;

      const result: ShowInfo = {
        id: `${data.title.id}-${data.title.slug}`,
        title: data.title.name,
        plot: data.title.plot ?? undefined,
        quality: data.title.quality ?? undefined,
        type: data.title.type ?? undefined,
        originalTitle: data.title.original_name ?? undefined,
        status: data.title.status ?? undefined,
        runtime: data.title.runtime ?? undefined,
        views: data.title.views ?? undefined,
        dailyViews: data.title.daily_views ?? undefined,
        score: parseFloat(data.title.score),
        releaseDate: parseDate(data.title.release_date),
        lastAirDate: parseDate(data.title.last_air_date),
        subOrDub: data.title.sub_ita === 0 ? SubOrDub.DUB : SubOrDub.SUB,
        seasonsCount: data.title.seasons_count ?? undefined,
        seasons:
          data.title.seasons.map((el: any): Season => {
            return {
              id: el.id,
              number: el.number ?? undefined,
              title: el.name ?? undefined,
              plot: el.plot ?? undefined,
              releaseDate: parseDate(el.release_date),
              showId: el.title_id ?? undefined,
              episodesCount: el.episodes_count ?? undefined,
            };
          }) ?? undefined,
        trailers:
          data.title.trailers.map((el: any): Trailer => {
            return {
              id: el.id,
              title: el.name ?? undefined,
              isHD: parseIsHD(el.is_hd),
              youtubeId: el.youtube_id ?? undefined,
              showId: el.title_id ?? undefined,
            };
          }) ?? undefined,
        images: parseImages(this.imagesUrl, data.title.images),
        genres: data.title.genres.map((el: any): string => {
          return el.name;
        }),
        keywords: data.title.keywords.map((el: any): string => {
          return el.name;
        }),
      };

      return result;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
}

export default StreamingCommunity;
