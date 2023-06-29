import ReactPlayer, { ReactPlayerProps } from 'react-player';
import Hls from 'hls.js';
import { IBroadDetail } from '../../pages/BroadDetail';

const BroadDetailVideo = ({ streamer }: IBroadDetail) => {
  const edcodedString = encodeURIComponent(streamer);

  const hlsUrl = `http://3.34.163.123:8080/streams/${edcodedString}/master.m3u8`;

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
