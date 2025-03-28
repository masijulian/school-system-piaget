import React from 'react';
import { auth, GoogleAuthProvider, signInWithPopup } from '../firebase';
import { Button, Card, Container, Spinner } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc';
import { FaGoogle } from 'react-icons/fa';
import { useState } from 'react';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError('');
            await signInWithPopup(auth, new GoogleAuthProvider());
        } catch (error) {
            setError('Error al iniciar sesión. Intente nuevamente.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex vh-100 align-items-center justify-content-center">
            <Card className="shadow-lg login-card">
                <Card.Body className="p-5 text-center">
                    <div className="mb-4">
                        <h1 className="text-primary mb-3">
                            <FaGoogle className="mb-2" size={40} />
                        </h1>
                        <h2 className="mb-3">Bienvenido al Sistema Julian Masi</h2>
                        <p className="text-muted">Inicie sesión con su cuenta de Google</p>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <Button
                        variant="outline-primary"
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-100 py-2"
                    >
                        {loading ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            <>
                                <FcGoogle className="me-2" size={20} />
                                Continuar con Google
                            </>
                        )}
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;