// import and export EVERYTHING

import StreamingCommunity from "./providers/streamingcommunity";

const fetch = async () => {
  const api = new StreamingCommunity();
  // console.log(await api.search("breaking bad"));
  console.log(await api.fetchShowInfo("3-breaking-bad-reazioni-collaterali"));
};

fetch();
