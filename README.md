# 🧩 Personal Portfolio – Full-Stack Web App

This project is a full-stack portfolio website created as part of my transition into web development.  
It includes a public-facing portfolio and a password-protected admin area for editing and managing the site's content.

---

## 🚀 Features

### 🖥️ Frontend
- Fully responsive layout (HTML, CSS, Vanilla JS)
- Dynamic section management (Home, About, Skills, Projects, Reviews, Contact)
- Popup-based form system
- Contact and Review forms with live feedback
- Admin login/logout toggle with session persistence
- Secure input with express validator

### 🔐 Admin Area
- Session-based authentication (express-session + bcrypt)
- Secure admin routes using middleware
- Editable content (via forms) for each section
- Skill icon and project feature upload
- Admin-only view logic (content visibility changes via `body.admin`)
- Secure input and rate limiting

### 🛠️ Backend
- Node.js with Express.js
- RESTful API routes for all content types
- MongoDB database integration via Mongoose
- File uploads with Multer (e.g., skill icons)
- Environment-based admin credential management
- Error handling with debug
- Testing at push/merge with jest/supertest

---

## 🧱 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Auth**: express-session, bcrypt
- **Security**: express-validator, express-rate-limiter
- **Error Handling**: Debug
- **File Upload**: Multer
- **Tools**: Git, GitHub, Postman
- **Testing**: Jest, Supertest

---

## 📘 API Documentation (Swagger)

This backend is fully documented using **Swagger (OpenAPI 3.0)**. You can explore, test, and understand the API via a web-based interface.

### 🔗 Access the Swagger UI

After starting the server, open your browser and go to:

http://localhost:3000/api-docs

---

## 🗂️ Project Structure
<pre>
WEBPAGE/
├── .vscode/
│   └── settings.json
├── Backend/
│   ├── middleware/
│   │   ├── isAdmin.js
│   │   ├── rateLimit.js
│   │   └── upload.js
│   ├── models/
│   │   ├── aboutSchema.js
│   │   ├── contactSchema.js
│   │   ├── homeSchema.js
│   │   ├── projectsSchema.js
│   │   └── reviewSchema.js
│   ├── node_modules/
│   ├── public/uploads/
│   │   ├── 1751282265165-html5.png
│   │   └── 1752163756790-react.png
│   └── routes/
│       ├── adminAuth.js
│       └── content.js
├── .env
├── package.json
├── package-lock.json
├── server.js
├── Frontend/
│   ├── html_finalprojimages/
│   └── scripts/
│       ├── adminEdit.js
│       ├── auth.js
│       ├── formHandler.js
│       ├── popup.js
│       └── sectionManagment.js
├── index.html
├── style.css
├── README.md
├── .gitignore
├── LICENSE
</pre>

## 📦 Setup

1. Clone the repository  /cd Backend
2. Install dependencies: `npm install`  
3. Create `.env` with:

<pre><code>ADMIN_USER=yourAdminUsername
ADMIN_PASS=yourHashedPassword  # Use bcrypt to hash
MONGODB_URI=yourMongoDbConnectionString
SECRET_KEY=yourStrongRandomSecretKeyHere
SESSION_SECRET=yourStrongRandomSecretKeyHere
CLIENT_URL=http://localhost:5500
Port=3000 </code></pre>

4. Run the server: `node server.js`  
5. Open in browser: `http://localhost:3000`

---

## 🎥 Demo

Watch the project walkthrough video here:  
[Demo Video](https://www.loom.com/share/daa253b0a7204864935d6510a621b044?sid=5689b276-e205-4852-9bb8-ec64ea5ca19a)

---

## 👤 About Me

I’m transitioning into web development, bringing leadership skills from my role as a team and training manager in industry.  
Currently building backend skills (Node.js, Express, MongoDB) and extending into full-stack development.

🔗 [GitHub Portfolio](https://github.com/Hikko218)  
🔗 [LinkedIn](https://www.linkedin.com/in/heiko-ries-b35778374/)

---

## 📬 Contact

Contact me via LinkedIn.
