# Personal Portfolio Fullstack Project

Dieses Projekt ist eine vollständige Fullstack-Webanwendung, die ein persönliches Portfolio mit Adminbereich enthält. Es eignet sich hervorragend für Quereinsteiger oder Junior-Entwickler, um Kompetenzen im Bereich Webentwicklung unter Beweis zu stellen.

## 🔧 Features

### 🔹 Allgemein
- Responsives Design
- Navigation über verschiedene Bereiche (Home, About Me, Projects, Reviews, Contact)
- Dynamische Anzeige der Inhalte basierend auf JSON/MongoDB-Daten

### 🔹 Admin-Panel
- Admin-Login mit Session-Handling (Cookie-basiert)
- Inhalte editierbar über Buttons, die nur im Admin-Modus sichtbar sind
- Skills, Projekte und About-Content live bearbeitbar
- Bild-Upload über `multer` möglich
- Änderungen ohne Reload sichtbar (dynamisches DOM-Update)

### 🔹 Backend (Node.js / Express)
- RESTful API-Struktur
- MongoDB/Mongoose Datenmodelle (`about`, `projects`, `reviews`, etc.)
- File Uploads (`/public/uploads`)
- Error Handling (inkl. 404/500 Middleware)

### 🔹 Sicherheit (geplant/teilweise umgesetzt)
- Authentifizierung mit Sessions
- (In Arbeit: Password Hashing, Input-Sanitizing, Rate Limiting)

## 📦 Tech Stack

| Bereich     | Technologie         |
|-------------|---------------------|
| Frontend    | HTML, CSS, Vanilla JS |
| Backend     | Node.js, Express     |
| Datenbank   | MongoDB, Mongoose    |
| Auth        | Express-Session      |
| File Upload | Multer               |

## 🛠️ Setup (lokal)

```bash
git clone https://github.com/dein-nutzername/portfolio-project.git
cd portfolio-project
npm install
npm start
