import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/authController.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';

const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/auth/login', celebrate(loginUserSchema), loginUser);
router.post('/auth/refresh', refreshUserSession);
router.post('/auth/logout', logoutUser);

import {
  requestResetEmail,
  resetPassword,
  // інші контролери...
} from '../controllers/authController.js';
import {
  requestResetEmailSchema,
  resetPasswordSchema,
  // інші схеми...
} from '../validations/authValidation.js';

// Додайте роути:
router.post(
  '/auth/request-reset-email',
  celebrate({ [Segments.BODY]: requestResetEmailSchema }),
  requestResetEmail,
);

router.post(
  '/auth/reset-password',
  celebrate({ [Segments.BODY]: resetPasswordSchema }),
  resetPassword,
);

export default router;
