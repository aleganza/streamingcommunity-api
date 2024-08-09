// import and export EVERYTHING

import StreamingCommunity from "./providers/streamingcommunity";

const fetch = async () => {
  const api = new StreamingCommunity();
  // console.log(await api.search("breaking bad"));
  const info = await api.fetchShowInfo("32-the-walking-dead");
  if (info.loadedSeason?.episodes) {
    const src = await api.fetchEpisodeSources(
      info.id,
      info.loadedSeason.episodes[0].id
    );

    console.log(src)
  }
};

fetch();
