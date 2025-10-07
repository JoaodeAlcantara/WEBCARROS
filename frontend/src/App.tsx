import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CarDetail from "./pages/CarDetail";
import Dashboard from "./pages/Dashboard";
import New from "./pages/New";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import { Private } from "./routes/private";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/car/:slug',
        element: <CarDetail />
      },
      {
        path: '/dashboard',
        element: <Private><Dashboard /></Private>
      },
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/dashboard/new',
        element: <Private><New /></Private>
      },
      {
        path: '/dashboard/favorites',
        element: <Private><Favorites /></Private>
      },
      {
        path: '*',
        element: <NotFound />
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },

])
