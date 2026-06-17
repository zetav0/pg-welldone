import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./components/common/Toast";
import { GlobalStyle, theme } from "./theme";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/inventory", element: <Inventory /> },
  { path: "/sales", element: <Sales /> },
  { path: "/settings", element: <Settings /> },
]);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
