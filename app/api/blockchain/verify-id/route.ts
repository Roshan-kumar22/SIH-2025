import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

interface VerificationRequest {
  touristId: string
  qrCode?: string
  blockchainHash?: string
}

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

// Mock blockchain data store (in real implementation, this would query the blockchain)
const mockBlockchainRecords = new Map([
  [
    "TST-2024-A7B9C2D1",
    {
      hash: "0000a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12",
      issuedAt: "2024-01-15T10:00:00Z",
      expiresAt: "2024-01-25T23:59:59Z",
      digitalSignature: "sig_abc123def456",
      touristInfo: {
        name: "John Doe",
        nationality: "Indian",
        visitPeriod: "2024-01-15 to 2024-01-25",
        visitingStates: ["Maharashtra", "Goa", "Karnataka"],
      },
      status: "active",
    },
  ],
  [
    "TST-2024-B8C3D4E2",
    {
      hash: "0000b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef23",
      issuedAt: "2024-01-14T09:30:00Z",
      expiresAt: "2024-01-28T23:59:59Z",
      digitalSignature: "sig_def456ghi789",
      touristInfo: {
        name: "Sarah Johnson",
        nationality: "American",
        visitPeriod: "2024-01-14 to 2024-01-28",
        visitingStates: ["Goa", "Kerala", "Tamil Nadu"],
      },
      status: "active",
    },
  ],
])

function calculateHash(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex")
}

function verifyDigitalSignature(data: string, signature: string): boolean {
  // Simulate signature verification
  const expectedSignature = calculateHash(data + (process.env.BLOCKCHAIN_PRIVATE_KEY || "demo-key"))
  return signature === expectedSignature
}

function verifyBlockchainHash(touristId: string, providedHash: string): boolean {
  const record = mockBlockchainRecords.get(touristId)
  return record ? record.hash === providedHash : false
}

export async function POST(request: NextRequest) {
  try {
    const { touristId, qrCode, blockchainHash }: VerificationRequest = await request.json()

    if (!touristId) {
      return NextResponse.json({ success: false, error: "Tourist ID is required" }, { status: 400 })
    }

    // Simulate blockchain verification time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get record from blockchain
    const blockchainRecord = mockBlockchainRecords.get(touristId)

    if (!blockchainRecord) {
      return NextResponse.json({
        success: true,
        verification: {
          isValid: false,
          touristId,
          status: "invalid" as const,
          issuedAt: "",
          expiresAt: "",
          blockchainHash: "",
          verificationDetails: {
            hashVerified: false,
            signatureVerified: false,
            timestampValid: false,
            notExpired: false,
            notRevoked: false,
          },
        },
      })
    }

    // Perform verification checks
    const now = new Date()
    const issuedDate = new Date(blockchainRecord.issuedAt)
    const expiryDate = new Date(blockchainRecord.expiresAt)

    const verificationDetails = {
      hashVerified: blockchainHash ? verifyBlockchainHash(touristId, blockchainHash) : true,
      signatureVerified: true, // Simplified for demo
      timestampValid: issuedDate <= now,
      notExpired: now <= expiryDate,
      notRevoked: blockchainRecord.status !== "revoked",
    }

    const isValid = Object.values(verificationDetails).every(Boolean)

    let status: "active" | "expired" | "revoked" | "invalid"
    if (!isValid) {
      if (!verificationDetails.notExpired) status = "expired"
      else if (!verificationDetails.notRevoked) status = "revoked"
      else status = "invalid"
    } else {
      status = "active"
    }

    const result: VerificationResult = {
      isValid,
      touristId,
      status,
      issuedAt: blockchainRecord.issuedAt,
      expiresAt: blockchainRecord.expiresAt,
      blockchainHash: blockchainRecord.hash,
      verificationDetails,
      touristInfo: isValid ? blockchainRecord.touristInfo : undefined,
    }

    return NextResponse.json({
      success: true,
      verification: result,
      blockchainNetwork: "SafeTour-Chain-Testnet",
      verifiedAt: new Date().toISOString(),
      verificationId: `VER-${Date.now()}`,
    })
  } catch (error) {
    console.error("Blockchain Verification Error:", error)
    return NextResponse.json({ success: false, error: "Failed to verify blockchain digital ID" }, { status: 500 })
  }
}
