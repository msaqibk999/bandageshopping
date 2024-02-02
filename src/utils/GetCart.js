import { GetToken } from "./Login_logoutUser";
const baseUrl = process.env.REACT_APP_BASE_URL;

export const GetCart = async () => {
 
  var cart;
  const token = GetToken()
  

  await fetch(baseUrl+"/cart/get-cart", {
    headers: { "Content-Type": "application/json","token":token },
  })
    .then((response) => {
     return response.json()
    })
    .then((result) => {
      if(result.status === "Blocked"){
        cart =[]
      }
      if(result.status === "success"){
        const event = new CustomEvent('cartLoaded');
        window.dispatchEvent(event);
        cart = result.cart;
      }
    });
  return cart;
};
