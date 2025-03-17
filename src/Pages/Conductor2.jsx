import { useState } from 'react';
import {QrReader} from 'react-qr-reader';
import CryptoJS from 'crypto-js';

export default function Conductor2(){

    const [scannedData, setScannedData] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isScanning, setIsScanning] = useState(true); // Controls scanning state

  const decryptData = (encryptedText) => {
    try {
        const secretKey = "b7!A$df1@Gz9xLqP4mT8vW#Y2sR6NcKd";
      const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedText ? JSON.parse(decryptedText) : null;
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  };

  const handleVerify = () => {
    if (!scannedData) {
      setVerificationMessage("❌ No QR Code scanned.");
      return;
    }

    const decrypted = decryptData(scannedData);
    if (decrypted) {
      setDecryptedData(decrypted);
      setVerificationMessage("✅ QR Code is valid.");
    } else {
      setDecryptedData(null);
      setVerificationMessage("❌ Invalid QR Code.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Scan Bus Pass</h2>

      {/* Live Camera Preview */}
      {isScanning && (
        <div style={{ width: "100%", maxWidth: "400px", margin: "auto" }}>
          <QrReader
            constraints={{ facingMode: "user" }} // Uses front camera
            scanDelay={500} // Reduces excessive scans
            onResult={(result, error) => {
              if (result?.text) {
                setScannedData(result.text);
                setIsScanning(false); // Stops scanning once QR is detected
                setVerificationMessage(""); // Reset messages
              }
              if (error) console.log("QR Scan Error:", error);
            }}
            videoStyle={{ width: "100%", borderRadius: "10px" }} // Styling for better view
          />
        </div>
      )}

      {/* Rescan Button */}
      {!isScanning && <button onClick={() => setIsScanning(true)}>🔄 Rescan QR</button>}

      {/* Scanned Data */}
      {scannedData && (
        <div>
          <h3>Scanned Data:</h3>
          <pre>{scannedData}</pre>
          <button onClick={handleVerify}>Verify</button>
        </div>
      )}

      {/* Verification Message */}
      {verificationMessage && <p>{verificationMessage}</p>}

      {/* Decrypted Data */}
      {decryptedData && (
        <div>
          <h3>Decrypted Data:</h3>
          <pre>{JSON.stringify(decryptedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );

}