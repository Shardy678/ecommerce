import { createRoot } from "react-dom/client";
import { Provider } from "./Context.tsx";
import { AuthProvider } from "./AuthContext.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./MainPage.tsx";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage/>,
  },
  {
    path: "/success",
    element: <h1>Success!</h1>
  }
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <Provider>
      <RouterProvider router={router}/>
    </Provider>
  </AuthProvider>
);
