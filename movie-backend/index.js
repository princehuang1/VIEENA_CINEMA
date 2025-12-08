// 要連資料庫的東西這邊都要寫
// 1. 引入我們需要的套件
const express = require("express"); // Express 框架
const sqlite3 = require("sqlite3"); // SQLite 資料庫驅動
const cors = require("cors"); // 允許跨域請求
const path = require("path"); // 處理檔案路徑

// 2. 建立 Express 應用程式
const app = express();
const PORT = 4000; // 我們指定後端伺服器跑在 4000 埠

// 3. 設定 Middlewares (中介軟體)
app.use(cors()); // 允許所有來源的跨域請求 (非常重要，這樣 React 才能呼叫它)
app.use(express.json()); // 讓 Express 能夠解析傳入的 JSON 格式請求

// 4. 定義資料庫檔案的路徑
// [重要!] 確保 'movie_project.db' 檔案就在這個 'movie-backend' 資料夾中
const dbPath = path.resolve(__dirname, "movie_project.db");

// 5. 連接 SQLite 資料庫
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("錯誤：無法連接到 SQLite 資料庫。", err.message);
  } else {
    console.log("成功連接到 SQLite 資料庫 (movie_project.db)。");
  }
});

// --- API 路由 (Endpoints) ---

// 6. 實作 [GET] /api/movies - 取得所有電影
app.get("/api/movies", (req, res) => {
  const status = req.query.status; // 例如: /api/movies?status=Now Playing
  let sql;
  const params = [];

  if (status) {
    sql = "SELECT * FROM Movies WHERE status = ?";
    params.push(status);
  } else {
    sql = "SELECT * FROM Movies";
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("資料庫查詢錯誤:", err.message);
      res.status(500).json({ error: "伺服器内部錯誤" });
    } else {
      res.status(200).json(rows);
    }
  });
});

// [GET] /api/movies/:id - 取得「單一」電影的詳細資料
app.get("/api/movies/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Movies WHERE movieId = ?";

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("資料庫查詢錯誤 (單一電影):", err.message);
      res.status(500).json({ error: "伺服器内部錯誤" });
    } else if (row) {
      res.status(200).json(row);
    } else {
      res.status(404).json({ error: "找不到該電影" });
    }
  });
});

// 🎯 新增：取得所有影城
app.get("/api/theaters", (req, res) => {
  db.all("SELECT * FROM Theaters", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 🎯 新增：進階場次查詢 (根據電影、影城、日期篩選時間)
// 用法: /api/showtimes?movieId=1&theaterId=1&date=2025-11-15
app.get("/api/showtimes", (req, res) => {
  const { movieId, theaterId, date } = req.query;

  if (!movieId || !theaterId || !date) {
    // 如果參數不全，回傳空陣列或錯誤 (這裡選擇回傳空陣列以免前端炸開)
    return res.json([]); 
  }

  // SQLite 日期篩選: 找 showtimeStartTime 是 'YYYY-MM-DD' 開頭的
  const sql = `
    SELECT showtimeId, strftime('%H:%M', showtimeStartTime) as time 
    FROM Showtimes 
    WHERE movieId = ? AND theaterId = ? AND showtimeStartTime LIKE ?
    ORDER BY showtimeStartTime ASC
  `;
  
  const dateLike = `${date}%`; // 例如 "2025-11-15%"

  db.all(sql, [movieId, theaterId, dateLike], (err, rows) => {
    if (err) {
      console.error("查詢場次錯誤:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    // 只回傳時間字串陣列 ["10:30", "13:15", ...] 讓前端好處理
    const times = rows.map(r => r.time); 
    res.json(times);
  });
});

// 取得所有遊戲
app.get("/api/games", (req, res) => {
  const sql = "SELECT * FROM Games";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 取得單一遊戲詳情
app.get("/api/games/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Games WHERE gameId = ?";
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: "Game not found" });
    }
  });
});

// 取得所有餐飲
app.get("/api/concessions", (req, res) => {
  const sql = "SELECT * FROM Concessions";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// --- 會員系統與訂單 API ---

// 8. [POST] 註冊 API
app.post("/api/register", (req, res) => {
  const { name, email, phone, password } = req.body;
  
  // 取得當前日期 YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  const sql = `INSERT INTO Users (userName, userEmail, userPhone, userPassword, createdAt) VALUES (?, ?, ?, ?, ?)`;
  
  db.run(sql, [name, email, phone, password, today], function(err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).json({ error: "此 Email 已經被註冊過了" });
      }
      return res.status(500).json({ error: err.message });
    }
    // 註冊成功，回傳使用者資料 (不含密碼)
    res.json({ 
      userId: this.lastID, 
      userName: name, 
      userEmail: email, 
      userPhone: phone,
      createdAt: today 
    });
  });
});

// 9. [POST] 登入 API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM Users WHERE userEmail = ? AND userPassword = ?";

  db.get(sql, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      // 登入成功
      const { userPassword, ...userWithoutPass } = row; // 移除密碼不回傳
      res.json(userWithoutPass);
    } else {
      res.status(401).json({ error: "帳號或密碼錯誤" });
    }
  });
});

// 10. [POST] 重設密碼 API (Demo用)
app.post("/api/reset-password", (req, res) => {
  const { email, newPassword } = req.body;
  // 先檢查帳號是否存在
  db.get("SELECT * FROM Users WHERE userEmail = ?", [email], (err, row) => {
    if (!row) return res.status(404).json({ error: "找不到此帳號" });

    // 更新密碼
    const sql = "UPDATE Users SET userPassword = ? WHERE userEmail = ?";
    db.run(sql, [newPassword, email], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: "密碼重設成功" });
    });
  });
});

// 11. [POST] 建立訂單 API (修改版：支援存入 Users)
app.post("/api/orders", (req, res) => {
  const { userId, showtimeId, totalPrice, items, type } = req.body;
  // items 是一個物件或陣列，我們轉成 JSON 字串存入資料庫
  const itemsJson = JSON.stringify(items);
  const status = "Confirmed";

  // 注意：如果是商城購買，showtimeId 可能為 0 或 null，資料庫要允許
  const sql = `
    INSERT INTO Bookings (userId, showtimeId, totalPrice, bookingStatus, items, type) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [userId, showtimeId || 0, totalPrice, status, itemsJson, type], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, bookingId: this.lastID });
  });
});

// 12. [GET] 取得某會員的所有訂單
app.get("/api/users/:userId/orders", (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM Bookings WHERE userId = ? ORDER BY bookingId DESC";

  db.all(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // 將 items JSON 字串轉回物件
    const orders = rows.map(row => ({
      ...row,
      items: row.items ? JSON.parse(row.items) : null
    }));
    res.json(orders);
  });
});

// 13. 啟動伺服器
app.listen(PORT, () => {
  console.log(`後端伺服器 (API) 正在 http://localhost:${PORT} 上運行...`);
});