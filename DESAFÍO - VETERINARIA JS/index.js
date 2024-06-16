const { registrar, leer } = require('./operaciones');

const [operacion, nombre, edad, tipo, color, enfermedad] = process.argv.slice(2); // Eliminar `id` de aquí

if (operacion === 'registrar') {
    registrar(nombre, edad, tipo, color, enfermedad); 
} 
if (operacion === 'leer'){
    leer();
}


// node index.js registrar Benito "1 año" perro blanco otitis
// node index.js registrar Julieta "6 años" perro amarillo Moquillo

// node index.js leer

