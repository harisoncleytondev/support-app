import { createBrowserRouter, Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Home from "../pages/home/Home";
import UserHome from "../pages/user/UserHome";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import NewTicket from "../pages/new-ticket/NewTicket";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageCategories from "../pages/admin/ManageCategories";

function Loading() {
  return (
    <div className="h-screen flex items-center justify-center text-sm text-[#6B7280]">
      Carregando...
    </div>
  );
}

function HomeRouter() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? <Home /> : <UserHome />;
}

function NewTicketGuard() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/" replace />;
  return <NewTicket />;
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    Component: HomeRouter,
  },
  {
    path: "/new-ticket",
    Component: NewTicketGuard,
  },
  {
    path: "/admin/manage-users",
    element: (
      <AdminGuard>
        <ManageUsers />
      </AdminGuard>
    ),
  },
  {
    path: "/admin/manage-categories",
    element: (
      <AdminGuard>
        <ManageCategories />
      </AdminGuard>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
