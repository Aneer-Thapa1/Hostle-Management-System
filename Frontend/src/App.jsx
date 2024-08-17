import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as ReactDOM from "react-dom";
import { RouterProvider } from "react-router-dom";

import Landing from "./pages/Landing";

import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
