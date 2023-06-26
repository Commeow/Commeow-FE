import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import api from '../../shared/api';

interface IPayment {
  onAccess: (newValue: boolean) => void;
}

const Payment = ({ onAccess }: IPayment) => {
  const [churOption, setChurOption] = useState('100츄르');
  const [churAmount, setChurAmount] = useState(1200);
  // const accessToken = Cookies.get('accesstoken');
  // const headers = {
  //   Access_Token: `Bearer ${accessToken}`,
  // };
  useEffect(() => {
    const jquery = document.createElement('script');
    jquery.src = 'http://code.jquery.com/jquery-1.12.4.min.js';
    const iamport = document.createElement('script');
    iamport.src = 'http://cdn.iamport.kr/js/iamport.payment-1.1.7.js';
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);
  const handleSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    setChurOption(
      event.currentTarget.options[event.currentTarget.selectedIndex].text
    );
    setChurAmount(Number(event.currentTarget?.value));
  };
  const requestPay = () => {
    // if (!accessToken) {
    //   alert('로그인이 필요한 서비스입니다.');
    //   return;
    // }
    const { IMP } = window;
    IMP?.init('imp24850211');
    IMP?.request_pay(
      {
        pg: 'kakaopay.TC0ONETIME',
        pay_method: 'card',
        merchant_uid: new Date().getTime().toString(),
        name: `커뮤! ${churOption}`,
        amount: churAmount,
        buyer_tel: '000-0000-0000',
      },
      async (rsp) => {
        try {
          // const { data } = await api.post(
          //   'http://localhost:8080/verifyIamport/' + rsp.imp_uid,
          //   null,
          //   { headers }
          // );
          const { data: verifyData } = await api.post(
            `/verifyIamport/${rsp.imp_uid}`,
            null
            // { headers }
          );
          if (rsp.paid_amount === verifyData.response.amount) {
            alert('결제가 완료되었습니다.');
            const requestBody = {
              points: parseInt(
                churOption.substring(0, churOption.length - 2),
                10
              ),
            };
            try {
              console.log(
                '충천 포인트: ',
                churOption.substring(0, churOption.length - 2)
              );
              // const { data } = await axios.post(
              //   'http://localhost:8080/points/charge',
              //   requestBody
              //   // { headers }
              // );
              const { data } = await api.post(
                '/points/charge',
                requestBody
                // { headers }
              );
              localStorage.setItem('point', data);
              onAccess(false);
            } catch (error) {
              console.error('Error while points request:', error);
            }
          } else {
            alert('결제가 실패했습니다.');
          }
        } catch (error) {
          console.error('Error while verifying payment:', error);
          alert('결제가 실패했습니다.');
        }
      }
    );
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-modalOuter">
      <div className="bg-mainBlack w-2/5 h-1/5 rounded-lg relative flex flex-col items-center justify-center gap-5">
        <h3 className="text-yellow-500 text-2xl font-bold ">
          츄르 상점 o(〃＾▽＾〃)o
        </h3>
        <h6 className="text-white text-sm font-bold">
          !!테스트 결제로 실제 요금이 발생하지 않습니다.
        </h6>
        <div>
          <label htmlFor="churOption" className="text-white">
            메뉴판:
            <select
              id="churOption"
              name="churOption"
              onChange={handleSelectChange}
              className="text-black"
            >
              <option value="1200">100츄르</option>
              <option value="3500">300츄르</option>
              <option value="5900">500츄르</option>
              <option value="11900">1000츄르</option>
              <option value="17900">1500츄르</option>
              <option value="23500">2000츄르</option>
            </select>
          </label>
          <button
            type="button"
            onClick={requestPay}
            className="bg-yellow-500 w-16 h-7 ml-5"
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};
export default Payment;
