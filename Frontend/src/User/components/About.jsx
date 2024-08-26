import arrowRightIcon from "../../assets/arrowRight.svg";
import image1 from "../../assets/aboutImage1.svg";
import image2 from "../../assets/aboutImage2.svg";
import image3 from "../../assets/aboutImage3.svg";
import image4 from "../../assets/aboutImage4.svg";

const About = () => {
  return (
    <div className="flex flex-col  w-screen items-center mt-[20vh]">
      {/* about upper part */}
      <div className="flex justify-around w-[80%] items-center">
        <div className="w-[15%] flex flex-col">
          <p className="text-gray-500 font-semibold w-full">
            {" "}
            years of experience
          </p>
          <p className="before:content-['years of experience'] before:text-red-500 text-white font-bold text-9xl">
            10
          </p>
        </div>
        <div className="w-[30%]">
          <h2 className="text-white text-5xl font-bold leading-snug">
            Where Every Stay <br />
            Feels Like <br /> <span className="text-primaryColor">Home</span>
          </h2>
        </div>
        <div className="w-[30%] flex  flex-col justify-between gap-4">
          <p className="text-gray-500">
            {" "}
            Lorem ipsum dolor sit amet consectetur. Arcu in vel bibendum quam in
            justo vitae. Cursus purus nisl ut sollicitudin. Vitae tristique leo
            lacus tristique. Dui urna nunc eu fames quam in justo vitae. Cursus
            purus nisl ut sollicitudin. Vitae tristique leo lacus tristique.
          </p>
          <button className="border-2 border-primaryColor rounded-3xl px-6 py-3 text-white font-semibold cursor-pointer w-fit  flex justify-center items-center gap-4">
            More About Us <img src={arrowRightIcon} alt="" />
          </button>
        </div>
      </div>

      {/* about lower part */}

      <div className="flex items-center mt-[10vh] w-[90%] justify-between   ">
        <div className="flex flex-col gap-4 w-[50%]">
          <img src={image1} alt="" className="w-[900px] h-[600px]" />
          <div className="flex gap-4">
            <img src={image2} alt="" className="w-[290px]" />
            <img src={image3} alt="" className="w-[290px]" />
            <img src={image4} alt="" className="w-[290px]" />
          </div>
        </div>

        <div className="flex flex-col w-[50%] items-center gap-6">
          <h2 className="text-white text-6xl font-bold leading-snug">
            {" "}
            Affordable <span className="text-primaryColor">Comfort</span> ,{" "}
            <br /> Wherever You <br /> Stay
          </h2>
          <div className="w-[20%] flex flex-col">
            <p className="text-gray-500 font-semibold w-full">
              {" "}
              Numbers of Client
            </p>
            <p className="before:content-['years of experience'] before:text-red-500 text-white font-bold text-9xl">
              10
            </p>
          </div>

          <div className="flex flex-col w-[70%] gap-4 ">
            <p className="text-gray-500">
              Lorem ipsum dolor sit amet consectetur. Arcu in vel bibendum quam
              in justo vitae. Cursus purus nisl ut sollicitudin. Vitae tristique
              leo lacus tristique. Dui urna nunc eu fames quam in justo vitae.
              Cursus purus nisl ut sollicitudin. Vitae tristique leo lacus
              tristique.{" "}
            </p>
            <button className="flex items-center h-fit py-3 px-6 bg-primaryColor w-fit rounded-3xl text-white font-semibold">
              Book Now <img src={arrowRightIcon} alt="" />{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
