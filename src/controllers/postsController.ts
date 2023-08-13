import { ICreatePost } from "../models/Posts";
import PostsService from "../services/postsService";
import { TableResponseNoData } from "../utils/constant";
import { ApiStatus, ApiStatusCode, TableType } from "../utils/enum";
import validateReqBody from "../utils/requestbody";
import { Role, TemplateType } from './../utils/enum';
import { ReqBody } from './../utils/requestbody';


export default class PostsController {

  //GET
  public static getAllPost = async (req, res, next) => {
    try {
      validateReqBody(req, ReqBody.getTableValues, next);
      let data;
      switch (req.body.tableType) {
        case TableType.postsApproved:
          data = await PostsService.getAll(req.body.page, req.body.pageSize, req.body.searchKey, true);
          break;
        case TableType.postsWait:
          data = await PostsService.getAll(req.body.page, req.body.pageSize, req.body.searchKey, false);
          break;
        default:
          data = TableResponseNoData;
      }
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: data
      })
    } catch (error) {
      next(error)
    }
  }

  //POST
  public static createPost = async (req, res, next) => {
    try {
      validateReqBody(req, ReqBody.createPostService, next);
      const { userId, role } = req.user;
      const newPost: ICreatePost = {
        title: req.body.title,
        image: "",
        content: req.body.content,
        author: userId,
        date: new Date,
        approve: role === Role.doctor ? false : true,
        template: TemplateType.template1,
      }
      await PostsService.create(newPost);
      res.status(ApiStatusCode.OK).json({
        status: ApiStatus.succes,
        data: "them moi thanh cong"
      })
    } catch (error) {
      next(error)
    }
  }

  //PUT
  // public static editPost = async (req, res, next) => {

  // }

  //PUT
  public static approve = async (req, res, next) => {

  }

  //PUT
  public static delete = async (req, res, next) => {

  }
}