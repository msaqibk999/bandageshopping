import { useState, useEffect, useContext } from "react";
import { GetCart } from "../utils/GetCart";
import { GetToken } from "../utils/GetToken";
import { Card } from "./Card";
import { CartContext } from "./LandingPage";
import Loader from "./Loader";



export const AllProductsComponent = () => {
  const { setCartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  
  useEffect(() => {
    fetch(baseUrl+"/product/get-list")
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false)
        setProducts(result.products);
      });
  }, []);

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
    <div style={{minHeight:"70rem"}}><Loader /></div>
  ):(
   <>{productList}</>
  )}
  </>;
};
