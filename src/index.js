import "./index.css";
import App from "./app";
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';


// This is the ID of the div in your index.html file

const rootElement = document.getElementById('root');
const roots = createRoot(rootElement);

roots.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
