import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as ReactDOM from "react-dom";
import { RouterProvider } from "react-router-dom";

import Landing from "./pages/Landing";
import UserSingleRoom from "./pages/UserSingleRoom";

import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import HostSignup from "./pages/HostSignup";
import AdminPage from "./pages/ADMIN/AdminPage";

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
