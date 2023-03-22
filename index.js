const express = require("express");
const app = express();
const port = 8000;

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
