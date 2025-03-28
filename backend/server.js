const express = require('express');
const cors = require('cors');

const app = express();

// Configuración mejorada de CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Tipos de inasistencias permitidos
const ATTENDANCE_TYPES = [
    'Llegada tarde',
    'Falta de uniforme',
    'Falta completa',
    'Falta justificada',
    'Retiro anticipado'
];

let students = [{
    _id: '1',
    name: 'Juan Pérez',
    dni: '40123456',
    email: 'juan@escuela.com',
    course: 'ES3',
    medicalHistory: {
        allergies: ['polen', 'frutos secos'],
        bloodType: 'A+',
        lastCheckup: '2023-03-15'
    },
    behaviorRecords: [{
        _id: '101',
        date: '2023-04-10',
        type: 'Falta grave',
        description: 'Agresión a compañero',
        resolved: false
    }],
    psychologicalProfile: {
        learningStyle: 'visual',
        notes: 'Requiere apoyo en resolución de conflictos'
    }
},
{
    _id: '2',
    name: 'Ana López',
    dni: '35123456',
    email: 'ana@escuela.com',
    course: 'ES2',
    medicalHistory: {
        allergies: [],
        bloodType: '0-',
        lastCheckup: '2023-04-01'
    },
    behaviorRecords: [],
    psychologicalProfile: {
        learningStyle: 'auditivo',
        notes: 'Perfil en evaluación'
    }
}];

// Middlewares de validación
const validateStudent = (req, res, next) => {
    const { name } = req.body;

    // Solo el nombre es obligatorio
    if (!name) {
        return res.status(400).json({
            error: 'El campo "name" es requerido'
        });
    }

    next();
};

const validateAttendance = (req, res, next) => {
    const { type, date } = req.body;

    if (!ATTENDANCE_TYPES.includes(type)) {
        return res.status(400).json({
            error: `Tipo de falta inválido. Opciones válidas: ${ATTENDANCE_TYPES.join(', ')}`
        });
    }

    if (!date || !Date.parse(date)) {
        return res.status(400).json({ error: 'Fecha inválida o faltante' });
    }

    next();
};

// Endpoints principales
app.get('/api/students', (req, res) => {
    const simplifiedStudents = students.map(student => ({
        _id: student._id,
        name: student.name,
        dni: student.dni || '',
        email: student.email || '',
        course: student.course || ''
    }));
    res.json(simplifiedStudents);
});

app.get('/api/students/:_id', (req, res) => {
    const student = students.find(s => s._id === req.params._id);
    if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

    // Filtrar registros si se especifica tipo
    const filteredStudent = req.query.tipo
        ? {
            ...student,
            behaviorRecords: student.behaviorRecords.filter(r => r.type === req.query.tipo)
        }
        : student;

    res.json(filteredStudent);
});

app.post('/api/students', validateStudent, (req, res) => {
    const newStudent = {
        _id: Date.now().toString(),
        name: req.body.name,
        dni: req.body.dni || '',
        email: req.body.email || '',
        course: req.body.course || '',
        medicalHistory: req.body.medicalHistory || {
            allergies: [],
            bloodType: '',
            lastCheckup: ''
        },
        behaviorRecords: req.body.behaviorRecords || [],
        psychologicalProfile: req.body.psychologicalProfile || {
            learningStyle: '',
            notes: ''
        },
        absences: req.body.absences || [] // Agregado para consistencia con el frontend
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

app.put('/api/students/:_id', validateStudent, (req, res) => {
    const index = students.findIndex(s => s._id === req.params._id);
    if (index === -1) return res.status(404).json({ error: 'Estudiante no encontrado' });

    students[index] = {
        ...students[index],
        name: req.body.name,
        dni: req.body.dni || '',
        email: req.body.email || '',
        course: req.body.course || '',
        medicalHistory: req.body.medicalHistory || students[index].medicalHistory,
        behaviorRecords: req.body.behaviorRecords || students[index].behaviorRecords,
        psychologicalProfile: req.body.psychologicalProfile || students[index].psychologicalProfile,
        absences: req.body.absences || students[index].absences || [],
        _id: req.params._id
    };
    res.json(students[index]);
});

app.delete('/api/students/:_id', (req, res) => {
    const index = students.findIndex(s => s._id === req.params._id);
    if (index === -1) return res.status(404).json({ error: 'Estudiante no encontrado' });

    const [deletedStudent] = students.splice(index, 1);
    res.json(deletedStudent);
});

// Endpoints específicos para inasistencias (behaviorRecords)
app.post('/api/students/:_id/attendance', validateAttendance, (req, res) => {
    const student = students.find(s => s._id === req.params._id);
    if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

    const newRecord = {
        _id: Date.now().toString(),
        date: req.body.date,
        type: req.body.type,
        description: req.body.description || '',
        resolved: false
    };

    student.behaviorRecords.push(newRecord);
    res.status(201).json(newRecord);
});

app.put('/api/students/:_id/attendance/:recordId', validateAttendance, (req, res) => {
    const student = students.find(s => s._id === req.params._id);
    if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

    const record = student.behaviorRecords.find(r => r._id === req.params.recordId);
    if (!record) return res.status(404).json({ error: 'Registro no encontrado' });

    record.type = req.body.type;
    record.date = req.body.date;
    record.description = req.body.description || '';
    record.resolved = req.body.resolved || false;

    res.json(record);
});

app.delete('/api/students/:_id/attendance/:recordId', (req, res) => {
    const student = students.find(s => s._id === req.params._id);
    if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

    const initialLength = student.behaviorRecords.length;
    student.behaviorRecords = student.behaviorRecords.filter(r => r._id !== req.params.recordId);

    if (student.behaviorRecords.length === initialLength) {
        return res.status(404).json({ error: 'Registro no encontrado' });
    }

    res.json({ message: 'Registro eliminado correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});