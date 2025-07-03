//Show the home section on page load
window.addEventListener('DOMContentLoaded', () => {
  showSection('home');
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
      skillsContainer.innerHTML = '<div id="skills_header"><h2>Skills</h2></div>';

      about.skills.forEach(skill => {
        const div = document.createElement('div');
        div.className = 'skill';
        div.innerHTML = `
          <img src="http://localhost:3000${skill.icon}" alt="${skill.title}">
          <h3>${skill.title}</h3>
          <p>${skill.description}</p>
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
          <small>${new Date(review.date).toLocaleDateString()}</small>
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
        projectDiv.innerHTML = `
          <h3>${project.title}</h3>
          <ul>
          ${(Array.isArray(project.features) ? project.features : [])
            .map(feature => `<li>${feature}</li>`)
            .join('')}
          </ul>
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
}

function showLoginSection() {
  const login = document.getElementById("loginSection");
  if (login.style.display === "block") {
    login.style.display = "none";
  } else {
    login.style.display = "block";
  }
}             

 // addRecommendation function

async function addReview(event) {
  event.preventDefault(); 

  let review = document.getElementById("new_review");
  let email = document.getElementById("email");
  let name = document.getElementById("name");

  // Validierung
  if (
    review.value.trim() !== "" &&
    email.value.trim() !== "" &&
    name.value.trim() !== ""
  ) {
    try {
      // Send POST request to save the review
      const response = await fetch("http://localhost:3000/api/content/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          text: review.value.trim()
        })
      });

      if (response.ok) {
        console.log("New review saved to database");
        showPopupReview(true);

        // Input fields reset
        review.value = "";
        email.value = "";
        name.value = "";

        await showSection('reviews');
      } else {
        const error = await response.json();
        console.error("Server error:", error.message);
        showPopupError(true);
      }
    } catch (err) {
      console.error("Network error:", err);
      showPopupError(true);
    }
  } else {
    console.log("No valid input");
    showPopupError(true);
  }
}

// Event listeners for review form

document.querySelector(".review_input_form").addEventListener("submit", addReview);

  // message function client-side

async function message(event) {
  event.preventDefault(); 

  let messageInput= document.getElementById("new_message");
  let email = document.getElementById("email_m");                     // valid email test const
  let name = document.getElementById("name_m"); 

  if (
    messageInput.value.trim() !== "" &&                                     // valid input test 
    email.value.trim() !== "" &&
    name.value.trim() !== ""
  ) { 
  try {
    // Send POST request to save the message
    const response = await fetch("http://localhost:3000/api/content/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        message: messageInput.value.trim()
      })
    });

    if (response.ok) {
      console.log("New message added to database");
      showPopupMessage(true);

      messageInput.value = "";
      email.value = "";
      name.value = ""; 
    } else {
      console.log("No valid input");
      showPopupError(true);
    }
  } catch (err) {
    console.error("Network error:", err);
    showPopupError(true);
  }
  } else {
    console.log("No valid input");
    showPopupError(true);
  }
}
// Event listeners for message form

document.querySelector(".contact_input_form").addEventListener("submit", message);


  // popup function success review

function showPopupReview(bool) {
  if (bool) {
    document.getElementById('popup-review').style.visibility = 'visible';
  } else {
    document.getElementById('popup-review').style.visibility = 'hidden';
  }
}

 // popup function success message

function showPopupMessage(bool) {
  if (bool) {
    document.getElementById('popup-message').style.visibility = 'visible';
  } else {
    document.getElementById('popup-message').style.visibility = 'hidden';
  }
}


  // popup function error
function showPopupError(bool) {
  if (bool) {
    document.getElementById('popup-error').style.visibility = 'visible';
  } else {
    document.getElementById('popup-error').style.visibility = 'hidden';
  }
}


// Event listeners for Admin login form
document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('adminUser').value;
  const password = document.getElementById('adminPass').value;

  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem('token', data.token);
    alert("Login successful");
    // Redirect or load edit UI
  } else {
    alert("Login failed");
  }
});

