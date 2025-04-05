import axios from 'axios';

interface StudentData {
    name: string;
    dni: string;
    email: string;
    course: string;
    medicalHistory: {
        bloodType: string;
        allergies: string[];
        lastCheckup: string;
    };
    // ...otros campos
}

const seedData: StudentData[] = [
    // Tus datos iniciales
];

seedData.forEach(async (student) => {
    try {
        await axios.post('http://localhost:5000/api/students', student);
        console.log(`Estudiante ${student.name} creado`);
    } catch (error) {
        console.error(error);
    }
});