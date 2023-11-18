import { Router } from 'express';

import UserModel from '../models/user.model.js';

const router = Router();

router.post('/sessions/register', async (req, res) => {
  const { body } = req;

   // Si no se proporciona un rol, establecerlo como "usuario"
   if (!body.role) {
    body.role = 'usuario';
  }

  const newUser = await UserModel.create(body);
  console.log('newUser', newUser);
  res.redirect('/login');
});

router.post('/sessions/login', async (req, res) => {
  const { body: { email, password } } = req;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).send('Correo o contraseña invalidos 😨.');
  }
  const isPassValid = user.password === password;
  if (!isPassValid) {
    return res.status(401).send('Correo o contraseña invalidos 😨.');
  }
  const { first_name, last_name, role } = user;
  req.session.user = { first_name, last_name, email, role };

  // Asignar el rol "usuario" si no se ha establecido
  if (role === 'admin') {
    req.session.welcomeMessage = '¡Bienvenido admin!';
  } else {
    req.session.welcomeMessage = `Bienvenido, ${req.session.user.first_name}!`;
  }

  res.redirect('/views/products');
  // res.redirect('/views/products');


});

router.get('/sessions/logout', (req, res) => {
  req.session.destroy((error) => {
    res.redirect('/login');
  });
});

export default router;