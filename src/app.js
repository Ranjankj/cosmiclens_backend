const express = require("express");
const cors = require("cors");
const dbRoutes = require("./routes/db.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const profileRoutes = require("./routes/profile.routes");
const personalityRoutes = require("./routes/personality.routes");
const astrologyRoutes = require("./routes/astrology.routes");
const usageRoutes = require("./routes/usage.routes");
const homeRoutes = require("./routes/home.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_, res) => {
  res.send("CosmicLens Backend Running");
});

app.use("/db-test", dbRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/profile", profileRoutes);
app.use("/personality", personalityRoutes);
app.use("/astrology", astrologyRoutes);
app.use("/usage", usageRoutes);
app.use("/home", homeRoutes);

module.exports = app;
