
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: "page not found"
  });
};
