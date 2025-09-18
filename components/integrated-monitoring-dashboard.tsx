"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AIMonitoringPanel } from "./ai-monitoring-panel"
import { BlockchainVerification } from "./blockchain-verification"
import { Brain, Shield, Activity, AlertTriangle, CheckCircle, TrendingUp, Hash, Eye, Zap } from "lucide-react"

interface IntegratedAlert {
  id: string
  type: "ai_anomaly" | "blockchain_verification" | "cross_validation"
  severity: "low" | "medium" | "high"
  title: string
  description: string
  timestamp: string
  touristId: string
  aiConfidence?: number
  blockchainVerified?: boolean
  actionRequired: boolean
}

export function IntegratedMonitoringDashboard() {
  const [alerts, setAlerts] = useState<IntegratedAlert[]>([])
  const [systemStats, setSystemStats] = useState({
    aiProcessing: true,
    blockchainSynced: true,
    crossValidationActive: true,
    totalTourists: 3421,
    activeMonitoring: 2847,
    verifiedIds: 3398,
    anomaliesDetected: 23,
    blockchainTransactions: 15847,
  })

  useEffect(() => {
    // Simulate integrated monitoring alerts
    const mockAlerts: IntegratedAlert[] = [
      {
        id: "INT-001",
        type: "cross_validation",
        severity: "high",
        title: "AI-Blockchain Cross-Validation Alert",
        description: "AI detected anomaly for tourist TST-2024-A7B9C2D1, but blockchain verification shows valid ID",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        touristId: "TST-2024-A7B9C2D1",
        aiConfidence: 0.87,
        blockchainVerified: true,
        actionRequired: true,
      },
      {
        id: "INT-002",
        type: "ai_anomaly",
        severity: "medium",
        title: "Behavioral Pattern Anomaly",
        description: "Unusual movement pattern detected with blockchain audit trail confirmation",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        touristId: "TST-2024-B8C3D4E2",
        aiConfidence: 0.73,
        blockchainVerified: true,
        actionRequired: false,
      },
      {
        id: "INT-003",
        type: "blockchain_verification",
        severity: "high",
        title: "ID Verification Failure",
        description: "Blockchain verification failed for tourist attempting to access restricted area",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        touristId: "TST-2024-INVALID",
        blockchainVerified: false,
        actionRequired: true,
      },
    ]

    setAlerts(mockAlerts)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ai_anomaly":
        return <Brain className="h-4 w-4" />
      case "blockchain_verification":
        return <Shield className="h-4 w-4" />
      case "cross_validation":
        return <Activity className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Processing</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {systemStats.aiProcessing ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm font-medium">{systemStats.aiProcessing ? "Active" : "Offline"}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {systemStats.activeMonitoring.toLocaleString()} tourists monitored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blockchain Sync</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {systemStats.blockchainSynced ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm font-medium">{systemStats.blockchainSynced ? "Synced" : "Syncing"}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {systemStats.blockchainTransactions.toLocaleString()} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cross-Validation</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {systemStats.crossValidationActive ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm font-medium">{systemStats.crossValidationActive ? "Active" : "Inactive"}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">AI + Blockchain validation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified IDs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemStats.verifiedIds}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((systemStats.verifiedIds / systemStats.totalTourists) * 100)}% verification rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Integrated Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Integrated Security Alerts
            </CardTitle>
            <Badge variant="outline">{alerts.filter((a) => a.actionRequired).length} require action</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-muted-foreground">No security alerts at this time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                  <div className="flex items-start gap-3">
                    {getTypeIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                        {alert.actionRequired && (
                          <Badge variant="destructive" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <AlertDescription className="text-sm mb-3">{alert.description}</AlertDescription>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">Tourist ID:</span>
                          <div className="font-mono">{alert.touristId}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <div>{new Date(alert.timestamp).toLocaleTimeString()}</div>
                        </div>
                        {alert.aiConfidence && (
                          <div>
                            <span className="text-muted-foreground">AI Confidence:</span>
                            <div>{Math.round(alert.aiConfidence * 100)}%</div>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Blockchain:</span>
                          <div className="flex items-center gap-1">
                            {alert.blockchainVerified ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 text-red-600" />
                            )}
                            {alert.blockchainVerified ? "Verified" : "Failed"}
                          </div>
                        </div>
                      </div>

                      {alert.actionRequired && (
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Investigate
                          </Button>
                          <Button size="sm" variant="outline">
                            <Shield className="h-3 w-3 mr-1" />
                            Verify ID
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integrated Monitoring Tabs */}
      <Tabs defaultValue="ai-monitoring" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ai-monitoring">AI Monitoring</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain Verification</TabsTrigger>
          <TabsTrigger value="analytics">Cross-Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-monitoring">
          <AIMonitoringPanel />
        </TabsContent>

        <TabsContent value="blockchain">
          <BlockchainVerification />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Cross-System Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">AI-Blockchain Correlation</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg border">
                      <span className="text-sm">AI Anomalies with Valid IDs</span>
                      <Badge variant="outline">12</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg border">
                      <span className="text-sm">Invalid IDs with Normal Behavior</span>
                      <Badge variant="outline">3</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg border">
                      <span className="text-sm">Cross-Validation Success Rate</span>
                      <Badge variant="outline">94.7%</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">System Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg border">
                      <span className="text-sm">Average Processing Time</span>
                      <Badge variant="outline">1.2s</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg border">
                      <span className="text-sm">Blockchain Confirmation Time</span>
                      <Badge variant="outline">0.8s</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg border">
                      <span className="text-sm">False Positive Rate</span>
                      <Badge variant="outline">2.1%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
