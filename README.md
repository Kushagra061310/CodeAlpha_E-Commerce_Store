# CodeAlpha E-Commerce Store

A full-stack e-commerce web application featuring a dynamic client-side interface and a robust RESTful API backend. This project was developed as part of the CodeAlpha internship program.

**Author:** Kushagra Goyal  
**Status:** Completed & Functional (Local Environment)

---

## 🛠️ Tech Stack

**Frontend Interface**
* Next.js
* Tailwind CSS
* TypeScript / JavaScript

**Backend Server & API**
* Python 3
* Django & Django REST Framework (DRF)
* SQLite (Relational Database)
* django-cors-headers (Cross-Origin Resource Sharing)

---

## ✨ Key Features

* **Dynamic Rendering:** Products are fetched from the backend API and rendered instantly on the client UI.
* **RESTful API Architecture:** Clean, structured endpoints for frontend-backend communication.
* **Backend Admin Panel:** Secure Django interface for adding, updating, and removing products from the database.
* **Responsive Design:** Optimized layout utilizing Tailwind CSS for various screen sizes.

---

## 🚀 Local Setup Instructions

To run this project on your local machine, you will need two separate terminal windows—one for the backend server and one for the frontend client.

### Prerequisites
* Python 3.x installed
* Node.js and npm installed

### 1. Backend Setup (Terminal 1)
Navigate to the backend directory, activate the virtual environment, and start the Django server:

```bash
# Move into the backend folder
cd backend

# Turn on the virtual environment (Windows)
.\venv\Scripts\activate

# Install the required dependencies
pip install -r requirements.txt

# Start the Django development server
python manage.py runserver
