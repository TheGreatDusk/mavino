import { AppError } from '../utils/errors.js';

export const validateCourseData = (req, res, next) => {
  const { title, description } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw new AppError('Title must be a non-empty string', 400);
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    throw new AppError('Description must be a non-empty string', 400);
  }

  if (title.length > 200) {
    throw new AppError('Title must not exceed 200 characters', 400);
  }

  if (description.length > 2000) {
    throw new AppError('Description must not exceed 2000 characters', 400);
  }

  next();
};

export const validateLessonData = (req, res, next) => {
  const { courseId, title, type } = req.body;

  if (!courseId || typeof courseId !== 'string' || courseId.trim().length === 0) {
    throw new AppError('Course ID is required', 400);
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw new AppError('Title is required', 400);
  }

  const validTypes = ['scale', 'chord', 'rhythm', 'melody', 'composition', 'theory'];
  if (!type || !validTypes.includes(type)) {
    throw new AppError(`Type must be one of: ${validTypes.join(', ')}`, 400);
  }

  next();
};
