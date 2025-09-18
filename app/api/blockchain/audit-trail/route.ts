import { type NextRequest, NextResponse } from "next/server"

interface AuditTrailRequest {
  touristId: string
  startDate?: string
  endDate?: string
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

// Mock audit trail data
const mockAuditTrail = new Map([
  [
    "TST-2024-A7B9C2D1",
    [
      {
        eventId: "AUD-001",
        timestamp: "2024-01-15T10:00:00Z",
        eventType: "id_created" as const,
        description: "Digital Tourist ID created and registered on blockchain",
        blockchainHash: "0000a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12",
        verifiedBy: "SafeTour-System",
        metadata: {
          registrationLocation: "Mumbai, Maharashtra",
          documentVerified: true,
          kycStatus: "completed",
        },
      },
      {
        eventId: "AUD-002",
        timestamp: "2024-01-15T14:30:00Z",
        eventType: "id_verified" as const,
        description: "Digital ID verified by police checkpoint",
        blockchainHash: "0000b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef23",
        verifiedBy: "Mumbai Police Station - Colaba",
        location: "Gateway of India, Mumbai",
        metadata: {
          officerId: "POL-001",
          verificationMethod: "QR_scan",
          status: "verified",
        },
      },
      {
        eventId: "AUD-003",
        timestamp: "2024-01-15T18:45:00Z",
        eventType: "location_update" as const,
        description: "Location updated - entered monitored tourist zone",
        blockchainHash: "0000c3d4e5f6789012345678901234567890abcdef1234567890abcdef34",
        location: "Marine Drive, Mumbai",
        metadata: {
          geoFenceZone: "safe_tourist_zone",
          safetyScore: 85,
          alertLevel: "green",
        },
      },
      {
        eventId: "AUD-004",
        timestamp: "2024-01-16T09:15:00Z",
        eventType: "emergency_alert" as const,
        description: "Emergency SOS alert triggered and resolved",
        blockchainHash: "0000d4e5f6789012345678901234567890abcdef1234567890abcdef45",
        location: "Colaba Fort, Mumbai",
        metadata: {
          alertType: "panic_button",
          responseTime: "2.3 minutes",
          resolvedBy: "Mumbai Police Patrol Unit",
          status: "resolved",
        },
      },
      {
        eventId: "AUD-005",
        timestamp: "2024-01-16T16:20:00Z",
        eventType: "status_change" as const,
        description: "Safety status updated based on AI analysis",
        blockchainHash: "0000e5f6789012345678901234567890abcdef1234567890abcdef56",
        location: "Bandra, Mumbai",
        metadata: {
          previousScore: 85,
          newScore: 92,
          aiConfidence: 0.94,
          factors: ["safe_location", "normal_behavior", "good_health_metrics"],
        },
      },
    ],
  ],
])

export async function POST(request: NextRequest) {
  try {
    const { touristId, startDate, endDate }: AuditTrailRequest = await request.json()

    if (!touristId) {
      return NextResponse.json({ success: false, error: "Tourist ID is required" }, { status: 400 })
    }

    // Simulate blockchain query time
    await new Promise((resolve) => setTimeout(resolve, 800))

    let auditEvents = mockAuditTrail.get(touristId) || []

    // Filter by date range if provided
    if (startDate || endDate) {
      auditEvents = auditEvents.filter((event) => {
        const eventDate = new Date(event.timestamp)
        if (startDate && eventDate < new Date(startDate)) return false
        if (endDate && eventDate > new Date(endDate)) return false
        return true
      })
    }

    // Calculate audit statistics
    const stats = {
      totalEvents: auditEvents.length,
      eventTypes: auditEvents.reduce(
        (acc, event) => {
          acc[event.eventType] = (acc[event.eventType] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      verificationCount: auditEvents.filter((e) => e.eventType === "id_verified").length,
      emergencyAlerts: auditEvents.filter((e) => e.eventType === "emergency_alert").length,
      lastActivity: auditEvents.length > 0 ? auditEvents[auditEvents.length - 1].timestamp : null,
    }

    return NextResponse.json({
      success: true,
      touristId,
      auditTrail: auditEvents,
      statistics: stats,
      blockchainNetwork: "SafeTour-Chain-Testnet",
      queryTimestamp: new Date().toISOString(),
      dataIntegrity: {
        hashChainValid: true,
        noTampering: true,
        allEventsVerified: true,
      },
    })
  } catch (error) {
    console.error("Audit Trail Error:", error)
    return NextResponse.json({ success: false, error: "Failed to retrieve audit trail" }, { status: 500 })
  }
}
