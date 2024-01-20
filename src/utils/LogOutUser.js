import Cookies from "universal-cookie";
const cookies = new Cookies();

export function LogOutUser() {
  try {
    cookies.remove("jwt-authorization", {
      path: "/",
      domain: window.location.hostname,
    });
      console.log("Cookie 'jwt-authorization' removed successfully.");
  } catch (error) {
    console.error("Error while removing cookie 'jwt-authorization':", error);
  }
}
