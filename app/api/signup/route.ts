import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import fs from "fs"
import path from "path"
import crypto from "crypto"
import axios from "axios"
import FormData from "form-data"

const ENCRYPTION_KEY = process.env.PROFILE_ENCRYPTION_KEY || "12345678901234567890123456789012" // 32 chars for AES-256
const IV_LENGTH = 16

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString("hex") + ":" + encrypted.toString("hex")
}

const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY

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
  return res.data.IpfsHash // This is the CID
}

// Simulate blockchain call: store email and cid, return a hash (for demo, hash = email)
async function storeOnBlockchain(email: string, cid: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/blockchain/create-id`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, cid }),
  })
  const data = await res.json()
  return data.hash
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, password, profile } = body

  // 1. Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // 2. Insert only id and role in Supabase DB
  const { error: dbError } = await supabase.from("profiles").insert([
    { id: data.user.id, role: profile.role }
  ])
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 400 })

  try {
    // 3. Save encrypted profile JSON in the public folder
    const userProfile = { id: data.user.id, email, ...profile }
    const dir = path.join(process.cwd(), "public", "user_profiles")
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const encrypted = encrypt(JSON.stringify(userProfile))
    const filePath = path.join(dir, `${data.user.id}.enc`)
    fs.writeFileSync(filePath, encrypted)

    // 4. Upload to Pinata
    const cid = await uploadToPinata(filePath, `${data.user.id}.enc`)

    // 5. Store CID on blockchain and get hash (here, using email as hash for demo)
    const hash = await storeOnBlockchain(email, cid)

    // 6. Store hash and decryption key in Supabase
    await supabase.from("profiles").update({
      hash,
      decryption_key: ENCRYPTION_KEY
    }).eq("id", data.user.id)

    return NextResponse.json({ success: true, cid, hash })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to save encrypted profile" }, { status: 500 })
  }
}