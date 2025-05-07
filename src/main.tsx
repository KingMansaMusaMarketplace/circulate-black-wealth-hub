
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './App.css';

// Get the root element and ensure it fills the viewport
const rootElement = document.getElementById("root");
if (rootElement) {
  rootElement.style.width = "100%";
  rootElement.style.minHeight = "100vh";
  rootElement.style.display = "flex";
  rootElement.style.flexDirection = "column";
}

createRoot(document.getElementById("root")!).render(<App />);
