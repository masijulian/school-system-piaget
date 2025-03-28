import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css'; // Import de animate.css

const EditStudentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        dni: '',
        email: '',
        course: '',
        medicalHistory: {
            bloodType: '',
            allergies: [],
            lastCheckup: ''
        },
        learningprofile: {
            learningStyle: '',
            notes: ''
        },
        behaviorRecords: [],
        absences: []
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/students/${id}`);
                setFormData({
                    ...response.data,
                    course: response.data.course || '',
                    medicalHistory: response.data.medicalHistory || {
                        bloodType: '',
                        allergies: [],
                        lastCheckup: ''
                    },
                    learningprofile: response.data.learningprofile || {
                        learningStyle: '',
                        notes: ''
                    },
                    behaviorRecords: response.data.behaviorRecords || [],
                    absences: response.data.absences || []
                });
            } catch (error) {
                setError('No se pudo cargar el estudiante');
                console.error("Error al cargar:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            console.log("Datos a enviar:", formData);
            await axios.put(`http://localhost:5000/api/students/${id}`, formData);

            toast.success('¡Estudiante guardado correctamente!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                onClose: () => navigate('/')
            });
        } catch (error) {
            toast.error('Error al guardar el estudiante', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            setError('Error al guardar los cambios');
            console.error("Error al guardar:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const handleAllergiesChange = (e) => {
        const allergies = e.target.value.split(',').map(a => a.trim());
        handleNestedChange('medicalHistory', 'allergies', allergies);
    };

    const handleBehaviorRecordChange = (index, field, value) => {
        const newRecords = [...formData.behaviorRecords];
        newRecords[index][field] = value;
        setFormData(prev => ({ ...prev, behaviorRecords: newRecords }));
    };

    const addBehaviorRecord = () => {
        setFormData(prev => ({
            ...prev,
            behaviorRecords: [
                ...prev.behaviorRecords,
                { date: new Date().toISOString().split('T')[0], type: '', description: '' }
            ]
        }));
    };

    const removeBehaviorRecord = (index) => {
        const newRecords = formData.behaviorRecords.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, behaviorRecords: newRecords }));
    };

    const handleAbsenceChange = (index, field, value) => {
        const newAbsences = [...formData.absences];
        newAbsences[index][field] = value;
        setFormData(prev => ({ ...prev, absences: newAbsences }));
    };

    const addAbsence = () => {
        setFormData(prev => ({
            ...prev,
            absences: [
                ...prev.absences,
                { date: new Date().toISOString().split('T')[0], reason: '' }
            ]
        }));
    };

    const removeAbsence = (index) => {
        const newAbsences = formData.absences.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, absences: newAbsences }));
    };

    if (loading) return (
        <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" style={{ width: '3rem', height: '3rem' }} />
        </div>
    );

    if (error && !saving) return <Alert variant="danger">{error}</Alert>;

    return (
        <>
            <Card className="shadow-lg my-4 animate__animated animate__fadeIn">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                    <Button variant="outline-primary" onClick={() => navigate(-1)}>
                        Volver
                    </Button>
                    <h4 className="mb-0">Editar Estudiante</h4>
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Sección Datos Generales */}
                        <Card className="mb-4">
                            <Card.Header>Datos Generales</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre completo</Form.Label>
                                            <Form.Control
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>DNI</Form.Label>
                                            <Form.Control
                                                name="dni"
                                                value={formData.dni}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Curso</Form.Label>
                                            <Form.Select
                                                name="course"
                                                value={formData.course}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Seleccionar</option>
                                                <option value="ES1">ES1</option>
                                                <option value="ES2">ES2</option>
                                                <option value="ES3">ES3</option>
                                                <option value="ES4">ES4</option>
                                                <option value="ES5">ES5</option>
                                                <option value="ES6">ES6</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Sección Información Médica */}
                        <Card className="mb-4">
                            <Card.Header>Información Médica</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tipo de sangre</Form.Label>
                                            <Form.Control
                                                value={formData.medicalHistory.bloodType}
                                                onChange={(e) => handleNestedChange('medicalHistory', 'bloodType', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Alergias (separar por comas)</Form.Label>
                                            <Form.Control
                                                value={formData.medicalHistory.allergies?.join(', ')}
                                                onChange={handleAllergiesChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Último control médico</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={formData.medicalHistory.lastCheckup}
                                                onChange={(e) => handleNestedChange('medicalHistory', 'lastCheckup', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Sección Aprendizaje */}
                        <Card className="mb-4">
                            <Card.Header>Aprendizaje</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Estilo de aprendizaje</Form.Label>
                                            <Form.Select
                                                value={formData.learningprofile.learningStyle}
                                                onChange={(e) => handleNestedChange('learningprofile', 'learningStyle', e.target.value)}
                                            >
                                                <option value="">Seleccionar</option>
                                                <option value="visual">Visual</option>
                                                <option value="auditivo">Auditivo</option>
                                                <option value="kinestésico">Kinestésico</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Observaciones</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={formData.learningprofile.notes}
                                                onChange={(e) => handleNestedChange('learningprofile', 'notes', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Sección Registros de Conducta */}
                        <Card className="mb-4">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                Registros de Conducta
                                <Button variant="success" size="sm" onClick={addBehaviorRecord}>
                                    <FaPlus /> Nuevo Registro
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                {formData.behaviorRecords.map((record, index) => (
                                    <div key={index} className="mb-3 border p-3">
                                        <Row className="g-2">
                                            <Col md={3}>
                                                <Form.Group>
                                                    <Form.Label>Fecha</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        value={record.date}
                                                        onChange={(e) => handleBehaviorRecordChange(index, 'date', e.target.value)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={3}>
                                                <Form.Group>
                                                    <Form.Label>Tipo</Form.Label>
                                                    <Form.Select
                                                        value={record.type}
                                                        onChange={(e) => handleBehaviorRecordChange(index, 'type', e.target.value)}
                                                    >
                                                        <option value="">Seleccionar</option>
                                                        <option value="Falta leve">Falta leve</option>
                                                        <option value="Falta grave">Falta grave</option>
                                                        <option value="Inasistencia">Inasistencia</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={5}>
                                                <Form.Group>
                                                    <Form.Label>Descripción</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={1}
                                                        value={record.description}
                                                        onChange={(e) => handleBehaviorRecordChange(index, 'description', e.target.value)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={1} className="d-flex align-items-end">
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => removeBehaviorRecord(index)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>

                        {/* Sección Inasistencias */}
                        <Card className="mb-4">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                Inasistencias
                                <Button variant="success" size="sm" onClick={addAbsence}>
                                    <FaPlus /> Nueva Inasistencia
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                {formData.absences.map((absence, index) => (
                                    <div key={index} className="mb-3 border p-3">
                                        <Row className="g-2">
                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label>Fecha</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        value={absence.date}
                                                        onChange={(e) => handleAbsenceChange(index, 'date', e.target.value)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={7}>
                                                <Form.Group>
                                                    <Form.Label>Razón</Form.Label>
                                                    <Form.Select
                                                        value={absence.reason}
                                                        onChange={(e) => handleAbsenceChange(index, 'reason', e.target.value)}
                                                    >
                                                        <option value="">Seleccionar</option>
                                                        <option value="Llegada tarde">Llegada tarde</option>
                                                        <option value="Inasistencia">Inasistencia</option>
                                                        <option value="Uniforme">Uniforme</option>
                                                        <option value="Gimnasia">Gimnasia</option>
                                                        <option value="Se van al mediodía y no van a la tarde">
                                                            Se van al mediodía y no van a la tarde
                                                        </option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={1} className="d-flex align-items-end">
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => removeAbsence(index)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>

                        <div className="d-flex gap-3 justify-content-end">
                            <Button
                                variant="primary"
                                type="submit"
                                size="lg"
                                disabled={saving}
                                className={saving ? 'animate__animated animate__pulse animate__infinite' : ''}
                            >
                                {saving ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Guardando...
                                    </>
                                ) : (
                                    "Guardar Cambios"
                                )}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => navigate(-1)}
                                size="lg"
                                disabled={saving}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
};

export default EditStudentForm;