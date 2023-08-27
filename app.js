const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const globalErrorMiddleware = require("./middleware/globalErrorMiddleware");
const userRouter = require("./routes/userRoutes");
const thoughtRouter = require("./routes/thoughtRoutes");

dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/thoughts", thoughtRouter);

app.use(globalErrorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "social-network",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database connection successful!"))
    .catch(err => console.log(err));

  console.log(`Server is listening on port ${PORT}...`);
});
