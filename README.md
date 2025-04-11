# ⚡️Fleek Platform Agents Chatbox Widget

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-blue.svg)](https://conventionalcommits.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A standalone widget that allows users to embed a chatbox on any website to interact with a Fleek agent. This lightweight, customizable widget can be easily integrated into any website with a simple script tag or imported as a React component.

## What is this project about?

The Fleek Chatbox Widget is a drop-in solution for adding AI chat capabilities to your website. It provides:

- A floating chat button that expands into a full chat interface
- Real-time messaging with Fleek AI agents
- Customizable appearance through CSS variables
- Responsive design that works on both desktop and mobile devices
- Lightweight implementation using Preact
- Available as both a standalone script and a React component

![Chatbox Widget Demo](https://via.placeholder.com/600x400?text=Fleek+Chatbox+Widget)

## Installation

### For Development

To set up the project for development:

```bash
git clone https://github.com/fleek-platform/chatbox-widget.git
cd chatbox-widget

npm install
```

### For Usage in a React Project

```bash
npm install @fleek-platform/agents-chatbox-widget
```

## Development

To start the development server:

```bash
npm run dev
```

This will:

1. Build the project using Rollup with watch mode
2. Start a live server that opens test/index.html
3. Automatically reload when changes are detected

### Project Structure

```
fleek-chatbox-widget/
├── dist/               # Built files (generated)
├── src/                # Source code
│   ├── components/     # UI components
│   │   ├── icons/      # SVG icons as React components
│   │   └── *.tsx       # Component files
│   ├── core/           # Core functionality
│   │   ├── api.ts      # API client
│   │   ├── types.ts    # TypeScript type definitions
│   │   └── utils.ts    # Utility functions
│   ├── npm/            # React/NPM package entry point
│   │   └── index.ts    # NPM package entry
│   ├── standalone/     # Standalone script
│   │   └── chatbox.ts  # Standalone entry point
│   └── global.css      # Global styles and CSS variables
├── examples/           # Example usage
│   ├── react-app/      # React example
├── test/               # Test files
│   └── index.html      # Test page for development
├── package.json        # Project dependencies and scripts
└── rollup.config.js    # Rollup build configuration
```

## How to Build

To build the project for production:

```bash
npm run build

npm run build:standalone

npm run build:npm
```

This creates the following files in the `dist/` directory:

- `dist/chatbox.min.js` - The standalone script to be included on websites
- `dist/index.esm.js` - ES module for npm package
- `dist/index.cjs.js` - CommonJS module for npm package
- `dist/index.d.ts` - TypeScript declarations

## Versioning and Releases

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and automated releases.

### How to Create a Release

1. Make your changes to the codebase
2. Add a changeset to describe your changes:
   ```bash
   npx changeset
   ```
3. Follow the prompts to select the type of change (major, minor, patch) and provide a description
4. Commit the generated changeset file along with your code changes
5. Create a pull request
6. When the PR is merged to main, a GitHub Action will:
   - Create a version PR if there are changesets
   - When the version PR is merged:
     - Update the version in package.json
     - Update the CHANGELOG.md
     - Publish to npm
     - Deploy the standalone script to GitHub Pages

### Manual Triggering

You can also manually trigger the release process:

1. Go to your GitHub repository
2. Navigate to the "Actions" tab
3. Select the "Release" workflow
4. Click on "Run workflow"
5. Optionally provide a reason for the manual trigger
6. Click "Run workflow" to start the process

### Accessing Versioned Builds

For production use, we recommend using a specific version of the standalone script:

```html
<script
  src="https://unpkg.com/@fleek-platform/agents-chatbox-widget@<VERSION>/dist/chatbox.min.js?agentId=<YOUR_AGENT_ID>&token=<YOUR_API_KEY>"
  async
></script>
```

> [!NOTE]
> Replace `<VERSION>`, `<YOUR_AGENT_ID>` and `<YOUR_API_KEY>` with your own details.

## Usage Options

### Option 1: Standalone Script

To add the Fleek Chatbox Widget to your website using the standalone script, include the script tag in your HTML:

```html
<script
  src="https://unpkg.com/@fleek-platform/agents-chatbox-widget@<VERSION>/dist/chatbox.min.js?agentId=<YOUR_AGENT_ID>&token=<YOUR_API_KEY>&containerId=<YOUR_HTML_ELEMENT_ID>"
  async
></script>
```

> [!NOTE]
> Replace `<VERSION>`, `<YOUR_AGENT_ID>`, `<YOUR_API_KEY>` and `<YOUR_HTML_ELEMENT_ID>` with your own details.

#### Parameters

- `agentId` (required): Your Fleek agent ID
- `token` (required): Your TOKEN for authentication
- `restApiHost` (optional): Custom API host URL (defaults to production URL if not provided)
- `containerId` (optional): ID of an existing element to render the widget into

Example:

```html
<script
  src="https://unpkg.com/@fleek-platform/agents-chatbox-widget@1.0.0/dist/chatbox.min.js?agentId=abcdef&token=abcdef&containerId=chat-container"
  async
></script>
```

> [!WARNING]
> You must replace the values in the script `src` with your own details.

When using the `containerId` parameter, you need to have an element with that ID in your HTML:

```html
<div id="chat-container"></div>
```

### Option 2: React Component

To use the Fleek Chatbox Widget in a React application:

```jsx
import React from 'react';
import FleekChatbox from '@fleek-platform/agents-chatbox-widget';

function App() {
  return (
    <div className="App">
      <FleekChatbox
        agentId="YOUR_AGENT_ID"
        token="YOUR_TOKEN"
        restApiHost="https://api.custom-domain.com"
        colors={{
          'color-primary': '#FF69B4',
        }}
        isWidgetOpen={false}
      />
    </div>
  );
}

export default App;
```

#### Props

- `agentId` (required): Your Fleek agent ID
- `token` (required): Your token for authentication
- `colors` (optional): An object with color overrides
- `restApiHost` (optional): Custom API host URL (defaults to production URL if not provided)
- `isWidgetOpen` (optional): Boolean to control if the widget is initially open (default: false)

Example:

```jsx
<FleekChatbox
  agentId="123"
  token="abc123"
  restApiHost="https://api.custom-domain.com"
  colors={{
    'accent-9': '#ff0000',
    'neutral-3': '#f5f5f5',
  }}
  isWidgetOpen={true}
/>
```

## API Host Configuration

You can specify a custom API host for the widget to connect to by using the `restApiHost` parameter:

```html
<script
  src="https://unpkg.com/@fleek-platform/agents-chatbox-widget@<VERSION>/dist/chatbox.min.js?agentId=<YOUR_AGENT_ID>&token=<YOUR_TOKEN>&restApiHost=https://<REST_API>"
  async
></script>
```

If no `restApiHost` is specified, the widget will connect to the production API at `https://api.fleek.xyz`.

This is useful when you need to connect to a custom API endpoint or a self-hosted version of the Fleek API.

## How to Override Colors

### In Standalone Script

You can customize the appearance of the widget by overriding the default colors. This is done by passing a JSON object in the `colors` parameter:

```html
<script
  src="https://unpkg.com/@fleek-platform/agents-chatbox-widget@<VERSION>/dist/chatbox.min.js?agentId=<YOUR_AGENT_ID>&token=<YOUR_API_TOKEN>&colors=%7B%22accent-9%22%3A%22%23ff0000%22%2C%22neutral-3%22%3A%22%23f5f5f5%22%7D"
  async
></script>
```

> [!NOTE]
> Replace `<VERSION>`, `<YOUR_AGENT_ID>` and `<YOUR_API_KEY>`with your own details.

The `colors` parameter is a URL-encoded JSON object where:

- Keys are CSS variable names without the `--` prefix
- Values are valid CSS color values

Example (before URL encoding):

```json
{
  "accent-9": "#ff0000",
  "neutral-3": "#f5f5f5"
}
```

### In React Component

When using the React component, you can pass the colors directly as an object:

```jsx
<FleekChatbox
  agentId="123"
  token="abc123"
  colors={{
    'accent-9': '#ff0000',
    'neutral-3': '#f5f5f5',
  }}
/>
```

### Available Color Variables

- **Neutral colors**: `--neutral-1` through `--neutral-12`
- **Accent colors**: `--accent-1` through `--accent-12`
- **Warning colors**: `--warning-1` through `--warning-12`

These color variables can be used to customize the appearance of the widget to match your website's design.

## Troubleshooting

### Common Issues

#### Widget doesn't appear on the page

- Check that the script URL is correct
- Verify that your `agentId` and `token` are valid
- Check the browser console for any JavaScript errors
- Ensure there are no Content Security Policy (CSP) restrictions blocking the script

#### Custom colors not applying

- Make sure your JSON is properly URL-encoded (for standalone script)
- Check the browser console for any parsing errors
- Verify the color variable names match those in the documentation

#### Widget appears but agent doesn't respond

- Verify your API key has the correct permissions
- Check that the agent ID is correct and the agent is active
- Look for network errors in the browser's developer tools

### Browser Console Logs

The widget outputs information to the browser console that can help with troubleshooting. Check your browser's developer tools console for messages related to the widget's initialization and operation.

### Development Guidelines

- Follow the existing code style
- Write clear, descriptive commit messages
- Always include a changeset for changes that affect functionality
- Add tests for new features
- Update documentation as needed

### Code Style

This project uses Biome for formatting and linting:

```bash
npm run format

npm run format:check

npm run lint

npm run lint:check
```

## 🙏 Contributing

This section guides you through the process of contributing to our open-source project. From creating a feature branch to submitting a pull request, get started by:

1. Fork the project [here](https://github.com/fleekxyz/cli)
2. Create your feature branch using our [branching strategy](#branching-strategy), e.g. `git checkout -b feat/my-new-feature`
3. Run the tests: `pnpm test`
4. Commit your changes by following our [commit conventions](#conventional-commits), e.g. `git commit -m 'chore: 🤖 my contribution description'`
5. Push to the branch, e.g. `git push origin feat/my-new-feature`
6. Create new Pull Request following the corresponding template guidelines

### Branching strategy

The develop branch serves as the main integration branch for features, enhancements, and fixes. It is always in a deployable state and represents the latest development version of the application.

Feature branches are created from the develop branch and are used to develop new features or enhancements. They should be named according to the type of work being done and the scope of the feature and in accordance with conventional commits [here](#conventional-commits).

### Conventional commits

We prefer to commit our work following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0) conventions. Conventional Commits are a simple way to write commit messages that both people and computers can understand. It help us keep track fo changes in a consistent manner, making it easier to see what was added, changed, or fixed in each commit or update.

The commit messages are formatted as **[type]/[scope]**
The **type** is a short descriptor indicating the nature of the work (e.g., feat, fix, docs, style, refactor, test, chore). This follows the conventional commit types.

The **scope** is a more detailed description of the feature or fix. This could be the component or part of the codebase affected by the change.

Here's an example of different conventional commits messages that you should follow:

```txt
test: 💍 Adding missing tests
feat: 🎸 A new feature
fix: 🐛 A bug fix
chore: 🤖 Build process or auxiliary tool changes
docs: 📝 Documentation only changes
refactor: 💡 A code change that neither fixes a bug or adds a feature
style: 💄 Markup, white-space, formatting, missing semi-colons...
```
