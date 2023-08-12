import { Router } from "express";
import Middlewares from "../middlewares";
import { Role } from "../utils/enum";
import PostsController from "../controllers/postsController";

const postsRoute = Router();

postsRoute.route('/').post(Middlewares.verifyToken, Middlewares.permission([Role.admin, Role.doctor]), PostsController.createPost);
// postsRoute.route('/').put(Middlewares.verifyToken, Middlewares.permission([Role.admin, Role.doctor]), PostsController.editPost);
postsRoute.route('/approve').put(Middlewares.verifyToken, Middlewares.permission([Role.admin]), PostsController.approve);
postsRoute.route('/delete').put(Middlewares.verifyToken, Middlewares.permission([Role.admin]), PostsController.delete);

export default postsRoute;