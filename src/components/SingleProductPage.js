import { useState, useEffect, useContext } from "react";
import styles from "../cssModules/SingleProductPage.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GetToken } from "../utils/GetToken";
import { CartContext } from "./LandingPage";
import Carousel from "./Carousel";
import Loader from "./Loader";
import { postIntoCart, deleteFromCart } from "../utils/Cart";

export const SingleProductPage = () => {
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState(null);
  const [text, setText] = useState("Add");
  const [cls, setCls] = useState("addbtn");
  const { cartItems, setCartItems } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCart, setIsLoadingCart] = useState(false);

  let { id } = useParams();
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const url = baseUrl+"/product/" + id;
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false);
        setProduct(result.product[0]);
        setImage(result.product[0].images[0]);
      });
  }, [url]);

  function checkIfInCart(product) {
    let res = false;
    if (cartItems && product) {
      cartItems.forEach((item) => {
        if (item.id === product.id) {
          res = true;
        }
      });
    }
    return res;
  }

  const state = checkIfInCart(product);
  useEffect(() => {
    if (state === true) {
      setText("Remove");
      setCls("removebtn");
    }
  }, [state]);

  const handleSetImage = (event, img) => {
    setImage(img);
  };

  const goToCart = () => {
    navigate("/cart");
  };

  const handleButtonClick = async (event, item) => {
    const token = GetToken();
    if (!token) {
      alert("Please login to add products!");
      return;
    }
    setIsLoadingCart(true);

    if (text === "Add") {
      const data = {
        productId: item.id,
      };
      const result = await postIntoCart(data, token).then((res) => res.status);
      if (result === "Blocked") {
        alert("Session Expired Please login again");
        navigate("/login");
      }
      if (result === "success") {
        setCls("removebtn");
        setText("Remove");
        setIsLoadingCart(false);
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
        alert("Session Expired Please login again");
        navigate("/login");
      }
      if (result === "success") {
        setCls("addbtn");
        setText("Add");
        setIsLoadingCart(false);
        setCartItems(cartItems.filter((product) => product.id !== item.id));
      }
    }
  };
  let productList = <div>Loading</div>;
  let images = <div>Loading</div>;;
  if (product) {
    images = product.images.map((img, ind) => (
      <div key={ind} className={styles.miniImgContainer}>
        <img
          src={img}
          alt="NA"
          className={styles.mini}
          onClick={(event) => handleSetImage(event, img)}
        />
      </div>
    ));
    productList = (
      <div key={product.id} className={styles.product}>
        <div className={styles.imageSection}>
          <div>
            <img src={image} alt="img" className={styles.image} />
          </div>
          {images.length > 1 ? (<Carousel>{images}</Carousel>):(<></>)}
        </div>
        <div className={styles.details}>
          <div className={styles.name}>{product.name}</div>
          <div className={styles.category}>{product.category}</div>
          <div className={styles.price}>${product.price}</div>
          <div>
            <strong className={styles.avaibility}>Avaibility :</strong>{" "}
            <strong className={styles.stock}>In Stock</strong>
          </div>
          <div className={styles.description}>{product.meta.description}</div>
          <hr />
          <div className={styles.bottomBtns}>
            <button
              className={cls}
              onClick={(event) => handleButtonClick(event, product)}
            >
              {isLoadingCart ? (
                <div className={styles.loaderContainer}>
                  <div className={styles.loader}></div>
                </div>
              ):(text)}
            </button>
            <div className={styles.bottomIcons}>
            <i className="fa fa-heart-o" aria-hidden="true"></i>
            <i
              className="fa fa-eye"
              aria-hidden="true"
              style={{ marginLeft: 15 }}
            ></i>
            <i
              className="fa fa-shopping-cart"
              style={{ marginLeft: 15 }}
              onClick={() => goToCart()}
            ></i>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.main_container}>
        <div className={styles.homebtn}>
          <strong onClick={() => goToHome()}>Home</strong>
          <div>
            <i className="fa fa-chevron-right" style={{ marginLeft: 15 }}></i>
            &nbsp; Shop
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ):(
          <div className={styles.list_container}>{productList}</div>
        )}
      </div>
    </>
  );
};
