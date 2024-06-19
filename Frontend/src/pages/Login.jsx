import "../styles/login.css";
import login from "../assets/login.jpg";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  return (
    <div className="login-page">
      <button className="back-btn">
        {" "}
        <Link to={"/landing"} className="redirect">
          <FontAwesomeIcon icon={faAngleLeft} /> Go back
        </Link>
      </button>
      <div className="login-container">
        <div className="left">
          <p>
            <span>Hostle</span>Ease
          </p>
          <form className="login-form">
            <input type="text" placeholder="Email" />
            <input type="text" placeholder="Password" />
            <button className="login-btn">Login </button>
            <p className="lower-txt">
              Don't hava an account?{" "}
              <Link to={"/signup"} className="redirect">
                Signup
              </Link>
            </p>
          </form>
        </div>
        <div className="right">
          <h2>Welcome back</h2>
          <img src={login} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
