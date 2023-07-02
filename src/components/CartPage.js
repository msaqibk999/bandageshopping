import React, { useEffect, useState ,useContext} from "react";
import styles from "../cssModules/CartPage.module.css";
import { useNavigate, Link } from "react-router-dom";
import { GetToken } from "../utils/GetToken";
import Cookies from "universal-cookie";
import { CartContext } from "./LandingPage";


async function deleteFromCart(data, token) {
  const res = await fetch("http://localhost:4000/cart/delete-product", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json", "token":token },
  });

  const data1 = await res.json();
  return data1;
}

async function deleteCart(token) {
  const res = await fetch("http://localhost:4000/cart/delete-cart", {
    headers: { "Content-Type": "application/json", "token":token},
  });

  const data1 = await res.json();
  return data1;
}

async function updateQuantity(data, token) {
  const res = await fetch("http://localhost:4000/cart/update-quantity", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json", "token":token },
  });

  const data1 = await res.json();
  return data1;
}

async function placeOrder(token) {
  const res = await fetch("http://localhost:4000/order/place", {
    headers: { "Content-Type": "application/json", "token":token },
  });
  const data1 = await res.json();
  return data1;
}

export const CartPage = () => {

  const ref = React.useRef(null);
  const cookies = new Cookies();

  const [vat, setVat] = useState(0);
  const [state, setState] = useState(true);
  const { cartItems, setCartItems } = useContext(CartContext);


  const token = GetToken();
  const navigate = useNavigate();

  //const [products, setProducts] = useState([]);
  const [orderTotal, SetOrderTotal] = useState(0);

  useEffect(() => {
    if (cartItems.length === 0) {
      ref.current.setAttribute("disabled", "disabled");
    }
    if (cartItems.length > 0) {
      ref.current.removeAttribute("disabled");
    }
   
  }, [cartItems.length]);

  const getOrderTotal = (array) => {
    let sum = 0;
    array.forEach((item) => {
      item.quantity= item.quantity ||1;
      sum += parseInt(item.price) * parseInt(item.quantity);
    });
    setVat(sum/100*5);
    return sum;
  };

  const handleChangedQuantity = async (event, item) => {
    const data = {
      productId: item.id,
      quantity: parseInt(event.target.value),
    };
    const result = await updateQuantity(data, token).then((res) => res.status);
    if(result === "Blocked"){
      cookies.remove("jwt-authorization", { path: "/", domain: "localhost" });
      alert("Session Expired Please login again")
      navigate("/login");
    }
    if (result === "success") {
      cartItems.forEach((product) =>{
        if(product.id === item.id){
          product.quantity=event.target.value;
        }
      })
      setState(!state);
    }
  };

  const handleDeleteFromCart = async (event, item) => {
    const data = {
      productId: item.id,
    };
    const result = await deleteFromCart(data, token).then((res) => res.status);
    if(result === "Blocked"){
      cookies.remove("jwt-authorization", { path: "/", domain: "localhost" });
      alert("Session Expired Please login again")
      navigate("/login");
    }
    if (result === "success") {
      setCartItems(cartItems.filter((product) => product.id !== item.id));
    }
    setState(!state);
  };

  const handlePlaceOrder = async (event) => {
    let id = 0;
    const result = await placeOrder(token).then((res) => {
      id = res.id;
      return res.status;
    });
    if(result === "Blocked"){
      cookies.remove("jwt-authorization", { path: "/", domain: "localhost" });
      alert("Session Expired Please login again")
      navigate("/login");
    }
    if (result === "success") {
      const result2 = await deleteCart(token).then((res) => res.status);
      if (result2 === "success") {
        setState(!state);
        setCartItems([])
        navigate("/home/order", { state: { id, status: true } });
      } else {
        setState(!state);
        navigate("/home/order", { state: { id: null, status: false } });
      }
    }
    if(result === "fail") {
      setState(!state);
      navigate("/home/order", { state: { id: null, status: false } });
    }
  };
  
    useEffect(()=>{
      if(GetToken()){
        SetOrderTotal(getOrderTotal(cartItems)) 
      }
    },[cartItems,state])

  let productList = <div>Loading</div>;
  if (cartItems.length) {
    productList = cartItems.map((item, index) => (
      <div key={index}>
        <div key={item.id} className={styles.product}>
          <img src={item.images[0]} alt="img" className={styles.image} />
          <div className={styles.details}>
            <div className={styles.name}>{item.name}</div>
            <div className={styles.category}>{item.category}</div>
            <div className={styles.prices}>
              <div className={styles.price1}>${item.price}</div>
              <div className={styles.price2}>${item.price}</div>
            </div>
            <div className={styles.buttons}>
              <select
                name="quantity"
                id="qty"
                defaultValue={item.quantity}
                className={styles.quantity}
                onChange={(event) => handleChangedQuantity(event, item)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              <button
                className={styles.removebtn}
                onClick={(event) => handleDeleteFromCart(event, item)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ));
  }

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.cartContainer}>
          <div className={styles.homebtn}>
           <Link className="link" to="/home"> <strong>Home</strong> </Link>
            <div className={styles.head}>
              <i className="fa fa-chevron-right" style={{ marginLeft: 15 }}></i>
              MyCart
            </div>
          </div>
          {GetToken() ? (
            <div> 
              {cartItems.length ? (
            <div>{productList}</div>
          ) : (
            <div><strong>Please add some products to cart</strong></div>
          )}
            </div>
          ):(
            <div>
             <strong>Please login to add products!</strong>   
            </div>
          )}
          
        </div>
        <div className={styles.orderContainer}>
          <h3 className={styles.highlight}>Order Summary</h3>
          <div className={styles.discountContainer}>
            <span style={{ color: "grey" }}>Discount code:</span>
            <div className={styles.discount}>
              <input placeholder="SAVE20" className={styles.codeInput} />
              <button className={styles.applybtn}>Apply</button>
            </div>
          </div>
          <div className={styles.orderDetails}>
            <div className={styles.orderData}>
              <span>Order Value</span>
              <span>${orderTotal}</span>
            </div>
            <div className={styles.orderData}>
              <span>VAT</span>
              <span>${vat}</span>
            </div>
            <div className={styles.orderData}>
              <span>Total before discount</span>
              <span>${orderTotal + vat}</span>
            </div>
            <div className={styles.orderData}>
              <span className={styles.highlight}>TOTAL</span>
              <span className={styles.highlight}>${orderTotal + vat}</span>
            </div>
          </div>
          <button
            className={styles.placeOrderBtn}
            onClick={(event) => handlePlaceOrder(event)}
            ref={ref}
          >
            Place Order
          </button>
          <span className={styles.notice}>
            *Custom orders need a few working days to be created. More info here
          </span>
        </div>
      </div>
    </>
  );
};
