import React, { useEffect, useState, useContext } from "react";
import styles from "../cssModules/Card.module.css";
import { useNavigate } from "react-router-dom";
import { GetToken } from "../utils/GetToken";
import Cookies from "universal-cookie";
import { CartContext } from "./LandingPage";
import { postIntoCart, deleteFromCart } from "../utils/Cart";

export const Card = (props) => {
  const item = props.product;
  const cookies = new Cookies();

  const [text, setText] = useState("Add");
  const [cls, setCls] = useState("addbtn");
  const [isLoading, setIsLoading] = useState(false);
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

  const handlePoductClick = (item) => {
    const id = item.id;
    navigate("/product/" + id);
  };

  const handleButtonClick = async (event, item) => {
    event.stopPropagation();
    setIsLoading(true);
    const token = GetToken();
    if (!token) {
      cookies.remove("jwt-authorization", {
        path: "/",
        domain: "localhost",
      });
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
        cookies.remove("jwt-authorization", {
          path: "/",
          domain: "localhost",
        });
        alert("Session Expired Please login again");
        navigate("/login");
      }
      if (result === "success") {
        setCls("removebtn");
        setText("Remove");
        setIsLoading(false);
        setCartItems([...cartItems, item]);
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
        cookies.remove("jwt-authorization", {
          path: "/",
          domain: "localhost",
        });
        alert("Session Expired Please login again");
        navigate("/login");
      }
      if (result === "success") {
        setCls("addbtn");
        setText("Add");
        setIsLoading(false);
        setCartItems(cartItems.filter((product) => product.id !== item.id));
      }
    }
  };

  return (
    <div className={styles.product} onClick={() => handlePoductClick(item)}>
      <img src={item.images[0]} alt="img" className={styles.image} />
      <div className={styles.name}>{item.name}</div>
      <div className={styles.category}>{item.category}</div>
      <div className={styles.price}>${item.price}</div>
      <button
        className={cls}
        onClick={(event) => handleButtonClick(event, item)}
      >
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
          </div>
        ):(text)}
      </button>
    </div>
  );
};
