"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Shield,
  MapPin,
  AlertTriangle,
  Phone,
  Users,
  Bell,
  Settings,
  LogOut,
  QrCode,
  Navigation,
  Heart,
  Battery,
  Wifi,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Eye,
  Download,
  User,
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { supabase } from "@/lib/supabaseClient"
import dynamic from "next/dynamic"

const QRCode = dynamic(() => import("qrcode.react").then((mod) => mod.QRCodeCanvas), { ssr: false })

export function TouristDashboard() {
  const [isTracking, setIsTracking] = useState(true)
  const [receiveAlerts, setReceiveAlerts] = useState(true)
  const [shareLocation, setShareLocation] = useState(false)
  const [panicMode, setPanicMode] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [idCardWhiteBackground, setIdCardWhiteBackground] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [trip, setTrip] = useState<any>(null)
  const [tripCid, setTripCid] = useState("")
  const [tripRevealed, setTripRevealed] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      try {
        // 1. Get hash and decryption key from Supabase
        const { data, error } = await supabase
          .from("profiles")
          .select("hash, decryption_key")
          .eq("id", user.id)
          .single()
        if (error) throw error
        const { hash, decryption_key } = data

        // 2. Get CID from blockchain
        const res = await fetch("/api/blockchain/get-cid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hash }),
        })
        const { cid } = await res.json()
        if (!cid) throw new Error("CID not found on blockchain")

        // 3. Fetch encrypted file from IPFS
        const fileRes = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`)
        const encrypted = await fileRes.text()

        // 4. Decrypt (same logic as your encrypt, but reversed)
        function decrypt(text: string, key: string) {
          const [ivHex, encryptedHex] = text.split(":")
          const iv = Buffer.from(ivHex, "hex")
          const encryptedText = Buffer.from(encryptedHex, "hex")
          const crypto = require("crypto")
          const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv)
          let decrypted = decipher.update(encryptedText)
          decrypted = Buffer.concat([decrypted, decipher.final()])
          return decrypted.toString()
        }

        const decrypted = decrypt(encrypted, decryption_key)
        console.log("Decrypted profile:", decrypted)
        setProfile(JSON.parse(decrypted))
      } catch (err: any) {
        setProfile(null)
      }
      
    }
     async function fetchTrip() {
      const { data, error } = await supabase
        .from("profiles")
        .select("trip_hash, trip_decryption_key")
        .eq("id", user.id)
        .single()
      if (error || !data?.trip_hash || !data?.trip_decryption_key) {
        setTrip(null)
        setTripCid("")
        console.log("No trip_hash or trip_decryption_key in profile")
        return
      }

      // 1. Get trip CID from blockchain
      const res = await fetch("/api/blockchain/get-cid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash: data.trip_hash }),
      })
      const { cid } = await res.json()
      console.log("Fetched trip CID:", cid)
      if (!cid) {
        setTrip(null)
        setTripCid("")
        console.log("No CID found on blockchain for hash", data.trip_hash)
        return
      }
      setTripCid(cid)

      // 2. Fetch encrypted trip file from IPFS
      const fileRes = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`)
      const encrypted = await fileRes.text()
      console.log("Encrypted trip file:", encrypted)
      if (!encrypted) {
        setTrip(null)
        return
      }

      // 3. Decrypt
      function decrypt(text: string, key: string) {
        const [ivHex, encryptedHex] = text.split(":")
        const iv = Buffer.from(ivHex, "hex")
        const encryptedText = Buffer.from(encryptedHex, "hex")
        const crypto = require("crypto")
        const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv)
        let decrypted = decipher.update(encryptedText)
        decrypted = Buffer.concat([decrypted, decipher.final()])
        return decrypted.toString()
      }

      try {
        const decrypted = decrypt(encrypted, data.trip_decryption_key)
        console.log("Decrypted trip file:", decrypted)
        setTrip(JSON.parse(decrypted))
      } catch (err) {
        setTrip(null)
        console.error("Trip decryption failed:", err)
      }
    }
if (user?.id) {
    
      fetchProfile()
      fetchTrip()

      setLoading(false)
    }
  }, [user])

  useEffect(() => {
   
  }, [user])

  // Dummy fallback for arrays if profile is not loaded
  const visitingStates = profile?.visitingStates || []
  const emergencyContacts = profile?.emergencyContacts || []
  const travelItinerary = Array.isArray(profile?.travelItinerary) ? profile.travelItinerary : []

  // Dummy fallback for alerts (replace with real data if available)
  const mockAlerts = [
    {
      id: 1,
      type: "warning",
      title: "Geo-fence Alert",
      message: "You are approaching a restricted area. Please maintain safe distance.",
      timestamp: "2 minutes ago",
      location: visitingStates[0] || "",
    },
    {
      id: 2,
      type: "info",
      title: "Weather Update",
      message: "Heavy rainfall expected in your area.",
      timestamp: "1 hour ago",
      location: visitingStates[0] || "",
    },
    {
      id: 3,
      type: "success",
      title: "Safe Zone",
      message: "You have entered a verified safe tourist zone.",
      timestamp: "3 hours ago",
      location: visitingStates[0] || "",
    },
  ]

  const getSafetyScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getSafetyScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Attention"
  }

  // Spoiler/HiddenText field
  function SpoilerField({ label, value, field }: { label: string; value: any; field: string }) {
    const allRevealed = Object.values(revealed).some(Boolean)
    return (
      <div className="mb-2">
        <span className="font-semibold">{label}: </span>
        <span
          className={`inline-block cursor-pointer select-none rounded transition-all px-2 py-0.5 ${
            allRevealed
              ? "bg-transparent text-inherit"
              : "bg-muted text-muted-foreground blur-sm hover:blur-none hover:bg-muted/80"
          }`}
          onClick={() => {
            if (!allRevealed) {
              // Reveal all spoilers at once
              setRevealed({
                name: true,
                id: true,
                email: true,
                phone: true,
                sex: true,
                dob: true,
                id_type: true,
                id_number: true,
                safetyScore: true,
                currentLocation: true,
                // Add all other fields you use as spoilers
              })
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Reveal all`}
        >
          {typeof value === "object" ? JSON.stringify(value) : value || ""}
        </span>
      </div>
    )
  }

  // Add this helper for trip field blur/reveal (like profile)
  function TripSpoilerField({ label, value, field }: { label: string; value: any; field: string }) {
    return (
      <div className="mb-2">
        <span className="font-semibold">{label}: </span>
        <span
          className={`inline-block cursor-pointer select-none rounded transition-all px-2 py-0.5 ${
            tripRevealed
              ? "bg-transparent text-inherit"
              : "bg-muted text-muted-foreground blur-sm hover:blur-none hover:bg-muted/80"
          }`}
          onClick={() => {
            if (!tripRevealed) setTripRevealed(true)
          }}
          tabIndex={0}
          role="button"
          aria-label={`Reveal all trip fields`}
        >
          {typeof value === "object" ? JSON.stringify(value) : value || ""}
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">SafeTour Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {currentTime.toLocaleTimeString()}
            </div>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center text-lg py-20">Loading your data...</div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Dashboard */}
            <div className="lg:col-span-2 space-y-6">
              {/* Digital Tourist ID Card */}
              <Card
                className={`border-2 border-secondary/20 cursor-pointer transition-colors ${
                  idCardWhiteBackground ? "bg-white" : ""
                }`}
                onClick={() => setIdCardWhiteBackground(!idCardWhiteBackground)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Tourist Profile
                    </CardTitle>
                   
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    {/* REMOVE QR CODE, just keep the placeholder */}
                    <div className="w-24 h-24 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <div className="w-20 h-20 bg-muted rounded" />
                    </div>
                    <div className="flex-1">
                      <SpoilerField
                        label="Name"
                        value={
                          profile?.first_name && profile?.last_name
                            ? `${profile.first_name} ${profile.last_name}`
                            : ""
                        }
                        field="name"
                      />
                      <SpoilerField label="Email" value={profile?.email || ""} field="email" />
                      <SpoilerField label="Phone" value={profile?.phone || ""} field="phone" />
                      <SpoilerField label="Sex" value={profile?.sex || ""} field="sex" />
                      <SpoilerField label="Date of Birth" value={profile?.dob || ""} field="dob" />
                      <div className="flex justify-start align-center">
                      <SpoilerField label="ID Type" value={profile?.id_type || ""} field="id_type" />
                      <SpoilerField label="ID Number" value={profile?.id_number || ""} field="id_number" />

                      </div>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>

              {/* Trip Details */}
{trip ? (
  <Card className="border-2 border-secondary/20">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Trip Details
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex-1">
        <TripSpoilerField label="Trip Destination" value={trip?.destination || ""} field="trip_destination" />
        <TripSpoilerField label="Start Date" value={trip?.start_date || ""} field="trip_startDate" />
        <TripSpoilerField label="End Date" value={trip?.end_date || ""} field="trip_endDate" />

        {/* If trip has activities / itinerary inside */}
        {Array.isArray(trip?.itinerary) && trip.itinerary.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold">Planned Itinerary:</h4>
            {trip.itinerary.map((item: any, idx: number) => (
              <div key={idx} className="pl-4 border-l">
                <TripSpoilerField label="Date" value={item.date || ""} field={`trip-itinerary-date-${idx}`} />
                <TripSpoilerField label="Location" value={item.location || ""} field={`trip-itinerary-location-${idx}`} />
                <TripSpoilerField label="Notes" value={item.notes || ""} field={`trip-itinerary-notes-${idx}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
) : (
  <Card>
    <CardHeader>
      <CardTitle>Trip Details</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-muted-foreground text-sm">No trip data available.</div>
    </CardContent>
  </Card>
)}

              {/* Safety Score & Status */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Safety Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getSafetyScoreColor(profile?.safetyScore || 0)}`}>
                        <span
                          className={`inline-block cursor-pointer select-none rounded transition-all px-2 py-0.5 ${
                            revealed["safetyScore"]
                              ? "bg-transparent text-inherit"
                              : "bg-muted text-muted-foreground blur-sm hover:blur-none hover:bg-muted/80"
                          }`}
                          onClick={() => !revealed["safetyScore"] && setRevealed((prev) => ({ ...prev, safetyScore: true }))}
                          tabIndex={0}
                          role="button"
                          aria-label="Reveal Safety Score"
                        >
                          {profile?.safetyScore || ""}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {getSafetyScoreLabel(profile?.safetyScore || 0)}
                      </p>
                      <Progress value={profile?.safetyScore || 0} className="mb-2" />
                      <p className="text-xs text-muted-foreground">Based on location, behavior, and area safety</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Current Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Location</span>
                        <span
                          className={`inline-block cursor-pointer select-none rounded transition-all px-2 py-0.5 ${
                            revealed["currentLocation"]
                              ? "bg-transparent text-inherit"
                              : "bg-muted text-muted-foreground blur-sm hover:blur-none hover:bg-muted/80"
                          }`}
                          onClick={() => !revealed["currentLocation"] && setRevealed((prev) => ({ ...prev, currentLocation: true }))}
                          tabIndex={0}
                          role="button"
                          aria-label="Reveal Location"
                        >
                          {profile?.currentLocation || ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tracking</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-green-600">Active</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Connection</span>
                        <div className="flex items-center gap-1">
                          <Wifi className="h-4 w-4 text-green-600" />
                          <Battery className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">Strong</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Emergency Panic Button */}
              {/* <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Emergency SOS
                  </CardTitle>
                  <CardDescription>
                    Press and hold for 3 seconds to send emergency alert to nearest police and your emergency contacts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    size="lg"
                    className={`w-full h-16 text-lg font-bold ${
                      panicMode ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-red-500 hover:bg-red-600"
                    }`}
                    onClick={() => {
                      setPanicMode(true)
                      setTimeout(() => {
                        setPanicMode(false)
                        alert("Emergency alert sent to nearest police station and emergency contacts!")
                      }, 3000)
                    }}
                    disabled={panicMode}
                  >
                    {panicMode ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                        Sending Emergency Alert...
                      </>
                    ) : (
                      <>
                        <Zap className="h-6 w-6 mr-2" />
                        EMERGENCY SOS
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card> */}

              {/* Recent Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAlerts.map((alert) => (
                      <Alert
                        key={alert.id}
                        className={`${
                          alert.type === "warning"
                            ? "border-yellow-200 bg-yellow-50"
                            : alert.type === "info"
                            ? "border-blue-200 bg-blue-50"
                            : "border-green-200 bg-green-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {alert.type === "warning" && <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                          {alert.type === "info" && <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />}
                          {alert.type === "success" && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm">{alert.title}</h4>
                              <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                            </div>
                            <AlertDescription className="text-sm mb-1">{alert.message}</AlertDescription>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.location}
                            </p>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Travel Itinerary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    Travel Itinerary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {travelItinerary.length > 0 ? (
                      travelItinerary.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border">
                          <div className="w-3 h-3 rounded-full mt-2 bg-blue-500"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">
                                <span
                                  className={`inline-block cursor-pointer select-none rounded transition-all px-2 py-0.5 ${
                                    revealed[`itinerary-date-${idx}`]
                                      ? "bg-transparent text-inherit"
                                      : "bg-muted text-muted-foreground blur-sm hover:blur-none hover:bg-muted/80"
                                  }`}
                                  onClick={() =>
                                    !revealed[`itinerary-date-${idx}`] &&
                                    setRevealed((prev) => ({ ...prev, [`itinerary-date-${idx}`]: true }))
                                  }
                                  tabIndex={0}
                                  role="button"
                                  aria-label="Reveal Itinerary Date"
                                >
                                  {item.date || ""}
                                </span>
                                {" - "}
                                <span
                                  className={`inline-block cursor-pointer select-none rounded transition-all px-2 py-0.5 ${
                                    revealed[`itinerary-location-${idx}`]
                                      ? "bg-transparent text-inherit"
                                      : "bg-muted text-muted-foreground blur-sm hover:blur-none hover:bg-muted/80"
                                  }`}
                                  onClick={() =>
                                    !revealed[`itinerary-location-${idx}`] &&
                                    setRevealed((prev) => ({ ...prev, [`itinerary-location-${idx}`]: true }))
                                  }
                                  tabIndex={0}
                                  role="button"
                                  aria-label="Reveal Itinerary Location"
                                >
                                  {item.location || ""}
                                </span>
                              </h4>
                              <Badge variant="outline">{item.status || ""}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(item.activities || []).map((activity: string, actIndex: number) => (
                                <span
                                  key={actIndex}
                                  className={`inline-block cursor-pointer select-none rounded transition-all px-2 py-0.5 ${
                                    revealed[`itinerary-activity-${idx}-${actIndex}`]
                                      ? "bg-transparent text-inherit"
                                      : "bg-muted text-muted-foreground blur-sm hover:blur-none hover:bg-muted/80"
                                  }`}
                                  onClick={() =>
                                    !revealed[`itinerary-activity-${idx}-${actIndex}`] &&
                                    setRevealed((prev) => ({
                                      ...prev,
                                      [`itinerary-activity-${idx}-${actIndex}`]: true,
                                    }))
                                  }
                                  tabIndex={0}
                                  role="button"
                                  aria-label="Reveal Itinerary Activity"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground text-sm">No itinerary available.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Settings & Info */}
            <div className="space-y-6">
              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tracking" className="text-sm">
                      Location Tracking
                    </Label>
                    <Switch id="tracking" checked={isTracking} onCheckedChange={setIsTracking} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="alerts" className="text-sm">
                      Safety Alerts
                    </Label>
                    <Switch id="alerts" checked={receiveAlerts} onCheckedChange={setReceiveAlerts} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="share" className="text-sm">
                      Share with Family
                    </Label>
                    <Switch id="share" checked={shareLocation} onCheckedChange={setShareLocation} />
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Live Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    
                        <div  className="flex items-center justify-between p-3 rounded-lg border">
                         
                          <a href={"https://d024293fd5a0.ngrok-free.app"} className="text-blue-600 hover:underline" target="_blank">
                          Click here for live location
                          </a>
                        </div>
                      
                   
                  </div>
                </CardContent>
              </Card>

              {/* Health Monitoring */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Health Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Heart Rate</span>
                      <span className="text-sm font-medium text-green-600">72 BPM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Activity Level</span>
                      <span className="text-sm font-medium text-blue-600">Moderate</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Check</span>
                      <span className="text-sm font-medium">2 min ago</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      All vitals normal
                    </p>
                  </div>
                </CardContent>
              </Card> */}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MapPin className="h-4 w-4 mr-2" />
                    View Live Map
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export Trip Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}