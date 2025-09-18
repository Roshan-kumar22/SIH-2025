import { IntegratedMonitoringDashboard } from "@/components/integrated-monitoring-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function IntegratedMonitoringPage() {
  return (
    <ProtectedRoute allowedRoles={["police", "admin"]}>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-primary">Integrated AI & Blockchain Monitoring</h1>
            <p className="text-muted-foreground">
              Unified dashboard combining AI anomaly detection with blockchain verification
            </p>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <IntegratedMonitoringDashboard />
        </div>
      </div>
    </ProtectedRoute>
  )
}
