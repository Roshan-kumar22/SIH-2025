import { type NextRequest, NextResponse } from "next/server"

// Mock AI anomaly detection service
interface TouristData {
  id: string
  location: { lat: number; lng: number }
  timestamp: string
  heartRate?: number
  activityLevel: string
  lastKnownSafeLocation: { lat: number; lng: number }
  travelPattern: string[]
  emergencyContacts: string[]
}

interface AnomalyResult {
  touristId: string
  anomalyType: "location" | "health" | "behavior" | "communication"
  severity: "low" | "medium" | "high"
  confidence: number
  description: string
  recommendations: string[]
  alertAuthorities: boolean
}

// Simulated AI anomaly detection logic
function detectAnomalies(touristData: TouristData): AnomalyResult[] {
  const anomalies: AnomalyResult[] = []

  // Location-based anomaly detection
  const distanceFromSafeLocation = calculateDistance(touristData.location, touristData.lastKnownSafeLocation)

  if (distanceFromSafeLocation > 10) {
    // 10km threshold
    anomalies.push({
      touristId: touristData.id,
      anomalyType: "location",
      severity: distanceFromSafeLocation > 50 ? "high" : "medium",
      confidence: 0.85,
      description: `Tourist has moved ${distanceFromSafeLocation.toFixed(1)}km from last known safe location`,
      recommendations: [
        "Send location verification request",
        "Check with emergency contacts",
        "Monitor for next 30 minutes",
      ],
      alertAuthorities: distanceFromSafeLocation > 50,
    })
  }

  // Health-based anomaly detection
  if (touristData.heartRate && (touristData.heartRate > 120 || touristData.heartRate < 50)) {
    anomalies.push({
      touristId: touristData.id,
      anomalyType: "health",
      severity: touristData.heartRate > 150 || touristData.heartRate < 40 ? "high" : "medium",
      confidence: 0.92,
      description: `Abnormal heart rate detected: ${touristData.heartRate} BPM`,
      recommendations: [
        "Send health check notification",
        "Suggest nearby medical facilities",
        "Alert emergency contacts if no response",
      ],
      alertAuthorities: touristData.heartRate > 150 || touristData.heartRate < 40,
    })
  }

  // Behavior pattern anomaly detection
  const currentHour = new Date().getHours()
  if (touristData.activityLevel === "high" && (currentHour < 6 || currentHour > 23)) {
    anomalies.push({
      touristId: touristData.id,
      anomalyType: "behavior",
      severity: "medium",
      confidence: 0.78,
      description: "Unusual activity pattern detected during late/early hours",
      recommendations: [
        "Send safety check message",
        "Provide nearby safe zone information",
        "Monitor location for safety",
      ],
      alertAuthorities: false,
    })
  }

  return anomalies
}

function calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180
  const dLng = ((point2.lng - point1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function POST(request: NextRequest) {
  try {
    const touristData: TouristData = await request.json()

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 500))

    const anomalies = detectAnomalies(touristData)

    return NextResponse.json({
      success: true,
      touristId: touristData.id,
      anomalies,
      processedAt: new Date().toISOString(),
      aiModel: "SafeTour-Anomaly-Detection-v2.1",
    })
  } catch (error) {
    console.error("AI Anomaly Detection Error:", error)
    return NextResponse.json({ success: false, error: "Failed to process anomaly detection" }, { status: 500 })
  }
}
