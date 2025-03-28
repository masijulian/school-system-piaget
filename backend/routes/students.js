const express = require('express');
const router = express.Router();
const Student = require('../models/Student');  // Asegúrate de tener este modelo

// Ruta existente para obtener estudiantes
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Nueva ruta para carga masiva (AGREGAR ESTO)
router.post('/bulk', async (req, res) => {
    try {
        const result = await Student.insertMany(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            error: 'Error en la carga masiva',
            details: error.message
        });
    }
});

module.exports = router;