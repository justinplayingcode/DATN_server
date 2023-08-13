import { ICreatePost } from "../models/Posts";
import Post from "../schema/Post";

export default class PostsService {
    public static getAll = async (page, pageSize, searchKey, approved) => {
        const values = await Post
            .find({ approve: approved, title: { $regex: searchKey, $options: "i" } }, { __v: 0 })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();

        const totals = await Post
            .find({ approve: approved, title: { $regex: searchKey, $options: "i" } }, { __v: 0 })
            .lean();

        return {
            values,
            total: totals.length
        }
    }

    public static create = async (obj: ICreatePost) => {
        return await Post.create(obj);
    }
}