import React from 'react';
import FleekChatbox from 'fleek-chatbox-widget';

function App() {
  return (
    <div className="App">
      <div class="container">
        <h1>Fleek Chatbox Widget React Example</h1>
        <p>
          This page demonstrates the chatbox widget imported as a React
          component.
        </p>
      </div>

      <FleekChatbox
        agentId="123"
        apiKey="abc123"
        colors={{
          'color-primary': '#FF69B4',
        }}
      />
    </div>
  );
}

export default App;
