import Cookies from 'js-cookie';
import { atom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../shared/api';
import ModalPortal from '../shared/ModalPortal';
import SnackBar from '../shared/SnackBar';
import LoginComponent from './LoginComponent';
import Payment from './Payment/Payment';
import SignUpComponent from './SignUpComponent';

export const countAtom = atom<number>(0);

const HeaderComponent = () => {
  const [signupModal, setSignupModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [logoutSnack, setLogoutSnack] = useState(false);
  const navigate = useNavigate();

  const accessValid = Cookies.get('accesstoken');

  useEffect(() => {
    if (accessValid !== undefined) {
      setIsLogin(true);
    }
  }, []);

  const logoutHandle = async () => {
    try {
      await api.get('/members/logout');
      Cookies.remove('accesstoken');
      Cookies.remove('refreshtoken');
      Cookies.remove('streamkey');
      localStorage.removeItem('point');

      setIsLogin(false);
      setLogoutSnack(true);
    } catch (error) {
      Cookies.remove('accesstoken');
      Cookies.remove('refreshtoken');
      Cookies.remove('streamkey');
      localStorage.removeItem('point');
    }
  };
  const handleSignModal = (newValue: boolean) => {
    setSignupModal(newValue);
  };
  const handleLoginModal = (newValue: boolean) => {
    setLoginModal(newValue);
  };
  const handlePaymentModal = (newValue: boolean) => {
    setPaymentModal(newValue);
  };

  return (
    <div className="w-full h-14 flex justify-between items-center bg-headerBlack border-b-1 border-black">
      {logoutSnack && (
        <ModalPortal>
          <SnackBar newValue="로그아웃 되었습니다" />
        </ModalPortal>
      )}
      <div
        className="bg-mainlogo bg-center bg-cover bg-no-repeat w-32 h-14 ml-5 cursor-pointer"
        onClick={() => navigate('/')}
      />
      <div className="mr-8">
        {isLogin && (
          <button
            type="button"
            onClick={() => setPaymentModal(true)}
            className="bg-yellow-500 w-20 h-8 font-semibold rounded"
          >
            츄르구매
          </button>
        )}
        {paymentModal && (
          <ModalPortal>
            <Payment onAccess={handlePaymentModal} />
          </ModalPortal>
        )}
        {!isLogin && (
          <button
            type="button"
            onClick={() => setLoginModal(true)}
            className="bg-yellow-500 w-20 h-8 font-semibold rounded"
          >
            로그인
          </button>
        )}
        {loginModal && (
          <ModalPortal>
            <LoginComponent
              onAccess={handleLoginModal}
              setIsLogin={setIsLogin}
              setSignupModal={setSignupModal}
              setLoginModal={setLoginModal}
            />
          </ModalPortal>
        )}

        {!isLogin && (
          <button
            type="button"
            onClick={() => setSignupModal(true)}
            className="bg-yellow-500 w-20 h-8 ml-3 font-semibold rounded"
          >
            회원가입
          </button>
        )}
        {signupModal && (
          <ModalPortal>
            <SignUpComponent
              onAccess={handleSignModal}
              setSignupModal={setSignupModal}
              setLoginModal={setLoginModal}
            />
          </ModalPortal>
        )}
        {isLogin && (
          <button
            type="button"
            onClick={logoutHandle}
            className="bg-yellow-500 w-20 h-8 ml-3 font-semibold rounded"
          >
            로그아웃
          </button>
        )}
      </div>
    </div>
  );
};

export default HeaderComponent;
