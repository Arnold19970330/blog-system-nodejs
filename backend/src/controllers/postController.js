const Post = require('../models/Post');

// Controller függvény az összes poszt lekérésére
exports.getAllPosts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.author) {
            filter.author = req.query.author;
        }

        const posts = await Post.find(filter)
            .populate('author', 'name email')
            .populate('categories', 'name description')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: posts.length,
            data: { posts }
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// Egy konkrét poszt lekérése ID alapján
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email')
            .populate('categories', 'name description');

        if (!post) {
            return res.status(404).json({ status: 'fail', message: 'Hoppá, ez a poszt nem létezik!' });
        }

        res.status(200).json({
            status: 'success',
            data: { post }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Uj post letrehozasa

exports.createPost = async (req, res) =>  {
    try {
        const newPost = await Post.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                post: newPost
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

//post torlese

exports.deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            return res.status(404).json({
                status: 'fail',
                message: 'Nincs ilyen ID-jű poszt, nem tudom törölni!'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'A poszt sikeresen törölve.'
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};