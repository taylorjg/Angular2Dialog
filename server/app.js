var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var port = process.env.PORT || 3000;

var nameList = [
    { id: 23, firstName: "F1", lastName: "L1", email: "f1.l1@gmail.com" },
    { id: 24, firstName: "F2", lastName: "L2", email: "f2.l2@gmail.com" },
    { id: 25, firstName: "F3", lastName: "L3", email: "f3.l3@gmail.com" },
    { id: 26, firstName: "F4", lastName: "L4", email: "f4.l4@gmail.com" }
];

var nextId = 27; 

var apiRouter = express.Router();
apiRouter.get('/', handleApiReadAll);
apiRouter.get('/:id', handleApiReadOne);
apiRouter.post('/', handleApiCreate);
apiRouter.put('/:id', handleApiUpdate);
apiRouter.delete('/:id', handleApiDelete);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", express.static("server/public"));
app.use('/api', apiRouter);

app.listen(port, function () {
    console.log("Listening on port %d", port);
});

function handleApiReadAll(req, res, _) {
    sendJsonResponse(res, 200, nameList);   
}

function handleApiReadOne(req, res, _) {
    var id = Number(req.params.id);
    var item = nameListFind(id);
    if (item) {
        sendJsonResponse(res, 200, item);
        return;   
    }
    sendJsonResponse(res, 404)   
}

function handleApiCreate(req, res, _) {
    var item = {
        id: nextId++,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };
    nameList.push(item);
    sendJsonResponse(res, 201, item);   
}

function handleApiUpdate(req, res, _) {
    var id = Number(req.params.id);
    var item = nameListFind(id);
    if (item) {
        item.firstName = req.body.firstName;
        item.lastName = req.body.lastName;
        item.email = req.body.email;
        sendJsonResponse(res, 200, item);
        return;   
    }
    sendJsonResponse(res, 404);
}

function handleApiDelete(req, res, _) {
    var id = Number(req.params.id);
    var index = nameListFindIndex(id);
    if (index >= 0) {
        nameList.splice(index, 1);
        sendJsonResponse(res, 200);   
        return;   
    }
    sendJsonResponse(res, 404);
}

function sendJsonResponse(res, status, content) {
    if (content) {
        res.status(status);
        res.json(content);
    }
    else {
        res.sendStatus(status);
        res.end();
    }
}

function nameListFind(id) {
    for (var i = 0; i < nameList.length; i++) {
        var item = nameList[i];
        if (item.id === id) return item;
    }
    return null;
}

function nameListFindIndex(id) {
    for (var i = 0; i < nameList.length; i++) {
        var item = nameList[i];
        if (item.id === id) return i;
    }
    return -1;
}
