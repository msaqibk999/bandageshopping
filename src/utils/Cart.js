const baseUrl = process.env.REACT_APP_BASE_URL;

export async function postIntoCart(data, token) {
    const res = await fetch(baseUrl+"/cart/add-to-cart", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json", token: token },
    });
  
    const data1 = await res.json();
    return data1;
  }
  
export async function deleteFromCart(data, token) {
    const res = await fetch(baseUrl+"/cart/delete-product", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json", token: token },
    });
  
    const data1 = await res.json();
    return data1;
  }