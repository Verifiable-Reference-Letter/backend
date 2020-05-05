import express from "express";
import { UsersDbService } from "../database/users/User.dbservice";
import { User } from "../database/users/User.dbmodel";
const router = express.Router();

const usersDbService: UsersDbService = new UsersDbService();

// Get all users
router.get('/', async (req, res, next) => {
    const userModels: User[] = await usersDbService.selectAll();
    res.send(userModels);
});

router.get('/:userId', async (req, res, next) => {
    const userModel: User = await usersDbService.selectOneRowByPrimaryId(req.params.userId);
    res.send(userModel);
});

export { router }