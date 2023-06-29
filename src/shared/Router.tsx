import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BroadDetail from '../pages/BroadDetail';
import BroadList from '../pages/BroadList';
import MyChannel from '../pages/MyChannel';
import Layout from './Layout';

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<BroadList />} />
          <Route path="/broadcasts/:id" element={<BroadDetail />} />
          <Route path="/mychannel" element={<MyChannel />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
