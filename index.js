const express = require("express");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo")(session);
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMiddleware = require("./config/middleware");

app.use(
    sassMiddleware({
        src: "./assets/scss",
        dest: "./assets/css",
        debug: false,
        outputStyle: "extended",
        prefix: "/css",
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// use set static folder
app.use(express.static("./assets"));
// use express layouts
app.use(expressLayouts);
//  extract styles and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
// set ejs as the view_engine
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(
    session({
        name: "SPS",
        // TODO change the secret before deployment in production
        secret: "secret123",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 100,
        },
        store: new MongoStore(
            {
                mongooseConnection: db,
                autoRemove: "disable",
            },
            (err) => {
                console.log(err || "connect-mongodb setip ok");
            }
        ),
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMiddleware.setFlash);
// use express router
app.use("/", require("./routes"));

app.listen(port, (err) => {
    if (err) {
        console.log(`Error in running the server on the port: ${port}`);
        return;
    }
    console.log(`Server running on the port: ${port}`);
});
