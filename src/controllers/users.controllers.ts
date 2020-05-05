import express from "express";
import { UsersDbService } from "../database/users/User.dbservice";
import { User } from "../database/users/User.dbmodel";
const router = express.Router();

const usersDbService: UsersDbService = new UsersDbService();

// Get all users
router.get('/', async (req, res, next) => {
    const userModels: User[] = await usersDbService.selectAll();
    const jsonUserModels: string = JSON.stringify(userModels.map((value) => value.convertToClientModel()));
    res.send(jsonUserModels);
});

router.get('/:userId', async (req, res, next) => {
    const userModel: User = await usersDbService.selectOneRowById(req.params.userId);
    const jsonUserModel: string = JSON.stringify(userModel.convertToClientModel());
    res.send(jsonUserModel);
});

export { router }