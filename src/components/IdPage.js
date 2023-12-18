import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import styles from "../cssModules/IdPage.module.css";
import { toast } from "react-toastify";
import { GetToken } from "../utils/GetToken";


async function getUser(token) {
  const res = await fetch("http://localhost:4000/user/get-by-id", {
    headers: { "Content-Type": "application/json", "token":token },
  });
  const data1 = await res.json();
  return data1;
}

export const IdPage = (props) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleEditProfile = () => {
    navigate("/home/edit",{ state: { 
      img:user?.meta?.image || 'https://t3.ftcdn.net/jpg/00/61/77/60/360_F_61776002_ZEbc9JEvvE0zqyVPwK0u0R9AkH7Mc0s1.jpg', 
      name:user.firstName + " " + user.lastName, 
      phone:user.phone, 
      email:user.email } });
  }

  const loggedIn = async (token) => {
    const userDetails = await getUser(token)
      .then((res) => res)
      .catch((e) => e);
      if(userDetails.status === "success"){
         setUser(userDetails.data[0]);
      }
      if(userDetails.status === "Blocked"){
        setUser(null)
      }
  };

  const logout = () => {
    setUser(null);
    cookies.remove("jwt-authorization", { path: "/", domain: "localhost" });
    props.func(null);
    toast.success("Log out successful !", {
      position: toast.POSITION.TOP_RIGHT,
    });
     navigate("/home");
  };

  useEffect(() => {
    const token = GetToken();

    if (token) {
      loggedIn(token);
    }
  }, []);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.homebtn}>
          <Link className="link" to="/home"><strong>Home</strong></Link>
          <div className={styles.head}>
            <i className="fa fa-chevron-right" style={{ marginLeft: 15 }}></i>
            Profile
          </div>
        </div>
        {user ? (
          <div className={styles.profile}>
            <div>
              <img src={user?.meta?.image || 'https://t3.ftcdn.net/jpg/00/61/77/60/360_F_61776002_ZEbc9JEvvE0zqyVPwK0u0R9AkH7Mc0s1.jpg'} alt="dp" className={styles.image} />
            </div>
            <div className={styles.details}>
              <strong className={styles.name}>
                {user.firstName + " " + user.lastName}
              </strong>
              <strong className={styles.email}>{user.email}</strong>
              <strong className={styles.phone}>{user.phone}</strong>
              <div className={styles.btns}>
                <button className={styles.editbtn} onClick={() => handleEditProfile()} >Edit Profile</button>
                <button onClick={() => logout()} className={styles.logoutbtn}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.notlogged}>
            <strong>Please Login</strong>
          </div>
        )}
      </div>
    </>
  );
};
