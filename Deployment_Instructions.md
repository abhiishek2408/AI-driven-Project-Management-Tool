
# AI-driven Project Management Tool - Deployment Instructions 

# 🖥️ Backend Deployment (Node + Express)

Clone repository

```bash
git clone https://github.com/your-username/ai-project-manager.git
cd backend
```

Install dependencies

```bash
npm install
```

Create .env file

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai_pm
OPENAI_API_KEY=your_api_key
```

Start server

```bash
npm start
```

Backend will run on:
👉 https://ai-driven-project-management-tool.onrender.com

---

Frontend Deployment (React + MUI)

Go to frontend folder

```bash
cd frontend
npm install
```

Add environment variable

```env
REACT_APP_API_URL=https://ai-driven-project-management-tool.onrender.com
```

Build React app

```bash
npm run build
```


## Backend (Node.js + Express)

1. **Install dependencies:**
   ```bash
   cd backend
   npm install express mongoose cors openai
   ```
2. **Set environment variables:**
   - Create a `.env` file and add your MongoDB URI and OpenAI API Key:
     ```env
     MONGO_URI=your_mongodb_connection_string
     GEMINI_API_KEY=your_gemini_api_key       
     PORT=5000
     JWT_SECRET=your_jwt_key
     ```
3. **Run the backend:**
   ```bash
   cd backend
   npm start
   ```

## Frontend (React + MUI)

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install @mui/material @emotion/react @emotion/styled axios react-router-dom
   ```
2. **Run the frontend:**
   ```bash
   cd frontend
   npm start
   ```


---
## Step-by-Step Guide: Make This App LIVE build folder (Render + Vercel)

### Deploy Backend to Render

1. Go to https://render.com and sign up / log in.
2. Click 'New' → 'Web Service'.
3. Connect your GitHub repo (or upload code).
4. Select the backend folder as the root for the service.
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Add environment variables (from your `.env`):
   - `PORT=5000` (or leave blank, Render sets it)
   - `MONGO_URI=...`
   - `GEMINI_API_KEY=...`
   - `JWT_SECRET=...`
8. Click 'Create Web Service'.
9. Wait for build & deploy. Copy the Render backend URL (e.g., `https://your-backend.onrender.com`).

---

### Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up / log in.
2. Click 'New Project' and import your repo.
3. Select the frontend folder as the root for the project.
4. Set build command: `npm run build`
5. Set output/public directory: `build`
6. Add environment variable:
   - `REACT_APP_API_URL=https://your-backend.onrender.com`
7. Click 'Deploy'.
8. Wait for build & deploy. Copy the Vercel frontend URL (e.g., `https://your-frontend.vercel.app`).

---

### 3️⃣ Final Steps

- Test your deployed app by opening the Vercel URL in your browser.
- All API calls from frontend will go to the Render backend URL.
- If you update code, just push to GitHub—Render and Vercel auto-deploy!

---



## Additional Notes & Tips

- Make sure MongoDB is running and accessible from your machine.
- The backend uses JWT for authentication. Set a strong value for `JWT_SECRET` in your `.env` file.
- The Gemini API key is required for AI suggestions. You can get it from Google AI's developer portal.
- If you want to use OpenAI instead, update the backend code and provide your OpenAI API key in `.env` as `OPENAI_API_KEY`.
- To install all dependencies at once, you can run `npm install` in both `backend` and `frontend` folders.
- If you face CORS issues, check the backend CORS configuration in `backend/server.js`.
- For any environment variable changes, restart the backend server.
- To build the frontend for production, run `npm run build` inside the `frontend` folder.
- All user roles (Admin, Project Manager, Developer) are supported. Role-based access is enforced in both backend and frontend.
- The project uses Material-UI (MUI) for UI components and styling.
- Kanban board and AI suggestions panel are also built using Material-UI.
- If you get a 'Module not found' error for `index.js`, make sure `frontend/src/index.jsx` exists and create a minimal `index.js` that imports it.
- For any issues, check the browser console and backend terminal for error messages.

---

**Note:**
Gemini API is used for AI features in this project because I did not have a paid OpenAI plan.
