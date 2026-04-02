function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const expectedUser = process.env.ADMIN_USER || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD || 'techpulse2024';
  const expectedToken = Buffer.from(`${expectedUser}:${expectedPass}`).toString('base64');

  if (token !== expectedToken) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  next();
}

module.exports = adminAuth;
