import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import api from '../shared/api';

const MyChannel = () => {
  const [defaultPage, setDefaultPage] = useState(true);
  const [intoInfo, setIntoInfo] = useState(false);
  const [intoManage, setIntoManage] = useState(false);
  const [titleChange, setTitleChange] = useState('');

  const titleOnchange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setTitleChange(e.currentTarget.value);
  };

  const submitTitleChange = async () => {
    try {
      const useId = Cookies.get('userId');
      await api.post(`/mypage/${useId}`, { title: titleChange });
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError?.response?.data === '존재하지 않는 사용자입니다.') {
        toast.error('방송을 먼저 생성해주세요');
      }
    }
  };

  const handleDefault = () => {
    setDefaultPage(true);
    setIntoManage(false);
    setIntoInfo(false);
  };
  const handleInfo = () => {
    setDefaultPage(false);
    setIntoManage(false);
    setIntoInfo(true);
  };
  const handleManage = () => {
    setDefaultPage(false);
    setIntoInfo(false);
    setIntoManage(true);
  };

  return (
    <div className="flex">
      <div className="bg-zinc-800 h-screen w-1/5 pt-8 pl-[20px] ">
        <div
          className="flex items-center gap-3 mb-[20px]"
          onClick={handleDefault}
        >
          <div className="bg-broadInfo bg-center bg-cover bg-no-repeat w-[25px] h-[25px]" />
          <p className="text-yellow-500 text-[20px]">방송 가이드</p>
        </div>
        <div className="flex items-center gap-3 mb-[20px]" onClick={handleInfo}>
          <div className="bg-broadInfo bg-center bg-cover bg-no-repeat w-[25px] h-[25px]" />
          <p className="text-yellow-500 text-[20px]">방송 정보</p>
        </div>
        <div className="flex items-center gap-3" onClick={handleManage}>
          <div className="bg-broadManage bg-center bg-cover bg-no-repeat w-[25px] h-[25px]" />
          <p className="text-yellow-500 text-[20px]">방송 관리</p>
        </div>
      </div>

      {defaultPage && (
        <div>
          <div className="p-[30px]">
            <p className="text-yellow-500 text-[25px] mb-[20px]">
              방송 시작 가이드
            </p>
            <p className="text-white mb-[10px]">
              OBS 프로그램에서 다음과 같이 설정해주세요.
            </p>
            <p className="text-white mb-[10px]">
              Step1. 좌측 상단 메뉴 [파일] &gt; [설정]; &gt; [방송]
            </p>
            <p className="text-white mb-[30px]">
              Step2. 다음과 같이 설정해주세요. 스트림 키는 방송 정보에서 확인
              할수 있습니다
            </p>
            <p className="text-white mb-[10px]">서비스 : 사용자 지정</p>
            <p className="text-white mb-[10px]">
              서버: rtmp://3.34.44.118::1935/닉네임
            </p>
            <p className="text-white">스트링 키 : 발급받은 스트림 키</p>
          </div>
        </div>
      )}

      {intoInfo && (
        <div className="pt-8 pl-[20px]">
          <p className="text-yellow-500 text-[25px] mb-[20px]">스트림 키</p>
          <p className="text-white">{Cookies.get('streamkey')}</p>
        </div>
      )}

      {intoManage && (
        <div className="pt-8 pl-[20px] relative">
          <p className="text-yellow-500 text-[25px] mb-[20px]">
            방송 정보 편집
          </p>
          <label htmlFor="broadTitle" className="text-white text-[20px] flex">
            제목
            <textarea
              id="broadTitle"
              rows={2}
              maxLength={30}
              style={{ resize: 'none', fontSize: '18px' }}
              placeholder="제목 입력 (최대 30글자)"
              className="ml-[20px] w-[350px] h-[50px] indent-2.5 text-yellow-500 focus:outline-yellow-500 focus:outline-ring-4"
              value={titleChange}
              onChange={titleOnchange}
            />
          </label>
          <button
            type="button"
            className="bg-yellow-500 rounded-md w-[70px] h-[30px] block absolute top-[180px] left-[380px]"
            onClick={submitTitleChange}
          >
            완료
          </button>
        </div>
      )}
    </div>
  );
};

export default MyChannel;
