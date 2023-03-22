const express = require("express");
const app = express();
const port = 8000;

app.listen(port, (err) => {
    if (err) {
        console.log(`Error in running the server on the port: ${port}`);
        return;
    }
    console.log(`Server running on the port: ${port}`);
});
