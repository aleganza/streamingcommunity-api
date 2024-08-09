import axios from "axios";
import { load } from "cheerio";

import Parser from "../models/parser";
import {
  Episode,
  Individual,
  Result,
  Search,
  Season,
  ShowInfo,
  Source,
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

  override fetchShowInfo = async (
    showId: string,
    season: number = 1
  ): Promise<ShowInfo> => {
    try {
      const res = await axios.get(
        `${this.baseUrl}/titles/${showId}/stagione-${season}`
      );
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
              number: el.number,
              title: el.name ?? undefined,
              plot: el.plot ?? undefined,
              releaseDate: parseDate(el.release_date),
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
            };
          }) ?? undefined,
        images: parseImages(this.imagesUrl, data.title.images),
        genres: data.title.genres.map((el: any): string => {
          return el.name;
        }),
        mainActors: data.title.main_actors.map((el: any): Individual => {
          return {
            id: el.id ?? undefined,
            name: el.name ?? undefined,
            job: el.job ?? undefined,
          };
        }),
        mainDirectors: data.title.main_directors.map((el: any): Individual => {
          return {
            id: el.id ?? undefined,
            name: el.name ?? undefined,
            job: el.job ?? undefined,
          };
        }),
        preview: data.title.preview ?? undefined,
        keywords: data.title.keywords.map((el: any): string => {
          return el.name;
        }),
        loadedSeason: {
          id: data.loadedSeason.id,
          number: data.loadedSeason.number,
          title: data.loadedSeason.name ?? undefined,
          plot: data.loadedSeason.plot ?? undefined,
          releaseDate: parseDate(data.loadedSeason.release_date),
          episodesCount:
            data.title.seasons[data.loadedSeason.number - 1].episodes_count ??
            undefined,
          episodes: data.loadedSeason.episodes.map((el: any): Episode => {
            return {
              id: el.id,
              number: el.number,
              title: el.name ?? undefined,
              plot: el.plot ?? undefined,
              durationMinutes: el.duration ?? undefined,
              images: parseImages(this.imagesUrl, el.images),
            };
          }),
        },
      };

      return result;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  override fetchEpisodeSources = async (
    showId: string,
    episodeId: number
  ): Promise<Source> => {
    try {
      const res = await axios.get(
        `${this.baseUrl}/iframe/${showId}?episode_id=${episodeId}&next_episode=1`
      );
      const $ = load(res.data);
      const url = $("iframe").attr("src");

      const episodeSources: Source = {
        sources: [],
      };

      if (url) {
        console.log(url);
        const res = await axios.get(url);
        const $ = load(res.data);

        const domain = $('script:contains("window.video")')
          .text()
          ?.match(/url: '(.*)'/)![1];
        const token = $('script:contains("window.video")')
          .text()
          ?.match(/token': '(.*)'/)![1];
        const expires = $('script:contains("window.video")')
          .text()
          ?.match(/expires': '(.*)'/)![1];

        episodeSources.sources.push({
          url: `${domain}?token=${token}&referer=&expires=${expires}&h=1`,
          quality: `default`,
          isM3U8: true,
        });
      }

      return episodeSources;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
}

export default StreamingCommunity;
