import React from 'react'
import styles from '../cssModules/Modal.module.css'
import { useNavigate } from "react-router-dom";


export default function Modal(props) {

  const navigate = useNavigate();
  
  const closeModal = () => {
    props.closeModal();
  }

  const handleLinkClick = (id) => {
    navigate("/product/" + id);
  }

  return (
        <dialog id='modal' className={styles.modal} open={props.isModalOpen}>
            <div className={styles.products}>
            {props.modalData.meta.productInfo.map((item, index) => (
                    <div key={index} className={styles.product} onClick={() => handleLinkClick(props.modalData.meta.products[index])}>
                        <img className={styles.image} src={item.image} alt={item.name}/>
                        <span>{item.name.length > 6 ? item.name.substring(0, 6) + ' ..' : item.name}</span>
                        <i className={`fa-solid fa-up-right-from-square ${styles.link}`}></i>
                    </div>
            ))}
            </div>
            <button onClick={closeModal} className={styles.closeBtn}><i className="fa-solid fa-xmark"></i></button>
        </dialog>
  )
}
