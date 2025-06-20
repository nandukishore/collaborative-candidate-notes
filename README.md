# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


# CandidateConnect MVP

## Description

CandidateConnect is a React-based web application designed for recruiters and hiring managers to collaboratively share feedback on candidates in real-time. It features @tagging for notifying specific users and a notification system to keep everyone informed. This MVP (Minimum Viable Product) version utilizes in-memory storage and browser `localStorage` to simulate backend functionalities, making it easy to run and test locally without a dedicated database or server setup.

## Features

*   **User Authentication:** Secure signup and login functionality.
*   **Candidate Management:** Create and list candidates.
*   **Collaborative Notes:** Add time-stamped notes for each candidate.
*   **@Mentions:** Tag other registered users in notes to notify them.
*   **Real-time Notifications:** Receive in-app notifications for mentions.
*   **Responsive UI:** User interface built with Tailwind CSS for responsiveness across devices.
*   **Toast Notifications:** User-friendly feedback for actions (success, error, info).
*   **Client-Side Data Persistence:** Uses `localStorage` to persist notes and notifications across browser sessions for a better MVP experience.

 ## Tech Stack 

*   **Frontend:**
    *   React 19 (using `esm.sh` for module resolution)
    *   TypeScript
    *   Tailwind CSS (via CDN)
    *   React Router DOM (for navigation)
    *   Heroicons (for UI icons)
*   **State Management:** React Context API
*   **Build/Dev:** No explicit build step required for this CDN-based setup; relies on browser's ES module support.
*   **Data Storage (MVP):** In-memory JavaScript objects and browser `localStorage`.

 ## Setup Instructions

This project is designed to run directly in a browser that supports ES modules and has an internet connection to fetch dependencies from CDNs.

### Prerequisites

*   A modern web browser (e.g., Chrome, Firefox, Edge, Safari).
*   A text editor or IDE for viewing/editing code (e.g., VS Code).
*   A local web server to serve the `index.html` file. Many IDEs have live server extensions (e.g., "Live Server" for VS Code). Alternatively, you can use Python's built-in HTTP server or `npx serve`.

 ### Running the Application

1.  **Get the Code:**
    *   Download or clone/copy all the project files (`.html`, `.tsx`, `.ts`, `.json`) into a single folder on your local machine.

2.  **API Key (Placeholder for Future Gemini API Integration):**
    *   This MVP does not yet actively use the Gemini API, so an `API_KEY` is not strictly required to run the current features.
    *   The code is structured to use `process.env.API_KEY` if Gemini API calls were to be implemented. For a pure client-side application without a Node.js-like environment, `process.env` is not directly available. If you were to add Gemini features:
        *   You might temporarily hardcode it for local testing (not recommended for shared code).
        *   Or, adapt the API client initialization to fetch the key from a configuration file or a secure input mechanism (though the current instructions prohibit UI for API key input).
        *   **For this MVP, no action is needed regarding `API_KEY` to run the existing features.**

3.  **Serve the `index.html` file:**
    *   **Using VS Code Live Server Extension:**
        1.  Open the project folder in VS Code.
        2.  Right-click on `index.html` in the Explorer panel.
        3.  Select "Open with Live Server".
    *   **Using Python's HTTP Server (Python 3):**
        1.  Open your terminal or command prompt.
        2.  Navigate to the root directory of the project (where `index.html` is located).
        3.  Run the command: `python -m http.server`
        4.  Open your browser and go to `http://localhost:8000`.
    *   **Using `npx serve` (Node.js required):**
        1.  Open your terminal or command prompt.
        2.  Navigate to the root directory of the project.
        3.  Run the command: `npx serve`
        4.  Open your browser to the local address provided by the `serve` command (usually `http://localhost:3000` or a similar port).

4.  **Access the Application:**
    *   Open the provided URL (e.g., `http://localhost:8000` or `http://localhost:5500` if using Live Server) in your web browser.

 ## Usage Guide 

1.  **Sign Up / Login:**
    *   If you're a new user, click "Sign Up" on the login page, fill in your details (name, email, password), and create an account.
    *   If you already have an account, enter your email and password to "Sign In".
    *   The application starts with a few pre-defined users for demonstration:
        *   Alice Wonderland (email: `alice@example.com`, password: `password123`)
        *   Bob The Builder (email: `bob@example.com`, password: `password123`)
        *   Charlie Brown (email: `charlie@example.com`, password: `password123`)

2.  **Dashboard:**
    *   After logging in, you'll be directed to the dashboard.
    *   This page displays a list of candidates and a section for your notifications (mentions).

3.  **Create a Candidate:**
    *   Click the "+ New Candidate" button on the dashboard.
    *   A form will appear. Enter the candidate's name and email address.
    *   Click "Create Candidate". The new candidate will be added to the list.

4.  **View and Add Notes for a Candidate:**
    *   From the candidate list on the dashboard, click on a candidate's name.
    *   This will take you to the "Notes for [Candidate Name]" page.
    *   You can view existing notes in a chat-like interface.
    *   **Add a Note:** Use the text area at the bottom to type your note.
    *   **Mention Users:** To mention another user and notify them, type `@` followed by their name (e.g., `@Alice Wonderland`). A list of matching users will appear as you type. Click on a user from the list to insert their name.
    *   Press Enter (without Shift) or click the send button (paper airplane icon) to submit your note.
    *   The note will appear in the list, and any mentioned users will receive an in-app notification.

5.  **Notifications:**
    *   A bell icon in the navbar at the top of the page will show a badge with the count of your unread notifications.
    *   Clicking the bell icon will scroll to the "Your Mentions" card on the dashboard.
    *   The "Your Mentions" card lists notifications where you've been tagged.
    *   Clicking on a notification in this card will navigate you to the relevant candidate's notes page, highlight the specific message, and mark the notification as read.
    *   You can also "Mark all read" using the button on the "Your Mentions" card.

6.  **Logout:**
    *   Click the "Logout" button in the navbar to sign out of the application.

## Project Structure (Overview)

___________________________________________________________________________________________________

 List of libraries and services used with brief justifications 

## Libraries and Services Used

- **React & ReactDOM (esm.sh)** – Core for building the frontend app using modern component architecture.
- **React Router DOM (esm.sh)** – Enables smooth client-side navigation between login, dashboard, and candidate pages.
- **Tailwind CSS (cdn.tailwindcss.com)** – Rapid UI styling and responsive layout.
- **Heroicons (esm.sh)** – Minimalistic icons for UI feedback (e.g., bell, logout).
- **React Context API** – Manages authentication and app-wide state (users, notes, notifications).
- **localStorage API** – Simulates persistent backend for MVP, stores session data locally in the browser.


 ## A short section answering: 
 ## “If you had more time, what enhancements would you implement and why?”

 ### If I Had More Time...

 1. **Backend Integration:** Implement a real backend using Node.js + MongoDB or Firebase to handle persistence, authentication, and real-time data sync.
2. **Push Notifications:** Add browser push notifications for @mentions.
3. **User Presence Tracking:** Show who’s currently online and viewing the same candidate.
4. **Search & Filter:** Allow users to search notes or filter by tag or date.
5. **Mobile Optimizations:** Add swipe gestures and native-style elements for mobile experience.
6. **Gemini API Integration:** For smart suggestions based on candidate notes or summarizing conversations.

