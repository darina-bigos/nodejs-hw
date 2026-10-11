import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatarController = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, 'File is missing');
    }

    const userId = req.user._id;

    // Передаємо req.file, а не req.file.buffer (якщо утиліта читає file.buffer всередині)
    const uploadResult = await saveFileToCloudinary(req.file, userId);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadResult.secure_url },
      { new: true, returnDocument: 'after' },
    );

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json({
      url: updatedUser.avatar,
    });
  } catch (error) {
    next(error);
  }
};
