import { AirportDashboard } from "@/components/airport-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AirportPage() {
  return (
    <ProtectedRoute allowedRoles={["airport"]}>
      <AirportDashboard />
    </ProtectedRoute>
  )
}
