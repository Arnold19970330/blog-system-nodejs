const Post = require('../models/Post');

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

// Controller függvény az összes poszt lekérésére
exports.getAllPosts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.author) {
            filter.author = req.query.author;
        }

        const posts = await Post.find(filter)
            .select('title content createdAt author categories')
            .populate('author', 'name')
            .populate('categories', 'name')
            .sort({ createdAt: -1 });

        const lightweightPosts = posts.map((post) => {
            const obj = post.toObject();
            const plainContent = stripHtml(obj.content || '');
            const excerpt = plainContent.slice(0, 220);
            return {
                ...obj,
                content: excerpt.length < plainContent.length ? `${excerpt}...` : excerpt
            };
        });

        res.status(200).json({
            status: 'success',
            results: lightweightPosts.length,
            data: { posts: lightweightPosts }
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
        const payload = {
            title: req.body.title,
            content: req.body.content,
            image: req.body.image || '',
            categories: req.body.categories || [],
            author: req.user.id
        };

        const newPost = await Post.create(payload);

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

// poszt szerkesztese (csak sajat poszt)
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                status: 'fail',
                message: 'Nincs ilyen poszt.'
            });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                status: 'fail',
                message: 'Csak a saját posztodat szerkesztheted.'
            });
        }

        const allowedUpdates = {
            title: req.body.title,
            content: req.body.content,
            image: req.body.image,
            categories: req.body.categories
        };

        Object.keys(allowedUpdates).forEach((key) => {
            if (allowedUpdates[key] === undefined) {
                delete allowedUpdates[key];
            }
        });

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, allowedUpdates, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: { post: updatedPost }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

//post torlese

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                status: 'fail',
                message: 'Nincs ilyen ID-jű poszt, nem tudom törölni!'
            });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                status: 'fail',
                message: 'Csak a saját posztodat törölheted.'
            });
        }

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