# Clarity Canvas

Clarity Canvas is an AI-powered prototyping tool that instantly transforms your ideas into web layouts and summarizes user feedback to accelerate your design process.

![Clarity Canvas Screenshot](https://storage.googleapis.com/aip-dev-images/clarity-canvas-screenshot.png)

## Features

- **AI Layout Generation**: Describe your desired layout in plain English, and watch as the AI generates responsive HTML with Tailwind CSS.
- **Interactive Feedback Pins**: Click anywhere on the canvas to add a feedback pin and leave comments.
- **AI Feedback Summarization**: Automatically summarize all your feedback points into a concise, actionable list.
- **Incognito Mode**: Experiment freely without your session being saved to local storage.
- **Secure Lock Screen**: Protect your work with a PIN-protected lock screen.
- **Export to HTML**: Easily export your final layout for use in other projects.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/akdinesh2003/Clarity-Canvas.git
    cd Clarity-Canvas
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env` in the root of your project and add your AI provider API key.

    ```env
    # .env
    GENKIT_API_KEY=<your_google_ai_api_key>
    ```

    **Important**: You must replace `<your_google_ai_api_key>` with your actual Google AI API key. The AI features will not work without it. You can obtain a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Application

1.  **Start the development server:**
    This command starts the Next.js application.
    ```bash
    npm run dev
    ```

2.  **Start the Genkit AI server:**
    In a separate terminal, run this command to start the Genkit server for the AI flows.
    ```bash
    npm run genkit:watch
    ```

3.  **Open your browser:**
    Navigate to [http://localhost:9002](http://localhost:9002) to see the application in action.

## Author

- **akdinesh2003**: [https://github.com/akdinesh2003](https://github.com/akdinesh2003)
