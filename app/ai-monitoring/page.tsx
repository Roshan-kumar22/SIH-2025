import { AIMonitoringPanel } from "@/components/ai-monitoring-panel"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AIMonitoringPage() {
  return (
    <ProtectedRoute allowedRoles={["police", "admin"]}>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-primary">AI Safety Monitoring</h1>
            <p className="text-muted-foreground">Real-time anomaly detection and predictive analytics</p>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <AIMonitoringPanel />
        </div>
      </div>
    </ProtectedRoute>
  )
}
