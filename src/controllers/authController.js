import createHttpError from 'http-errors';
import {
  registerUserService,
  loginUserService,
  logoutUserService,
  refreshUsersSessionService,
  requestResetTokenService,
  resetPasswordService,
} from '../services/auth.js';
import { createSession, setSessionCookies } from '../services/auth.js'; // або з відповідного файлу сервісів
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'path';
import fs from 'fs/promises';

export const registerUser = async (req, res, next) => {
  try {
    const existingUser = await registerUserService(req.body);

    const session = await createSession(existingUser._id);
    setSessionCookies(res, session);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: existingUser,
    });
  } catch (error) {
    if (error.status === 409) {
      return next(createHttpError(400, 'Email in use'));
    }
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const sessionData = await loginUserService(req.body); // Повертає сесію та юзера або об'єкт з ними

    setSessionCookies(res, sessionData);

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: sessionData.accessToken,
        user: sessionData.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    const newSession = await refreshUsersSessionService({
      sessionId,
      refreshToken,
    });

    setSessionCookies(res, newSession);

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed session!',
      data: {
        accessToken: newSession.accessToken,
      },
    });
  } catch (error) {
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;
    if (sessionId) {
      await logoutUserService(sessionId);
    }

    // Очищуємо всі три cookies за вимогою тесту
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resetToken = await requestResetTokenService(email);

    const templatePath = path.resolve(
      'src/templates/reset-password-email.html',
    );
    const templateSource = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);

    const html = template({
      name: resetToken.user.name || 'User', // Використання чітко визначеного поля name
      link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken.token}`,
    });

    await sendEmail({
      from: process.env.SMTP_FROM, // Обов'язково вказуємо from з env
      to: email,
      subject: 'Reset your password',
      html,
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    await resetPasswordService(req.body);

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
