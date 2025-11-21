import React, { useEffect, useState } from 'react';
import QrcodeCreate from "../components/QrcodeCreate";
import './ClientProfile.scss';

export default function ClientProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Não autenticado. Faça login.');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `Erro ${res.status}`);
        }

        const data = await res.json();
        setUser(data.data.user);
      } catch (err) {
        setError(err.message || 'Erro ao obter perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="client-profile"><p>Carregando perfil...</p></div>;
  if (error) return <div className="client-profile error"><p>{error}</p></div>;
  if (!user) return <div className="client-profile"><p>Perfil não disponível.</p></div>;

  return (
    <div className="client-profile">
      <div className="profile-card">
        {/* ... resto do perfil ... */}
        
        <div className="qr-section">
          <h3>QR Code para Login Rápido</h3>
          <QrcodeCreate user={user} />
          <p className="qr-hint">Use este QR Code para fazer login rapidamente</p>
        </div>
      </div>
    </div>
  );
}