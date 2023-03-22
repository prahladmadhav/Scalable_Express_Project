const express = require("express");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const cookieParser = require("cookie-parser");

app.use(express.urlencoded());
app.use(cookieParser());
// use set static folder
app.use(express.static("./assets"));
// use express layouts
app.use(expressLayouts);
//  extract styles and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
// use express router
app.use("/", require("./routes"));
// set ejs as the view_engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(port, (err) => {
    if (err) {
        console.log(`Error in running the server on the port: ${port}`);
        return;
    }
    console.log(`Server running on the port: ${port}`);
});
