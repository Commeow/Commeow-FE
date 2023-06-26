import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IList } from './BroadListComponent';

const BroadCard = ({ channelId, streamer, title, thumbnailFiles }: IList) => {
  const navigate = useNavigate();
  const intoBroadDetail = () => {
    navigate(`/broadcasts/${channelId}`);
  };

  return (
    <div onClick={intoBroadDetail}>
      <img
        src={`data:image/jpeg;base64, ${thumbnailFiles[0]?.fileImg}`}
        alt="thumbnail"
      />

      <div>
        <p className="text-white">{title}</p>
        <p className="text-yellow-500">{streamer}</p>
      </div>
    </div>
  );
};

export default BroadCard;
