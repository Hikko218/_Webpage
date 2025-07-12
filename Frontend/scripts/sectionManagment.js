import { showPopupReview, showPopupMessage, showPopupError } from './popup.js';
//Show the home section on page load
window.addEventListener('DOMContentLoaded', async () => {
  showSection('home');

  try {
    const res = await fetch('http://localhost:3000/api/admin/check', {
      credentials: 'include',
    });

    if (res.ok) {
    const data = await res.json();


    if (data.loggedIn) {
      const adminLogin = document.getElementById("adminLoginBtn");
      adminLogin.innerHTML = "Logout";
      adminLogin.id = "logout-btn"; 
      adminLogin.className ="logout-btn" // Change button ID for logout
      document.body.classList.add('admin');
      };
    } else {
      const adminLogout = document.getElementById("adminLoginBtn");
      adminLogout.innerHTML = "Login";
      adminLogout.className = "topmenu"; 
    }
  } catch (err) {
    console.error('Error checking Session:', err);
  }
});

// Nav-bar and section management 
async function showSection(sectionId) {
  const sections = document.querySelectorAll("#about-me, #projects, #reviews, #contact, #home, #loginSection");
  sections.forEach(section => section.style.display = "none");
  
  const active = document.getElementById(sectionId);
  if (active) active.style.display = "block";

   // Load about-me content if the section is 'about-me'
  if (sectionId === 'about-me') {
    try {
      const res = await fetch('http://localhost:3000/api/content/about', {
      credentials: 'include'
      });
      const [about] = await res.json();

      // Text rendern
      document.getElementById('about-heading').innerText = about.heading;
      document.getElementById('about-text').innerText = about.text;

      // Skills rendern
      const skillsContainer = document.getElementById('all_skills');
      skillsContainer.innerHTML = `
        <div id="skills_header">
        <h2>Skills</h2>
        </div>
        `; 
      

      about.skills.forEach(skill => {
        const div = document.createElement('div');
        div.className = 'skill';
        div.dataset.id = skill._id; 
        div.innerHTML = `
          <img src="http://localhost:3000${skill.icon}" alt="${skill.title}">
          <h3>${skill.title}</h3>
          <p>${skill.description.split(',,').map(item => item.trim()).join('<br>')}</p>
          <div class="skills-button-group">
          <button type="button" class="edit-skills-btn">✏️</button>
          <button type="button" class="delete-skills-btn">🗑️</button>
          </div>
        `;
        skillsContainer.appendChild(div);
      });

    } catch (err) {
      console.error('Error loading about content:', err);
    }
  }
  // Load reviews content if the section is 'reviews'
  if (sectionId === 'reviews') {
    try {
      const res = await fetch('http://localhost:3000/api/content/reviews', {
        credentials: 'include'
      });
      const reviews = await res.json();

      const reviewsContainer = document.getElementById('all_reviews');
      reviewsContainer.innerHTML = ''; // Clear existing reviews

      reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review';
        reviewDiv.innerHTML = `
          <h3>${review.name}</h3>
          <p>${review.text}</p>
          <small>${new Date(review.date).toLocaleDateString()}</small><br>
          <button class="delete-review-btn" data-review-id="${review._id}">🗑️ Delete</button>
        `;
        
        reviewsContainer.appendChild(reviewDiv);
        
      });
    }
    catch (err) {
      console.error('Error loading reviews:', err);
    }
  }
  // Load projects content if the section is 'projects'
  if (sectionId === 'projects') {
    try {
      const res = await fetch('http://localhost:3000/api/content/projects', {
        credentials: 'include'
      });
      const projects = await res.json();

      console.log('Projects', projects);

      const projectsContainer = document.querySelector('.projects-container');
      projectsContainer.innerHTML = '';

      projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = "project-card";
        projectDiv.dataset.id = project._id;
        projectDiv.innerHTML = `
          <h3>${project.title}</h3>
          <ul>
          ${(Array.isArray(project.features) ? project.features : [])
            .map(feature => `<li>${feature}</li>`)
            .join('')}
          </ul>
          <div class="project-btn-group">
          <button class="edit-project-btn">✏️ Edit</button>
          <button class="delete-project-btn">🗑️ Delete</button>
          </div>
        `;
        projectsContainer.appendChild(projectDiv);
      });
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  }
  // Load home content if the section is 'home'
  if (sectionId === 'home') {
    try {
      const res = await fetch('http://localhost:3000/api/content/home', {
        credentials: 'include'
      });
      const [homeContent] = await res.json();

      document.querySelector('.home-content').innerHTML = ` 
      <h1>${homeContent.heading}</h1>
      <p>${homeContent.text}</p>
      <a href="#" class="btn" onclick="showSection('projects')">View My Projects</a>
    `; 
    } catch (err) {
      console.error('Error loading home content:', err);
    }
  }
  // Show Contact Messages for Admin
  if (sectionId === 'contact') {
  try {
    const res = await fetch('http://localhost:3000/api/content/contact', {
      credentials: 'include'
    });

    if (!res.ok) {
      if (res.status === 401) {
        console.warn("Admin login required.– ");
        return;
      }
      throw new Error("Error fetching contact messages");
    }

    const messages = await res.json();

    const contactContainer = document.getElementById('contact-messages');
    contactContainer.innerHTML = '';

    messages.forEach(message => {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'contact-message';
      messageDiv.dataset.id = message._id; 
      messageDiv.innerHTML = `
        <h3>${message.name}</h3>
        <p>${message.message}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <small>${message.date}</small><br>
        <button class="delete-contact-btn">🗑️ Delete</button>
      `;
      contactContainer.appendChild(messageDiv);
    });

    console.log('Contact messages loaded.');

  } catch (err) {
    console.error('Error loading contact messages:', err);
    }
  }
}

async function showLoginSection() {
  const login = document.getElementById("loginSection");
  if (login.style.display === "block") {
    login.style.display = "none";
  } else {
    login.style.display = "block";
  }
}

document.getElementById('projectsBtn').addEventListener('click', () => showSection('projects'));
document.getElementById('aboutBtn').addEventListener('click', () => showSection('about-me'));
document.getElementById('reviewsBtn').addEventListener('click', () => showSection('reviews'));
document.getElementById('contactBtn').addEventListener('click', () => showSection('contact'));
document.getElementById('homeBtn').addEventListener('click', () => showSection('home'));

document.addEventListener('click', async (e) => {
    if (e.target.matches('#adminLoginBtn')) {
      showLoginSection();
    }
});


// Frontend/scripts/script.js
// Export functions for use in other modules
export {showSection, showLoginSection};








