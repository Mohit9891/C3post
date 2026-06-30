const db = require('../config/db');

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `C3P${timestamp}${random}`;
};

// Get available carriers with calculated rates
exports.getCarriers = async (req, res) => {
  const { weight, length, width, height } = req.query;

  try {
    const [carriers] = await db.query(
      'SELECT * FROM carriers WHERE status = 1'
    );

    const result = carriers.map((carrier) => {
      const volumetricWeight = (length * width * height) / carrier.divisor;
      const chargeableWeight = Math.max(parseFloat(weight), volumetricWeight);
      const available = chargeableWeight <= carrier.max_weight;

      return {
        id: carrier.id,
        name: carrier.name,
        carrier_code: carrier.carrier_code,
        image_url: carrier.image_url,
        max_weight: carrier.max_weight,
        chargeable_weight: chargeableWeight.toFixed(2),
        available,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Get single order by id
exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const [orders] = await db.query(
      `SELECT orders.*, carriers.name as carrier_name, carriers.carrier_code, carriers.image_url
       FROM orders
       LEFT JOIN carriers ON orders.carrier_id = carriers.id
       WHERE orders.id = ? AND orders.user_id = ?`,
      [id, user_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(orders[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  const user_id = req.user.id;
  const {
    carrier_id,
    seller_name, seller_address1, seller_address2, seller_pincode, seller_contact,
    buyer_name, buyer_address1, buyer_address2, buyer_pincode, buyer_contact,
    order_weight, length, width, height, order_value, booking_date
  } = req.body;

  try {
    const order_number = generateOrderNumber();
    await db.query(
      `INSERT INTO orders (
        order_number, user_id, carrier_id,
        seller_name, seller_address1, seller_address2, seller_pincode, seller_contact,
        buyer_name, buyer_address1, buyer_address2, buyer_pincode, buyer_contact,
        order_weight, length, width, height, order_value, booking_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_number, user_id, carrier_id || null,
        seller_name, seller_address1, seller_address2 || null, seller_pincode, seller_contact,
        buyer_name, buyer_address1, buyer_address2 || null, buyer_pincode, buyer_contact,
        order_weight, length, width, height, order_value, booking_date
      ]
    );
    res.status(201).json({ message: 'Order created successfully', order_number });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all orders for logged in user
exports.getUserOrders = async (req, res) => {
  const user_id = req.user.id;
  try {
    const [orders] = await db.query(
      `SELECT orders.*, carriers.name as carrier_name, carriers.carrier_code 
       FROM orders 
       LEFT JOIN carriers ON orders.carrier_id = carriers.id
       WHERE orders.user_id = ? 
       ORDER BY orders.created_at DESC`,
      [user_id]
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};