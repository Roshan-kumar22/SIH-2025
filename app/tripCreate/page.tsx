"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth"
import dynamic from "next/dynamic"

const QRCode = dynamic(() => import("qrcode.react").then(mod => mod.QRCodeCanvas), { ssr: false })

export default function TripCreatePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")
  const [medicalHistory, setMedicalHistory] = useState("")
  const [emergencyContacts, setEmergencyContacts] = useState("")
  const [email, setEmail] = useState(user?.email || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [tripCid, setTripCid] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setTripCid("")
    setLoading(true)
    try {
      // Prepare trip data
      const tripData = {
        destination,
        start_date: startDate,
        end_date: endDate,
        blood_group: bloodGroup,
        medical_history: medicalHistory,
        emergency_contacts: emergencyContacts.split(",").map(s => s.trim()),
        email,
        user_id: user?.id,
      }

      // Call API to encrypt, upload to Pinata, store CID on blockchain, and save hash in DB
      const res = await fetch("/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Trip creation failed")
      setSuccess("Trip created and stored successfully!")
      setTripCid(data.cid)
      // Optionally redirect or refresh
      // router.push("/tourist")
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle>Create Your Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Trip Destination</Label>
              <Input type="text" value={destination} onChange={e => setDestination(e.target.value)} required />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
            <div>
              <Label>Blood Group</Label>
              <Input type="text" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} required />
            </div>
            <div>
              <Label>Medical History</Label>
              <Textarea value={medicalHistory} onChange={e => setMedicalHistory(e.target.value)} />
            </div>
            <div>
              <Label>Emergency Contacts (comma separated)</Label>
              <Input type="text" value={emergencyContacts} onChange={e => setEmergencyContacts(e.target.value)} required />
            </div>
            <div>
              <Label>Phone number</Label>
              <Input type="text" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Create Trip"}
            </Button>
          </form>
          {tripCid && (
            <div className="flex flex-col items-center mt-8">
              <p className="mb-2 text-sm text-muted-foreground">Trip QR Code (scan to view on IPFS):</p>
              <QRCode value={`https://gateway.pinata.cloud/ipfs/${tripCid}`} size={160} />
              <p className="mt-2 text-xs break-all text-center">{tripCid}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}