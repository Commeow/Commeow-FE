import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_SERVER_URL;
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const accesstoken = Cookies.get('accesstoken');

    if (accesstoken) {
      config.headers.Access_Token = `Bearer ${accesstoken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      response: {
        data: { status },
      },
    } = error;

    if (status === 500) {
      toast.error('로그인 만료시간이 끝났습니다.');
      Cookies.remove('accesstoken');
      Cookies.remove('refreshtoken');
      Cookies.remove('streamkey');
      Cookies.remove('points');
      Cookies.remove('userId');
      setTimeout(() => {
        window.location.replace('/');
      }, 3000);
    }

    return Promise.reject(error);
  }
);
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const {
//       config,
//       response: {
//         data: { status, message },
//       },
//     } = error;
//     console.log('인터셉터 에러 콘솔::', error);

//     if (status === 500) {
//       const refresh = Cookies.get('refreshtoken');

//       const originReq = config;

//       await api
//         .get('/members/logout', {
//           headers: { Refresh_Token: `Bearer ${refresh}` },
//         })
//         .then((response) => {
//           const { access_token: newAccessToken } = response.headers;
//           Cookies.set('accesstoken', newAccessToken.split(' ')[1]);
//           console.log('로그아웃통신 res::', response);
//         });

//       console.log('여기까지 들어오나');

//       const newAccessToken = Cookies.get('accesstoken');
//       originReq.headers.Access_Token = `Bearer ${newAccessToken}`;

//       return api(originReq);
//     }

//     if (message === '유효한 토큰이 없습니다.') {
//       Cookies.remove('accesstoken');
//       Cookies.remove('refreshtoken');
//       Cookies.remove('streamkey');
//       Cookies.remove('points');
//       Cookies.remove('userId');
//       toast.error('로그인이 만료되었습니다. 재로그인 해주세요');
//       setTimeout(() => {
//         window.location.replace('/');
//       }, 3000);
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
