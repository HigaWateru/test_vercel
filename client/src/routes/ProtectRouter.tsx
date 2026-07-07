import React from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRouterProps {
  children: React.ReactNode
}

export default function ProtectedRouter({children}: ProtectedRouterProps) {
  const currentUser = localStorage.getItem("currentUser")
  if (!currentUser) return <Navigate to="/login" replace />
  return <>{children}</>
}