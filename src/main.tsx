
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from "next-themes";
import App from './App.tsx';
import './index.css';
import './App.css';

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <App />
  </ThemeProvider>
);
