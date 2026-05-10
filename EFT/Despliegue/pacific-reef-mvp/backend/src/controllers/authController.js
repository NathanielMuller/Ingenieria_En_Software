import { asyncHandler } from '../utils/asyncHandler.js';
import { login, registerClient } from '../services/authService.js';

export const postLogin = asyncHandler(async (request, response) => {
  const result = await login({
    email: request.body.email,
    password: request.body.password,
    role: request.body.role
  });

  response.json({
    success: true,
    data: result
  });
});

export const postRegister = asyncHandler(async (request, response) => {
  const result = await registerClient(request.body);

  response.status(201).json({
    success: true,
    data: result
  });
});