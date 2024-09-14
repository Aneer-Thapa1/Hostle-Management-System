import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Footer from "../components/Footer";
import Contact from "../components/Contact";

const Landing = () => {
  return (
    <div className="w-screen bg-background flex flex-col gap-11">
      <div>
        <Hero />
      </div>
      <div>
        <About />
      </div>
      <div>
        <Contact />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
