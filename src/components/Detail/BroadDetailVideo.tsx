import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import Hls from 'hls.js';

import { IBroadDetail } from '../../pages/BroadDetail';
import api from '../../shared/api';

const BroadDetailVideo = ({ streamer }: IBroadDetail) => {
  const edcodedString = encodeURIComponent(streamer);

  // const hlsUrl = `http://3.34.163.123:8080/streams/${streamer}/master.m3u8`;
  // const hlsUrl = `http://3.34.163.123:8080/streams/${edcodedString}/master.m3u8`;
  // // const hlsUrl =
  //   'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';

  const hlsUrl =
    'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';

  const handlePlayerReady = (player: ReactPlayerProps) => {
    if (player?.getInternalPlayer) {
      const hls = player.getInternalPlayer()?.hls;

      if (hls) {
        hls.config = {
          ...hls.config,
          hlsOptions: {
            hlsTime: 1,
          },
        };
      }
    }
  };

  return (
    <div className="h-[70%]">
      <ReactPlayer
        url={hlsUrl}
        controls
        muted
        playing
        width="100%"
        height="100%"
        onReady={handlePlayerReady}
        config={{
          file: {
            hlsOptions: {
              liveSyncDurationCount: 1,
              liveMaxLatencyDurationCount: 3,
              liveDurationInfinity: true,
            },
          },
        }}
        hls={Hls}
      />
    </div>
  );
};

export default BroadDetailVideo;
