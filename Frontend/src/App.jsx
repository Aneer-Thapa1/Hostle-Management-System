import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as ReactDOM from "react-dom";
import { RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import Students from "./pages/Students";
import Staffs from "./pages/Staffs";
import Rooms from "./pages/Rooms";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/students" element={<Students />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
