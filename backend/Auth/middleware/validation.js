export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      message: 'validation Email and password are required',
    });
  }

  // Check if the email is in a valid format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: 'validation Invalid email format',
    });
  }

  // If validation passes, continue to the next middleware/controller
  next();
};
