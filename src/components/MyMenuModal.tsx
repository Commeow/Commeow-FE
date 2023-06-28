import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../shared/api';
import ModalPortal from '../shared/ModalPortal';
import ModalSecondPortal from '../shared/ModalSecondPortal';
import SnackBar from '../shared/SnackBar';

interface IMyMenu {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setMyMenuModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLogoutSnack: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyMenuModal = ({
  setIsLogin,
  setMyMenuModal,
  setLogoutSnack,
}: IMyMenu) => {
  const navigate = useNavigate();

  const logoutHandle = async () => {
    try {
      await api.get('/members/logout');
      Cookies.remove('accesstoken');
      Cookies.remove('refreshtoken');
      Cookies.remove('streamkey');
      Cookies.remove('points');

      setIsLogin(false);
      setLogoutSnack(true);
      setMyMenuModal(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log('로그아웃 에러::', axiosError?.response?.status);

      if (axiosError?.response?.status === 401) {
        Cookies.remove('accesstoken');
        Cookies.remove('refreshtoken');
        Cookies.remove('streamkey');
        Cookies.remove('points');

        setIsLogin(false);
        setLogoutSnack(true);
        setMyMenuModal(false);
      }
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setMyMenuModal(false);
    }
  };
  const handleMyChannel = () => {
    setMyMenuModal(false);
    navigate('/mychannel');
  };

  return (
    <div onClick={handleOutsideClick} className="w-screen h-screen relative">
      <div className="bg-white w-[120px] h-[70px] flex flex-col p-2 justify-center border-2 border-yellow-500 gap-1 absolute top-[55px] right-[10px]">
        <button type="button" onClick={handleMyChannel}>
          마이 채널
        </button>
        <div className="border-b-2 border-yellow-500" />
        <button type="button" onClick={logoutHandle}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyMenuModal;
