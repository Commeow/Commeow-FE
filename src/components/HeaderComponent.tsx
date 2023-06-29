import Cookies from 'js-cookie';
import { atom } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalPortal from '../shared/ModalPortal';
import SnackBar from '../shared/SnackBar';
import LoginComponent from './LoginComponent';
import Payment from './Payment/Payment';
import SignUpComponent from './SignUpComponent';
import MyMenuModal from './MyMenuModal';

export const countAtom = atom<number>(0);

const HeaderComponent = () => {
  const [signupModal, setSignupModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [logoutSnack, setLogoutSnack] = useState(false);

  const [myMenuModal, setMyMenuModal] = useState(false);
  const navigate = useNavigate();

  const accessValid = Cookies.get('accesstoken');

  useEffect(() => {
    if (accessValid !== undefined) {
      setIsLogin(true);
    }
  }, []);

  const handleSignModal = (newValue: boolean) => {
    setSignupModal(newValue);
  };
  const handleLoginModal = (newValue: boolean) => {
    setLoginModal(newValue);
  };
  const handlePaymentModal = (newValue: boolean) => {
    setPaymentModal(newValue);
  };
  const handleMyMenuModal = () => {
    setMyMenuModal((prev) => !prev);
  };

  return (
    <div className="w-full h-14 flex justify-between items-center bg-white border-b-1 border-black ">
      <div
        className="bg-mainlogo bg-center bg-cover bg-no-repeat w-56 h-14 ml-5 cursor-pointer"
        onClick={() => navigate('/')}
      />
      <div className="mr-8">
        {isLogin && (
          <div className="flex">
            <div
              className="bg-chur bg-cover bg-center bg-no-repeat w-14 h-14 cursor-pointer"
              onClick={() => setPaymentModal(true)}
            />
            <div
              className="bg-userImg bg-cover bg-no-repeat bg-center w-14 h-14 cursor-pointer"
              onClick={handleMyMenuModal}
            />
          </div>
        )}
        {myMenuModal && (
          <ModalPortal>
            <MyMenuModal
              setIsLogin={setIsLogin}
              setMyMenuModal={setMyMenuModal}
              setLogoutSnack={setLogoutSnack}
            />
          </ModalPortal>
        )}

        {logoutSnack && (
          <ModalPortal>
            <SnackBar newValue="로그아웃 되었습니다" />
          </ModalPortal>
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
            className="bg-yellow-500 w-20 h-8 rounded font-medium"
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
            className="bg-yellow-500 w-20 h-8 ml-3 font-medium rounded"
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
      </div>
    </div>
  );
};

export default HeaderComponent;
