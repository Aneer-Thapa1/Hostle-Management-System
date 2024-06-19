import "../styles/signup.css";
import { Link } from "react-router-dom";
import signup from "../assets/signup.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
  return (
    <div className="signup-page">
      <button className="back-btn">
        {" "}
        <Link to={"/landing"} className="redirect">
          <FontAwesomeIcon icon={faAngleLeft} /> Go back
        </Link>
      </button>
      <div className="signup-container">
        <div className="left">
          <p>
            Take Control of Your Hostel <br />
            with Ease - Join HostleEase Now!
          </p>

          <img src={signup} alt="" />
        </div>

        <div className="right">
          <p>
            <span>Hostle</span>Ease
          </p>
          <form className="login-form">
            <input type="text" placeholder="Name" />
            <input type="text" placeholder="Email" />
            <input type="text" placeholder="Password" />
            <input type="text" placeholder="Confirm Password" />
            <button className="login-btn">Signup </button>
            <p className="lower-txt">
              Already have an account?{" "}
              <Link to={"/login"} className="redirect">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
