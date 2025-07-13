// File: Frontend/scripts/adminEdit.js
// This script handles the admin editing functionality.

// Import necessary functions
import { showSection } from "./sectionManagment.js";

//Home Content Edit Functionality
async function changeHomeContent(event) {
  event.preventDefault();
    const heading = document.getElementById("edit-home-heading").value.trim();
    const text = document.getElementById("edit-home-text").value.trim();

    if (heading && text) {
      try {
        const response = await fetch("http://localhost:3000/api/content/home", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                heading,
                text,
            }),
            });
        if (response.ok) {
            // Refresh the home section to show updated content
            showSection('home');
            console.log("Home content updated successfully");
        } else {
            const error = await response.json();
            console.error("Error updating home content:", error.message);
        }
        } catch (err) {
            console.error("Network error:", err);
        }
    } else {
        console.log("Heading and text cannot be empty");
    }
}
// Add event listener to the home edit form
document.querySelector(".home-admin-edit").addEventListener("submit", changeHomeContent);

// Reviews delete functionality
async function deleteReview(event) {
  if (event.target.classList.contains("delete-review-btn")) {
    const reviewId = event.target.dataset.reviewId;
    try {
      const response = await fetch(`http://localhost:3000/api/content/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        console.log("Review deleted successfully");
        // Refresh the reviews section to show updated content
        showSection('reviews');
      } else {
        const error = await response.json();
        console.error("Error deleting review:", error.message);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  }
}

// Add event listener to the reviews section for delete buttons
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-review-btn')) {
    deleteReview(e);
  }
});

// Projects edit and delete functionality
document.addEventListener('click', async (e) => {
// Delete project functionality  
  if (e.target.classList.contains('delete-project-btn')) {

    const card = e.target.closest('.project-card');
    const id = card?.dataset.id;

    console.log("TARGET:", e.target);
    console.log("CARD:", card);
    console.log("ID:", id);

    const confirmed = confirm("Projekt wirklich löschen?");
    if (!confirmed) return;

    const res = await fetch(`http://localhost:3000/api/content/projects/${id}`, { 
      method: 'DELETE', 
      credentials: 'include',
    });
    if (res.ok) {
      card.remove(); 
    }
  }
// Edit project functionality
  if (e.target.classList.contains('edit-project-btn')) {
    const card = e.target.closest('.project-card');
    const id = card?.dataset.id;

  const newTitle = prompt("New Titel:");
  if (!newTitle) return;

  const newFeaturesRaw = prompt("New Features (comma separated):");
  if (newFeaturesRaw === null) return; 

  const newFeatures = newFeaturesRaw.split(',,').map(f => f.trim()).filter(Boolean);

  const res = await fetch(`http://localhost:3000/api/content/projects/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: newTitle,
      features: newFeatures
    })
  });

  if (res.ok) {
    // Change the title of the project card
    card.querySelector('h3').textContent = newTitle;

    // Change the features list
    const ul = card.querySelector('ul');
    ul.innerHTML = newFeatures.map(f => `<li>${f}</li>`).join('');
  }
}
// Add new project functionality
  if (e.target.classList.contains('add-project-btn')) {
    
  const newTitle = prompt("New Titel:");
  if (!newTitle) return;

  const newFeaturesRaw = prompt("New Features (comma separated):");
  if (newFeaturesRaw === null) return; 

  const newFeatures = newFeaturesRaw.split(',,').map(f => f.trim()).filter(Boolean);

  const res = await fetch("http://localhost:3000/api/content/projects", {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: newTitle,
      features: newFeatures
    })
  });

  if (res.ok) {
    showSection('projects'); // Refresh the projects section to show updated content
    console.log("New project added successfully");
  }
}
});

// About section edit and delete functionality
// Edit about section functionality
document.addEventListener('click', async (e) => { 
  if (e.target.classList.contains('edit-about-btn')) {
    const newHeading = prompt("New About Heading:");
    if (!newHeading) return;

    const newText = prompt("New About Text:");
    if (newText === null) return; 

    const res = await fetch('http://localhost:3000/api/content/about', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        heading: newHeading,
        text: newText
      })
    });

    if (res.ok) {
      console.log("About section updated successfully");
    }
  }
 
// Delete skill functionality
  if (e.target.classList.contains('delete-skills-btn')) {
    const skillDiv = e.target.closest('.skill');
    const skillId = skillDiv.dataset.id;

    const confirmed = confirm("Skill delete?");
    if (!confirmed) return;

    const res = await fetch(`http://localhost:3000/api/content/about/skills/${skillId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.ok) {
      skillDiv.remove(); // Remove the skill from the DOM
      console.log("Skill deleted successfully");
    }
  }

  if (e.target.classList.contains('edit-skills-btn')) {
    const skillDiv = e.target.closest('.skill');
    const skillId = skillDiv.dataset.id;

    const newTitle = prompt("New Skill Title:");
    if (!newTitle) return;

    const newDescription = prompt("New Skill Description:");
    if (newDescription === null) return; 

    const res = await fetch(`http://localhost:3000/api/content/about/skills/${skillId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
      })
    });

    if (res.ok) {
      // Update the skill in the DOM
      skillDiv.querySelector('h3').textContent = newTitle;
      skillDiv.querySelector('p').textContent = newDescription;
      skillDiv.querySelector('img').src = `http://localhost:3000${newIconPath}`;
      console.log("Skill updated successfully");
    }
  }
});

// Add new skill functionality
document.getElementById("skill-add-btn").addEventListener('click', async (e) => {
  e.preventDefault();

  const file = document.getElementById('skillFile').files[0];
  const title = document.getElementById('newSkillTitle').value;
  const description = document.getElementById('newSkillDescription').value;

  if (!file || !title || !description) {
    alert("Please fill out all fields");
    return;
  }

  const formData = new FormData();
  formData.append('icon', file);
  formData.append('title', title);
  formData.append('description', description);

  try {
    // Send the form data to the server
    const res = await fetch('http://localhost:3000/api/content/about/skills', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      console.log("Skill added");
      showSection('about-me'); 
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error("Upload error:", err);
  }
});

// Contact messages deletion functionality
document.addEventListener('click', async (e) => {
    if (e.target.matches('.delete-contact-btn')) {
    const messageDiv = e.target.closest('.contact-message');
    const messageId = messageDiv.dataset.id;

    const confirmed = confirm("Delete contact message?");
    if (!confirmed) return;

    const res = await fetch(`http://localhost:3000/api/content/contact/${messageId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.ok) {
      messageDiv.remove(); // Remove the message from the DOM
      console.log("Contact message deleted successfully");
    }
    }
});


