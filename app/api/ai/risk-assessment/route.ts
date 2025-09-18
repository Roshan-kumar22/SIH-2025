import { type NextRequest, NextResponse } from "next/server"

interface RiskAssessmentRequest {
  touristId: string
  location: { lat: number; lng: number; address: string }
  timeOfDay: string
  weatherConditions: string
  crowdDensity: "low" | "medium" | "high"
  localEvents: string[]
  touristProfile: {
    age: number
    gender: string
    travelExperience: "novice" | "intermediate" | "expert"
    healthConditions: string[]
  }
}

interface RiskAssessment {
  overallRisk: "low" | "medium" | "high"
  riskScore: number // 0-100
  riskFactors: {
    category: string
    level: "low" | "medium" | "high"
    description: string
    mitigation: string
  }[]
  recommendations: string[]
  safetyTips: string[]
  emergencyContacts: {
    type: string
    number: string
    distance: string
  }[]
}

function assessRisk(data: RiskAssessmentRequest): RiskAssessment {
  let riskScore = 20 // Base risk score
  const riskFactors = []

  // Time-based risk assessment
  const hour = Number.parseInt(data.timeOfDay.split(":")[0])
  if (hour < 6 || hour > 22) {
    riskScore += 15
    riskFactors.push({
      category: "Time of Day",
      level: "medium" as const,
      description: "Traveling during late/early hours increases risk",
      mitigation: "Stay in well-lit, populated areas",
    })
  }

  // Weather-based risk assessment
  if (data.weatherConditions.includes("heavy rain") || data.weatherConditions.includes("storm")) {
    riskScore += 20
    riskFactors.push({
      category: "Weather",
      level: "high" as const,
      description: "Severe weather conditions pose safety risks",
      mitigation: "Seek indoor shelter and avoid travel",
    })
  }

  // Crowd density risk assessment
  if (data.crowdDensity === "high") {
    riskScore += 10
    riskFactors.push({
      category: "Crowd Density",
      level: "medium" as const,
      description: "High crowd density increases pickpocketing and stampede risks",
      mitigation: "Stay alert, secure belongings, identify exit routes",
    })
  }

  // Tourist profile risk assessment
  if (data.touristProfile.travelExperience === "novice") {
    riskScore += 10
    riskFactors.push({
      category: "Experience Level",
      level: "medium" as const,
      description: "Limited travel experience may increase vulnerability",
      mitigation: "Follow guided tours, stay in tourist-friendly areas",
    })
  }

  // Health conditions risk assessment
  if (data.touristProfile.healthConditions.length > 0) {
    riskScore += 15
    riskFactors.push({
      category: "Health Conditions",
      level: "medium" as const,
      description: "Pre-existing health conditions require extra precautions",
      mitigation: "Carry medications, know nearest medical facilities",
    })
  }

  // Local events risk assessment
  if (data.localEvents.some((event) => event.includes("protest") || event.includes("strike"))) {
    riskScore += 25
    riskFactors.push({
      category: "Local Events",
      level: "high" as const,
      description: "Political events or strikes may cause disruptions",
      mitigation: "Avoid affected areas, monitor news updates",
    })
  }

  // Determine overall risk level
  let overallRisk: "low" | "medium" | "high"
  if (riskScore < 30) overallRisk = "low"
  else if (riskScore < 60) overallRisk = "medium"
  else overallRisk = "high"

  const recommendations = [
    "Keep emergency contacts readily available",
    "Share your location with trusted contacts",
    "Stay aware of your surroundings",
    "Keep important documents secure",
  ]

  if (overallRisk === "high") {
    recommendations.unshift("Consider postponing travel or changing location")
  }

  const safetyTips = [
    "Trust your instincts - if something feels wrong, leave",
    "Keep your phone charged and carry a portable charger",
    "Inform someone about your travel plans",
    "Research local emergency numbers and procedures",
  ]

  const emergencyContacts = [
    { type: "Police", number: "100", distance: "0.5 km" },
    { type: "Medical Emergency", number: "108", distance: "1.2 km" },
    { type: "Tourist Helpline", number: "1363", distance: "N/A" },
    { type: "Fire Emergency", number: "101", distance: "0.8 km" },
  ]

  return {
    overallRisk,
    riskScore: Math.min(riskScore, 100),
    riskFactors,
    recommendations,
    safetyTips,
    emergencyContacts,
  }
}

export async function POST(request: NextRequest) {
  try {
    const assessmentData: RiskAssessmentRequest = await request.json()

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 800))

    const riskAssessment = assessRisk(assessmentData)

    return NextResponse.json({
      success: true,
      touristId: assessmentData.touristId,
      assessment: riskAssessment,
      processedAt: new Date().toISOString(),
      aiModel: "SafeTour-Risk-Assessment-v1.8",
    })
  } catch (error) {
    console.error("AI Risk Assessment Error:", error)
    return NextResponse.json({ success: false, error: "Failed to process risk assessment" }, { status: 500 })
  }
}
