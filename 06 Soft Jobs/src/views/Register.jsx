// Register.jsx
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT } from '../config/constants.js'; 

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    password: '',
    rol: 'Seleccione un rol',
    lenguage: 'Seleccione un Lenguage'
  });

  const handleUser = (event) => setUser({ ...user, [event.target.name]: event.target.value });

  const handleForm = (event) => {
    event.preventDefault();

    if (
      !user.email.trim() ||
      !user.password.trim() ||
      user.rol === 'Seleccione un rol' ||
      user.lenguage === 'Seleccione un Lenguage'
    ) {
      return window.alert('Todos los campos son obligatorios.');
    }

    axios.post(ENDPOINT.users, user)
      .then(({ data }) => {
        window.alert('Usuario registrado con éxito 😀.');
        navigate('/login');
      })
      .catch(error => {
        console.error(error);
        if (error.response && error.response.data) {
          window.alert(`${error.response.data.message} 🙁.`);
        } else {
          window.alert('Error al registrar usuario 🙁.');
        }
      });
  };

  return (
    <form onSubmit={handleForm} className='col-10 col-sm-6 col-md-3 m-auto mt-5'>
      <h1>Registrar nuevo usuario</h1>
      <hr />
      <div className='form-group mt-1'>
        <label>Email address</label>
        <input
          value={user.email}
          onChange={handleUser}
          type='email'
          name='email'
          className='form-control'
          placeholder='Enter email'
        />
      </div>
      <div className='form-group mt-1'>
        <label>Password</label>
        <input
          value={user.password}
          onChange={handleUser}
          type='password'
          name='password'
          className='form-control'
          placeholder='Password'
        />
      </div>
      <div className='form-group mt-1'>
        <label>Rol</label>
        <select
          defaultValue={user.rol}
          onChange={handleUser}
          name='rol'
          className='form-select'
        >
          <option disabled>Seleccione un rol</option>
          <option value='Full Stack Developer'>Full Stack Developer</option>
          <option value='Frontend Developer'>Frontend Developer</option>
          <option value='Backend Developer'>Backend Developer</option>
        </select>
      </div>
      <div className='form-group mt-1'>
        <label>Lenguage</label>
        <select
          defaultValue={user.lenguage}
          onChange={handleUser}
          name='lenguage'
          className='form-select'
        >
          <option disabled>Seleccione un Lenguage</option>
          <option value='JavaScript'>JavaScript</option>
          <option value='Python'>Python</option>
          <option value='Ruby'>Ruby</option>
        </select>
      </div>
      <button type='submit' className='btn btn-light mt-3'>Registrarme</button>
    </form>
  );
};

export default Register;
