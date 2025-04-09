import FleekChatbox from 'fleek-chatbox-widget';
import React, { useState } from 'react';

function App() {
  const [primaryColor, setPrimaryColor] = useState('#FF69B4');

  const generateRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setPrimaryColor(randomColor);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Fleek Chatbox Widget React Example</h1>
        <p>
          This page demonstrates the chatbox widget imported as a React
          component.
        </p>
        <button
          type="button"
          onClick={generateRandomColor}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          Randomize Color
        </button>
        <div style={{ marginBottom: '10px' }}>
          Current color:{' '}
          <span style={{ color: primaryColor }}>{primaryColor}</span>
        </div>
      </div>

      <FleekChatbox
        agentId="123"
        token="abc123"
        colors={{
          'color-primary': primaryColor,
        }}
        isWidgetOpen={true}
      />
    </div>
  );
}

export default App;
