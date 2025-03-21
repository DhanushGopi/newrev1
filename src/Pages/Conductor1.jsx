import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import CryptoJS from "crypto-js";

export default function Conductor1() {
  const [scannedData, setScannedData] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isScanning, setIsScanning] = useState(true);

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

  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
      disableFlip: false, // Keep it false to allow mirroring
      rememberLastUsedCamera: true,
    });

    scanner.render(
      (decodedText) => {
        setScannedData(decodedText);
        setIsScanning(false);
        scanner.clear();
      },
      (error) => {
        console.warn("QR Scan Error:", error);
      }
    );

    return () => scanner.clear();
  }, [isScanning]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Scan Bus Pass</h2>

      {/* Live Camera Preview */}
      {isScanning && (
        <div id="qr-reader" style={{ width: "100%", maxWidth: "400px", margin: "auto" }}></div>
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
