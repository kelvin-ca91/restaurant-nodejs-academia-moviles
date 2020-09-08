var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const utils = require("./helpers/utils");
const categoriesRoutes = require("./routes/categories");
const dishesRouter = require("./routes/dishes");
const authRouter = require("./routes/auth");
const ordersRouter = require("./routes/order");
const clientsRouter = require("./routes/clients");

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://restaurant-academia:restaurant-academia@restaurant-academia.8uhqv.gcp.mongodb.net/restaurant-academia?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

var app = express();
var corsOptions = {
  origin: "*",
  methods: "GET, POST, OPTIONS, PUT, DELETE",
  allowedHeaders: "Authorization, token, Content-Type",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Authorization, token, Content-Type, X-Requested-With"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

//   next();
// });

app.use(["/categories", "/dishes", "/orders"], async (req, res, next) => {
  try {
    if (req.method == "OPTIONS") {
      return next();
    } else {
      if (req.headers.token) {
        const decode = await utils.decodeToken(req.headers.token);
        if (decode) {
          // const user = decode._doc ? decode._doc : decode;
          // req.body.userId = user._id;
          // req.body.user = user;
          return next();
        }
      }
      throw new Error();
    }
  } catch (error) {
    return res.sendStatus(401);
  }
});

app.use("/categories", categoriesRoutes);
app.use("/dishes", dishesRouter);
app.use("/auth", authRouter);
app.use("/orders", ordersRouter);
app.use("/auth-client", clientsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
