import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// Middleware para manejar archivos estáticos
app.use(express.static('public'));

// Middleware para manejar la subida de archivos
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    abortOnLimit: true,
    responseOnLimit: 'El archivo supera el límite de 5MB.'
}));

// Ruta para servir el formulario de carga de imágenes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'formulario.html'));
});

// Ruta para servir el collage de imágenes
app.get('/collage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'collage.html'));
});

// Ruta para cargar imágenes
app.post('/imagen', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No se subió ningún archivo.');
    }

    const file = req.files.target_file;
    const position = req.body.posicion;

    const uploadPath = path.join(__dirname, 'public', 'imgs', `imagen-${position}.jpg`);

    file.mv(uploadPath, err => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/collage');
    });
});

// Ruta para eliminar imágenes
app.delete('/imagen/:nombre', (req, res) => {
    const imageName = req.params.nombre;
    const imagePath = path.join(__dirname, 'public', 'imgs', imageName);

    fs.unlink(imagePath, err => {
        if (err) {
            return res.status(500).send('Error al eliminar la imagen.');
        }
        res.send('Imagen eliminada exitosamente.');
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor está funcionando en http://localhost:${PORT}`);
});
