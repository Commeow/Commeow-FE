import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../shared/api';

const LoginComponent = () => {
  const [inputValue, setInputValue] = useState({
    userId: '',
    password: '',
  });
  const { userId, password } = inputValue;
  const navigate = useNavigate();

  const onChangeHandle = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const loginHandle = async () => {
    try {
      const response = await api.post('/members/login', inputValue);
      // console.log('loginRes:::', response);

      const accessHeader = response?.headers?.access_token;
      const refreshHeader = response?.headers?.refresh_token;

      const accessToken = accessHeader?.split(' ')[1];
      const refreshToken = refreshHeader?.split(' ')[1];

      Cookies.set('accesstoken', accessToken);
      Cookies.set('refreshtoken', refreshToken);

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };
  // bg-mainBlack

  return (
    <div className="w-full h-screen flex justify-center items-center bg-modalOuter">
      <div className="bg-mainBlack w-2/5 rounded-lg relative">
        <div className="flex flex-row items-center justify-center gap-5">
          <div className="bg-mainlogo bg-cover bg-center bg-no-repeat w-28 h-28" />
          <span className="text-white text-2xl font-bold">
            Commeow에 로그인
          </span>
        </div>
        <button
          type="button"
          className="text-white absolute top-4 right-4 font-bold"
        >
          닫기
        </button>
        <div className="flex flex-col  gap-6">
          <label
            htmlFor="signupId"
            className="text-white font-semibold flex flex-col ml-10"
          >
            아이디
            <input
              id="signupId"
              name="userId"
              value={userId}
              onChange={onChangeHandle}
              className="border border-black border-solid ml-7 w-4/5 text-yellow-500 h-7 indent-2.5"
            />
          </label>

          <label
            htmlFor="signupPwd"
            className="text-white font-semibold flex flex-col ml-10"
          >
            패스워드
            <input
              id="signupPwd"
              name="password"
              value={password}
              onChange={onChangeHandle}
              type="password"
              className="border border-black border-solid ml-7 text-yellow-500 w-4/5 h-7 indent-2.5"
            />
          </label>
        </div>
        <div className="flex justify-center gap-16 mt-12 mb-4">
          <button type="button" className="text-yellow-500">
            아직 Commeow 유저가 아닌가요? 회원가입
          </button>
          <button
            type="button"
            onClick={loginHandle}
            className="bg-yellow-500 w-16 h-7"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
