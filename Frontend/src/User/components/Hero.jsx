import React, { useState } from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import searchIcon from "../../assets/searchIcon.svg";
import Navbar from "../components/Navbar";

const Hero = () => {
  const [text] = useTypewriter({
    words: ["FINDING", "MANAGING", "BOOKING"],
    loop: true,
    typeSpeed: 150,
    deleteSpeed: 150,
    delaySpeed: 1000,
  });

  return (
    <div className="bg-hero-bg flex w-screen h-screen bg-no-repeat bg-center bg-cover  flex-col">
      <div className="abslute top-0 left-0 z-20">
        <Navbar />
      </div>
      <div className="bg-black bg-opacity-50 w-screen h-screen absolute"></div>

      <div className="flex flex-col h-[65%] w-screen justify-end items-center z-20 gap-1">
        <h1 className="text-white text-7xl font-bold tracking-widest">
          HOSTEL
        </h1>
        <h1 className="text-primaryColor text-8xl font-bold tracking-widest">
          {text}
          <Cursor />
        </h1>
      </div>
      <div className="flex z-20 w-screen justify-center gap-7 flex-col items-center h-[40%]">
        <div className="flex gap-6 items-center w-[35%]  ">
          <h2 className="text-4xl text-white font-semibold ">FIND</h2>
          <div className="flex gap-6 relative">
            <p className="text-white before:block before:absolute before:w-14 before:h-0.5 before:bottom-0  before:bg-white ">
              Boys Hostel
            </p>
            <p className="text-white">Girls Hostel</p>
          </div>
        </div>
        <div className="w-[40%] bg-white flex h-fit rounded-[80px] py-4 relative  justify-between items-center overflow-hidden">
          <div className="flex [45%] flex-col ">
            <p className="w- font-semibold pl-6">Location</p>
            <input
              className=" h-full outline-none rounded-3xl px-6 py-2"
              placeholder="Which city do you prefer? "
              type="text"
            />
          </div>
          <div className="flex [45%] flex-col ">
            <p className="w- font-semibold pl-6">Check in </p>
            <input
              className=" h-full outline-none rounded-3xl px-6 py-2"
              placeholder="Add dates "
              type="text"
            />
          </div>

          <button className="rounded-full bg-primaryColor h-14 w-14 mr-4 flex justify-center items-center">
            <img src={searchIcon} alt="" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
