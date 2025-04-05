import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';

interface Props {
  onSuccess: () => void;
}

const StudentForm: React.FC<Props> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/students', { name, email, course })
      .then(() => {
        onSuccess();
        navigate('/');
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Error al registrar estudiante.');
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="name">
        <Form.Label>Nombre</Form.Label>
        <Form.Control value={name} onChange={e => setName(e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="course">
        <Form.Label>Curso</Form.Label>
        <Form.Control value={course} onChange={e => setCourse(e.target.value)} required />
      </Form.Group>
      <Button type="submit" className="mt-3">Registrar</Button>
    </Form>
  );
};

export default StudentForm;