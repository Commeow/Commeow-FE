import { useQuery } from 'react-query';
import api from '../../shared/api';
import BroadCard from './BroadCard';

interface IThumb {
  fileName: string;
  fileImg: string;
}

export interface IList {
  channelId: number;
  streamer: string;
  title: string;
  thumbnailFiles: Array<IThumb>;
}
const BroadListComponent = () => {
  const getBroadList = async () => {
    const response = await api.get('/broadcasts');
    return response;
  };
  const { data } = useQuery('getBroadList', getBroadList);

  return (
    <div className="flex">
      <div className="bg-zinc-800 h-screen w-1/5 pt-8 pl-3">
        <p className="text-yellow-500 text-2xl ">구독 중인 채널</p>
        <div className="bg-yellow-500 w-[90%] h-2/5 rounded-md mt-4">
          <div className="bg-defaultList bg-center bg-cover bg-no-repeat w-16 h-16" />
        </div>
      </div>
      <div className="pt-5 pl-10 w-4/5">
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-2xl">생방송 채널</span>
          <div className="bg-live bg-center bg-cover bg-no-repeat w-20 h-14" />
        </div>
        <div className="flex flex-wrap">
          {data?.data.map((item: IList) => (
            <BroadCard
              key={item.channelId}
              channelId={item.channelId}
              streamer={item.streamer}
              title={item.title}
              thumbnailFiles={item.thumbnailFiles}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BroadListComponent;
