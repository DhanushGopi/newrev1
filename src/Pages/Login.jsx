import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link, useNavigate} from "react-router-dom";
import { firebaseApp } from "../config/firebase";
import { useState} from "react";
import { useDispatch } from "react-redux";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export default function Login(){

    const auth = getAuth(firebaseApp);
    const googleAuth = new GoogleAuthProvider(firebaseApp);
    const firestoreDb = getFirestore(firebaseApp);

    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    // const [newreUser,setNewreUser] = useState();

    const navigation = useNavigate();
    const dispatchNewreUserData = useDispatch();

    const fetchUserData = async (uid) =>{
        try {
            const newreUserDetails = await getDoc(doc(firestoreDb, "users",uid));
            const newreUserDetailsData = newreUserDetails.data();
            const newreUserObj = {
                "name":newreUserDetailsData.name,
                "email":newreUserDetailsData.email,
                "phonenumber":newreUserDetailsData.phonenumber,
                "uid":newreUserDetailsData.uid,
                "photoUrl":newreUserDetailsData.photoUrl,
            }

            //dispatch
            dispatchNewreUserData(
                {
                    type:"newreUsers",
                    data: {
                        "name":`${newreUserObj.name}`,
                        "email":`${newreUserObj.email}`,
                        "phonenumber":`${newreUserObj.phonenumber}`,
                        "uid":`${newreUserObj.uid}`,
                        "photoUrl":newreUserObj.photoUrl
                    }

                }
            )
            console.log(newreUserDetailsData);
            console.log("the fetched ",newreUserObj);
            navigation('/home')
        } catch (err) {
            console.error(err);
        }
    }

    const loginUser = async(event)=>{
        event.preventDefault();
    try {

        const loggedUser = await signInWithEmailAndPassword(auth,email,password);
        const presentUser = loggedUser.user;
        // setNewreUser(presentUser.uid);
        fetchUserData(presentUser.uid);
        console.log("The logged User",presentUser);
    } catch (error) {
        console.error("The error",error);
    }

    } 

    const loginGoogle = async()=>{
    try {
        const loggedgoogleuser = await signInWithPopup(auth,googleAuth);
        const googleUser = loggedgoogleuser.user;
        // setNewreUser(googleUser.uid);
        fetchUserData(googleUser.uid);
        console.log("The google user logged in",googleUser.displayName);
        console.log("The google user logged in",googleUser);
    } catch (error) {
        console.error(error);
    }
    }


    return(
    <>
    <form onSubmit={loginUser}>
        <h1>Login User</h1>
        <input type="text" placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)}/>
        <br/>
        <input type="password" placeholder="Enter your password" onChange={(e)=> setPassword(e.target.value)} />
        <br/>
        <br/>
        <input type="submit"/>
        </form>
        <input type="button" value="google login" onClick={()=>loginGoogle()}/>
        <Link to='/reg'>Create your account</Link>
    </>
    )
}