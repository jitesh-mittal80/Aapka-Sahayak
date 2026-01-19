import { adminLogin as adminLoginService } from "../services/auth.service.js";

export const postSignup = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth signup endpoint working",
  });
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await adminLoginService(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
