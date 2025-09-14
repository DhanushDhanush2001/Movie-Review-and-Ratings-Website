const express = require("express");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDatabase = require("./configs/database");
const path = require('path');
const userRoute = require("./routes/user.route");
const movieRoute = require("./routes/movie.route");
const reviewRoute = require("./routes/review.route");
const watchListRoute = require("./routes/watchList.route");
const adminRoute = require("./routes/adminRoutes");
const adminDashBoardRoute = require("./routes/adminDashboardRoutes");


// Load environment variables
dotenv.config({ path: path.join(__dirname, 'configs/.env') });
const app = express()
const port = process.env.PORT || 8000;


app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use('/api/user',userRoute)
app.use('/api/movie',movieRoute)
app.use('/api/review',reviewRoute)
app.use('/api/watchlist',watchListRoute);
app.use('/api/admin',adminRoute);
app.use('/api/adminDash',adminDashBoardRoute)

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
  // Connect to the database
  connectDatabase();
})


