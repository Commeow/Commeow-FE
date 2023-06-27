import { useAtom } from 'jotai';
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

  const getBroadDetail = async () => {
    const response = await api.get(`/broadcasts/${params.id}`);
    return response;
  };
  const { data } = useQuery('getBroadDetail', getBroadDetail, {
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex justify-center">
      <div className="flex ml-4 mr-4 mt-2 w-11/12 h-11/12 ">
        <div>
          <p className="text-yellow-500 text-2xl">{data?.data?.title}</p>
          <BroadDetailVideo streamer={data?.data?.streamer} />
          <div className="flex justify-between items-center py-2">
            <p className="text-yellow-500 ">현재 참여자: {viewerCount} 명</p>
          </div>
        </div>

        <ChatComponent roomId={params.id as string} />
      </div>
    </div>
  );
};

export default BroadDetail;
