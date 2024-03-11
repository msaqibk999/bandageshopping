import React,{useState} from 'react'
import styles from '../cssModules/EditIdPage.module.css'
import { useNavigate, Link } from "react-router-dom";
import {useLocation} from 'react-router-dom';
import { toast } from "react-toastify";
import { GetToken } from "../utils/Login_logoutUser";
import { storage } from '../firebase';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'

const baseUrl = process.env.REACT_APP_BASE_URL;

async function updateUser(data, token) {
    const res = await fetch(baseUrl+"/user/update", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json", "token":token },
    });
    
    const data1 = await res.json();
    return data1;
  }

const EditIdPage = (props) => {

    const navigate = useNavigate();
    const location = useLocation();

    const imgP = location.state.img;
    const nameP = location.state.name;
    const phoneP = location.state.phone;
    const emailP = location.state.email;
    const nameArrP = nameP.split(" ")

    const [name,setName] = useState("")
    let   [email,setEmail] = useState("")
    let   [phone,setPhone] = useState("")
    let   [image,setImage] = useState(null)
    let   [url,setUrl]     = useState(imgP)

    const refference = React.useRef(null);

    const handleSubmit = async() =>{
        let nameArr = name.split(" ");
        let firstName = nameArr[0];
        let lastName = nameArr[1];

        if(!firstName){
          firstName = nameArrP[0];
        }
        if(!lastName){
          lastName = nameArrP[1];
        }
        if(!email){
          email = emailP
        }
        if(!phone){
          phone = phoneP
        }
        if(!url){
          url = imgP;
        }
         
        var regx=/^([a-zA-Z0-9._]+)@([a-zA-Z0-9])+.([a-z]+)(.[a-z]+)?$/;
          if(email){
          if(!regx.test(email)) {
            toast.error("Please Enter proper Email !", {
              position: toast.POSITION.TOP_RIGHT,
            });
            return
          }
        }

            if(image){
          const imageRef =ref(storage,email+".jpeg")
            await uploadBytes(imageRef,image).then(async() => {
            await getDownloadURL(imageRef).then((urlFirebase) => {
                if(urlFirebase){
                url = urlFirebase;
                }
            }).catch((error) => {
              console.log(error.message)
            })
          }).catch((error) => {
            console.log(error.message)
          })
          }

        const data ={
            firstName,
            lastName,
            email,
            phone,
            image:url
        }
        const token = GetToken();
        const result = await updateUser(data, token).then((res) => res.status);
    if (result === "success") {
      toast.success("Details updated !", {
        position: toast.POSITION.TOP_RIGHT,
      });

      props.func(url);
      navigate("/id")
    }
    if (result === "Blocked") {
      alert("Session Expired Please login")
      navigate("/login")
    }

    }

    const handleImageChange = (event) => {
      if(event.target.files[0]) {
         setImage(event.target.files[0])
         image = event.target.files[0];
         var reader = new FileReader();
         reader.onload = function(event) {
          setUrl(event.target.result) ;
        };
        reader.readAsDataURL(event.target.files[0]);
      }
      
    }

    const handleImageClick = () => {
      refference.current.click();
    }

    const handleChange = (event) => {
    
        if (event.target.name === "name") {
          const regx = /^[a-zA-z ]*$/;
          if (regx.test(event.target.value)) setName(event.target.value);
          else alert("Please enter name correctly");
        }
        if (event.target.name === "email") {
          setEmail(event.target.value);
        }
        if (event.target.name === "phone") {
            const regx = /^[0-9 ]*$/;
          if (regx.test(event.target.value)) setPhone(event.target.value);
          else alert("Please enter name correctly");
          setPhone(event.target.value);
        }
        
      };

  return (
    <>
    <div className={styles.mainContainer}>
        <div className={styles.homebtn}>
          <Link className='link' to="/"><strong>Home</strong></Link>
          <div className={styles.head}>
            <i className="fa fa-chevron-right" style={{ marginLeft: 15 }}></i>
            &nbsp; Profile
          </div>
        </div>
        {GetToken() ? (
          <div className={styles.profile}>
            <div className={styles.imageDiv}>
              <img src={url} alt="dp" className={styles.image} 
              onClick={() => handleImageClick()}
              />
              <i className="fa fa-edit"></i>
              <input type="file" onChange={(event) => handleImageChange(event)}
                hidden id='input_file' ref={refference}
              />
            </div>
            <div className={styles.details}>
              <form className={styles.form}>
                <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder={nameP}
                        value={name}
                        onChange={(event) => handleChange(event)}
                        className={styles.input}
                        />
                <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder={emailP}
                        value={email}
                        onChange={(event) => handleChange(event)}
                        className={styles.input}
                        />
                <input
                        id="phone"
                        name="phone"
                        placeholder={phoneP}
                        value={phone}
                        onChange={(event) => handleChange(event)}
                        className={styles.input}
                        />
              </form>
              <div className={styles.btns}>
                <button className={styles.editbtn} onClick={() => handleSubmit()}>Save Changes</button>
                <Link className='link' to="/id"><button className={styles.logoutbtn}>
                  Cancel
                </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.notlogged}>
            <strong>Please Login</strong>
          </div>
        )}
      </div>
    </>
  )
}

export default EditIdPage;