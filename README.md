# Nexus-SkyNet

> 
# 🌌 Nexus SkyNet

**Nexus SkyNet** is a full‑stack platform for **space‑related data ingestion, normalization, and analytics**. It empowers researchers, developers, and enthusiasts to upload raw datasets (CSV/JSON), fetch data from external APIs (NASA, ESA, ISRO), and transform them into a unified schema for comparison, visualization, and AI‑powered insights.

---

## 🚀 Features

- **User Authentication**  
  Secure JWT‑based login with persistent sessions (7 days). Role‑based access control for users and admins.

- **Data Ingestion**  
  Upload CSV/JSON files or fetch datasets directly from external APIs. Automatic validation ensures clean and consistent raw data storage.

- **Normalization Engine**  
  Converts raw datasets into a standardized schema:
  - Unit conversion (e.g., km → AU, Celsius → Kelvin).  
  - Coordinate conversion (RA/Dec → galactic).  
  - Schema mapping for consistent field names.

- **Analytics**  
  Powerful tools for:
  - Dataset aggregation.  
  - Statistical analysis (mean, variance, correlation).  
  - Cross‑source comparison (NASA vs ESA vs ISRO).

- **AI Assistant**  
  Integrated LLM client that generates human‑readable explanations and insights from datasets and analytics results.

- **Frontend (React + Vite)**  
  Clean, accessible UI for authentication, dataset upload, visualization, and analytics dashboards.

---

## 🛠️ Tech Stack

**Backend**  
- Flask (Python)  
- SQLAlchemy ORM  
- PostgreSQL (JSONB support)  

**Frontend**  
- React + Vite  
- CSS Modules  

**Authentication**  
- JWT (Access + Refresh tokens)  
- Middleware for route protection  

**AI Integration**  
- External LLM APIs (Gemini, Claude, etc.)  

---

## 📂 Project Structure

```
Backend/
  app.py              # Entry point
  app/                # Core config & extensions
  Api_http_level/     # HTTP routes (auth, ingestion, analytics, AI)
  Services/           # Business logic
  Models/             # SQLAlchemy models
  repository/         # Data access layer
  Ingestion/          # User uploads & API ingestion
  Normalization_Engine/ # Schema, unit, coordinate converters
  Analytics/          # Aggregation, comparison, statistics
  middleware/         # JWT auth middleware
  utils/              # Helpers, constants, JWT utilities
  Tests/              # Unit tests
Frontend/
  src/                # React components, pages, styles
```

---

## ⚡ Workflow

1. **User signs up / logs in** → JWT issued.  
2. **Dataset ingestion** → Upload CSV/JSON or fetch from API.  
3. **Validation** → Ensure schema correctness.  
4. **Normalization** → Standardize units, coordinates, schema.  
5. **Analytics** → Aggregate, compare, analyze datasets.  
6. **AI Assistant** → Generate explanations and insights.  
7. **Frontend** → Display results in tables, charts, and dashboards.  

---

## 🧪 Testing

- Unit tests for ingestion, normalization, and analytics.  
- Integration tests for authentication and middleware.  
- Test datasets included for validation and comparison.  

---

## 📈 Roadmap

- [ ] Expand analytics with machine learning models.  
- [ ] Add visualization dashboards (charts, maps).  
- [ ] Enhance AI assistant with domain‑specific prompts.  
- [ ] Deploy backend + frontend with CI/CD pipeline.  

---

## 🤝 Contributing

Contributions are welcome!  
- Fork the repo.  
- Create a feature branch.  
- Submit a pull request with clear commit messages.  

---

## 📜 License

This project is licensed under the MIT License. See `LICENSE` for details.





![License](https://img.shields.io/badge/license-MIT-green) ![Version](https://img.shields.io/badge/version-1.0.0-blue) ![Language]![Language](https://img.shields.io/badge/language-JavaScript%20%7C%20Python-yellow)
![Framework](https://img.shields.io/badge/framework-React%20%7C%20Flask-orange)
![GitHub](https://img.shields.io/badge/GitHub-KingMakerDEV/Nexus--SkyNet-black?logo=github)
![Build Status](https://img.shields.io/github/actions/workflow/status/KingMakerDEV/Nexus-SkyNet/ci.yml?branch=main)


## 📋 Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Requirements](#requirements)
- [Contributing](#contributing)

## ℹ️ Project Information

- **👤 Author:** KingMakerDEV
- **📦 Version:** 1.0.0
- **📄 License:** MIT
- **📂 Repository:** [https://github.com/KingMakerDEV/Nexus-SkyNet](https://github.com/KingMakerDEV/Nexus-SkyNet)
- **🏷️ Keywords:** Nexus SkyNet - Space Data   - Dataset Ingestion   - Data Normalization   - Analytics Engine   - AI Insights   - Flask Backend   - React Frontend   - PostgreSQL   - JWT Authentication   - Full‑Stack Project   - Astronomy Data   - API Integration   - Machine Learning Ready   - Open Source

## Features

📖 Content
Nexus SkyNet is a full‑stack platform built to handle the complexities of space‑related datasets. It provides a seamless workflow from data ingestion to normalization and analytics, with an integrated AI assistant for generating insights.

The project is designed for researchers, developers, and enthusiasts who want to work with heterogeneous datasets from sources like NASA, ESA, ISRO, or user‑uploaded files. By standardizing units, schemas, and coordinates, Nexus SkyNet makes it possible to compare, analyze, and visualize data across multiple origins.

🔹 Core Capabilities
Authentication: Secure JWT‑based login with persistent sessions (7 days).

Ingestion: Upload CSV/JSON files or fetch datasets from external APIs.

Normalization: Standardize schema, convert units, and unify coordinate systems.

Analytics: Aggregate datasets, run statistical analysis, and perform cross‑source comparisons.

AI Assistant: Generate human‑readable explanations and insights using external LLM APIs.

Frontend UI: React + Vite interface for uploads, dashboards, and visualizations.

🔹 Why Nexus SkyNet?
Consistency: Raw data is normalized into a unified schema.

Scalability: Modular backend architecture for easy extension.

Clarity: Clean frontend UI for accessible dataset interaction.

Intelligence: AI‑powered insights to make sense of complex data.

## Usage



## 📦 Usage

### 🔹 Backend (Flask + PostgreSQL)
1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/nexus-skynet.git
   cd nexus-skynet/Backend
   ```

2. **Set up environment variables**  
   Create a `.env` file in `Backend/` with values like:
   ```
   DATABASE_URL=postgresql://user:password@localhost/nexus_skynet
   SECRET_KEY=your_secret_key
   ```

3. **Install dependencies**  
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend server**  
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:5000`.

---

### 🔹 Frontend (React + Vite)
1. **Navigate to frontend folder**  
   ```bash
   cd ../Frontend
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Run the development server**  
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

### 🔹 Typical Workflow
- **Sign up / Log in** → Obtain JWT tokens.  
- **Upload dataset** → CSV/JSON via frontend form or API (`/upload`).  
- **Normalization** → Trigger pipeline to standardize schema, units, and coordinates.  
- **Analytics** → Run aggregation, comparison, or statistical analysis.  
- **AI Insights** → Call AI endpoints to generate explanations and summaries.  
- **Frontend UI** → View datasets, analytics results, and AI insights in dashboards.  

---

### 🔹 Example API Calls
- **Login**  
  ```http
  POST /auth/login
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Upload Dataset**  
  ```http
  POST /upload
  Content-Type: multipart/form-data
  file: dataset.csv
  ```
- **Normalize Dataset**  
  ```http
  POST /normalize/{dataset_id}
  ```
- **Run Comparison**  
  ```http
  POST /analytics/compare
  {
    "dataset_ids": ["id1", "id2"]
  }
  ```


## Requirements


## 📋 Requirements

Before running Nexus SkyNet, ensure you have the following installed and configured:

### 🔹 System Requirements
- **Operating System**: Windows, macOS, or Linux  
- **Python**: Version 3.10+  
- **Node.js**: Version 18+  
- **npm**: Version 9+ (comes with Node.js)  
- **PostgreSQL**: Version 14+  

### 🔹 Backend Dependencies
- **Flask** → Web framework for API routes  
- **SQLAlchemy** → ORM for database models  
- **psycopg2** → PostgreSQL driver  
- **python‑dotenv** → Environment variable management  
- **bcrypt** → Password hashing  
- **PyJWT** → JWT authentication  
- **requests** → External API ingestion  

### 🔹 Frontend Dependencies
- **React** → UI framework  
- **Vite** → Fast bundler and dev server  
- **Axios** → HTTP client for API calls  
- **React Router** → Navigation and routing  
- **CSS Modules** → Scoped styling  

### 🔹 Development Tools
- **Git** → Version control  
- **VS Code / PyCharm** → Recommended IDEs  
- **Postman / cURL** → API testing  
- **pytest** → Unit testing framework  



## Contributing



## 🤝 Contributing

We welcome contributions to **Nexus SkyNet**! Whether it’s fixing bugs, improving documentation, or building new features, your help makes the project stronger.

### 🔹 How to Contribute
1. **Fork the repository**  
   Click the “Fork” button at the top right of this page to create your own copy.

2. **Clone your fork locally**  
   ```bash
   git clone https://github.com/yourusername/nexus-skynet.git
   cd nexus-skynet
   ```

3. **Create a feature branch**  
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**  
   - Follow the project’s modular structure (Backend/Frontend separation).  
   - Keep code clean and well‑documented.  
   - Add or update tests where relevant.  

5. **Commit with clear messages**  
   ```bash
   git commit -m "Add: detailed ingestion validation"
   ```

6. **Push your branch**  
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request (PR)**  
   - Go to your fork on GitHub.  
   - Click “Compare & pull request.”  
   - Provide a clear description of your changes.  

---

### 🔹 Contribution Guidelines
- **Coding Style**: Follow PEP8 for Python and ESLint rules for React.  
- **Testing**: Ensure new features include unit tests (`pytest` for backend, React Testing Library for frontend).  
- **Documentation**: Update README or inline docs if your changes affect usage.  
- **Respect Branches**:  
  - `main` → stable production branch.  
  - `nik1` → development branch for new features.  

---

### 🔹 Areas You Can Help
- Expanding **analytics features** (new statistical methods).  
- Improving **normalization pipeline** (support more units/coordinate systems).  
- Enhancing **frontend UI/UX** (dashboards, charts, accessibility).  
- Strengthening **AI assistant prompts** for better dataset insights.  
- Writing **tests** to improve reliability.  


