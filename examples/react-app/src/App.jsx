import FleekChatbox from 'fleek-chatbox-widget';
import React from 'react';

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
        token="abc123"
        colors={{
          'color-primary': '#FF69B4',
        }}
        isWidgetOpen={true}
      />
    </div>
  );
}

export default App;
