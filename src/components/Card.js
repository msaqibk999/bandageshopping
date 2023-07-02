import React, { useEffect, useState, useContext } from "react";
import styles from "../cssModules/Card.module.css";
import { useNavigate } from "react-router-dom";
import { GetToken } from "../utils/GetToken";
import Cookies from "universal-cookie";
import { CartContext } from "./LandingPage";

async function postIntoCart(data, token) {
  const res = await fetch("http://localhost:4000/cart/add-to-cart", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json", token: token },
  });

  const data1 = await res.json();
  return data1;
}

async function deleteFromCart(data, token) {
  const res = await fetch("http://localhost:4000/cart/delete-product", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json", token: token },
  });

  const data1 = await res.json();
  return data1;
}

export const Card = (props) => {
  const item = props.product;
  const cookies = new Cookies();

  const [text, setText] = useState("Add");
  const [cls, setCls] = useState("addbtn");
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
    navigate("/home/product/" + id);
  };

  const handleButtonClick = async (event, item) => {
    event.stopPropagation();
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
        {text}
      </button>
    </div>
  );
};
