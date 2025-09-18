import { PoliceDashboard } from "@/components/police-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function PolicePage() {
  return (
    <ProtectedRoute allowedRoles={["police"]}>
      <PoliceDashboard />
    </ProtectedRoute>
  )
}
