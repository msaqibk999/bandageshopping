import Cookies from 'universal-cookie'

const cookies = new Cookies();

export function GetToken (){

    const jwt_token = cookies.get("jwt-authorization")
    if(jwt_token===undefined) return null
    return jwt_token
}