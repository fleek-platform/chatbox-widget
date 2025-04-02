# Fleek Chatbox Widget

A standalone widget that allows users to embed a chatbox on any website to interact with a Fleek agent. This lightweight, customizable widget can be easily integrated into any website with a simple script tag.

## What is this project about?

The Fleek Chatbox Widget is a drop-in solution for adding AI chat capabilities to your website. It provides:

- A floating chat button that expands into a full chat interface
- Real-time messaging with Fleek AI agents
- Customizable appearance through CSS variables
- Responsive design that works on both desktop and mobile devices
- Lightweight implementation using Preact

![Chatbox Widget Demo](https://via.placeholder.com/600x400?text=Fleek+Chatbox+Widget)

## Installation

To set up the project for development:

```bash
# Clone the repository
git clone https://github.com/your-org/fleek-chatbox-widget.git
cd fleek-chatbox-widget

# Install dependencies
npm install
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
│   ├── chatbox.ts      # Main entry point
│   ├── global.css      # Global styles and CSS variables
│   ├── types.ts        # TypeScript type definitions
│   └── utils.ts        # Utility functions
├── test/               # Test files
│   └── index.html      # Test page for development
├── package.json        # Project dependencies and scripts
└── rollup.config.js    # Rollup build configuration
```

## How to Build

To build the project for production:

```bash
# Build for production
npm run build
```

This creates a minified bundle in the `dist/` directory:

- `dist/chatbox.js` - The main script to be included on websites

## How to Use the Generated Script

To add the Fleek Chatbox Widget to your website, include the script tag in your HTML:

```html
<script
  src="https://cdn.fleek.xyz/chatbox.js?agentId=YOUR_AGENT_ID&apiKey=YOUR_API_KEY"
  async
></script>
```

### Required Parameters

- `agentId`: Your Fleek agent ID
- `apiKey`: Your API key for authentication

Example:

```html
<script
  src="https://cdn.fleek.xyz/chatbox.js?agentId=123&apiKey=abc123"
  async
></script>
```

## How to Override Colors

You can customize the appearance of the widget by overriding the default colors. This is done by passing a JSON object in the `colors` parameter:

```html
<script
  src="https://cdn.fleek.xyz/chatbox.js?agentId=YOUR_AGENT_ID&apiKey=YOUR_API_KEY&colors=%7B%22accent-9%22%3A%22%23ff0000%22%2C%22neutral-3%22%3A%22%23f5f5f5%22%7D"
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

### Available Color Variables

- **Neutral colors**: `--neutral-1` through `--neutral-12`
- **Accent colors**: `--accent-1` through `--accent-12`
- **Warning colors**: `--warning-1` through `--warning-12`

For a complete list of available variables, see the [theme usage documentation](docs/theme-usage.md).

## Troubleshooting

### Common Issues

#### Widget doesn't appear on the page

- Check that the script URL is correct
- Verify that your `agentId` and `apiKey` are valid
- Check the browser console for any JavaScript errors
- Ensure there are no Content Security Policy (CSP) restrictions blocking the script

#### Custom colors not applying

- Make sure your JSON is properly URL-encoded
- Check the browser console for any parsing errors
- Verify the color variable names match those in the documentation

#### Widget appears but agent doesn't respond

- Verify your API key has the correct permissions
- Check that the agent ID is correct and the agent is active
- Look for network errors in the browser's developer tools

### Debugging

To enable debug mode, add `debug=true` to the script parameters:

```html
<script
  src="https://cdn.fleek.xyz/chatbox.js?agentId=YOUR_AGENT_ID&apiKey=YOUR_API_KEY&debug=true"
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
7. Commit your changes: `git commit -m 'Add some feature'`
8. Push to the branch: `git push origin feature/my-new-feature`
9. Submit a pull request

### Development Guidelines

- Follow the existing code style
- Write clear, descriptive commit messages
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
