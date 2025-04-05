import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { auth } from './firebase'
import { Button, Navbar, Nav, Container, Form, Spinner, Alert } from 'react-bootstrap';
import { FaSignOutAlt, FaUserPlus, FaUpload, FaSchool } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import Login from './components/login';
import StudentDetails from './components/StudentDetails';
import EditStudentForm from './components/EditStudentForm';
import { User } from 'firebase/auth';

interface Student {
    _id: string;
    name: string;
    email: string;
    course: string;
    // Añadir más propiedades según necesidad
}

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            if (user) loadStudents();
        });
        return () => unsubscribe();
    }, []);

    const loadStudents = () => {
        setLoading(true);
        setError('');
        axios.get<Student[]>('http://localhost:5000/api/students')
            .then((res) => {
                setStudents(res.data);
                setLoading(false);
            })
            .catch((err: AxiosError) => {
              alert(`Error: ${(err?.response?.data as { error?: string })?.error || 'Error del servidor'}`);
              setLoading(false);
          });
          
    };

    const handleBulkUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

                setLoading(true);
                axios.post('http://localhost:5000/api/students/bulk', jsonData)
                    .then(() => {
                        loadStudents();
                        alert('Carga masiva exitosa');
                    })
                    .catch(error => {
                        alert(`Error: ${error.response?.data?.error || 'Error del servidor'}`);
                        setLoading(false);
                    });
            } catch (error) {
              const errorMessage = (error as AxiosError<{ error?: string }>)?.response?.data?.error || 'Error del servidor';
              alert(`Error: ${errorMessage}`);
              setLoading(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    if (!user) return <Login />;

    return (
        <Router>
            <Navbar bg="primary" variant="dark" expand="lg" className="custom-navbar shadow-sm">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold">
                        <FaSchool className="d-inline-block align-top me-2" size={30} />
                        Sistema Escolar Piaget
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/" className="text-white">
                                Estudiantes
                            </Nav.Link>
                            <Nav.Link as={Link} to="/new" className="text-white">
                                <FaUserPlus className="me-1" />
                                Nuevo Registro
                            </Nav.Link>
                        </Nav>

                        <div className="d-flex align-items-center">
                            <Form.Group controlId="formFile" className="me-3">
                                <Button
                                    variant="warning"
                                    as="label"
                                    className="d-flex align-items-center"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Spinner animation="border" size="sm" className="me-2" />
                                    ) : (
                                        <>
                                            <FaUpload className="me-2" />
                                            Cargar Excel
                                        </>
                                    )}
                                    <Form.Control
                                        type="file"
                                        accept=".xlsx, .csv"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.files?.[0]) {
                                                handleBulkUpload(e.target.files[0]);
                                            }
                                        }}
                                        className="d-none"
                                    />
                                </Button>
                            </Form.Group>

                            <Button
                                variant="outline-light"
                                onClick={handleLogout}
                                className="ms-2"
                            >
                                <FaSignOutAlt className="me-1" />
                                Salir
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="py-4">
                {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
                <Routes>
                    <Route path="/" element={
                        <StudentList
                            students={students}
                            loading={loading}
                            onRefresh={loadStudents}
                        />
                    } />
                    <Route path="/new" element={<StudentForm onSuccess={loadStudents} />} />
                    <Route path="/students/:id" element={<StudentDetails />} />
                    <Route path="/students/:id/edit" element={<EditStudentForm />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;