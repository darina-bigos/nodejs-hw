import createHttpError from 'http-errors';
import { User } from '../models/user.js'; // або шлях до вашої моделі користувача
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  try {
    // Перевіряємо, чи завантажено файл
    if (!req.file) {
      throw createHttpError(400, 'Avatar file is missing');
    }

    // Передаємо і файл, і userId у функцію завантаження
    const avatarUrl = await saveFileToCloudinary(req.file, req.user._id);

    // Оновлюємо користувача в базі, використовуючи { returnDocument: 'after' }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { returnDocument: 'after' },
    );

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated avatar!',
      data: {
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};
