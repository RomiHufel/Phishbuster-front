const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Permite peticiones desde el frontend

// Conexión a MongoDB local
mongoose.connect('mongodb://localhost:27017/PhishBuster_Desarrollo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Conectado a MongoDB local"))
.catch(err => console.error("Error de conexión:", err));

// Definir un modelo de datos
const UsuarioSchema = new mongoose.Schema({
    ID_Usuario: Number,
    UserName: String,
    Password: String,
    Estado: Boolean,
    FechaHoraCreacion: Date,
    FechaHoraModificacion: Date
});
const Usuario = mongoose.model("T_Usuario", UsuarioSchema);

// Ruta para validar credenciales
app.post('/login', async (req, res) => {
    res.json({ mensaje: "Ruta /login funcionando" });
    const { user, password } = req.body;

    try {
        // Buscar credenciales
        const usuario = await Usuario.findOne({ UserName:user, Password:password, Estado:true });

        if (usuario) {
            return res.json({ success: true, mensaje: "Inicio de sesión exitoso" });
        } else {
            return res.status(401).json({ success: false, mensaje: "Credenciales Incorrectas" });
        }
    } catch (error) {
            return res.status(500).json({ success: false, mensaje: "Error en el servidor" });
    }
});

// Iniciar servidor en el puerto 3000
app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));