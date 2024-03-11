import { useState, useEffect, useContext } from "react";
import { GetCart } from "../utils/GetCart";
import { GetToken } from "../utils/Login_logoutUser";
import { Card } from "./Card";
import { CartContext } from "./LandingPage";
import Loader from "./Loader";



const AllProductsComponent = () => {
  const { setCartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const loaderContainerLength = window.innerWidth <= 1024 ? '100vw' : '44vw';

  useEffect(() => {
    let alertTimeout;
    if (isLoading) {
      alertTimeout = setTimeout(() => {
        alert("Server spinned down due to inactivity, Please wait for a minute.");
      }, 7000);
    }
    return () => clearTimeout(alertTimeout);
  }, [isLoading]);

  useEffect(() => {
    fetch(baseUrl+"/product/get-list")
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false)
        setProducts(result.products);
      });
  }, [baseUrl]);

  useEffect(() => {
    (async () => {
      if (GetToken()) {
        await GetCart().then((res) => {
          setCartItems(res);
          return res;
        });
      }
    })();
  }, [setCartItems]);

  let productList = products.map((item, index) => (
    <div key={index}>
      <div key={item.id}>
        <Card product={item} />
      </div>
    </div>
  ));

  return <>
  {isLoading ? (
    <div style={{minHeight:"70rem"}}>
        <Loader containerHeight={loaderContainerLength} loaderSize="2.5rem" borderSize="0.4rem" />
    </div>
  ):(
   <>{productList}</>
  )}
  </>;
};

export default AllProductsComponent;
