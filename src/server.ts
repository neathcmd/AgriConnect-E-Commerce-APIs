// import express from "express";
// import connectDB from "@/config/db";
// import Router from "@/routes/index";
// import "@/models/bookModel"; 

// const app = express();

// app.use(express.json());

// app.use(express.urlencoded({ extended: true }));

// app.use("/api", Router);

// connectDB()
//   .then(() => console.log("Database connected"))
//   .catch((err) => console.error("Database connection failed:", err));

// const PORT = process.env.PORT;

// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });

import express from "express";
const app = express();
const port = "8000";

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});