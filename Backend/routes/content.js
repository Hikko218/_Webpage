// /routes/content.js
const express = require('express');
const router = express.Router();

// Middleware to check if the user is an admin
const isAdmin = require('../middleware/isAdmin');

// Import Content Routes
const homeContent = require('../models/homeSchema');
const aboutContent = require('../models/aboutSchema');
const projectContent = require('../models/projectsSchema');
const reviewContent = require('../models/reviewSchema');
const contactContent = require('../models/contactSchema');
const upload = require('../middleware/upload');

// Home Content Routes
router.get('/home', async (req, res) => {
  const content = await homeContent.find();
  res.json(content);
});

router.put('/home', isAdmin, async (req, res) => {
  const updated = await homeContent.findByIdAndUpdate('home', req.body, { new: true });
  res.json(updated);
});

// About Content Routes
router.get('/about', async (req, res) => {
  const content = await aboutContent.find();
  res.json(content);
});

router.put('/about/:id', isAdmin, async (req, res) => {
  const updated = await aboutContent.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.post('/about/skill', isAdmin, upload.single('icon'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const iconPath = req.file ? `/uploads/${req.file.filename}` : '';

    let content = await aboutContent.findOne();

    if (!content) {
      content = new aboutContent({
        heading: 'About Me',
        text: 'Beschreibung...',
        image: '',
        skills: []
      });
    }

    content.skills.push({ title, description, icon: iconPath });

    await content.save();

    res.json({ message: 'Skill added', skill: content.skills.at(-1) });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// Projects Content Routes
router.get('/projects', async (req, res) => {
  const content = await projectContent.find();
  res.json(content);
});

router.put('/projects/:id', isAdmin, async (req, res) => {
  const updated = await projectContent.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.post('/projects', isAdmin, async (req, res) => {
  try {
    const { title, features } = req.body;
    const newProject = new projectContent({title, features});
    await newProject.save();
    console.log('New project added:', newProject);
    res.status(201).json({message:"New project added",newProject});
  } catch (err) {
    res.status(400).json({ message: 'Error saving project', error: err.message });
  }
});


// Reviews Content Routes
router.get('/reviews', async (req, res) => {
  const content = await reviewContent.find();
  res.json(content);
});

router.delete('/reviews/:id', isAdmin, async (req, res) => {
  try {
    const deletedReview = await reviewContent.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully', review: deletedReview });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review', error: err.message });
  }
});

router.post('/reviews', async (req, res) => {
  try { 
  const newReview = new reviewContent(req.body);
  await newReview.save();
  res.status(201).json(newReview);
} catch (err) {
  res.status(400).json({ message: 'Error saving review', error: err.message });
}
});

// Contact Content Routes

router.get('/contact', isAdmin, async (req, res) => {
  const content = await contactContent.find();
  res.json(content);
});

router.post('/contact', async (req, res) => {
  try { 
  const newContact = new contactContent(req.body);
  await newContact.save();
  res.status(201).json(newContact);
} catch (err) {
  res.status(400).json({ message: 'Error saving contact', error: err.message });
};
});

module.exports = router;
