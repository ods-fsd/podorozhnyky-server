<<<<<<< HEAD
export const ctrlWrapper = (controller) => {
  return (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch(next);
=======
/**
 * Обгортка для асинхронних контролерів, яка передає помилки в global error handler.
 */
export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
>>>>>>> main
  };
};