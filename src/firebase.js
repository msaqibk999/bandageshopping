import { initializeApp } from "firebase/app";
//f import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCYbS7_tdwIVYnDPOQexZ-qBZEnTmTsDIY",
  authDomain: "ecommerceapp-49620.firebaseapp.com",
  projectId: "ecommerceapp-49620",
  storageBucket: "ecommerceapp-49620.appspot.com",
  messagingSenderId: "954132353586",
  appId: "1:954132353586:web:ef383381a7f116762aa22b",
  measurementId: "G-6FK3HLPHE4"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const storage = getStorage(app )