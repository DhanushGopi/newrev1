import { useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import CryptoJS from "crypto-js";

export default function Conductor() {
  const [scannedData, setScannedData] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  const secretKey = "b7!A$df1@Gz9xLqP4mT8vW#Y2sR6NcKd";

  const decryptData = (encryptedText) => {
    try {
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

  const startScanner = () => {
    if (isScanning || scannerRef.current) return;

    setIsScanning(true);

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
      disableFlip: false,
      rememberLastUsedCamera: true,
    });

    scanner.render(
      (decodedText) => {
        setScannedData(decodedText);
        stopScanner();
      },
      (error) => {
        console.warn("QR Scan Error:", error);
      }
    );

    scannerRef.current = scanner;
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .clear()
        .then(() => {
          setIsScanning(false);
          scannerRef.current = null;
        })
        .catch((err) => console.warn("Error stopping scanner:", err));
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Scan Bus Pass</h2>

      {/* Scanner Start/Stop */}
      {isScanning ? (
        <button onClick={stopScanner}>⛔ Stop Scanner</button>
      ) : (
        <button onClick={startScanner}>📷 Start Scanning</button>
      )}

      {/* Live Camera Preview */}
      <div id="qr-reader" style={{ width: "100%", maxWidth: "400px", margin: "auto" }}></div>

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
