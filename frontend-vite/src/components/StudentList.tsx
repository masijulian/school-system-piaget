import React from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Student {
  _id: string;
  name: string;
  email: string;
  course: string;
}

interface Props {
  students: Student[];
  loading: boolean;
  onRefresh: () => void;
}

const StudentList: React.FC<Props> = ({ students, loading, onRefresh }) => {
  if (loading) return <Spinner animation="border" />;

  return (
    <>
      <Button onClick={onRefresh} className="mb-3">Actualizar</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Curso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.course}</td>
              <td>
                <Link to={`/students/${student._id}`} className="btn btn-info btn-sm me-2">Ver</Link>
                <Link to={`/students/${student._id}/edit`} className="btn btn-warning btn-sm">Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default StudentList;
