import React from 'react';
import ReactPlayer from 'react-player';

import { IBroadDetail } from '../../pages/BroadDetail';

const BroadDetailVideo = ({ streamer }: IBroadDetail) => {
  const hlsUrl = `http://3.34.163.123:8080/streams/${streamer}/master.m3u8`;
  // const hlsUrl =
  //   'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';

  return (
    <div>
      <ReactPlayer
        url={hlsUrl}
        controls
        playing
        muted
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default BroadDetailVideo;
