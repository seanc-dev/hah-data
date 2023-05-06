// const   expressSession  = require("express-session"),
//         methodOverride  = require("method-override"),
//         LocalStrategy   = require("passport-local"),

import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import indexRoutes from "./routes/index.js";
import clientsRoutes from "./routes/clients.js";
import jobsRoutes from "./routes/jobs.js";
import staffRoutes from "./routes/staff.js";

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
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
app.use("/", indexRoutes);
app.use("/:orgId/clients", clientsRoutes);
app.use("/:orgId/jobs", jobsRoutes);
app.use("/:orgId/staff", staffRoutes);

console.log("App routes initialised");

process.on("unhandledRejection", (err) => {
	console.error(err);
	process.exit(1);
});

app.listen(process.env.PORT, process.env.IP, () =>
	console.log("hah-data running on port " + process.env.PORT)
);
