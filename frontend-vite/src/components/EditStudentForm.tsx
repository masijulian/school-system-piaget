import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';

type Student = {
    name: string;
    email: string;
    course: string;
};


const EditStudentForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [student, setStudent] = useState<Student>({ name: '', email: '', course: '' });
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`/api/students/${id}`);
                setStudent(response.data);
                setLoading(false);
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.data?.message) {
                    setError(err.response.data.message);
                } else {
                    setError('Error al cargar los datos del estudiante');
                }
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStudent((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await axios.put(`/api/students/${id}`, student);
            navigate(`/students/${id}`);
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Error al guardar los cambios');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Card className="shadow-lg">
            <Card.Header className="bg-white">
                <h4 className="mb-0">Editar Estudiante</h4>
            </Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={student.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={student.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="course">
                        <Form.Label>Curso</Form.Label>
                        <Form.Control
                            type="text"
                            name="course"
                            value={student.course}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" disabled={saving} className="mt-3">
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default EditStudentForm;