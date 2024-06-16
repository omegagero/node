const fs = require('fs');

const registrar = (nombre, edad, tipo, color, enfermedad) => {
    const citas = JSON.parse(fs.readFileSync('citas.json', 'utf8'));
    const id = Math.floor(Math.random() * 100).toString();
    if (!nombre || !edad || !tipo || !color || !enfermedad) {
        console.log('Pasar todos los datos por favor');
        return;
    }
    citas.push({ id, nombre, tipo, edad, color, enfermedad });
    fs.writeFileSync('citas.json', JSON.stringify(citas, null, 2)); 
    console.log('se agregó con éxito la cita')
};

const leer = () =>{
    const citas = JSON.parse(fs.readFileSync('citas.json', 'utf8'));
    console.log(citas);
}

module.exports = { registrar, leer };
