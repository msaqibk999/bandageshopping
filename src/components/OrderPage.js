import React from 'react'
import { useNavigate } from "react-router-dom";
import styles from "../cssModules/Order.module.css";
import {useLocation} from 'react-router-dom';


export const OrderPage = ( ) => {

    const navigate = useNavigate();
    const location = useLocation();
    let status = true
    status = location.state.status;
    const id = location.state.id;

    const handleButtonClick = () => {
        navigate("/home/cart");
    }

  return (
    <>
    <div className={styles.mainContainer}>
         <div className={styles.body}>
            <div className={styles.order}>
            {status ? (
                <>
                <img src='https://t4.ftcdn.net/jpg/02/71/96/13/360_F_271961356_fx0Nr8JBQEQja5RlDdwIiAwXnR6q2ubY.jpg' alt=';-)'
                className={styles.img}
                />
                <h1 style={{color:"#3669C9"}}>Thank You!</h1>
                <span>Your Order has been placed successfully!</span>
                <br/>
                <span >Transaction Number :<strong style={{marginLeft:5}}>{id}</strong></span>
                </>
            ):(
                <>
                <img src='https://i.pinimg.com/originals/d0/17/47/d01747c4285afa4e7a6e8656c9cd60cb.png' alt=':,('
                className={styles.img}
                />
                <h1 style={{color:"#3669C9"}}>Sorry!</h1>
                <span>Your Order has been failed!</span>
                </> 
            )}
            
            <button onClick={()=>handleButtonClick()} className={styles.btn}> Back to Cart</button>
            </div>
         </div>
    </div>
    
    </>
  )
}
