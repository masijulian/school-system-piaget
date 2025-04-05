import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Spinner, Alert, Card } from 'react-bootstrap';

interface Student {
  _id: string;
  name: string;
  email: string;
  course: string;
}

const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get<Student>(`http://localhost:5000/api/students/${id}`)
      .then(res => {
        setStudent(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo cargar el estudiante.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!student) return null;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{student.name}</Card.Title>
        <Card.Text>Email: {student.email}</Card.Text>
        <Card.Text>Curso: {student.course}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default StudentDetails;