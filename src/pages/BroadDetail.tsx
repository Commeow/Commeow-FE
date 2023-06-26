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
import Donation from '../components/Detail/Donation';
import ModalPortal from '../shared/ModalPortal';
import api from '../shared/api';

export interface IBroadDetail {
  // channelId: number;
  // chattingAddress: string;
  streamer: string;

  // title: string;
}

const BroadDetail = () => {
  const [donation, setDonation] = useState(false);
  const [viewerCount] = useAtom(viewerCountAtom);
  const [, setDonationModalIsOpen] = useAtom(handleDonationModalOpenAtom);
  const params = useParams();

  const getBroadDetail = async () => {
    const response = await api.get(`/broadcasts/${params.id}`);
    return response;
  };
  const { data } = useQuery('getBroadDetail', getBroadDetail, {
    refetchOnWindowFocus: false,
  });
  console.log('detailData::::', data);

  const handleModal = (newValue: boolean) => {
    setDonation(newValue);
  };

  return (
    <div>
      <div className="flex">
        <div className="w-full">
          <BroadDetailVideo streamer={data?.data?.streamer} />
          <div className="flex justify-between items-center py-2">
            <p className="text-yellow-500">현재 참여자: {viewerCount} 명</p>
            {/* <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => setDonationModalIsOpen(true)}
            >
              충전하기
            </button> */}
          </div>
        </div>
        <div className="bg-white">
          <ChatComponent roomId={params.id as string} />
        </div>
      </div>
    </div>
  );
};

export default BroadDetail;
