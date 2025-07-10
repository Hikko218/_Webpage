// /routes/content.js
const express = require('express');
const router = express.Router();
const fs   = require('fs/promises');      // <-- async/await
const path = require('path');

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

router.put('/about', isAdmin, async (req, res) => {
  try {
    const about = await aboutContent.findOne();
    if (!about) {
      console.error('No about content found');
      return res.status(404).json({ message: 'About content not found' });
    }

    about.heading = req.body.heading;
    about.text = req.body.text;

    const updated = await about.save(); 
    res.json(updated);
    
  } catch (err) {
    console.error('Error updating about content:', err);
    res.status(500).json({ message: 'Error updating about content' });
  }
});

router.post('/about/skills', isAdmin, upload.single('icon'), async (req, res) => {
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

router.delete('/about/skills/:id', isAdmin, async (req, res) => {
  try {
    const content = await aboutContent.findOne();
    if (!content) {
      return res.status(404).json({ message: 'About content not found' });
    }

    const skillIndex = content.skills.findIndex(skill => skill._id.toString() === req.params.id);
    if (skillIndex === -1) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Icon path deletion
    const iconPath = content.skills[skillIndex].icon;
    if (iconPath) {
      const fullPath = path.join(__dirname, '..', 'public', iconPath.replace(/^\/+/, ''));
      try {
        await fs.unlink(fullPath);
        console.log('Icon deleted', fullPath);
      } catch (err) {
        console.warn('Could not delelte icon', err.message);
      }
    }
    content.skills.splice(skillIndex, 1);
    await content.save();

    res.json({ message: 'Skill deleted successfully', skills: content.skills });
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting skill', error: err.message });
  }
});

router.put('/about/skills/:id', isAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const content = await aboutContent.findOne();
    if (!content) {
      return res.status(404).json({ message: 'About content not found' });
    }
    const skill = content.skills.id(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    skill.title = title;
    skill.description = description;
    await content.save();
    res.json({ message: 'Skill updated successfully', skill });
  } catch (err) {
    res.status(500).json({ message: 'Error updating skill', error: err.message
    });
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

// Delete a project
router.delete('/projects/:id', isAdmin, async (req, res) => {
  try {
    const deletedProject = await projectContent.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully', project: deletedProject });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
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
