export const postSignup = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth signup endpoint working",
  });
};
