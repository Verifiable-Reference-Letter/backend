import express from "express";
import { UserDbService } from "../database/users/User.dbservice";
import { User } from "../database/users/User.dbmodel";
const router = express.Router();

const usersDbService: UserDbService = new UserDbService();

/**
 * get all users (basic info)
 */
router.get('/', async (req, res, next) => {
    console.log("Getting all users");
    const userModels: User[] = await usersDbService.selectAll();
    res.send(userModels);
});

/**
 * get user profile
 * TODO: not yet implemented to get profile
 */
router.get('/:publicAddress/profile', async (req, res, next) => {
    console.log("Got into users GET for single address");
    const userModel: User = await usersDbService.selectOneRowByPrimaryId(req.params.publicAddress);
    res.send([userModel]);
});

export { router }