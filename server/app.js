var express = require("express");
var app = express();
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

app.use("/", express.static("server/dist"));
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
    
    // TODO: get these values from the request body...
    var firstName = "";
    var lastName = "";
    var email = "";
    
    var item = {
        id: nextId++,
        firstName: firstName,
        lastName: lastName,
        email: email
    };
    
    nameList.push(item);
    
    sendJsonResponse(res, 201, item);   
}

function handleApiUpdate(req, res, _) {
    var id = req.params.id;
    var item = nameListFind(id);
    if (item) {
        
        // TODO: get these values from the request body...
        var firstName = "";
        var lastName = "";
        var email = "";
        
        item.firstName = firstName;
        item.lastName = lastName;
        item.email = email;
        
        sendJsonResponse(res, 200, item);
        return;   
    }
    sendJsonResponse(res, 404);
}

function handleApiDelete(req, res, _) {
    var id = req.params.id;
    var index = nameListFindIndex(id);
    if (index >= 0) {
        nameList.splice(index, 1);
        sendJsonResponse(res, 200);   
        return;   
    }
    sendJsonResponse(res, 404);
}

function sendJsonResponse(res, status, content) {
    res.status(status);
    if (content) {
        res.json(content);
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
