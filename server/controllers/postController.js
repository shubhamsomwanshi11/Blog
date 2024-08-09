const Post = require('../models/postModel')
const User = require('../models/userModel')
const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')
const HttpError = require('../models/errorModel')


// CreatePost
// POST : api/posts/create
const createPost = async (req, res, next) => {
    try {
        const { title, category, description } = req.body;
        if (!title || !category || !description) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        if (!req.files || !req.files.thumbnail) {
            return next(new HttpError("Thumbnail file is required.", 422));
        }

        const { thumbnail } = req.files;

        if (thumbnail.size > 2000000) {
            return next(new HttpError("Thumbnail file should be less than 2MB.", 422));
        }

        // Convert thumbnail image to base64
        const imageBuffer = thumbnail.data.toString('base64');
        const base64Thumbnail = `data:${thumbnail.mimetype};base64,${imageBuffer}`;

        try {
            const newPost = await Post.create({
                title,
                category,
                description,
                thumbnail: base64Thumbnail, // Store thumbnail in base64 format
                creator: req.user.id
            });

            if (!newPost) {
                return next(new HttpError("Post couldn't be created.", 422));
            }

            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser.posts + 1;
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

            res.status(201).json("New post published successfully.");
        } catch (error) {
            return next(new HttpError("Creating post failed, please try again.", 500));
        }
    } catch (error) {
        return next(new HttpError("An error occurred. Please try again.", 500));
    }
}


// Get single post
// GET : api/posts/:id
const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return next(new HttpError("Post not found", 404));
        }

        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError("Fetching post failed, please try again later", 500));
    }
}


// Get all posts
// GET : api/posts
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updateAt: -1 })
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }
}


// Get post by Category
// GET : api/posts/categoris/:category
const getCatPosts = async (req, res, next) => {
    try {
        const category = req.params.category;
        const posts = await Post.find({ category: category });

        if (!posts || posts.length === 0) {
            return next(new HttpError("No posts found for this category", 404));
        }

        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError("Fetching posts failed, please try again later", 500));
    }
}


// Get posts by author
// GET : api/posts/users/:id
const getUsersPosts = async (req, res, next) => {
    try {
        const { id } = req.params; // Extracting the user ID from the URL parameters
        const posts = await Post.find({ creator: id }); // Finding posts with the creator ID

        if (!posts || posts.length === 0) {
            return next(new HttpError("No posts found from this user", 404));
        }

        res.status(200).json(posts); // Returning the found posts
    } catch (error) {
        return next(new HttpError("Fetching posts failed, please try again later", 500));
    }
}



// Update post
// PATCH : api/posts/update/:id
const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, category, description } = req.body;
        const thumbnail = req.files?.thumbnail;

        if (!id || !title || !description || !category)
            return next(new HttpError("Fill in all fields."));

        // Find the post by ID
        const post = await Post.findById(id);
        if (!post) {
            return next(new HttpError("Post not found", 404));
        }

        // Handle thumbnail update
        if (thumbnail) {
            if (thumbnail.size > 500000) {
                return next(new HttpError("Thumbnail size should be less than 500KB.", 422));
            }

            // Convert thumbnail image to base64
            const imageBuffer = thumbnail.data.toString('base64');
            const base64Thumbnail = `data:${thumbnail.mimetype};base64,${imageBuffer}`;

            post.thumbnail = base64Thumbnail; // Store thumbnail in base64 format
        }

        // Update post fields
        post.title = title;
        post.category = category;
        post.description = description;

        // Save updated post
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError("Updating post failed, please try again later", 500));
    }
};


// Delete post
// DELETE : api/posts/delete/:id
const deletePost = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Find the post by ID
        const post = await Post.findById(id);
        if (!post) {
            return next(new HttpError("Post not found", 404));
        }
        
        const currentUser = await User.findById(req.user.id);
        const userPostCount = currentUser.posts - 1;
        await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
        return next(new HttpError(error));
    }
};



module.exports = { createPost, getPost, getPosts, getCatPosts, getUsersPosts, updatePost, deletePost };
