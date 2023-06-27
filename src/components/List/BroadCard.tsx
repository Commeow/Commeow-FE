import { useNavigate } from 'react-router-dom';
import { IList } from './BroadListComponent';

const BroadCard = ({ channelId, streamer, title, thumbnailFiles }: IList) => {
  const navigate = useNavigate();
  const intoBroadDetail = () => {
    navigate(`/broadcasts/${channelId}`);
  };

  return (
    <div onClick={intoBroadDetail}>
      {thumbnailFiles[0]?.fileImg === undefined ? (
        <div className="bg-defaultList  bg-center bg-contain bg-no-repeat w-72 h-48" />
      ) : (
        <img
          src={`data:image/jpeg;base64, ${thumbnailFiles[0]?.fileImg}`}
          alt="thumbnail"
          className="w-72 h-48"
        />
      )}

      <div>
        <p className="text-white">{title}</p>
        <p className="text-yellow-500">{streamer}</p>
      </div>
    </div>
  );
};

export default BroadCard;
