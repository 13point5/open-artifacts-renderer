# 🔍 Open Artifacts Renderer

This repository contains a Next.js application that serves as an iframe for rendering React components passed as strings through messages. It's designed to be embedded in another application and provides functionality for dynamic component rendering and screen capture.

This is my attempt at figuring out how [Claude.ai](https://claude.ai) implements the Artifact viewer. If you find flaws or have ideas to improve please raise an issue or a Pull Request 🙏

## Features

- Dynamic rendering of React components from string code
- Screen capture functionality for rendered components
- Communication with parent window through postMessage API

## How It Works

1. The application initializes and sends an `INIT_COMPLETE` message to the parent window.
2. It listens for messages from the parent window:
   - `UPDATE_COMPONENT`: Updates the rendered component with new code.
   - `CAPTURE_SELECTION`: Captures a specific area of the rendered component.
3. When a new component code is received, it's evaluated and rendered dynamically.
4. The screen capture functionality can capture either a selected area or the entire rendered component.

## Usage

To use this component renderer in your application:

1. Host this Next.js application and embed it as an iframe in your main application.
2. Send messages to the iframe to update the component or request screen captures.
3. Listen for messages from the iframe to receive captured images or other data.

## Key Components

- `Home`: The main component that handles message passing and component rendering.
- `getReactComponentFromCode`: A utility function that converts string code into a React component using `babel`.
- `html2canvas`: Used for capturing the rendered component as an image.

## Message Types

- `INIT_COMPLETE`: Sent when the iframe is ready to receive messages.
- `UPDATE_COMPONENT`: Received to update the rendered component.
- `CAPTURE_SELECTION`: Received to capture a specific area of the rendered component.
- `SELECTION_DATA`: Sent with captured image data.

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/13point5/open-artifacts-renderer.git
   ```

2. Navigate to the project directory:

   ```
   cd open-artifacts-renderer
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Run the development server:

   ```
   npm run dev
   ```

5. Set the `NEXT_PUBLIC_ARTIFACT_RENDERER_URL` env variable in the [Open Artifacts](https://github.com/13point5/open-artifacts) app to the URL of this app

## License

This project is licensed under the [MIT License](LICENSE).
