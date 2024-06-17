import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import "../styles/home.css";
import Navbar from "../components/Navbar.jsx";
import staffs from "../assets/staffs.png";
import students from "../assets/students.png";
import student from "../assets/student.png";
import rooms from "../assets/rooms.png";
import plus from "../assets/plus.png";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="home-container">
        <Navbar />

        <div className="home-main">
          <div className="status-container">
            <div className="status">
              <div className="status-txt">
                <p>Number of students</p>
                <span>104</span>
              </div>

              <img src={students} alt="" />
            </div>
            <div className="status">
              <div className="status-txt">
                <p>Number of Staffs</p>
                <span>24</span>
              </div>

              <img src={staffs} alt="" />
            </div>
            <div className="status">
              <div className="status-txt">
                <p>Number of Rooms</p>
                <span>32</span>
              </div>

              <img src={rooms} alt="" />
            </div>
          </div>

          <h1 className="title">Recently joined students</h1>

          <div className="new-students">
            <div className="new-student">
              <img src={student} alt="" />
              <h4>Bhelu Baje</h4>
            </div>
            <div className="new-student">
              <img src={student} alt="" />
              <h4>Bhelu Baje</h4>
            </div>
            <div className="new-student">
              <img src={student} alt="" />
              <h4>Bhelu Baje</h4>
            </div>
            <div className="new-student">
              <img src={student} alt="" />
              <h4>Bhelu Baje</h4>
            </div>
            <div className="new-student">
              <img src={plus} alt="" />
              <h4>Add new student</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
