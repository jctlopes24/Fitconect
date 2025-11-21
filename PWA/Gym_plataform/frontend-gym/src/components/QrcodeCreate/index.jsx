import React from 'react';
import QRCode from 'react-qr-code';
import styles from './styles.module.scss';

const QrcodeCreate = ({ user }) => {
  if (!user || !user.username) {
    return <div>Dados do utilizador não disponíveis</div>;
  }

  const qrData = JSON.stringify({
    username: user.username,
    userId: user._id || user.id,
    isQrCode: true,
    timestamp: Date.now()
  });

  return (
    <div className={styles.qrContainer}>
      <QRCode value={qrData} size={200} level="H" />
    </div>
  );
};

export default QrcodeCreate;