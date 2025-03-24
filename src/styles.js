export function addStyles() {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .typing-dots span {
      animation: blink 1.4s infinite both;
    }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink {
      0% { opacity: 0.2; }
      20% { opacity: 1; }
      100% { opacity: 0.2; }
    }
  `;
  document.head.appendChild(styleSheet);
}