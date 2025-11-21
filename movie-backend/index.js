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
  
  // 我們可以透過 "status" 查詢參數來篩選「正在上映」或「即將推出」
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
      console.log(`成功查詢 ${rows.length} 部電影 (狀態: ${status || 'All'})。`);
      res.status(200).json(rows); // 將查詢到的 'rows' (資料) 用 JSON 格式回傳
    }
  });
});

// (未來我們會在這裡新增更多 API，例如 /api/movies/:id, /api/bookings 等)
// (未來我們會在這裡新增更多 API，例如 /api/movies/:id, /api/bookings 等)

// 🎯 --- 新增 API 路由 --- 🎯
// [GET] /api/movies/:id - 取得「單一」電影的詳細資料
app.get("/api/movies/:id", (req, res) => {
  
  const id = req.params.id; // 抓取網址列上的 :id
  const sql = "SELECT * FROM Movies WHERE movieId = ?";

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("資料庫查詢錯誤 (單一電影):", err.message);
      res.status(500).json({ error: "伺服器内部錯誤" });
    } else if (row) {
      // 如果找到了電影
      console.log(`成功查詢 movieId: ${id}`);
      res.status(200).json(row); // 將單一電影 'row' (資料) 用 JSON 格式回傳
    } else {
      // 如果沒找到 (例如 ID 錯誤)
      res.status(404).json({ error: "找不到該電影" });
    }
  });
});

// 🎯 新增：取得所有遊戲 (用於 StorePage)
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

// 🎯 新增：取得單一遊戲詳情 (用於 GameDetailPage)
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

// --- 伺服器啟動 ---

// 7. 啟動伺服器
app.listen(PORT, () => {
  console.log(`後端伺服器 (API) 正在 http://localhost:${PORT} 上運行...`);
});
