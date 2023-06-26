import React from 'react';
import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from './shared/Router';
// import HeaderComponent from './components/HeaderComponent';

const queryClient = new QueryClient();
const toastConfig = {
  position: 'top-center',
};
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position={toastConfig.position as ToastPosition}
        autoClose={1000}
      />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
