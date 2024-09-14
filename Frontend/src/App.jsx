import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Landing from "./User/pages/Landing";
import Signup from "./User/pages/Signup";
import Login from "./User/pages/Login";

import "./App.css";

import AdminPage from "./Admin/AdminPage/AdminPage";
import HostSignup from "./Admin/AdminPage/HostSignup";
import UserSingleRoom from "./User/pages/UserSingleRoom";
import Home from "./User/pages/Home";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/hostSignup" element={<HostSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userSingleRoom" element={<UserSingleRoom />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
