"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Hash,
  Eye,
  FileText,
  Scan,
  Download,
  Copy,
  ExternalLink,
} from "lucide-react"

interface VerificationResult {
  isValid: boolean
  touristId: string
  status: "active" | "expired" | "revoked" | "invalid"
  issuedAt: string
  expiresAt: string
  blockchainHash: string
  verificationDetails: {
    hashVerified: boolean
    signatureVerified: boolean
    timestampValid: boolean
    notExpired: boolean
    notRevoked: boolean
  }
  touristInfo?: {
    name: string
    nationality: string
    visitPeriod: string
    visitingStates: string[]
  }
}

interface AuditEvent {
  eventId: string
  timestamp: string
  eventType: "id_created" | "id_verified" | "location_update" | "emergency_alert" | "status_change"
  description: string
  blockchainHash: string
  verifiedBy?: string
  location?: string
  metadata?: Record<string, any>
}

export function BlockchainVerification() {
  const [touristId, setTouristId] = useState("")
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoadingAudit, setIsLoadingAudit] = useState(false)

  const verifyId = async () => {
    if (!touristId.trim()) return

    setIsVerifying(true)
    try {
      const response = await fetch("/api/blockchain/verify-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ touristId: touristId.trim() }),
      })

      const result = await response.json()
      if (result.success) {
        setVerificationResult(result.verification)
      }
    } catch (error) {
      console.error("Verification failed:", error)
    } finally {
      setIsVerifying(false)
    }
  }

  const loadAuditTrail = async () => {
    if (!touristId.trim()) return

    setIsLoadingAudit(true)
    try {
      const response = await fetch("/api/blockchain/audit-trail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ touristId: touristId.trim() }),
      })

      const result = await response.json()
      if (result.success) {
        setAuditTrail(result.auditTrail)
      }
    } catch (error) {
      console.error("Audit trail loading failed:", error)
    } finally {
      setIsLoadingAudit(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200"
      case "expired":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "revoked":
        return "text-red-600 bg-red-50 border-red-200"
      case "invalid":
        return "text-gray-600 bg-gray-50 border-gray-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case "id_created":
        return <Shield className="h-4 w-4" />
      case "id_verified":
        return <CheckCircle className="h-4 w-4" />
      case "location_update":
        return <Eye className="h-4 w-4" />
      case "emergency_alert":
        return <AlertCircle className="h-4 w-4" />
      case "status_change":
        return <FileText className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Verification Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Blockchain ID Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="touristId">Tourist ID</Label>
              <Input
                id="touristId"
                placeholder="Enter Tourist ID (e.g., TST-2024-A7B9C2D1)"
                value={touristId}
                onChange={(e) => setTouristId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && verifyId()}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={verifyId} disabled={isVerifying || !touristId.trim()}>
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={loadAuditTrail} disabled={isLoadingAudit || !touristId.trim()}>
                <FileText className="h-4 w-4 mr-2" />
                Audit Trail
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Results */}
      {verificationResult && (
        <Tabs defaultValue="verification" className="space-y-4">
          <TabsList>
            <TabsTrigger value="verification">Verification Result</TabsTrigger>
            <TabsTrigger value="details">Technical Details</TabsTrigger>
            {auditTrail.length > 0 && <TabsTrigger value="audit">Audit Trail</TabsTrigger>}
          </TabsList>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {verificationResult.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    Verification Result
                  </CardTitle>
                  <Badge className={getStatusColor(verificationResult.status)}>
                    {verificationResult.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {verificationResult.isValid ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      <strong>Valid Digital Tourist ID</strong>
                      <br />
                      This ID has been successfully verified on the blockchain and is currently active.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      <strong>Invalid or Expired Digital Tourist ID</strong>
                      <br />
                      This ID could not be verified or has expired. Please contact authorities for assistance.
                    </AlertDescription>
                  </Alert>
                )}

                {verificationResult.touristInfo && (
                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Tourist Information</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <span className="ml-2 font-medium">{verificationResult.touristInfo.name}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Nationality:</span>
                          <span className="ml-2 font-medium">{verificationResult.touristInfo.nationality}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Visit Period:</span>
                          <span className="ml-2 font-medium">{verificationResult.touristInfo.visitPeriod}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Visiting States</h4>
                      <div className="flex flex-wrap gap-2">
                        {verificationResult.touristInfo.visitingStates.map((state, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {state}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tourist ID:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-muted px-2 py-1 rounded text-xs">{verificationResult.touristId}</code>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(verificationResult.touristId)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Blockchain Hash:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        {verificationResult.blockchainHash.substring(0, 16)}...
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(verificationResult.blockchainHash)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Technical Verification Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(verificationResult.verificationDetails).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <div className="flex items-center gap-2">
                        {value ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className={value ? "text-green-600" : "text-red-600"}>
                          {value ? "Verified" : "Failed"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Blockchain Information</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Network:</span>
                      <span className="ml-2">SafeTour-Chain-Testnet</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Issued:</span>
                      <span className="ml-2">{new Date(verificationResult.issuedAt).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expires:</span>
                      <span className="ml-2">{new Date(verificationResult.expiresAt).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(verificationResult.status)} size="sm">
                        {verificationResult.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {auditTrail.length > 0 && (
            <TabsContent value="audit">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Blockchain Audit Trail
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auditTrail.map((event, index) => (
                      <div key={event.eventId} className="flex gap-4 p-4 rounded-lg border">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                            {getEventTypeIcon(event.eventType)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{event.description}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          </div>
                          {event.location && <p className="text-sm text-muted-foreground mb-2">📍 {event.location}</p>}
                          {event.verifiedBy && (
                            <p className="text-sm text-muted-foreground mb-2">✓ Verified by: {event.verifiedBy}</p>
                          )}
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {event.blockchainHash.substring(0, 12)}...
                            </code>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(event.blockchainHash)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  )
}
