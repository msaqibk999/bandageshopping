import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import styles from "../cssModules/IdPage.module.css";
import { toast } from "react-toastify";
import { GetToken } from "../utils/GetToken";
import Loader from "./Loader";

const baseUrl = process.env.REACT_APP_BASE_URL;

async function getUser(token) {
  const res = await fetch(baseUrl+"/user/get-by-id", {
    headers: { "Content-Type": "application/json", "token":token },
  });
  const data1 = await res.json();
  return data1;
}

export const IdPage = (props) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const loaderContainerLength = window.innerWidth <= 1024 ? '100vw' : '44vw';

  const handleEditProfile = () => {
    navigate("/edit",{ state: { 
      img:user?.meta?.image || 'https://t3.ftcdn.net/jpg/00/61/77/60/360_F_61776002_ZEbc9JEvvE0zqyVPwK0u0R9AkH7Mc0s1.jpg', 
      name:user.firstName + " " + user.lastName, 
      phone:user.phone, 
      email:user.email } });
  }

  const loggedIn = async (token) => {
    const userDetails = await getUser(token)
      .then((res) => {
        setLoading(false)
        return res
      })
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
    cookies.remove("jwt-authorization", { path: "/", domain: window.location.hostname });
    props.func(null);
    toast.success("Log out successful !", {
      position: toast.POSITION.TOP_RIGHT,
    });
     navigate("/");
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
          <Link className="link" to="/"><strong>Home</strong></Link>
          <div className={styles.head}>
            <i className="fa fa-chevron-right" style={{ marginLeft: 15 }}></i>
            &nbsp; Profile
          </div>
        </div>
        {loading ? (
          <Loader containerHeight={loaderContainerLength} loaderSize="2.5rem" borderSize="0.4rem" />
        ):(
            user ? (
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
            )
        )}

      </div>
    </>
  );
};
