import {getAuth, createUserWithEmailAndPassword,signInWithPopup, GoogleAuthProvider} from "firebase/auth"
import {firebaseApp} from '../config/firebase'
import{getFirestore,doc, setDoc} from 'firebase/firestore'
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Reg(){

    const auth = getAuth(firebaseApp);
    const googleAuth = new GoogleAuthProvider();
    const firestoreDb = getFirestore(firebaseApp);

    const [name, setName] = useState();
    const [email,setEmail] = useState();
    const [password, setPassword] = useState();
    const [phonenumber, setPhoneNumber] = useState();

    const createUser = async(event) =>{
        event.preventDefault();
        try {
            const createNewUser = await createUserWithEmailAndPassword(auth,email,password);
            const newUser = createNewUser.user;

            const userData = {
                uid: newUser.uid,
                name: name,
                email: email,
                password: password,
                phonenumber: phonenumber,
                createAt: new Date(),
            };

            await setDoc(doc(firestoreDb,'users',newUser.uid),userData);

            alert("the user",newUser.uid);
            console.log("The created user value", newUser.uid);

        } catch (error) {
            console.error(error);
        }
    }

  const createWithGoogle = async()=>{
    try {
        const createNewUser = await signInWithPopup(auth,googleAuth);
        const newUser = createNewUser.user;

        const userData = {
            uid: newUser.uid,
            name: newUser.displayName,
            email: newUser.email,
            phonenumber: newUser.phoneNumber,
            photoUrl: newUser.photoURL,
            createAt: new Date(),
        };

        await setDoc(doc(firestoreDb,'users',newUser.uid),userData);

        alert("the user",newUser.uid);
        console.log("The created user value", newUser.uid);

    } catch (error) {
        console.error(error);
    }

  }

    return(
    <>
    <form onSubmit={createUser}>
        <h1>Register the New User</h1>
        <input type="text" placeholder="Enter your name" onChange={(e)=>setName(e.target.value)}/>
        <br/>
        <input type="text" placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)}/>
        <br/>
        <input type="password" placeholder="Enter your password" onChange={(e)=>setPassword(e.target.value)}/>
        <br/>
        <input type="text" placeholder="Enter your phone number" onChange={(e)=>setPhoneNumber(e.target.value)}/>
        <br/>
        <br/>
        <input type="submit"/>
        <input type="button" value="sign with google" onClick={()=>createWithGoogle()} />
        </form>
    <Link to='/'>Existing User</Link>
    </>
    )
}