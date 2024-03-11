import React, { useState, useEffect, createContext, Suspense } from "react";
import styles from "../cssModules/LandingPage.module.css";
import { Link } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Loader from "./Loader";
import ScrollToTop from "../utils/ScrollToTop";
import { GetToken } from "../utils/Login_logoutUser";
import { GetCart } from "../utils/GetCart";
import NoMatchPage from "./NoMatchPage";
import { LogOutUser } from "../utils/Login_logoutUser";
import BandageLogo from "../bandageLogo.png"

const baseUrl = process.env.REACT_APP_BASE_URL;
const AllProductsComponent = React.lazy(() => import('./AllProductsComponent'));
const SingleProductPage = React.lazy(() => import('./SingleProductPage'));
const CartPage = React.lazy(() => import('./CartPage'));
const IdPage = React.lazy(() => import('./IdPage'));
const EditIdPage = React.lazy(() => import('./EditIdPage'));
const OrderPage = React.lazy(() => import('./OrderPage'));
const PlaceOrderPage = React.lazy(() => import('./PlaceOrderPage'));
const loaderContainerLength = window.innerWidth <= 1024 ? '100vw' : '44vw';


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
  const [loading, setLoading] = useState(true);
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
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
                    <i className={`fa fa-user`} style={{fontSize:"2rem", marginTop:"0.4rem" }}></i>
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
              <Link className={`link ${styles.orderIcon}`} to="/order"><i className="fa-solid fa-bag-shopping"></i></Link>
          </div>
        </nav>
            
        {loading ? (
          <div className={styles.logoContainer}><img className={styles.bandageLogo} src={BandageLogo} alt=""/></div>
        ) : (
              <div className={styles.productsContainer}>
              <CartContext.Provider value={{ cartItems, setCartItems, isCartLoading }}>
                <ScrollToTop>
                  <Suspense fallback={<Loader containerHeight={loaderContainerLength} loaderSize="2.5rem" borderSize="0.4rem"/>}>
                    <Routes>
                      <Route path="/" element={<AllProductsComponent />} />
                      <Route path="/product/:id" element={<SingleProductPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/id" element={<IdPage func={pull_data} />} />
                      <Route path="/place-order" element={<PlaceOrderPage />} />
                      <Route path="/order" element={<OrderPage />}/>
                      <Route path="/edit" element={<EditIdPage func={pull_data} />} />
                      <Route path="/*" element={<NoMatchPage />} />
                    </Routes>
                  </Suspense>
                </ScrollToTop>
              </CartContext.Provider>
            </div>
        )}
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
            <Link to="/"><i className={`fa-solid fa-house ${styles.bottomHomeIcon}`} aria-hidden="true"></i></Link>
            <div className={styles.cartIcon}>
              {cartItems.length ? (
                <div className={styles.number}>{cartItems.length}</div>
              ) : (
                <div></div>
              )}
            <Link to="/cart"><i className={`fa fa-shopping-cart`}></i></Link>
            </div>
            <Link className={`link ${styles.orderIcon}`} to="/order"><i className="fa-solid fa-bag-shopping"></i></Link>
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
