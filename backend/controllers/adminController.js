const db = require('../config/db');
exports.getAllUsers = async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT id, name, email, status, created_at FROM users WHERE role = ?';
    const params = ['user'];

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query += ' AND status = ?';
      params.push(status);
    }

    const [users] = await db.query(query, params);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    await db.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: `User ${status} successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};