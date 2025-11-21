import React, { useState } from 'react';
import Login from '../../Auth/Login';
import QrcodeRead from '../QrcodeRead';
import styles from './styles.module.scss';

const HomePage = () => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [dataQrCode, setDataQrCode] = useState({});

  return (
    <div className={styles.container}>
      <div className={styles.loginSection}>
        <Login data={dataQrCode} />
        
        <div className={styles.qrSection}>
          <button 
            onClick={() => setShowQRCode(!showQRCode)}
            className={styles.qrButton}
          >
            {showQRCode ? 'Fechar Scanner' : 'Login com QR Code'}
          </button>
          
          {showQRCode && (
            <div className={styles.qrContainer}>
              <QrcodeRead setDataLogin={setDataQrCode} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;