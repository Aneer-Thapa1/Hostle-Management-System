import React from "react";
import arrowRightIcon from "../../assets/arrowRight.svg";
import image1 from "../../assets/aboutImage1.svg";
import image2 from "../../assets/aboutImage2.svg";
import image3 from "../../assets/aboutImage3.svg";
import image4 from "../../assets/aboutImage4.svg";

const About = () => {
  return (
    <div className="flex flex-col w-full items-center mt-16 sm:mt-24 md:mt-32 px-4 sm:px-6 lg:px-8">
      {/* About upper part */}
      <div className="flex flex-col lg:flex-row justify-around w-full max-w-7xl items-center gap-8 lg:gap-4">
        <div className="w-full lg:w-1/4 flex flex-col items-center lg:items-start">
          <p className="text-gray-500 font-semibold text-center lg:text-left">
            years of experience
          </p>
          <p className="text-white font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
            10
          </p>
        </div>
        <div className="w-full lg:w-1/3">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-snug text-center lg:text-left">
            Where Every Stay <br />
            Feels Like <br /> <span className="text-primaryColor">Home</span>
          </h2>
        </div>
        <div className="w-full lg:w-1/3 flex flex-col justify-between gap-4">
          <p className="text-gray-500 text-center lg:text-left">
            Lorem ipsum dolor sit amet consectetur. Arcu in vel bibendum quam in
            justo vitae. Cursus purus nisl ut sollicitudin. Vitae tristique leo
            lacus tristique. Dui urna nunc eu fames quam in justo vitae. Cursus
            purus nisl ut sollicitudin. Vitae tristique leo lacus tristique.
          </p>
          <button className="border-2 border-primaryColor rounded-3xl px-6 py-3 text-white font-semibold cursor-pointer w-fit mx-auto lg:mx-0 flex justify-center items-center gap-4">
            More About Us{" "}
            <img src={arrowRightIcon} alt="" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* About lower part */}
      <div className="flex flex-col lg:flex-row items-center mt-16 sm:mt-24 w-full max-w-7xl justify-between gap-8 lg:gap-4">
        <div className="flex flex-col gap-4 w-full lg:w-1/2">
          <img src={image1} alt="" className="w-full h-auto object-cover" />
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <img
              src={image2}
              alt=""
              className="w-full sm:w-[calc(33%-16px)] h-auto object-cover"
            />
            <img
              src={image3}
              alt=""
              className="w-full sm:w-[calc(33%-16px)] h-auto object-cover"
            />
            <img
              src={image4}
              alt=""
              className="w-full sm:w-[calc(33%-16px)] h-auto object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-1/2 items-center lg:items-start gap-6">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-snug text-center lg:text-left">
            Affordable <span className="text-primaryColor">Comfort</span>,{" "}
            <br /> Wherever You <br /> Stay
          </h2>
          <div className="w-full sm:w-1/2 lg:w-1/4 flex flex-col items-center lg:items-start">
            <p className="text-gray-500 font-semibold text-center lg:text-left">
              Numbers of Client
            </p>
            <p className="text-white font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
              10
            </p>
          </div>

          <div className="flex flex-col w-full lg:w-3/4 gap-4">
            <p className="text-gray-500 text-center lg:text-left">
              Lorem ipsum dolor sit amet consectetur. Arcu in vel bibendum quam
              in justo vitae. Cursus purus nisl ut sollicitudin. Vitae tristique
              leo lacus tristique. Dui urna nunc eu fames quam in justo vitae.
              Cursus purus nisl ut sollicitudin. Vitae tristique leo lacus
              tristique.
            </p>
            <button className="flex items-center justify-center lg:justify-start h-fit py-3 px-6 bg-primaryColor w-fit mx-auto lg:mx-0 rounded-3xl text-white font-semibold">
              Book Now{" "}
              <img src={arrowRightIcon} alt="" className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
