export function validateEnvironment() {
  const requiredEnvVars = ['NODE_ENV'];
  const missing = [];

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }

  if (!['development', 'production', 'test'].includes(process.env.NODE_ENV)) {
    console.warn(`Invalid NODE_ENV: ${process.env.NODE_ENV}. Defaulting to development.`);
    process.env.NODE_ENV = 'development';
  }

  const port = parseInt(process.env.PORT);
  if (isNaN(port) || port < 1 || port > 65535) {
    console.warn(`Invalid PORT: ${process.env.PORT}. Defaulting to 3000.`);
    process.env.PORT = 3000;
  }
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateUsername(username) {
  return username && username.length >= 3 && username.length <= 30;
}
