import { TouristDashboard } from "@/components/tourist-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function TouristPage() {
  return (
    <ProtectedRoute allowedRoles={["tourist"]}>
      <TouristDashboard />
    </ProtectedRoute>
  )
}
