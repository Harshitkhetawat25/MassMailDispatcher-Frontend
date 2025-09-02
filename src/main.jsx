import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/poppins"; // Default weight (400)
import "@fontsource/poppins/400.css"; // Specific weight
import "@fontsource/poppins/700.css"; // Bold
import App from "./App.jsx";
import { store } from "./redux/store.js";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
