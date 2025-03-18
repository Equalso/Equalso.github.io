const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const path = require("path");

// ✅ เชื่อมต่อ Firebase Admin SDK
const serviceAccount = require("./qwwq-33a6d-firebase-adminsdk-fbsvc-cb3f36efc4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://qwwq-33a6d-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ ให้ Express ใช้โฟลเดอร์ `public/` เป็น Static Files
app.use(express.static(path.join(__dirname, "public")));

// ✅ เสิร์ฟ `index.html` เป็นหน้าแรก
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/** ================================
 * 📌 1. ดึงข้อมูลสินค้าทั้งหมดจาก Firebase
 * ================================ */
app.get("/products", async (req, res) => {
  try {
    const snapshot = await db.ref("products").once("value");
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** ================================
 * 📌 2. เพิ่มสินค้าใหม่ไปยัง Firebase
 * ================================ */
app.post("/products", async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    if (!name || !price || !stock) return res.status(400).json({ error: "Missing fields!" });

    const newProductRef = db.ref("products").push();
    await newProductRef.set({ name, price, stock, visible: true });

    res.json({ message: "✅ เพิ่มสินค้าใหม่สำเร็จ!", productId: newProductRef.key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** ================================
 * 📌 3. อัปเดตสต็อกสินค้า
 * ================================ */
app.patch("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { stock } = req.body;

    if (stock === undefined) return res.status(400).json({ error: "Stock is required!" });

    await db.ref(`products/${productId}`).update({ stock });
    res.json({ message: "✅ อัปเดตสต็อกสำเร็จ!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** ================================
 * 📌 4. บันทึกคำสั่งซื้อ
 * ================================ */
app.post("/orders", async (req, res) => {
  try {
    const order = req.body;
    const newOrderRef = db.ref("orders").push();
    await newOrderRef.set(order);

    res.json({ message: "✅ คำสั่งซื้อถูกบันทึก!", orderId: newOrderRef.key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ เริ่มต้น Express Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
