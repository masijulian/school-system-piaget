const axios = require('axios');

const seedData = [
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