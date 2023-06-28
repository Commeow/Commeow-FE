import { useAtom } from 'jotai';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import {
  handleDonationModalOpenAtom,
  viewerCountAtom,
} from '../components/Detail/AtomStore';
import BroadDetailVideo from '../components/Detail/BroadDetailVideo';
import ChatComponent from '../components/Detail/ChatComponent';

import api from '../shared/api';

export interface IBroadDetail {
  // channelId: number;
  // chattingAddress: string;
  streamer: string;
}

const BroadDetail = () => {
  const [viewerCount] = useAtom(viewerCountAtom);
  const params = useParams();
  const userId = Cookies.get('userId');

  const getBroadDetail = async () => {
    const response = await api.get(`/broadcasts/${params.id}`);
    return response;
  };
  const { data } = useQuery('getBroadDetail', getBroadDetail, {
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex justify-center">
      <div className="flex ml-4 mr-4 mt-4  gap-3 justify-center">
        <div>
          <div className="flex gap-3 mb-4">
            <div className="bg-live bg-center bg-cover bg-no-repeat w-20 h-8" />
            <p className="text-yellow-500 text-2xl">{data?.data?.title}</p>
          </div>

          <BroadDetailVideo streamer={data?.data?.streamer} />

          <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <div className="bg-defaultList bg-center bg-cover bg-no-repeat w-20 h-20" />
              <p className="text-yellow-500 text-[20px]">{userId}</p>
            </div>
            <div>
              <button
                type="button"
                className="bg-yellow-500 w-16 h-7 rounded-md text-lg ml-11 mb-2"
              >
                구독
              </button>
              <p className="text-yellow-500 ml-7">참여자: {viewerCount} 명</p>
            </div>
          </div>
        </div>

        <ChatComponent roomId={params.id as string} />
      </div>
    </div>
  );
};

export default BroadDetail;
