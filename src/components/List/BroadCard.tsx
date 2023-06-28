import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { IList } from './BroadListComponent';

const BroadCard = ({ channelId, streamer, title, thumbnailFiles }: IList) => {
  const navigate = useNavigate();
  const intoBroadDetail = () => {
    navigate(`/broadcasts/${channelId}`);
  };
  // const userId = Cookies.get('userId');

  return (
    <div onClick={intoBroadDetail} className="w-1/4">
      {thumbnailFiles[0]?.fileImg === undefined ? (
        <div className="bg-defaultList2 bg-center bg-cover bg-no-repeat w-64 h-52" />
      ) : (
        <img
          src={`data:image/jpeg;base64, ${thumbnailFiles[0]?.fileImg}`}
          alt="thumbnail"
          className="w-64 h-52"
        />
      )}

      <div>
        <p className="text-white mt-3 mb-1">{title}</p>
        <span className="text-yellow-500">{streamer}</span>
        {/* <span className="text-yellow-500 ml-4">({userId})</span> */}
      </div>
    </div>
  );
};

export default BroadCard;
