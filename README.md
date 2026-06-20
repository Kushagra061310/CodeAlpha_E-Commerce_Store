# 🛒 CodeAlpha E-Commerce Store

A full-stack e-commerce web application featuring a dynamic client-side interface and a robust RESTful API backend. This project was developed as part of the CodeAlpha internship program.

**Author:** Kushagra Goyal  
**Status:** Core Backend & Frontend Integration Completed

---

## 📺 Project Demo
*Because the full demonstration video exceeds GitHub's file size limits, it is hosted externally. Please watch the demo below to see the live integration between the Next.js frontend and Django backend:*

**👉 [CLICK HERE TO WATCH THE DEMO VIDEO] (Paste your YouTube/Google Drive link here)**

---

## 🛠️ Tools & Tech Stack

### Frontend Client
* **Framework:** Next.js
* **Styling:** Tailwind CSS
* **Language:** TypeScript / JavaScript

### Backend API & Database
* **Framework:** Django & Django REST Framework (DRF)
* **Language:** Python 3
* **Database:** SQLite (Relational Database)
* **Middleware:** django-cors-headers (For secure cross-origin resource sharing)

---

## ✨ Features Implemented So Far

1. **RESTful API Architecture:** Configured clean, structured JSON endpoints (`/api/products/`) to serve database content to the client.
2. **Dynamic Client Rendering:** The Next.js frontend successfully fetches data from the Django API and renders the products in real-time.
3. **Database Management:** Configured the secure Django Admin panel to easily add, update, and manage product inventory.
4. **CORS Configuration:** Successfully bridged the `localhost:3000` (Frontend) and `127.0.0.1:8000` (Backend) ports to allow seamless local communication.
5. **Responsive UI:** Built a clean, modern, and responsive user interface utilizing Tailwind CSS utility classes.

---

## 🚀 Local Setup & Installation

To run this project on your local machine, you will need two separate terminal windows running simultaneously.

1. Start the Backend API (Terminal 1)
Navigate into the backend directory, turn on your virtual environment, and start the server.

```bash
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver


The backend API will run at: http://127.0.0.1:8000/api/products/

### 2. Start the Frontend Client (Terminal 2)
Open a fresh terminal, navigate into the frontend directory, and start the Next.js app.

cd frontend
npm install
npm run dev

The frontend interface will run at: http://localhost:3000

🧪 Testing the Integration
To test the full-stack connection locally:

Go to http://127.0.0.1:8000/admin/ and log in to the Django dashboard.

Add a new product to the database and save it.

Refresh http://localhost:3000 to see the new product instantly rendered on the UI via the API fetch.

---

## 🔮 Future Enhancements

While the core integration is complete, planned future updates for this application include:
* **User Authentication:** Secure login and registration utilizing JWT tokens.
* **Cart State Management:** Implementing a global cart state using React Context or Redux.
* **Payment Integration:** Connecting a secure payment gateway (like Stripe or Razorpay) for checkout processing.

---

## 🤝 Acknowledgments

This full-stack application was developed as a project for the **CodeAlpha** internship program. It served as an excellent opportunity to bridge modern frontend frameworks with robust backend architectures.

---

## 📬 Contact

**Kushagra Goyal** * **LinkedIn:** https://www.linkedin.com/in/kushagra-goyal-03287737b/
* **GitHub:** https://github.com/Kushagra061310
* **Email:** gkushagra905@gmail.com
