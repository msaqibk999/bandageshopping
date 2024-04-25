import React, { useEffect, useState, useContext } from "react";
import styles from "../cssModules/Card.module.css";
import { useNavigate } from "react-router-dom";
import { GetToken } from "../utils/Login_logoutUser";
import { CartContext } from "./LandingPage";
import { postIntoCart, deleteFromCart } from "../utils/Cart";
import Loader from "./Loader";
import { LogOutUser } from "../utils/Login_logoutUser";

export const Card = (props) => {
  const item = props.product;
  const [text, setText] = useState("Add");
  const [cls, setCls] = useState("addbtn");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  let { cartItems, setCartItems } = useContext(CartContext);

  const navigate = useNavigate();

  function checkIfInCart(product) {
    let res = false;
    if (cartItems && product) {
      cartItems.forEach((item, ind) => {
        if (item.id === product.id) {
          res = true;
        }
      });
    }
    return res;
  }

  const state = checkIfInCart(item);
  useEffect(() => {
    if (state === true) {
      setText("Remove");
      setCls("removebtn");
    }
  }, [state]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.src = item.images[0];
  }, [item.images]);

  const handlePoductClick = (item) => {
    const id = item.id;
    navigate("/product/" + id);
  };

  const handleButtonClick = async (event, item) => {
    event.stopPropagation();
    setIsLoading(true);
    const token = GetToken();
    if (!token) {
      LogOutUser();
      alert("Please login to add products!");
      navigate("/login");
      return;
    }
    if (text === "Add") {
      const data = {
        productId: item.id,
      };
      const result = await postIntoCart(data, token).then((res) => res.status);
      if (result === "Blocked") {
        LogOutUser();
        setIsLoading(false);
        alert("Session Expired Please login again");
        navigate("/login");
      }
      if (result === "success") {
        setCls("removebtn");
        setText("Remove");
        setCartItems(prevCartItems => [...prevCartItems, item]);
        setIsLoading(false);
      }
    }
    if (text === "Remove") {
      const data = {
        productId: item.id,
      };
      const result = await deleteFromCart(data, token).then(
        (res) => res.status
      );
      if (result === "Blocked") {
        LogOutUser();
        alert("Session Expired Please login again");
        navigate("/login");
      }
      if (result === "success") {
        setCls("addbtn");
        setText("Add");
        setCartItems(prevCartItems => prevCartItems.filter((product) => product.id !== item.id));
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.product} onClick={() => handlePoductClick(item)}>
      {imageLoaded ? (
          <img src={item.images[0]} alt="img" className={styles.image} />
      ):(
          <div className={`${styles.image} ${styles.imageLoad}`}></div>
      )}
      
      <div className={styles.name}>{item.name}</div>
      <div className={styles.category}>{item.category}</div>
      <div className={styles.price}>${item.price}</div>
      <button
        className={cls}
        onClick={(event) => handleButtonClick(event, item)}
      >
        {isLoading ? (
          <Loader containerHeight="1rem" loaderSize="0.9rem" borderSize="0.2rem"/>
        ):(text)}
      </button>
    </div>
  );
};
