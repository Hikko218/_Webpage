// /routes/content.js
const express = require('express');
const router = express.Router();
const fs   = require('fs/promises');      // <-- async/await
const path = require('path');
const debug = require('debug')('app:content');
const { body, validationResult } = require('express-validator');

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
// Get Home Content
router.get('/home', async (req, res) => {
  try {
    const content = await homeContent.find();
    debug('GET /home – found %d item(s)', content.length);
    res.json(content);
  } catch (err) {
    debug('GET /home error: %O', err);
    res.status(500).json({ message: 'DB error' });
  }
});

// Update Home Content (admin only)
router.put('/home', isAdmin, async (req, res) => {
  try {
    const updated = await homeContent.findByIdAndUpdate('home', req.body, { new: true });
    debug('PUT /home – updated');
    res.json(updated);
  } catch (err) {
    debug('PUT /home error: %O', err);
    res.status(500).json({ message: 'Update error' });
  }
});

// About Content Routes
// Get About Content
router.get('/about', async (req, res) => {
  try {
    const content = await aboutContent.find();
    debug('GET /about – %d item(s)', content.length);
    res.json(content);
  } catch (err) {
    debug('GET /about error: %O', err);
    res.status(500).json({ message: 'DB error' });
  }
});

// Update About Content (admin only)
router.put('/about', isAdmin, async (req, res) => {
  try {
    const about = await aboutContent.findOne();
    if (!about) {
      debug('No about content found');
      return res.status(404).json({ message: 'About content not found' });
    }

    about.heading = req.body.heading;
    about.text = req.body.text;

    const updated = await about.save(); 
    res.json(updated);
    
  } catch (err) {
    debug('Error updating about content:', err);
    res.status(500).json({ message: 'Error updating about content' });
  }
});

// Post About Content Skills (admin only)
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
    debug('Error adding skill:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// Delete About Content Skills (admin only)
router.delete('/about/skills/:id', isAdmin, async (req, res) => {
  try {
    const content = await aboutContent.findOne();
    if (!content) {
      debug('No about content found');
      return res.status(404).json({ message: 'About content not found' });
    }

    const skillIndex = content.skills.findIndex(skill => skill._id.toString() === req.params.id);
    if (skillIndex === -1) {
      debug('Skill not found:', req.params.id);
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
        debug('Error deleting icon:', err);
        console.warn('Could not delelte icon', err.message);
      }
    }
    content.skills.splice(skillIndex, 1);
    await content.save();

    res.json({ message: 'Skill deleted successfully', skills: content.skills });
    } catch (err) {
    debug('Error deleting skill:', err);
    res.status(500).json({ message: 'Error deleting skill', error: err.message });
  }
});

// Update About Content Skills (admin only)
router.put('/about/skills/:id', isAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const content = await aboutContent.findOne();
    if (!content) {
      debug('No about content found');
      return res.status(404).json({ message: 'About content not found' });
    }
    const skill = content.skills.id(req.params.id);
    if (!skill) {
      debug('Skill not found:', req.params.id);
      return res.status(404).json({ message: 'Skill not found' });
    }
    skill.title = title;
    skill.description = description;
    await content.save();
    res.json({ message: 'Skill updated successfully', skill });
  } catch (err) {
    debug('Error updating skill:', err);
    res.status(500).json({ message: 'Error updating skill', error: err.message
    });
  }
});

// Projects Content Routes
// Get all projects
router.get('/projects', async (req, res) => {
  try {
  const content = await projectContent.find();
  res.json(content);
  } catch (err) {
    debug('GET /projects error: %O', err);
    res.status(500).json({ message: 'DB error' });
  }
});

// Update a project (admin only)
router.put('/projects/:id', isAdmin, async (req, res) => {
  try {
  const updated = await projectContent.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
  } catch (err) {
    debug('PUT /projects error: %O', err);
    res.status(500).json({ message: 'Update error' });
  }
});

// Delete a project (admin only)
router.delete('/projects/:id', isAdmin, async (req, res) => {
  try {
    const deletedProject = await projectContent.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      debug('Project not found:', req.params.id);
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully', project: deletedProject });
  } catch (err) {
    debug('Error deleting project:', err);
    res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
});

// Add a new project (admin only)
router.post('/projects', isAdmin, async (req, res) => {
  try {
    const { title, features } = req.body;
    const newProject = new projectContent({title, features});
    await newProject.save();
    console.log('New project added:', newProject);
    res.status(201).json({message:"New project added",newProject});
  } catch (err) {
    debug('Error saving project:', err);
    res.status(400).json({ message: 'Error saving project', error: err.message });
  }
});


// Reviews Content Routes
// Get all reviews
router.get('/reviews', async (req, res) => {
  try {
  const content = await reviewContent.find();
  res.json(content);
  } catch (err) {
    debug('GET /reviews error: %O', err);
    res.status(500).json({ message: 'DB error' });
  }
});

// Delete a review (admin only)
router.delete('/reviews/:id', isAdmin, async (req, res) => {
  try {
    const deletedReview = await reviewContent.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      debug('Review not found:', req.params.id);
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully', review: deletedReview });
  } catch (err) {
    debug('Error deleting review:', err);
    res.status(500).json({ message: 'Error deleting review', error: err.message });
  }
});

// Add a new review
router.post('/reviews', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email is required'),
  body('text').trim().notEmpty().withMessage('Message is required'),
  body('text').isLength({ max: 300 }).withMessage('Max. 300 characters'),
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try { 
  const newReview = new reviewContent(req.body);
  await newReview.save();
  res.status(201).json(newReview);
} catch (err) {
  debug('Error saving review:', err);
  res.status(400).json({ message: 'Error saving review', error: err.message });
}
});

// Contact Content Routes
// Get all contact messages (admin only)
router.get('/contact', isAdmin, async (req, res) => {
  try {
  const content = await contactContent.find();
  res.json(content);
  } catch (err) {
    debug('GET /contact error: %O', err);
    res.status(500).json({ message: 'DB error' });
  }
});

// Post a new contact message
router.post('/contact', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try { 
  const newContact = new contactContent(req.body);
  await newContact.save();
  res.status(201).json(newContact);
} catch (err) {
  debug('Error saving contact:', err);
  res.status(400).json({ message: 'Error saving contact', error: err.message });
};
});

// Delete a contact message (admin only)
router.delete('/contact/:id', isAdmin, async (req, res) => {
  try {
    const deletedContact = await contactContent.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.json({ message: 'Contact message deleted successfully', contact: deletedContact });
  } catch (err) {
    debug('Error deleting contact message:', err);
    res.status(500).json({ message: 'Error deleting contact message', error: err.message });
  }
});

module.exports = router;
