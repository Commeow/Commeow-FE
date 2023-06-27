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
    <div className="flex gap-8 p-8">
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
  );
};

export default BroadListComponent;
