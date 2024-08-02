// import and export EVERYTHING

import StreamingCommunity from "./providers/streamingcommunity";

const fetch = async () => {
  const api = new StreamingCommunity();
  console.log(await api.search("breaking bad"));
};

fetch();
