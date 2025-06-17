const PORT = 8000;
const express = require("express");
const { connectDB } = require("./connect");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { checkforAuthentication, restrictTo } = require("./middleware/auth");
//routes
const userRouter = require("./routes/user");
const listingRouter = require("./routes/listings");
const adminRouter = require("./routes/admin");

connectDB(
  "mongodb+srv://tanmay:tanmay123@cluster0.nx1ii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB", error);
  });

const app = express();

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("LeaseLink Server is Live......");
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/user", userRouter);
app.use("/Property", checkforAuthentication, listingRouter);
app.use("/admin", checkforAuthentication, restrictTo(["Admin"]), adminRouter);
