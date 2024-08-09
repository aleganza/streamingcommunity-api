import Provider from "./provider";
import { Result, Search, ShowInfo, Source } from "./types";

abstract class Parser extends Provider {
  /**
   * Search for movies or tv series using the given query
   *
   * returns a promise resolving to a data object
   */
  abstract search(query: string, ...args: any): Promise<Search<Result>>;

  abstract fetchShowInfo(showId: string, ...args: any): Promise<ShowInfo>;

  abstract fetchEpisodeSources(
    showId: string,
    episodeId: number,
    ...args: any
  ): Promise<Source>;
}

export default Parser;
