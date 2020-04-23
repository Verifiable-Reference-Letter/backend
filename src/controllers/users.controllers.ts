import express from "express";
import { UsersDbService } from "../database/users/users.dbservice";
import { User } from "../database/users/users.dbmodel";
const router = express.Router();

const usersDbService: UsersDbService = new UsersDbService();

// Get all users
router.get('/', async (req, res, next) => {
    const userModels: User[] = await usersDbService.selectAll();
    const jsonUserModels: string = JSON.stringify(userModels.map((value) => value.convertToClientModel()));
    res.send(jsonUserModels);
});

export { router };