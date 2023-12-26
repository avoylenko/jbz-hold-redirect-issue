const express = require('express');
const app = express();

const port = process.env.HTTP_PORT || 1880;
const routes = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', routes);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({msg: err.message});
});

app.listen(port, () => {
    console.log(`jambonz demo app listening at http://localhost:${port}`);
});