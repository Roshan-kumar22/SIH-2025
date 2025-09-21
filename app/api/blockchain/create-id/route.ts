import { NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"

// Replace with your deployed contract address and ABI
const CONTRACT_ADDRESS = process.env.CID_REGISTRY_ADDRESS as string
const CONTRACT_ABI = [
  "function storeCid(string hash, string cid) public",
  "function getCid(string hash) public view returns (string)"
]

// Use a private key with testnet funds for writing to the contract
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY as string
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL as string // e.g. Infura/Alchemy endpoint

export async function POST(req: NextRequest) {
  try {
    const { email, cid } = await req.json()
    const hash = email // Use email as hash

    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet)

    // Store the CID on-chain
    const tx = await contract.storeCid(hash, cid)
    await tx.wait()

    return NextResponse.json({ hash })
  } catch (err: any) {
    return NextResponse.json({ error: "Blockchain storage failed", details: err.message }, { status: 500 })
  }
}