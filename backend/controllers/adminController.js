const db = require('../config/db');

exports.getPendingUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, status, created_at FROM users WHERE status = ? AND role = ?',
      ['pending', 'user']
    );
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