import express from "express";
import { UsersDbService } from "../database/users/User.dbservice";
import { User } from "../database/users/User.dbmodel";
const router = express.Router();

const usersDbService: UsersDbService = new UsersDbService();

// Get all users
router.get('/', async (req, res, next) => {
    console.log("Getting all users");
    const userModels: User[] = await usersDbService.selectAll();
    res.send(userModels);
});

router.get('/:publicAddress', async (req, res, next) => {
    console.log("Got into users GET for single address");
    const userModel: User = await usersDbService.selectOneRowByPrimaryId(req.params.publicAddress);
    res.send([userModel]);
});

export { router }