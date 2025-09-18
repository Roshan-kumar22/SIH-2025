"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Activity,
  Shield,
  Zap,
  Eye,
  Clock,
  BarChart3,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface AnomalyData {
  touristId: string
  anomalyType: "location" | "health" | "behavior" | "communication"
  severity: "low" | "medium" | "high"
  confidence: number
  description: string
  recommendations: string[]
  alertAuthorities: boolean
}

interface PredictiveAlert {
  alertId: string
  type: "safety" | "health" | "weather" | "crowd" | "transport"
  severity: "low" | "medium" | "high"
  probability: number
  timeframe: string
  title: string
  description: string
  preventiveActions: string[]
  monitoringRequired: boolean
}

export function AIMonitoringPanel() {
  const [anomalies, setAnomalies] = useState<AnomalyData[]>([])
  const [predictiveAlerts, setPredictiveAlerts] = useState<PredictiveAlert[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiStats, setAiStats] = useState({
    totalAnalyses: 1247,
    anomaliesDetected: 23,
    accuracyRate: 94.2,
    responseTime: 1.8,
  })

  useEffect(() => {
    // Simulate real-time AI monitoring
    const interval = setInterval(() => {
      runAnomalyDetection()
      generatePredictiveAlerts()
    }, 30000) // Run every 30 seconds

    // Initial run
    runAnomalyDetection()
    generatePredictiveAlerts()

    return () => clearInterval(interval)
  }, [])

  const runAnomalyDetection = async () => {
    setIsProcessing(true)
    try {
      // Simulate API call to anomaly detection
      const mockTouristData = {
        id: "TST-2024-A7B9C2D1",
        location: { lat: 18.922, lng: 72.8347 },
        timestamp: new Date().toISOString(),
        heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 BPM
        activityLevel: "moderate",
        lastKnownSafeLocation: { lat: 18.92, lng: 72.83 },
        travelPattern: ["Gateway of India", "Marine Drive"],
        emergencyContacts: ["+91 9876543210"],
      }

      const response = await fetch("/api/ai/anomaly-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockTouristData),
      })

      const result = await response.json()
      if (result.success) {
        setAnomalies(result.anomalies)
        setAiStats((prev) => ({
          ...prev,
          totalAnalyses: prev.totalAnalyses + 1,
          anomaliesDetected: prev.anomaliesDetected + result.anomalies.length,
        }))
      }
    } catch (error) {
      console.error("Anomaly detection failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const generatePredictiveAlerts = async () => {
    try {
      const mockPredictiveData = {
        touristId: "TST-2024-A7B9C2D1",
        historicalData: {
          locations: [
            { lat: 18.922, lng: 72.8347, timestamp: new Date(Date.now() - 3600000).toISOString() },
            { lat: 18.92, lng: 72.83, timestamp: new Date().toISOString() },
          ],
          activities: [{ type: "walking", duration: 60, timestamp: new Date().toISOString() }],
          healthMetrics: [{ heartRate: 85, steps: 5000, timestamp: new Date().toISOString() }],
        },
        currentContext: {
          location: { lat: 18.922, lng: 72.8347 },
          weather: "partly cloudy",
          timeOfDay: new Date().toTimeString().slice(0, 5),
          plannedActivities: ["sightseeing", "outdoor"],
        },
      }

      const response = await fetch("/api/ai/predictive-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockPredictiveData),
      })

      const result = await response.json()
      if (result.success) {
        setPredictiveAlerts(result.alerts)
      }
    } catch (error) {
      console.error("Predictive alerts failed:", error)
    }
  }

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
      case "location":
      case "safety":
        return <Shield className="h-4 w-4" />
      case "health":
        return <Activity className="h-4 w-4" />
      case "behavior":
        return <Eye className="h-4 w-4" />
      case "weather":
        return <AlertTriangle className="h-4 w-4" />
      case "transport":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiStats.totalAnalyses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalies Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{aiStats.anomaliesDetected}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{aiStats.accuracyRate}%</div>
            <Progress value={aiStats.accuracyRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{aiStats.responseTime}s</div>
            <p className="text-xs text-muted-foreground">Average processing time</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Anomaly Detection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Real-time Anomaly Detection
            </CardTitle>
            <div className="flex items-center gap-2">
              {isProcessing && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Processing...
                </div>
              )}
              <Button onClick={runAnomalyDetection} disabled={isProcessing} size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Run Analysis
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {anomalies.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-muted-foreground">No anomalies detected. All tourists are safe.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {anomalies.map((anomaly, index) => (
                <Alert key={index} className={getSeverityColor(anomaly.severity)}>
                  <div className="flex items-start gap-3">
                    {getTypeIcon(anomaly.anomalyType)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-sm capitalize">{anomaly.anomalyType} Anomaly Detected</h4>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(anomaly.confidence * 100)}% confidence
                        </Badge>
                        <Badge className={getSeverityColor(anomaly.severity)}>{anomaly.severity}</Badge>
                      </div>
                      <AlertDescription className="text-sm mb-3">{anomaly.description}</AlertDescription>
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Recommended Actions:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {anomaly.recommendations.map((rec, recIndex) => (
                            <li key={recIndex} className="flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {anomaly.alertAuthorities && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs text-red-700 font-medium">
                            ⚠️ Authorities have been automatically notified
                          </p>
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

      {/* Predictive Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Predictive Safety Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {predictiveAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-muted-foreground">No predictive alerts at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {predictiveAlerts.map((alert) => (
                <Alert key={alert.alertId} className={getSeverityColor(alert.severity)}>
                  <div className="flex items-start gap-3">
                    {getTypeIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(alert.probability * 100)}% probability
                        </Badge>
                        <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                      </div>
                      <AlertDescription className="text-sm mb-2">{alert.description}</AlertDescription>
                      <p className="text-xs text-muted-foreground mb-3">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Timeframe: {alert.timeframe}
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Preventive Actions:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {alert.preventiveActions.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {alert.monitoringRequired && (
                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-xs text-blue-700 font-medium">
                            📊 Continuous monitoring activated for this alert
                          </p>
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
    </div>
  )
}
