abstract class Provider {
  /**
   * Provider name
   */
  abstract readonly name: string;

  /**
   * Provider main url
   */
  abstract readonly baseUrl: string;

  /**
   * Provider images url
   */
  abstract readonly imagesUrl: string;

  /**
   * Provider logo
   */
  readonly logo: string =
    "https://png.pngtree.com/png-vector/20210221/ourmid/pngtree-error-404-not-found-neon-effect-png-image_2928214.jpg";

  /**
   * Whether the provider currently works or not
   */
  readonly isWorking: boolean = true;
}

export default Provider;
