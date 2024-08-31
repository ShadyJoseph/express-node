const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack}`);
  res.status(500).json({ error: 'An unexpected error occurred!' });
};

export default errorHandler;
