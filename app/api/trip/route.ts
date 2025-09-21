import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import crypto from "crypto"
import axios from "axios"
import FormData from "form-data"
import { supabase } from "@/lib/supabaseClient"

const ENCRYPTION_KEY = process.env.PROFILE_ENCRYPTION_KEY || "12345678901234567890123456789012"
const IV_LENGTH = 16
const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY
const CONTRACT_ADDRESS = process.env.CID_REGISTRY_ADDRESS as string
const CONTRACT_ABI = [
  "function storeCid(string hash, string cid) public",
  "function getCid(string hash) public view returns (string)"
]
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY as string
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL as string

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString("hex") + ":" + encrypted.toString("hex")
}

async function uploadToPinata(filePath: string, fileName: string) {
  const data = new FormData()
  data.append("file", fs.createReadStream(filePath), fileName)
  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
    maxBodyLength: Infinity,
    headers: {
      ...data.getHeaders(),
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  })
  return res.data.IpfsHash
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, user_id } = body

    // 1. Encrypt trip JSON and save to disk
    const dir = path.join(process.cwd(), "public", "trip_data")
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const encrypted = encrypt(JSON.stringify(body))
    const filePath = path.join(dir, `${user_id}_trip.enc`)
    fs.writeFileSync(filePath, encrypted)

    // 2. Upload to Pinata
    const cid = await uploadToPinata(filePath, `${user_id}_trip.enc`)

    // 3. Store CID on blockchain (use email as hash)
    const { ethers } = await import("ethers")
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet)
    const tx = await contract.storeCid(email, cid)
    await tx.wait()

    // 4. Store hash and decryption key in Supabase (optional, for retrieval)
    await supabase
      .from("profiles")
      .update({
        trip_hash: email,          
        trip_decryption_key: ENCRYPTION_KEY,
      })
      .eq("id", user_id)

    return NextResponse.json({ success: true, cid })
  } catch (err: any) {
    console.error("Blockchain error:", err)
    return NextResponse.json({ error: err.message || "Trip creation failed" }, { status: 500 })
  }
}