import { NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"

const CONTRACT_ADDRESS = process.env.CID_REGISTRY_ADDRESS as string
const CONTRACT_ABI = [
  "function getCid(string hash) public view returns (string)"
]
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL as string

export async function POST(req: NextRequest) {
  try {
    const { hash } = await req.json()
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
    const cid = await contract.getCid(hash)
    return NextResponse.json({ cid })
  } catch (err: any) {
    return NextResponse.json({ error: "Blockchain retrieval failed", details: err.message }, { status: 500 })
  }
}