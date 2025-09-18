import { HotelDashboard } from "@/components/hotel-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function HotelPage() {
  return (
    <ProtectedRoute allowedRoles={["hotel"]}>
      <HotelDashboard />
    </ProtectedRoute>
  )
}
