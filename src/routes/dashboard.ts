import * as express from "express";
import moment from "moment";
import AccountController from "../controllers/AccountController";

const dashboard = express.Router();

const accountController = new AccountController();

dashboard.get('/accounts/months', async (req, res) => {
    console.log('!!!GET - AccountController!!!')
    const result: object = await accountController.getData();
    res.json(result);
});

dashboard.get('/accounts/months/:month', async (req, res) => {
    const result: object = await accountController.getDataMonth(req.params.month);
    res.json(result);
});


export default dashboard;