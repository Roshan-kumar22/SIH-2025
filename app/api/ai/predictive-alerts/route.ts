import { type NextRequest, NextResponse } from "next/server"

interface PredictiveAlertRequest {
  touristId: string
  historicalData: {
    locations: { lat: number; lng: number; timestamp: string }[]
    activities: { type: string; duration: number; timestamp: string }[]
    healthMetrics: { heartRate: number; steps: number; timestamp: string }[]
  }
  currentContext: {
    location: { lat: number; lng: number }
    weather: string
    timeOfDay: string
    plannedActivities: string[]
  }
}

interface PredictiveAlert {
  alertId: string
  type: "safety" | "health" | "weather" | "crowd" | "transport"
  severity: "low" | "medium" | "high"
  probability: number // 0-1
  timeframe: string
  title: string
  description: string
  preventiveActions: string[]
  monitoringRequired: boolean
}

function generatePredictiveAlerts(data: PredictiveAlertRequest): PredictiveAlert[] {
  const alerts: PredictiveAlert[] = []

  // Analyze movement patterns for safety prediction
  const recentLocations = data.historicalData.locations.slice(-10)
  const movementSpeed = calculateMovementSpeed(recentLocations)

  if (movementSpeed > 80) {
    // km/h - likely in vehicle
    alerts.push({
      alertId: `PA-${Date.now()}-001`,
      type: "transport",
      severity: "medium",
      probability: 0.75,
      timeframe: "Next 30 minutes",
      title: "High-Speed Travel Detected",
      description: "You appear to be traveling at high speed. Ensure you're in a safe, licensed vehicle.",
      preventiveActions: [
        "Verify driver credentials",
        "Share trip details with emergency contacts",
        "Keep emergency numbers accessible",
      ],
      monitoringRequired: true,
    })
  }

  // Health pattern analysis
  const recentHealthData = data.historicalData.healthMetrics.slice(-5)
  const avgHeartRate = recentHealthData.reduce((sum, metric) => sum + metric.heartRate, 0) / recentHealthData.length

  if (avgHeartRate > 100) {
    alerts.push({
      alertId: `PA-${Date.now()}-002`,
      type: "health",
      severity: "medium",
      probability: 0.68,
      timeframe: "Next 2 hours",
      title: "Elevated Stress Levels Detected",
      description: "Your heart rate has been consistently elevated. Consider taking a break.",
      preventiveActions: [
        "Find a quiet place to rest",
        "Practice deep breathing exercises",
        "Stay hydrated",
        "Consider contacting a healthcare provider if symptoms persist",
      ],
      monitoringRequired: true,
    })
  }

  // Weather-based predictions
  if (data.currentContext.weather.includes("rain") && data.currentContext.plannedActivities.includes("outdoor")) {
    alerts.push({
      alertId: `PA-${Date.now()}-003`,
      type: "weather",
      severity: "low",
      probability: 0.85,
      timeframe: "Next 4 hours",
      title: "Weather Impact on Planned Activities",
      description: "Rain is expected which may affect your outdoor activities.",
      preventiveActions: [
        "Carry waterproof clothing",
        "Consider indoor alternatives",
        "Check for weather updates",
        "Plan for transportation delays",
      ],
      monitoringRequired: false,
    })
  }

  // Crowd prediction based on time and location patterns
  const currentHour = Number.parseInt(data.currentContext.timeOfDay.split(":")[0])
  if (currentHour >= 17 && currentHour <= 20) {
    // Peak hours
    alerts.push({
      alertId: `PA-${Date.now()}-004`,
      type: "crowd",
      severity: "low",
      probability: 0.72,
      timeframe: "Next 3 hours",
      title: "High Crowd Density Expected",
      description: "Popular tourist areas may be crowded during evening hours.",
      preventiveActions: [
        "Secure your belongings",
        "Stay close to your group",
        "Identify less crowded alternative routes",
        "Be extra vigilant in crowded areas",
      ],
      monitoringRequired: false,
    })
  }

  // Safety prediction based on location history
  const visitedRiskyAreas = recentLocations.some(
    (loc) =>
      // Simulate risky area detection (in real implementation, this would use a database)
      Math.abs(loc.lat - 18.922) < 0.01 && Math.abs(loc.lng - 72.8347) < 0.01,
  )

  if (visitedRiskyAreas) {
    alerts.push({
      alertId: `PA-${Date.now()}-005`,
      type: "safety",
      severity: "high",
      probability: 0.82,
      timeframe: "Immediate",
      title: "High-Risk Area Detected",
      description: "You are near or in an area with elevated safety concerns.",
      preventiveActions: [
        "Move to a well-lit, populated area immediately",
        "Contact local authorities if you feel unsafe",
        "Share your location with emergency contacts",
        "Consider using official transportation",
      ],
      monitoringRequired: true,
    })
  }

  return alerts.sort((a, b) => b.probability - a.probability)
}

function calculateMovementSpeed(locations: { lat: number; lng: number; timestamp: string }[]): number {
  if (locations.length < 2) return 0

  const latest = locations[locations.length - 1]
  const previous = locations[locations.length - 2]

  const distance = calculateDistance({ lat: previous.lat, lng: previous.lng }, { lat: latest.lat, lng: latest.lng })

  const timeDiff = (new Date(latest.timestamp).getTime() - new Date(previous.timestamp).getTime()) / (1000 * 60 * 60) // hours

  return timeDiff > 0 ? distance / timeDiff : 0
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
    const alertData: PredictiveAlertRequest = await request.json()

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const predictiveAlerts = generatePredictiveAlerts(alertData)

    return NextResponse.json({
      success: true,
      touristId: alertData.touristId,
      alerts: predictiveAlerts,
      processedAt: new Date().toISOString(),
      aiModel: "SafeTour-Predictive-Analytics-v3.2",
      confidence: 0.87,
    })
  } catch (error) {
    console.error("Predictive Alerts Error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate predictive alerts" }, { status: 500 })
  }
}
