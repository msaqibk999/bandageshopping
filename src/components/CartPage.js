import React, { useEffect, useState ,useContext} from "react";
import styles from "../cssModules/CartPage.module.css";
import { useNavigate, Link } from "react-router-dom";
import { GetToken } from "../utils/Login_logoutUser";
import { CartContext } from "./LandingPage";
import Loader from "./Loader";
import { deleteFromCart } from "../utils/Cart";
import { LogOutUser } from "../utils/Login_logoutUser";

const baseUrl = process.env.REACT_APP_BASE_URL;

async function deleteCart(token) {
  const res = await fetch(baseUrl+"/cart/delete-cart", {
    headers: { "Content-Type": "application/json", "token":token},
  });

  const data1 = await res.json();
  return data1;
}

async function updateQuantity(data, token) {
  const res = await fetch(baseUrl+"/cart/update-quantity", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json", "token":token },
  });

  const data1 = await res.json();
  return data1;
}

async function placeOrder(token) {
  const res = await fetch(baseUrl+"/order/place", {
    method: "POST",
    body: "",
    headers: { "Content-Type": "application/json", token: token },
  });

  const data1 = await res.json();
  return data1;
}

const CartPage = () => {

  const ref = React.useRef(null);
  const [vat, setVat] = useState(0);
  const [state, setState] = useState(true);
  const [Loading, setLoading] = useState(true);
  const [orderTotal, SetOrderTotal] = useState(0);
  const [placingOrder, setIsPlacingOrder] = useState(false);
  const [isDeleting, setDeleting] = useState(null);
  const { cartItems, setCartItems, isCartLoading } = useContext(CartContext);
  const token = GetToken();
  const navigate = useNavigate();
  const loaderContainerLength = window.innerWidth <= 1024 ? '100vw' : '40vw';

  useEffect(() => {
    if(isCartLoading === false) setLoading(false)
  }, [isCartLoading]);


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
      LogOutUser();
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
    setDeleting(item.id)
    const data = {
      productId: item.id,
    };
    const result = await deleteFromCart(data, token).then((res) => res.status);
    if(result === "Blocked"){
      setDeleting(null);
      LogOutUser();
      alert("Session Expired Please login again")
      navigate("/login");
    }
    if (result === "success") {
      setCartItems(prevCartItems => prevCartItems.filter((product) => product.id !== item.id));
      setDeleting(null);
    }
    setState(!state);
  };

  const handlePlaceOrder = async (event) => {
    setIsPlacingOrder(true);
    let id = 0;
    const result = await placeOrder(token).then((res) => {
      id = res.id;
      return res.status;
    });
    if(result === "Blocked"){
      LogOutUser();
      alert("Session Expired Please login again")
      navigate("/login");
    }
    if (result === "success") {
      const result2 = await deleteCart(token).then((res) => res.status);
      if (result2 === "success") {
        setState(!state);
        setIsPlacingOrder(false)
        setCartItems([])
        
        navigate("/place-order", { state: { id, status: true } });
      } else {
        setState(!state);
        setIsPlacingOrder(false)
        navigate("/place-order", { state: { id: null, status: false } });
      }
    }
    if(result === "fail") {
      setState(!state);
      navigate("/place-order", { state: { id: null, status: false } });
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
              <div className={styles.price2}>${item.price * item.quantity}</div>
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
                {isDeleting === item.id ? (
                                              <Loader containerHeight="0.78rem" loaderSize="0.9rem" borderSize="0.2rem" />
                                          ) : (
                                              "Remove"
                                          )}
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
      <div className={styles.homebtn}>
           <Link className="link" to="/"> <strong>Home</strong> </Link>
          <div className={styles.head}>
            <i className="fa fa-chevron-right" style={{ marginLeft: 15 }}></i>
            &nbsp; MyCart
          </div>
        </div>
        <div className={styles.subContainer}>
            <div className={styles.cartContainer}>
              {GetToken() ? (
                Loading ? (
                  <div className={styles.empty}>
                    <Loader containerHeight={loaderContainerLength} loaderSize="2.5rem" borderSize="0.4rem" />
                  </div>
                ) : 
                (
                      cartItems.length ? (
                      <div className={styles.productsContainer}>{productList}</div>
                  ) : (
                    <div className={styles.empty}><h1>Please add some products to cart</h1></div>
                  )
                )
                  ):(
                    <div className={styles.empty}><h1>Please login to add products!</h1></div>
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
                {placingOrder ? (
                  <Loader containerHeight="1.2rem" loaderSize="1rem" borderSize="0.2rem" />
                ):("Place Order")}
              </button>
              <span className={styles.notice}>
                *Custom orders need a few working days to be created. More info here
              </span>
            </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;