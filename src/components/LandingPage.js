import React, { useState, useEffect, createContext } from "react";
import styles from "../cssModules/LandingPage.module.css";
import { Link } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { AllProductsComponent } from "./AllProductsComponent";
import { SingleProductPage } from "./SingleProductPage";
import { CartPage } from "./CartPage";
import { IdPage } from "./IdPage";
import ScrollToTop from "../utils/ScrollToTop";
import { OrderPage } from "./OrderPage";
import { EditIdPage } from "./EditIdPage";
import { GetToken } from "../utils/GetToken";
import { GetCart } from "../utils/GetCart";
import NoMatchPage from "./NoMatchPage";
import { LogOutUser } from "../utils/LogOutUser";
const baseUrl = process.env.REACT_APP_BASE_URL;

async function getUser(token) {
  const res = await fetch(baseUrl+"/user/get-by-id", {
    headers: { "Content-Type": "application/json", token: token },
  });
  const data1 = await res.json();
  return data1;
}

export const CartContext = createContext({});

export const LandingPage = () => {
  const [userImg, setUserImg] = useState(null);
  const [isCartLoading, SetIsCartLoading] = useState(true);
  let [cartItems, setCartItems] = useState([]);

  const pull_data = (data) => {
    setUserImg(data);
  };

  const loggedIn = async (data) => {
    const userDetails = await getUser(data)
      .then((res) => {
        return res;
      })
      .catch((e) => e);
    if (userDetails.status === "Blocked") {
      setUserImg(null);
      LogOutUser();
      alert("Session Expired Please login!");
      return;
    }

    if (userDetails.status === "success") {
      if(userDetails.data[0].meta)
      setUserImg(userDetails.data[0].meta.image);
    }
  };

  useEffect(() => {
    const token = GetToken();
    if (token) {
      loggedIn(token);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (GetToken()) {
        await GetCart().then((res) => {
          SetIsCartLoading(false);
          setCartItems(res);
          return res;
        });
      }
    })();
  }, []);

  return (
    <>
      <div className={styles.body}>
        <nav className={styles.nav}>
          <Link className="link" to="/">
          <strong className={styles.logo}>
            Bandage
          </strong>
          </Link>
          <div className={styles.icons}>
            <div>
              {GetToken() ? (
                  <Link to="/id">
                  {userImg ? (
                    <img
                    src={userImg}
                    alt="dp"
                    className={styles.image}
                  />
                  ):(
                    <i className={`fa fa-user`} style={{fontSize:"2rem", color:"black", marginTop:"0.4rem" }}></i>
                  )}                  
                  </Link>
              ) : (
                <div className={styles.notLogged}>
                  <i className={`fa fa-user`} style={{ marginRight: 8 }}></i>
                  <Link to="/login">
                    <button className={styles.loginbtn}>Login</button>
                  </Link>
                </div>
              )}
            </div>

            <div className={styles.cartIcon}>
              {cartItems.length ? (
                <div className={styles.number}>{cartItems.length}</div>
              ) : (
                <div></div>
              )}
              <Link className="link" to="/cart"><i className={`fa fa-shopping-cart`}></i></Link>
            </div>
          </div>
        </nav>
        <div className={styles.productsContainer}>
          <CartContext.Provider value={{ cartItems, setCartItems, isCartLoading }}>
            <ScrollToTop>
              <Routes>
                <Route path="/" element={<AllProductsComponent />} />
                <Route path="/product/:id" element={<SingleProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/id" element={<IdPage func={pull_data} />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/edit" element={<EditIdPage func={pull_data} />} />
                <Route path="/*" element={<NoMatchPage />} />
              </Routes>
            </ScrollToTop>
          </CartContext.Provider>
        </div>
        <footer className={styles.displayFooter}>
          <div className={styles.footerHeading}>
            <strong className={styles.footerLogo}>Bandage</strong>
            <div className={styles.socialM}>
              <i className="fa fa-facebook" style={{ marginLeft: 15 }}></i>
              <i className="fa fa-instagram" style={{ marginLeft: 15 }}></i>
              <i className="fa fa-twitter" style={{ marginLeft: 15 }}></i>
            </div>
          </div>
          <hr className={styles.hrLine} />
          <div className={styles.table}>
            <table>
              <tbody>
                <tr>
                  <th>Company Info</th>
                  <th>Legal</th>
                  <th>Features</th>
                  <th>Resources</th>
                </tr>
                <tr>
                  <td>Alfreds Futterkiste</td>
                  <td>Maria Anders</td>
                  <td>Germany</td>
                  <td>India</td>
                </tr>
                <tr>
                  <td>Centro comercial</td>
                  <td>Francisco Chang</td>
                  <td>Mexico</td>
                  <td>India</td>
                </tr>
                <tr>
                  <td>Ios & Android</td>
                  <td>Watch a Demo</td>
                  <td>Customers</td>
                  <td>API</td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <br />
          <strong>Made with love by Saqib Khan</strong>
        </footer>
        <div className={styles.displayBottomNav}>
          <div className={styles.mobileBottomNaveContainer}>
            <Link to="/"><i className={`fa fa-home ${styles.bottomHomeIcon}`} aria-hidden="true"></i></Link>
            <div className={styles.cartIcon}>
              {cartItems.length ? (
                <div className={styles.number}>{cartItems.length}</div>
              ) : (
                <div></div>
              )}
            <Link to="/cart"><i className={`fa fa-shopping-cart`}></i></Link>
            </div>
            {GetToken() ? (
              <Link to="/id">
                {userImg ? (
                  <img
                  src={userImg}
                  alt="dp"
                  className={styles.bottomImage}
                />
                ) : (
                  <i className={`fa fa-user ${styles.bottomIcon}`} style={{ marginRight: 8 }}></i>
                )}
                  </Link>
              ) : (
                <Link to="/login" className={styles.bottomLoginLink}>
                  <i className={`fa fa-user ${styles.bottomIcon}`} style={{ marginRight: 8 }}></i>
                  <button className={styles.bottomLoginbtn}>Login</button>
                </Link>
              )}
          </div>
        </div>
      </div>
    </>
  );
};
