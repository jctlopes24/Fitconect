import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ data }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // UseEffect para login automático quando dados QR são recebidos
    useEffect(() => {
        if (data && data.username && data.isQrCode) {
            console.log('Login automático com QR Code', data);
            handleQRLogin(data);
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Exemplo de handleQRLogin
    const handleQRLogin = async (qrData) => {
        try {
            const response = await fetch('http://localhost:5000/api/login/qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ qrData }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro desconhecido no login QR');
            }

            // login bem-sucedido
            console.log('Login QR realizado:', data);
            // podes guardar o token no localStorage/sessionStorage
            localStorage.setItem('token', data.data.token);

        } catch (err) {
            console.error('Erro no login QR:', err);
            alert(err.message);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Erro no login');
            }

            if (!data.success) {
                throw new Error(data.message || 'Login falhou');
            }

            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));

            window.dispatchEvent(new Event('userChanged'));

            setFormData({ username: '', password: '' });

            if (data.data.user.role === 'admin') {
                navigate('/produtos');
            } else {
                navigate('/profile');
            }

        } catch (err) {
            console.error('Erro no login:', err);
            setError(err.message || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Email ou Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="exemplo@email.com ou username"
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Palavra-passe:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Sua palavra-passe"
                        disabled={loading}
                    />
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>

            <Link to="/recuperar-password" className="forgot-password">
                Esqueci-me da palavra-passe
            </Link>

            <div className="login-footer">
                <p>Não tem conta? <Link to="/register">Registe-se aqui</Link></p>
            </div>
        </div>
    );
};

export default Login;