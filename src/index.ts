// import and export EVERYTHING

import StreamingCommunity from "./providers/streamingcommunity";

const fetch = async () => {
  const api = new StreamingCommunity();
  // console.log(await api.search("breaking bad"));
  const info = await api.fetchShowInfo("32-the-walking-dead")
  console.log(info.loadedSeason?.episodes![4].images);
};

fetch();
