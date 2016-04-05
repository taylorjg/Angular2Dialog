var express = require("express");
var app = express();
var router = express.Router();
var port = process.env.PORT || 3000;
var nameList = [
    { id: 23, firstName: "F1", lastName: "L1", email: "f1.l1@gmail.com" },
    { id: 24, firstName: "F2", lastName: "L2", email: "f2.l2@gmail.com" },
    { id: 25, firstName: "F3", lastName: "L3", email: "f3.l3@gmail.com" }
]; 

app.use("/", express.static("server/dist"));
app.use('/api', router);

router.get('/', function(req, res) {
    res.json(nameList);   
});

app.listen(port, function () {
    console.log("Listening on port %d", port);
});
