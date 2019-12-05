const logger = require("./logger")("app");
const express = require("express");
const cors = require("cors");
const dao = require("./dao");

const app = express();
app.use(cors());
app.listen(3000, () => {
    logger.log("Server running on port 3000");
});

app.get('/users/:name', async function (req, res) {
    let user = await dao.getUser(req.params.name);
    if (user.toString() === '') {
        logger.error('cant find any user');
        res.status(404).send('cant find any user');
    } else {
        res.status(200).send(user);
    }
});

app.get('/addtask/:name/:taskname/:taskdate', async function (req, res) {
    logger.log('adding new task to user %s - %s (%s)', req.params.name, req.params.taskname, req.params.taskdate);
    let effect = 0;

    try {
        effect = await dao.addTaskToUser(req.params.name, req.params.taskname, req.params.taskdate);
    } catch (e) {
        logger.error(e.stack || e);
    }

    if (effect === 0) {
        logger.error('cant find any user/update');
        res.status(500).send('cant add task');
    } else {
        res.status(200).send(effect.toString());
    }
});