import axios from 'axios';
import { useAtom } from 'jotai';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  IdentitySerializer,
  JsonSerializer,
  RSocketClient,
} from 'rsocket-core';
import { Encodable, ReactiveSocket } from 'rsocket-types';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { FaPaw } from 'react-icons/fa';
import { donationModalOpenAtom, handleViewerCountAtom } from './AtomStore';
import { EchoResponder } from './responder';
import { Modal } from '../../shared/Modal';

interface Message {
  type: string;
  nickname: string;
  message: string;
  chattingAddress: string;
  points?: number;
}

interface DonationData {
  type: string;
  streamer: string;
  nickname: string;
  points: string;
  message: string;
  chattingAddress: string;
}

const ChatComponent = ({ roomId }: { roomId: string }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [socket, setSocket] = useState<ReactiveSocket<any, Encodable> | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [nickname, setNickname] = useState('');
  const [chattingAddress, setChattingAddress] = useState('');
  const [, setParticipantsCount] = useAtom(handleViewerCountAtom);
  const [streamer, setStreamer] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [client, setClient] = useState<RSocketClient<any, any> | null>(null);
  const [isKeyDown, setIsKeyDown] = useState(false);
  const [isOpen, setIsOpen] = useAtom(donationModalOpenAtom);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const points = Cookies.get('points');
  const accessToken = Cookies.get('accesstoken');
  const [pointChange, setPointChange] = useState(false);
  const headers = {
    Access_Token: `Bearer ${accessToken}`,
  };
  const handleDropdownToggle = () => {
    setDropdownIsOpen(!dropdownIsOpen);
  };
  const usedIds = new Set();
  const generateUniqueId = () => {
    let uniqueId = Math.floor(Math.random() * 1000);
    while (usedIds.has(uniqueId)) {
      uniqueId = Math.floor(Math.random() * 1000);
    }
    usedIds.add(uniqueId);
    return uniqueId;
  };

  const getChattingAddress = async () => {
    try {
      const response = await axios.get(
        `http://3.34.163.123:8080/broadcasts/${roomId}`,
        { headers } // 체크
      );

      setStreamer(response.data.streamer);
      setChattingAddress(response.data.chattingAddress);
    } catch (error) {
      console.error(error);
    }
  };

  const closeSocket = () => {
    if (socket) {
      socket.close();
    }
  };

  const send = () => {
    if (!accessToken) {
      toast.error('로그인이 필요한 서비스입니다.');
      return;
    }
    if (!message.trim()) return;
    const sendData: Message = {
      type: 'MESSAGE',
      nickname,
      message,
      chattingAddress,
    };
    socket
      ?.requestResponse({
        data: sendData,
        metadata: `${String.fromCharCode('message'.length)}message`,
      })
      .subscribe({
        onComplete: (com: any) => {
          console.log('com : ', com);
          setMessage('');
        },
        onError: (error: any) => {
          toast.error(error.source.message);
        },
        onSubscribe: (cancel: any) => {
          console.log('cancel', cancel);
        },
      });
  };

  const subscribeToParticipantCount = () => {
    if (socket)
      socket
        .requestStream({
          data: chattingAddress,
          metadata: `${String.fromCharCode('counting'.length)}counting`,
        })
        .subscribe({
          onComplete: () => {
            console.log('participantCount stream completed');
          },
          onError: (error: any) => {
            toast.error(error.source.message);
          },
          onNext: (payload: any) => {
            console.log(payload);
            const count = payload.data;
            console.log('participantCount:', count);
            setParticipantsCount(count);
          },
          onSubscribe: (subscription: any) => {
            subscription.request(2147483647);
          },
        });
  };

  const socketConnect = () => {
    if (client && !socket) {
      client.connect().subscribe({
        onComplete: (reactiveSocket) => {
          setSocket(reactiveSocket);
          subscribeToParticipantCount();
        },
        onError: (error) => {
          toast.error(error.message);
        },
        onSubscribe: (cancel) => {},
      });
    }
  };
  console.log('cookie:::::::::', Cookies.get('accesstoken'));

  const handleDonationAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDonationAmount(event.target.value);
  };

  const donation = async () => {
    if (!accessToken) {
      toast.error('로그인이 필요한 서비스입니다.');
      return;
    }
    if (!donationAmount) return;
    if (Number(donationAmount) <= 0) {
      toast.error('1 츄르부터 후원할 수 있습니다.');
      setDonationAmount('');
      return;
    }
    const donationData: DonationData = {
      type: 'DONATION',
      streamer,
      nickname,
      points: donationAmount,
      message: donationMessage,
      chattingAddress,
    };
    socket
      ?.requestResponse({
        data: donationData,
        metadata: `${String.fromCharCode('donation'.length)}donation`,
      })
      .subscribe({
        onComplete: (com: any) => {
          console.log('donationcom : ', com);
          Cookies.set('points', com.data.remainPoints);
          setPointChange(true);
          setDropdownIsOpen(false);
          setDonationAmount('');
          setDonationMessage('');
        },
        onError: (error: any) => {
          toast.error(error.source.message);
        },
        onSubscribe: (cancel: any) => {},
      });
  };

  const messageReceiver = (payload: any) => {
    setMessages((prevMessages) => [...prevMessages, payload.data]);
  };
  const responder = new EchoResponder(messageReceiver);
  const startSocket = async () => {
    setClient(
      new RSocketClient({
        serializers: {
          data: JsonSerializer,
          metadata: IdentitySerializer,
        },
        setup: {
          payload: {
            data: chattingAddress,
          },
          keepAlive: 60000,
          lifetime: 180000,
          dataMimeType: 'application/json',
          metadataMimeType: 'message/x.rsocket.routing.v0',
        },
        responder,
        transport: new RSocketWebSocketClient({
          url: 'ws://3.34.163.123:6565/rs',
        }),
      })
    );
  };
  window.onpopstate = closeSocket;
  useEffect(() => {
    if (accessToken) {
      const decodedToken: any = jwtDecode(accessToken);
      setNickname(decodedToken.nickname);
    }
    getChattingAddress();
    const jquery = document.createElement('script');
    jquery.src = 'http://code.jquery.com/jquery-1.12.4.min.js';
    const iamport = document.createElement('script');
    iamport.src = 'http://cdn.iamport.kr/js/iamport.payment-1.1.7.js';
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);

    return () => {
      if (socket) socket.close();
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
      window.removeEventListener('popstate', closeSocket);
    };
  }, []);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  useEffect(() => {
    if (chattingAddress && !socket) startSocket();
  }, [chattingAddress]);
  useEffect(() => {
    if (client) socketConnect();
  }, [client]);
  useEffect(() => {
    if (socket) subscribeToParticipantCount();
  }, [socket]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  });
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isKeyDown) {
      setIsKeyDown(true);
      send();
    }
  };

  const handleKeyUp = () => {
    setIsKeyDown(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div
        className="p-2 relative border border-gray-300 rounded-lg  bg-white h-[80%]"
        ref={dropdownRef}
      >
        {/* <h1 className="text-2xl font-bold mb-4">채팅</h1> */}
        {/* <p className="mb-4">현재 참여자: {participantCount} 명</p> */}
        <div className="h-[100vh]">
          <div className="h-[73%]" style={{ overflow: 'overlay' }}>
            <div
              className="h-full w-[320px] overflow-auto"
              ref={chatContainerRef}
            >
              {messages.map((msg) =>
                msg.type === 'DONATION' ? (
                  <div
                    key={generateUniqueId()}
                    className=" bg-yellow-500 rounded p-2 mb-2 px-4"
                  >
                    <p className="font-bold mb-1 flex items-center">
                      <FaPaw className="mr-2" />
                      {msg.nickname} 님이 {msg.points}츄르 후원!
                    </p>
                    <p className="flex-wrap">{msg.message}</p>
                  </div>
                ) : (
                  <div key={generateUniqueId()} className="p-1 ">
                    <p className="font-bold mb-1 mr-2">{msg.nickname} 님 : </p>
                    <p className="flex-wrap">{msg.message}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="flex w-11/12 mt-2 absolute bottom-3">
          <div className="relative flex justify-center items-center w-full">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지 입력"
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              className="border border-gray-400 bg-gray-200 rounded-lg p-2 w-full focus:outline-yellow-500 pr-8"
            />

            <div
              className="bg-chur bg-center bg-cover bg-no-repeat w-8 h-8 ml-4 cursor-pointer absolute right-1"
              onClick={handleDropdownToggle}
            />
          </div>
          <button
            type="button"
            onClick={send}
            className="bg-yellow-500 py-2 px-4 rounded-lg ml-2 min-w-[64px]"
          >
            전송
          </button>
        </div>
        {/* {donationMessage && (
          <div className="bg-green-200 text-green-800 p-2 mt-2">
            {donationMessage}
          </div>
        )} */}
        {dropdownIsOpen && (
          <div className="mt-4 absolute bottom-20 bg-white rounded-lg border border-gray-300 shadow-md p-4 w-[300px]">
            <div className="flex items-center mb-2">
              <h2 className="text-lg font-bold ">후원하기</h2>
              <span className="text-sm ml-24">보유</span>
              <div className="bg-chur bg-center bg-cover bg-no-repeat w-8 h-8" />
              <span className="text-sm">{points}개</span>
            </div>

            <input
              type="text"
              value={donationAmount}
              onChange={handleDonationAmountChange}
              placeholder="포인트"
              className="border border-gray-300 rounded p-2 mb-2 w-full"
            />

            <input
              type="text"
              value={donationMessage}
              onChange={(e) => setDonationMessage(e.target.value)}
              placeholder="기부 메시지"
              className="border border-gray-300 rounded mb-2 p-2 w-full"
            />
            <button
              type="button"
              onClick={donation}
              className="bg-yellow-500 text-white py-2 px-4 rounded w-full"
            >
              후원하기
            </button>
          </div>
        )}
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} hasOverlay>
        <div className="rounded bg-white p-4">{/* <Payment /> */}</div>
      </Modal>
    </>
  );
};

export default ChatComponent;
