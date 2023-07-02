import Cookies from "universal-cookie";
const cookies = new Cookies();


export function LogOutUser(){
cookies.remove("jwt-authorization", { path: "/", domain: "localhost" });
}