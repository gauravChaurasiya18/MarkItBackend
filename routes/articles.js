import express from "express";
import Article from "../models/Article.js";
import auth from "../middleware/auth.js";
import sanitizeHtml from "sanitize-html";

const router = express.Router();

const sanitizeOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    "h1",
    "h2",
    "h3",
    "pre",
    "code",
    "span",
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    "*": ["style", "class"],
    code: ["class"],
    pre: ["class"],
    span: ["class", "style"],
  },
  allowedStyles: {
    "*": {
      color: [
        /^#(0x)?[0-9a-f]+$/i,
        /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
      ],
      "font-family": [/.*/],
      "font-size": [/.*/],
      "font-weight": [/.*/],
      "text-align": [/.*/],
      "text-decoration": [/.*/],
      "background-color": [/.*/],
    },
  },
};

/**
 * @route  GET /api/articles
 * @desc   Get all articles with optional search and sorting
 * @access Private
 */
router.get("/", auth, async (req, res) => {
  try {
    const { sort, page, search } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    let sortCriteria = { createdAt: -1 };
    if (sort === "most-upvotes") {
      sortCriteria = { upvotes: -1 };
    }

    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;
    const articles = await Article.find(query)
      .populate("author", "name")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @route  GET /api/articles/:id
 * @desc   Get a single article by ID
 * @access Private
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate(
      "author",
      "name"
    );
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @route  POST /api/articles
 * @desc   Create a new article
 * @access Private
 */
router.post("/", auth, async (req, res) => {
  try {
    const sanitizedContent = sanitizeHtml(req.body.content, sanitizeOptions);

    const article = new Article({
      ...req.body,
      content: sanitizedContent,
      author: req.user.userId,
    });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json(err);
  }
});

/**
 * @route  DELETE /api/articles/:id
 * @desc   Delete an article by ID
 * @access Private
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route  PUT /api/articles/:id
 * @desc   Update an article by ID
 * @access Private
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const sanitizedContent = sanitizeHtml(req.body.content, sanitizeOptions);

    article.title = req.body.title || article.title;
    article.content = sanitizedContent || article.content;
    article.tags = req.body.tags || article.tags;

    await article.save();
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route  PUT /api/articles/:id/upvote
 * @desc   Upvote an article by ID
 * @access Private
 */
router.put("/:id/upvote", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    if (article.upvotedBy.includes(req.user.userId)) {
      return res.status(400).json({ message: "Article already upvoted" });
    }

    article.upvotedBy.push(req.user.userId);
    article.upvotes++;
    await article.save();
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route PUT /api/articles/:id/downvote
 * @desc Downvote an article by ID
 * @access Private
 */
router.put("/:id/downvote", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    if (!article.upvotedBy.includes(req.user.userId)) {
      return res.status(400).json({ message: "Article not upvoted" });
    }

    article.upvotedBy = article.upvotedBy.filter(
      (userId) => userId !== req.user.userId
    );
    article.upvotes--;
    await article.save();
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
})

export default router;
