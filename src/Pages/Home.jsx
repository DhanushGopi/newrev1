import {useSelector} from "react-redux";
import {QRCodeSVG} from "qrcode.react";
import CryptoJS from "crypto-js";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home(){

    const getNewreUser = useSelector((state)=>state.newreuserdata);
    const [qrData, setQrData] = useState("");

    const newPass = {
      "uid":getNewreUser.uid,
      "date":"16032025",
      "validTo":"16042025",
        };

    const encrytData = (data) =>{
      const secretKey = "b7!A$df1@Gz9xLqP4mT8vW#Y2sR6NcKd";
      const jsonData = JSON.stringify(data);
      const hashedData = CryptoJS.AES.encrypt(jsonData,secretKey).toString();
      console.log("hashedData",hashedData);
      return hashedData;

    }
      
    const generateQRCode = () =>{
      setQrData(encrytData(newPass));
    };


    return(
        <>
        <h1>Welcome,{getNewreUser.name}</h1>
        {getNewreUser.photoUrl ? (
        <img src={getNewreUser.photoUrl} alt="Profile" style={{ width: "50px", borderRadius: "100px" }} />
      ) : (
        <p>Loading...</p>
      )}
      <h2>Bus Pass</h2>
      {qrData && <QRCodeSVG value={qrData} size={300}/>}
      <button onClick={generateQRCode}>Generate the Pass</button>
      <Link to='/passverify'>Verify the pass</Link>
        </>
    )
}