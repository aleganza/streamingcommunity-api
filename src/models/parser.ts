import Provider from "./provider";

abstract class Parser extends Provider {
  /**
   * Search for movies or tv series using the given query
   *
   * returns a promise resolving to a data object
   */
  abstract search(query: string, ...args: any[]): Promise<unknown>;
}

export default Parser;
