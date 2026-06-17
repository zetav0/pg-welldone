import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./components/common/Toast";
import { GlobalStyle, theme } from "./theme";
import { PageShell } from "./components/layout/PageShell";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Settings from "./pages/Settings";
import Purchases from "./pages/Purchases";
import Customers from "./pages/Customers";
import InvoicingLayout from "./pages/invoicing/InvoicingLayout";
import Quotes from "./pages/invoicing/Quotes";
import Vouchers from "./pages/invoicing/Vouchers";
import Guides from "./pages/invoicing/Guides";

function AuthLayout() {
  return (
    <PageShell>
      <Outlet />
    </PageShell>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
  {
    element: <AuthLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/inventory", element: <Inventory /> },
      { path: "/sales",     element: <Sales />     },
      { path: "/settings",  element: <Settings />  },
      { path: "/purchases",  element: <Purchases />  },
      { path: "/customers",  element: <Customers />  },
      {
        path: "/invoicing",
        element: <InvoicingLayout />,
        children: [
          { index: true, element: <Navigate to="/invoicing/quotes" replace /> },
          { path: "quotes",   element: <Quotes />   },
          { path: "vouchers", element: <Vouchers /> },
          { path: "guides",   element: <Guides />   },
        ],
      },
    ],
  },
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
