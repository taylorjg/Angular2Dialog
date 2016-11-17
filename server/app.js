const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const nameListService = require('./nameListService');

const apiRouter = express.Router();
apiRouter.post('/', nameListService.createItem);
apiRouter.get('/', nameListService.readAllItems);
apiRouter.get('/:id', nameListService.readItem);
apiRouter.post('/:id', nameListService.updateItem);
apiRouter.delete('/:id', nameListService.deleteItem);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TODO: use __dirname__ ?
app.use('/', express.static('server/public'));
app.use('/api', apiRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));
