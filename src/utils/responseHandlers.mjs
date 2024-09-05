export const handleError = (res, status, message) => {
  res.status(status).json({ error: message });
};
