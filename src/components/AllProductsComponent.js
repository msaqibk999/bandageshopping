import { useState, useEffect, useContext } from "react";
import { GetCart } from "../utils/GetCart";
import { GetToken } from "../utils/GetToken";
import { Card } from "./Card";
import { CartContext } from "./LandingPage";



export const AllProductsComponent = () => {
  const { setCartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:4000/product/get-list")
      .then((response) => response.json())
      .then((result) => {
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

  return <>{productList}</>;
};
