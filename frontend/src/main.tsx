import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "./Context.tsx";
import { AuthProvider } from "./AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <Provider>
      <App />
    </Provider>
  </AuthProvider>
);
