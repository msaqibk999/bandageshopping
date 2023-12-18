import React, { useState } from "react";
import styles from "../cssModules/registerationForm.module.css";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


async function postData(data) {
  const res = await fetch("http://localhost:4000/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  
  const data1 = await res.json();
  return data1;
}

const RegisterationForm = () => {
  const [name, setName] = useState([""]);
  const [email, setEmail] = useState([""]);
  const [password, setPassword] = useState([""]);
  const [cpassword, setCpassword] = useState([""]);

  const navigate = useNavigate();


  const handleChange = (event) => {

    if (event.target.name === "name") {
      const regx = /^[a-zA-z ]*$/;
      if (regx.test(event.target.value)) setName(event.target.value);
      else alert("Please enter name correctly");
    }
    if (event.target.name === "email") {
       setEmail(event.target.value);
          }
    if (event.target.name === "password") {
      setPassword(event.target.value);
    }
    if (event.target.name === "confirm-password") {
      setCpassword(event.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    var regx=/^([a-zA-Z0-9._]+)@([a-zA-Z0-9])+.([a-z]+)(.[a-z]+)?$/;

    if(!regx.test(email)) {
      toast.error("Please Enter proper Email !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return
    }

    if (cpassword !== password) {
      toast.error("Passwords doesn't match !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return
    } else {
      const data = {
        username:name,
        email,
        password,
      };
      const result= await postData(data).then((res)=>res.status);
      if(result === 'success'){
        toast.success("Registeration Successful !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      navigate("/login");
      }
    }
  };

  return (
    <div className={styles.registerationFormContainer}>
      <div className={styles.heading}>
        <h1> Register your Account</h1>
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
        <label htmlFor="name">Name</label>
        <br />
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          value={name}
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
        <label htmlFor="confirm-password">Confirm Password</label>
        <br />
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          placeholder="Enter your password"
          value={cpassword}
          onChange={(event) => handleChange(event)}
        />
        <br />
        <br />
        <input
          type="submit"
          value="Signup"
          className={styles.signup}
          onClick={(event) => handleSubmit(event)}
        />
      </form>
      <section className=""></section>
      <section className={styles.alreadyRegistered}>
        <strong>Already Registered</strong>
        <Link to="/login">
        <button className={styles.loginBtn}>login</button>
        </Link>
      </section>
    </div>
  );
};

export default RegisterationForm;
