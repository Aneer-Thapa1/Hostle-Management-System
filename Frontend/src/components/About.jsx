import React from "react";

const About = () => {
  return (
    <div className="flex flex-col h-screen w-screen ">
      <div className="flex justify-around ">
        <div>
          <p className="before:content-['years of experience'] before:text-red-500">
            10
          </p>
        </div>
        <div>
          <h2 className="text-white text-4xl font-extrabold ">
            Where Every Stay <br />
            Feels Like <br /> Home
          </h2>
        </div>
        <div>
          <p>
            {" "}
            pLorem ipsum dolor sit amet consectetur. Arcu in vel bibendum quam
            in justo vitae. Cursus purus nisl ut sollicitudin. Vitae tristique
            leo lacus tristique. Dui urna nunc eu fames quam in justo vitae.
            Cursus purus nisl ut sollicitudin. Vitae tristique leo lacus
            tristique.
          </p>
          <button className="border-2 border-primaryColor rounded-3xl px-6 text-white font-semibold cursor-pointer">
            More About Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
