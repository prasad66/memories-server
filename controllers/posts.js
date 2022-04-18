import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

// 
export const getPosts = async (req, res) => {

    const { page } = req.query;

    try {

        const LIMIT = 8;

        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
};

export const getPost = async (req, res) => {

    const { id } = req.params;

    try {

        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
};


// 
export const getPostsBySearch = async (req, res) => {

    const { searchQuery, tags } = req.query;

    try {

        const title = new RegExp(searchQuery, "i"); // i = case insensitive
        const tagsArray = tags.split(",");

        const posts = await PostMessage.find({
            $or: [
                { title }, { tags: { $in: tagsArray } }
            ]
        });

        res.status(200).json({ data: posts });

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

// 
export const createPost = async (req, res) => {
    const post = req.body;

    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(409).json({ message: err.message });
    }
};

// 
export const updatePost = async (req, res) => {
    const { id: _id } = req.params;

    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) { return res.status(404).send('no posts with that ID'); }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });

    res.status(200).json(updatedPost);
};

// 
export const deletePost = async (req, res) => {
    const { id: _id } = req.params;

    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) { return res.status(404).send('no posts with that ID'); }

    await PostMessage.findByIdAndRemove(_id);

    res.status(200).json({ messgae: 'post deleted successfully' });
};


//
export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.status(401).send('Unauthenticated');

    if (!mongoose.Types.ObjectId.isValid(id)) { return res.status(404).send('no posts with that ID'); }

    const post = await PostMessage.findById(id);

    const index = post.likeCount.findIndex(id => id === String(req.userId));

    if (index === -1) {
        post.likeCount.push(req.userId);
    } else {
        post.likeCount = post.likeCount.filter(id => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
};


export const commentPost = async (req, res) => {
    const { id } = req.params;

    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
};