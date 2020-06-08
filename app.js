// const   expressSession  = require("express-session"),
//         methodOverride  = require("method-override"),
//         LocalStrategy   = require("passport-local"),

const bodyParser = require("body-parser"),
  express = require("express"),
  ejs = require("ejs");

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  const dotenv = require("dotenv");
  dotenv.config();
}

const app = express();

console.log("App variables initialised");

// config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public/"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.text());

console.log("App config intitialised");

// // AUTH CONFIG //
// app.use(expressSession({
//     secret: "And yet, everybody rushes around in a great panic as if it were necessary to achieve something beyond themselves.",
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.deserializeUser(User.deserializeUser());
// passport.serializeUser(User.serializeUser());

// // CONFIGURE MIDDLEWARE
// app.use(function(req, res, next){
//     res.locals.currentUser = req.user;
//     next();
// });

// ROUTES //
app.use("/", require("./routes/index"));
app.use("/:orgId/clients", require("./routes/clients"));
app.use("/:orgId/jobs", require("./routes/jobs"));

console.log("App routes initialised");

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

app.listen(process.env.PORT, process.env.IP, () =>
  console.log("HAH-Kapiti-Forms running on port " + process.env.PORT)
);
