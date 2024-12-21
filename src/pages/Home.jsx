import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, database, onValue, ref } from "../config";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";


const Home =()=>{

    const navigate = useNavigate();

    useEffect(() => {
        // Set up an auth state observer and get user data
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = ref(database, `users/${user.uid}`);
                onValue(userRef, (snapshot) => {
                const userData = snapshot.val();
                if(userData){
                if (userData.role ==="user") {
                    navigate('/login')
                }
            }
            else{
                navigate('/login')
            }
                });
            
            } else {
                navigate("/login")
            }
        });
    }, []);


    return <>
        <Navbar />
        
    </>
}



export default Home;