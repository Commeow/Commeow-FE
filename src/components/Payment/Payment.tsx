import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import api from '../../shared/api';
import ModalSecondPortal from '../../shared/ModalSecondPortal';
import SnackBar from '../../shared/SnackBar';

interface IPayment {
  onAccess: (newValue: boolean) => void;
}

const Payment = ({ onAccess }: IPayment) => {
  const [churOption, setChurOption] = useState('100츄르');
  const [churAmount, setChurAmount] = useState(1200);
  const [payFailModal, setPayFailModal] = useState(false);
  const [paySucModal, setPaySucModal] = useState(false);

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
          const { data: verifyData } = await api.post(
            `/verifyIamport/${rsp.imp_uid}`,
            null
          );
          if (rsp.paid_amount === verifyData.response.amount) {
            setPaySucModal(true);
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

              const { data } = await api.post('/points/charge', requestBody);
              // localStorage.setItem('point', data);
              Cookies.set('points', data);
              setTimeout(() => {
                onAccess(false);
              }, 1500);
            } catch (error) {
              console.error('Error while points request:', error);
            }
          } else {
            setPayFailModal(true);
          }
        } catch (error) {
          console.error('Error while verifying payment:', error);
          setPayFailModal(true);
        }
      }
    );
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-modalOuter">
      {payFailModal && (
        <ModalSecondPortal>
          <SnackBar newValue="결제가 취소되었습니다" />
        </ModalSecondPortal>
      )}
      {paySucModal && (
        <ModalSecondPortal>
          <SnackBar newValue="결제가 완료되었습니다" />
        </ModalSecondPortal>
      )}

      <div className="bg-mainBlack w-2/5 h-1/5 rounded-lg relative flex flex-col items-center justify-center gap-5">
        <h3 className="text-yellow-500 text-2xl font-bold ">
          츄르 상점 o(〃＾▽＾〃)o
        </h3>
        <button
          type="button"
          className="text-white absolute top-3 right-3"
          onClick={() => onAccess(false)}
        >
          닫기
        </button>
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
