import LazyLoad from "@/components/LazyLoad";
import MyTask from "@/pages/projectManager/MyTask";
import NotFound from "@/pages/projectManager/NotFound";
import ProductDetail from "@/pages/projectManager/ProjectDetail";
import ProjectList from "@/pages/projectManager/ProjectList";
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRouter from "./ProtectRouter";

const Login = React.lazy(() => import("@/pages/login"));
const Register = React.lazy(() => import("@/pages/register"));

function RootRedirect() {
  const userId = localStorage.getItem("currentUser");
  return <Navigate to={userId ? "/projects" : "/login"} replace />;
}

const routers = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/login",
    element: <LazyLoad children={<Login />} />,
  },
  {
    path: "/register",
    element: <LazyLoad children={<Register />} />,
  },
  {
    path: "/projects",
    element: <ProtectedRouter>
      <LazyLoad children={<ProjectList />}/>
    </ProtectedRouter>,
  },
  {
    path: "projects/:id",
    element: <ProtectedRouter>
       <LazyLoad children={<ProductDetail/>}/>
    </ProtectedRouter>,
  },
  {
    path: "mytask",
    element: <ProtectedRouter>
      <LazyLoad children={<MyTask/>}/>
    </ProtectedRouter>
  },
  {
    path: "*",
    element: <LazyLoad children={<NotFound/>}/>
  }
]);

export default routers;
