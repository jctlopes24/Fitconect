import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import styles from './styles.module.scss';

const QrcodeRead = ({ setDataLogin }) => {
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const handleScan = (result) => {
    if (result && result.length > 0) {
      try {
        const data = JSON.parse(result[0].rawValue);
        console.log('QR Code lido:', data);
        
        if (data.isQrCode && data.username) {
          setDataLogin({
            username: data.username,
            userId: data.userId,
            isQrCode: true
          });
          
          setScanning(false);
        } else {
          setError('QR Code inválido para login');
        }
      } catch (err) {
        console.error('Erro ao processar QR Code:', err);
        setError('QR Code inválido');
      }
    }
  };

  const handleError = (err) => {
    console.error('Erro no scanner:', err);
    
    if (err && err.name === 'NotAllowedError') {
      setPermissionDenied(true);
      setError('Permissão para usar a câmera foi negada');
    } else if (err && err.name === 'NotFoundError') {
      setError('Nenhuma câmera encontrada');
    } else {
      setError('Erro ao acessar a câmera');
    }
  };

  if (!scanning) {
    return (
      <div className={styles.success}>
        <p>✓ QR Code lido com sucesso!</p>
        <p>A fazer login...</p>
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <div className={styles.error}>
        <p>⚠️ Permissão para câmera negada</p>
        <p>Por favor, permita o acesso à câmera nas configurações do navegador</p>
      </div>
    );
  }

  return (
    <div className={styles.scannerContainer}>
      <div className={styles.instructions}>
        <p>Aponte a câmera para o QR Code</p>
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.scannerWrapper}>
        <Scanner
          onScan={handleScan}
          onError={handleError}
          constraints={{
            facingMode: 'environment'
          }}
          styles={{
            container: {
              width: '100%',
              maxWidth: '100%'
            },
            video: {
              width: '100%',
              height: 'auto',
              borderRadius: '8px'
            }
          }}
        />
      </div>
    </div>
  );
};

export default QrcodeRead;