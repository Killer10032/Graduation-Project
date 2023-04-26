import React from "react";
import Rotation from "../components/main/Rotation"
import News from "../components/main/News"
import { useRoutes, Navigate } from "react-router-dom"
import AddNews from "../components/main/AddNews";
import NewDetails from "../components/main/NewDetails";

export default function Routes() {
    return useRoutes([
        { path: "/home", element: <Rotation /> },
        { path: "/news", element: <News /> },
        { path: "/addNew", element: <AddNews /> },
        { path: "/addNew/:id", element: <AddNews /> },
        { path: "/newDetails/:id", element: <NewDetails /> },
        { path: "/", element: <Navigate replace to="/home" /> }
    ])
}