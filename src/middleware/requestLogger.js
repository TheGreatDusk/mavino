const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';
    const timestamp = new Date().toISOString();

    console.log(
      `[${timestamp}] ${logLevel.toUpperCase()} ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
};

export default requestLogger;
