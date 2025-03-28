import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Spinner, Alert, ListGroup, Button, Tabs, Tab } from 'react-bootstrap';
import { FaArrowLeft, FaEdit, FaNotesMedical, FaBrain, FaUserSlash, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const StudentDetails = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/students/${id}`);
                const studentData = {
                    ...response.data,
                    course: response.data.course || '',
                    medicalHistory: response.data.medicalHistory || {
                        bloodType: 'No registrado',
                        allergies: [],
                        lastCheckup: 'No registrado'
                    },
                    learningprofile: response.data.learningprofile || {
                        learningStyle: 'No registrado',
                        notes: 'Sin observaciones'
                    },
                    behaviorRecords: response.data.behaviorRecords || [],
                    absences: response.data.absences || []
                };
                setStudent(studentData);
            } catch (err) {
                setError(`Error: ${err.response?.data?.message || 'Estudiante no encontrado'}`);
                console.error("Error detallado:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;

    if (error) return (
        <Alert variant="danger" className="mx-3 my-4">
            {error}
            <Button variant="link" onClick={() => window.location.reload()} className="p-0 ms-2">
                Recargar
            </Button>
        </Alert>
    );

    return (
        <Card className="shadow-lg my-4">
            <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                <Link to="/" className="btn btn-outline-primary">
                    <FaArrowLeft className="me-2" />
                    Volver
                </Link>
                <Link to={`/students/${id}/edit`} className="btn btn-warning">
                    <FaEdit className="me-2" />
                    Editar
                </Link>
            </Card.Header>

            <Card.Body>
                <h3 className="mb-4">{student.name}</h3>

                <Tabs defaultActiveKey="resumen" className="mb-4">
                    {/* Pestaña Resumen */}
                    <Tab eventKey="resumen" title={<><FaEdit className="me-1" />Resumen</>}>
                        <ListGroup variant="flush" className="mt-3">
                            <ListGroup.Item>
                                <strong>DNI:</strong> {student.dni}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Email:</strong> {student.email}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Curso:</strong> {student.course.year}
                            </ListGroup.Item>
                        </ListGroup>
                    </Tab>

                    {/* Pestaña Perfil Médico */}
                    <Tab eventKey="medico" title={<><FaNotesMedical className="me-1" />Médico</>}>
                        <ListGroup variant="flush" className="mt-3">
                            <ListGroup.Item>
                                <strong>Tipo de sangre:</strong> {student.medicalHistory.bloodType}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Alergias:</strong>
                                {student.medicalHistory.allergies?.length > 0
                                    ? student.medicalHistory.allergies.join(', ')
                                    : 'Ninguna registrada'}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Último control:</strong> {student.medicalHistory.lastCheckup}
                            </ListGroup.Item>
                        </ListGroup>
                    </Tab>

                    {/* Pestaña Aprendizaje */}
                    <Tab eventKey="psicologico" title={<><FaBrain className="me-1" />Aprendizaje</>}>
                        <ListGroup variant="flush" className="mt-3">
                            <ListGroup.Item>
                                <strong>Estilo de aprendizaje:</strong>
                                {student.learningprofile.learningStyle}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Observaciones:</strong>
                                {student.learningprofile.notes}
                            </ListGroup.Item>
                        </ListGroup>
                    </Tab>

                    {/* Pestaña Inasistencias */}
                    <Tab eventKey="inasistencias" title={<><FaUserSlash className="me-1" />Inasistencias</>}>
                        <ListGroup variant="flush" className="mt-3">
                            {student.absences.map((absence, index) => (
                                <ListGroup.Item key={index}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{new Date(absence.date).toLocaleDateString()}</strong>
                                            <span className="ms-2 badge bg-danger">{absence.reason}</span>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                            {student.absences.length === 0 && <ListGroup.Item className="text-muted">No hay registros de inasistencias</ListGroup.Item>}
                        </ListGroup>
                    </Tab>

                    {/* Pestaña Observaciones de Conducta */}
                    <Tab eventKey="conducta" title={<><FaExclamationTriangle className="me-1" />Conducta</>}>
                        <ListGroup variant="flush" className="mt-3">
                            {student.behaviorRecords.map((record, index) => (
                                <ListGroup.Item key={index}>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <strong>{record.date}</strong> - {record.type}
                                        </div>
                                    </div>
                                    <div className="text-muted">{record.description}</div>
                                </ListGroup.Item>
                            ))}
                            {student.behaviorRecords.length === 0 &&
                                <ListGroup.Item>No hay observaciones de conducta</ListGroup.Item>}
                        </ListGroup>
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    );
};

export default StudentDetails;