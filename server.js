import dotenv from "dotenv";
dotenv.config({
  path: "./config.env",
});
import app from "./app.js";
import connnectToDB from "./db/db.js";

connnectToDB(process.env.MONGO_URI);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});
