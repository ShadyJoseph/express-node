export const handleError = (res, status, message) => {
    return res.status(status).json({ error: message });
  };
  