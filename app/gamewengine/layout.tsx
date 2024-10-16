// app/gamewengine/layout.tsx
import React from 'react';
import './../globals.css'; // Optional: import global styles
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GameEngineLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      
      <main>{children}</main>
      <footer>
        <p>&copy; 2024 MyChess</p>
      </footer>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default GameEngineLayout;
