import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Badge, Card, Spinner } from 'react-bootstrap';
import { FaEye, FaEdit, FaEnvelope, FaUserSlash } from 'react-icons/fa';

const StudentList = ({ students, loading, onRefresh }) => {
    return (
        <Card className="shadow-lg">
            <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                <h4 className="mb-0">Lista de Estudiantes</h4>
                <Button onClick={onRefresh} variant="outline-primary" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Actualizar'}
                </Button>
            </Card.Header>

            <Card.Body>
                <Table striped hover responsive>
                    <thead className="bg-primary text-white">
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Curso</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id}>
                                <td>{student.name}</td>
                                <td>
                                    <Button
                                        variant="link"
                                        className="text-decoration-none p-0"
                                        href={`mailto:${student.email}`}
                                    >
                                        <FaEnvelope className="me-2 text-warning" />
                                        {student.email}
                                    </Button>
                                </td>
                                <td>
                                    <Badge bg="success" pill>
                                        {student.course}
                                    </Badge>
                                </td>
                                <td>
                                    <Link
                                        to={`/students/${student._id}`}
                                        className="btn btn-sm btn-outline-primary me-2"
                                    >
                                        <FaEye />
                                    </Link>
                                    <Link
                                        to={`/students/${student._id}/edit`}
                                        className="btn btn-sm btn-outline-warning me-2"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <Link
                                        to={`/students/${student._id}/add-absence`}
                                        className="btn btn-sm btn-outline-danger"
                                    >
                                        <FaUserSlash />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default StudentList;