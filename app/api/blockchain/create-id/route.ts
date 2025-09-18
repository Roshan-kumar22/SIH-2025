import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

interface TouristData {
  firstName: string
  lastName: string
  email: string
  phone: string
  nationality: string
  documentType: string
  documentNumber: string
  arrivalDate: string
  departureDate: string
  visitingStates: string[]
  emergencyContacts: Array<{
    name: string
    phone: string
    relation: string
  }>
}

interface BlockchainTransaction {
  id: string
  timestamp: string
  touristData: TouristData
  hash: string
  previousHash: string
  nonce: number
  merkleRoot: string
}

interface DigitalID {
  touristId: string
  blockchainHash: string
  qrCode: string
  issuedAt: string
  expiresAt: string
  verificationUrl: string
  digitalSignature: string
}

// Simulated blockchain functions
function calculateHash(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex")
}

function generateMerkleRoot(transactions: string[]): string {
  if (transactions.length === 0) return ""
  if (transactions.length === 1) return calculateHash(transactions[0])

  const newLevel: string[] = []
  for (let i = 0; i < transactions.length; i += 2) {
    const left = transactions[i]
    const right = i + 1 < transactions.length ? transactions[i + 1] : left
    newLevel.push(calculateHash(left + right))
  }

  return generateMerkleRoot(newLevel)
}

function mineBlock(data: string, difficulty = 4): { hash: string; nonce: number } {
  let nonce = 0
  const target = "0".repeat(difficulty)

  while (true) {
    const hash = calculateHash(data + nonce)
    if (hash.substring(0, difficulty) === target) {
      return { hash, nonce }
    }
    nonce++
  }
}

function createBlockchainTransaction(touristData: TouristData): BlockchainTransaction {
  const id = `BLK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const timestamp = new Date().toISOString()

  // Simulate getting previous block hash (in real implementation, this would come from the blockchain)
  const previousHash = calculateHash(`previous-block-${Date.now() - 1000}`)

  // Create transaction data
  const transactionData = JSON.stringify({
    id,
    timestamp,
    touristData: {
      ...touristData,
      // Hash sensitive data for privacy
      documentNumber: calculateHash(touristData.documentNumber),
      phone: calculateHash(touristData.phone),
    },
  })

  // Generate Merkle root
  const merkleRoot = generateMerkleRoot([transactionData])

  // Mine the block
  const blockData = `${id}${timestamp}${transactionData}${previousHash}${merkleRoot}`
  const { hash, nonce } = mineBlock(blockData)

  return {
    id,
    timestamp,
    touristData,
    hash,
    previousHash,
    nonce,
    merkleRoot,
  }
}

function generateDigitalID(transaction: BlockchainTransaction): DigitalID {
  const touristId = `TST-${new Date().getFullYear()}-${transaction.hash.substring(0, 8).toUpperCase()}`

  // Generate QR code data
  const qrData = {
    touristId,
    hash: transaction.hash,
    issuedAt: transaction.timestamp,
    verificationUrl: `https://safetour.gov.in/verify/${touristId}`,
  }

  // Create digital signature
  const digitalSignature = calculateHash(JSON.stringify(qrData) + process.env.BLOCKCHAIN_PRIVATE_KEY || "demo-key")

  return {
    touristId,
    blockchainHash: transaction.hash,
    qrCode: Buffer.from(JSON.stringify(qrData)).toString("base64"),
    issuedAt: transaction.timestamp,
    expiresAt: transaction.touristData.departureDate,
    verificationUrl: qrData.verificationUrl,
    digitalSignature,
  }
}

export async function POST(request: NextRequest) {
  try {
    const touristData: TouristData = await request.json()

    // Validate required fields
    if (!touristData.firstName || !touristData.lastName || !touristData.email) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Simulate blockchain processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create blockchain transaction
    const transaction = createBlockchainTransaction(touristData)

    // Generate digital ID
    const digitalId = generateDigitalID(transaction)

    // In a real implementation, this would be stored in a distributed ledger
    console.log("Blockchain Transaction Created:", {
      transactionId: transaction.id,
      hash: transaction.hash,
      touristId: digitalId.touristId,
    })

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        hash: transaction.hash,
        timestamp: transaction.timestamp,
        merkleRoot: transaction.merkleRoot,
      },
      digitalId,
      blockchainNetwork: "SafeTour-Chain-Testnet",
      gasUsed: "0.0023 STT", // SafeTour Tokens
      confirmations: 6,
    })
  } catch (error) {
    console.error("Blockchain ID Creation Error:", error)
    return NextResponse.json({ success: false, error: "Failed to create blockchain digital ID" }, { status: 500 })
  }
}
