import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./User/pages/Landing";
import Signup from "./User/pages/Signup";
import Login from "./User/pages/Login";

import "./App.css";

import AdminPage from "./Admin/AdminPage/AdminPage";
import HostSignup from "./Admin/AdminPage/HostSignup";
import UserSingleRoom from "./User/pages/UserSingleRoom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/hostSignup" element={<HostSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userSingleRoom" element={<UserSingleRoom />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
