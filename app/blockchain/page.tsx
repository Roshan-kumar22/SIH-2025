import { BlockchainVerification } from "@/components/blockchain-verification"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function BlockchainPage() {
  return (
    <ProtectedRoute allowedRoles={["police", "airport", "hotel", "admin"]}>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-primary">Blockchain Verification</h1>
            <p className="text-muted-foreground">Verify digital tourist IDs and view blockchain audit trails</p>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <BlockchainVerification />
        </div>
      </div>
    </ProtectedRoute>
  )
}
