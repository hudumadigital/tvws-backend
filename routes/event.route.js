const route = require("express").Router();
const isAuth = require("../middlewares/auth.middleware");

const eventController = require("../controllers/events.controller");

route.post("/report-event", isAuth, eventController.reportEvent);

route.get("/reports", eventController.getReports);


module.exports = route;