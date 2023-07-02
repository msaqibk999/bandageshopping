import { GetToken } from "./GetToken";

export const GetCart = async () => {
 
  var cart;
  const token = GetToken()
  

  await fetch("http://localhost:4000/cart/get-cart", {
    headers: { "Content-Type": "application/json","token":token },
  })
    .then((response) => {
     return response.json()
    })
    .then((result) => {
      if(result.status === "Blocked"){
        cart =[]
      }
      if(result.status === "success")
      cart = result.cart;
    });
  return cart;
};
