import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";

const Landing = () => {
  return (
    <div className="w-screen bg-background ">
      <Navbar />
      <Hero />
      <About />
    </div>
  );
};

export default Landing;
