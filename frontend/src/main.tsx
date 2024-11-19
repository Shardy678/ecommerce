import { createRoot } from "react-dom/client";
import { Provider } from "./Context.tsx";
import { AuthProvider } from "./AuthContext.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProductPage from "./ProductPage.tsx";
import './index.css'
import MainPage from "./MainPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage/>,
  },
  {
    path: "/products",
    element: <ProductPage/>,
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
