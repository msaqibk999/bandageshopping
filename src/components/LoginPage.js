import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import styles from "../cssModules/registerationForm.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { loginUser } from "../utils/Login_logoutUser";

const baseUrl = process.env.REACT_APP_BASE_URL;

async function getToken(data) {
  const res = await fetch(baseUrl+"/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  const data1 = await res.json();
  return data1;
}

const LoginForm = () => {
  const [email, setEmail] = useState([""]);
  const [password, setPassword] = useState([""]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {

    if (event.target.name === "email") {
      setEmail(event.target.value);
    }
    if (event.target.name === "password") {
      setPassword(event.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      email,
      password,
    };

    if (!data.email || !data.password) {
      setLoading(false);
      alert("Please input fields");
      return;
    }

    const response = await getToken(data)
      .then((res) => res)
      .catch((e) => e);

    if(response) setLoading(false);

    if (response.status === "success") {
      const jwt_token = response.token;
      loginUser(jwt_token);
      toast.success("Login Successful !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      navigate("/");
      return;
    }

    if (response.status === "forbidden") {
      toast.error("wrong password", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (response.status === "invalid-email") {
      toast.error("Please input proper email", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (response.status === "unavailable") {
      toast.error("Unknown email please register!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (response.status === "fail") {
      toast.error("Login failed due to some error \n please try again later", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
  };

  return (
    <>
      <div className={styles.registerationFormContainer}>
        <div className={styles.heading}>
          <h1>
            Welcome back to <br />
            bandage
          </h1>
        </div>
        <form>
          <label htmlFor="email">Email</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => handleChange(event)}
          />
          <br />

          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => handleChange(event)}
          />
          <br />
          <br />
          {loading ? (
              <div className={styles.loaderContainer}><Loader containerHeight="3.1rem" loaderSize="1rem" borderSize="0.2rem" backgroundColor="#7343EE"/></div>
          ):(
              <input
                type="submit"
                value="Login"
                className={styles.signup}
                onClick={(event) => handleSubmit(event)}
              />
          )}
        </form>
        <section className=""></section>
        <section className={styles.alreadyRegistered}>
          <strong>New User ? </strong>
          <Link to="/register">
            <button className={styles.loginBtn}>Register</button>
          </Link>
        </section>
      </div>
    </>
  );
};

export default LoginForm;
