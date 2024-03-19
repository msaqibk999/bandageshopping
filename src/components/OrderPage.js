import React, { useCallback, useEffect, useState } from 'react'
import { GetToken, LogOutUser } from '../utils/Login_logoutUser';
import { useNavigate, Link } from "react-router-dom";
import Loader from './Loader';
import styles from '../cssModules/Order.module.css'
import Modal from './Modal';

const baseUrl = process.env.REACT_APP_BASE_URL;

async function getOrdersReq(token) {
    const res = await fetch(baseUrl+"/order/get", {
      headers: { "Content-Type": "application/json", token: token },
    });
    const data1 = await res.json();
    return data1;
  }

async function deleteOrderReq(token, id){
    const res = await fetch(baseUrl+"/order/delete", {
        method: "POST",
        body: JSON.stringify({id}),
        headers: { "Content-Type": "application/json", token: token },
      });
    
      const data1 = await res.json();
      return data1;
  }

export default function OrderPage() {
    const [orders, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setDeleting] = useState(null);
    const [modalData, setModalData] = useState([]);
    const navigate = useNavigate();
    const loaderContainerLength = window.innerWidth <= 1024 ? '100vw' : '44vw';

    const getOrder = useCallback(async (token) => {
        const data = await getOrdersReq(token);
        if (data.status === "success") {
            setOrder(data.OrderData);
            setLoading(false);
        } else if (data.status === "Blocked") {
            LogOutUser();
            alert("Session Expired Please login again");
            navigate("/login");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openModal = (item) => {
        setModalData(item)
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };

    const calculateTime = (data) => {
        const date = new Date(data);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = (hours % 12) || 12;
        const formattedMinutes = minutes.toString().padStart(2, "0");
        return `${month}/${day}/${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    const handleDeleteOrder = async (id) => {
        setDeleting(id);
        const token = GetToken();
        const res = await deleteOrderReq(token, id).then((res) => res.status);

        if(res === "success"){
            setOrder(prevOrders => prevOrders.filter((order) => order.id !== id));
            setDeleting(null);
        }
        else if(res === "Blocked"){
            setDeleting(null);
            LogOutUser();
            alert("Session Expired Please login again");
            navigate("/login");
        }
    }

    useEffect(() => {
        const token = GetToken();
        if (token) {
            getOrder(token);
        }
        else{
            setLoading(false);
        }
    }, [getOrder]);

  return (
    <div className={styles.mainContainer}>
        <div className={styles.homebtn}>
           <Link className="link" to="/"> <strong>Home</strong> </Link>
            <div className={styles.head}>
                <i className="fa fa-chevron-right" style={{ marginLeft: 15 }}></i>
                    &nbsp; MyOrders
            </div>
        </div>
        <div className={styles.subContainer}>
            {loading ? (
                <Loader containerHeight={loaderContainerLength} loaderSize="2.5rem" borderSize="0.4rem" />
            ):(
                <>
                    {GetToken() ? (
                        orders.length ? (
                            <>
                                {orders.map((item, index) => (
                                    <div className={styles.orderContainer} key={index}>
                                        <div className={styles.productsContainer}>
                                            {item.meta.productInfo.slice(0, 3).map((product, index) => (
                                                <div key={index} className={styles.imagesContainer}>
                                                    <img className={styles.productImg} src={product.image} alt="img" />
                                                </div>
                                            ))}
                                                {item.meta.productInfo.length > 2 ? (
                                                    <div className={styles.remaining}>
                                                        +{item.meta.productInfo.length - 2}
                                                    </div>
                                                ):(
                                                    <></>
                                                )}
                                        </div>
                                        <div className={styles.infoContainer}>
                                            <div className={styles.amount}><strong>Amount: </strong>${item.amount}</div>
                                            <div className={styles}> <strong>Order Status: </strong>{item.orderStatus}</div>
                                            <div className={styles}><strong>Payment Status: </strong>{item.paymentStatus}</div>
                                            <div className={styles}><strong>Ordered on: </strong>{calculateTime(item.createdAt)}</div>
                                        </div>
                                        <div className={styles.btns}>
                                            <button className={styles.moreBtn} onClick={() => openModal(item)}>View Products</button>
                                            <button className={styles.removeBtn} onClick={() => handleDeleteOrder(item.id)}>
                                                {isDeleting === item.id ? (
                                                        <Loader containerHeight="0.78rem" loaderSize="0.9rem" borderSize="0.2rem" />
                                                    ) : (
                                                        "Remove"
                                                    )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ):(
                            <div className={styles.empty}>
                                No Orders yet
                            </div>
                        )
                    ):(
                        <div className={styles.empty}>
                            Please Login
                        </div>
                    )}
                    {isModalOpen && (
                        <Modal isModalOpen={isModalOpen} closeModal={closeModal} modalData={modalData}/>
                    )}                  
                </>
            )}
        </div>
    </div>
  )
}
