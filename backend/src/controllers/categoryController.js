const Category = require('../models/Category');
const { DEFAULT_CATEGORIES } = require('../constants/defaultCategories');

const ensureDefaultCategories = async () => {
  const existing = await Category.find(
    { name: { $in: DEFAULT_CATEGORIES.map((category) => category.name) } },
    { name: 1 }
  );

  const existingNames = new Set(existing.map((category) => category.name));
  const missingDefaults = DEFAULT_CATEGORIES.filter((category) => !existingNames.has(category.name));

  if (missingDefaults.length > 0) {
    await Category.insertMany(missingDefaults);
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    await ensureDefaultCategories();
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: { categories }
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create({
      name: req.body.name,
      description: req.body.description || ''
    });

    res.status(201).json({
      status: 'success',
      data: { category: newCategory }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
