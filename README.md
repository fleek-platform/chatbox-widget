# Fleek Chatbox Widget

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
# Clone the repository
git clone https://github.com/your-org/fleek-chatbox-widget.git
cd fleek-chatbox-widget

# Install dependencies
npm install
```

### For Usage in a React Project

```bash
# Install from npm
npm install fleek-chatbox-widget
```

## Development

To start the development server:

```bash
# Run the development server with live reloading
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
# Build both standalone script and npm package
npm run build

# Build only the standalone script
npm run build:standalone

# Build only the npm package
npm run build:npm
```

This creates the following files in the `dist/` directory:

- `dist/chatbox.js` - The standalone script to be included on websites
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
  src="https://[username].github.io/[repo-name]/chatbox-1.0.0.js?agentId=YOUR_AGENT_ID&pat=YOUR_API_KEY"
  async
></script>
```

Replace `1.0.0` with the specific version you want to use.

## Usage Options

### Option 1: Standalone Script

To add the Fleek Chatbox Widget to your website using the standalone script, include the script tag in your HTML:

```html
<script
  src="https://cdn.fleek.xyz/chatbox.js?agentId=YOUR_AGENT_ID&pat=YOUR_API_KEY"
  async
></script>
```

#### Required Parameters

- `agentId`: Your Fleek agent ID
- `pat`: Your PAT for authentication
- `env` (optional): Environment to connect to (`dev`, `staging`, or `prod` (default))

Example:

```html
<script
  src="https://cdn.fleek.xyz/chatbox.js?agentId=123&pat=abc123&env=staging"
  async
></script>
```

### Option 2: React Component

To use the Fleek Chatbox Widget in a React application:

```jsx
import React from 'react';
import FleekChatbox from 'fleek-chatbox-widget';

function App() {
  return (
    <div className="App">
      <FleekChatbox
        agentId="YOUR_AGENT_ID"
        pat="YOUR_API_KEY"
        env="staging"
        colors={{
          'color-primary': '#FF69B4',
        }}
      />
    </div>
  );
}

export default App;
```

#### Props

- `agentId` (required): Your Fleek agent ID
- `pat` (required): Your API key for authentication
- `colors` (optional): An object with color overrides
- `env` (optional): Environment to connect to (`dev`, `staging`, or `prod` (default))

Example:

```jsx
<FleekChatbox
  agentId="123"
  pat="abc123"
  env="dev"
  colors={{
    'accent-9': '#ff0000',
    'neutral-3': '#f5f5f5',
  }}
/>
```

## Environment Configuration

You can specify which environment the widget should connect to by using the `env` parameter:

- `prod` (default): Production - https://api.fleek.xyz
- `staging`: Staging - https://api.staging.fleeksandbox.xyz
- `dev`: Development - https://api.dev.fleeksandbox.xyz

If no environment is specified, the widget will connect to the production environment.

This is useful for testing your integration against different environments before deploying to production.

## How to Override Colors

### In Standalone Script

You can customize the appearance of the widget by overriding the default colors. This is done by passing a JSON object in the `colors` parameter:

```html
<script
  src="https://cdn.fleek.xyz/chatbox.js?agentId=YOUR_AGENT_ID&pat=YOUR_API_KEY&colors=%7B%22accent-9%22%3A%22%23ff0000%22%2C%22neutral-3%22%3A%22%23f5f5f5%22%7D"
  async
></script>
```

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
  pat="abc123"
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

For a complete list of available variables, see the [theme usage documentation](docs/theme-usage.md).

## Troubleshooting

### Common Issues

#### Widget doesn't appear on the page

- Check that the script URL is correct
- Verify that your `agentId` and `pat` are valid
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

### Debugging

To enable debug mode in the standalone script, add `debug=true` to the script parameters:

```html
<script
  src="https://cdn.fleek.xyz/chatbox.js?agentId=YOUR_AGENT_ID&pat=YOUR_API_KEY&debug=true"
  async
></script>
```

This will output additional information to the browser console.

## How to Contribute

Contributions to the Fleek Chatbox Widget are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-feature`
3. Make your changes
4. Run the linter: `npm run lint`
5. Build the project: `npm run build`
6. Test your changes
7. Add a changeset to describe your changes: `npx changeset`
8. Commit your changes: `git commit -m 'Add some feature'`
9. Push to the branch: `git push origin feature/my-new-feature`
10. Submit a pull request

### Development Guidelines

- Follow the existing code style
- Write clear, descriptive commit messages
- Always include a changeset for changes that affect functionality
- Add tests for new features
- Update documentation as needed

### Code Style

This project uses Biome for formatting and linting:

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Check linting
npm run lint:check
```

## License

[MIT License](LICENSE)
