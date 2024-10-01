import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Landing from "./User/pages/Landing";
import Signup from "./User/pages/Signup";
import Login from "./User/pages/Login";

import "./App.css";

import AdminPage from "./Admin/AdminPage/AdminPage";
import HostSignup from "./Admin/AdminPage/HostSignup";
import Hostel from "./User/pages/Hostel";
import Home from "./User/pages/Home";
import Hostels from "./User/pages/Hostels";
import UserChatInterface from "./User/pages/UserChatInterface";

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
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/hostels" element={<Hostels />} />
          <Route path="/hostel/:id" element={<Hostel />} />
          <Route path="/messages" element={<UserChatInterface />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
