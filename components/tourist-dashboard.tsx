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
} from "lucide-react"

// Mock data for demonstration
const mockTouristData = {
  id: "TST-2024-A7B9C2D1",
  name: "John Doe",
  email: "john.doe@email.com",
  phone: "+91 9876543210",
  nationality: "Indian",
  arrivalDate: "2024-01-15",
  departureDate: "2024-01-25",
  visitingStates: ["Maharashtra", "Goa", "Karnataka"],
  accommodationAddress: "Hotel Grand Plaza, Mumbai, Maharashtra",
  safetyScore: 85,
  currentLocation: "Mumbai, Maharashtra",
  emergencyContacts: [
    { name: "Jane Doe", phone: "+91 9876543211", relation: "Spouse" },
    { name: "Robert Doe", phone: "+91 9876543212", relation: "Father" },
  ],
}

const mockAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Geo-fence Alert",
    message: "You are approaching a restricted area near Colaba Fort. Please maintain safe distance.",
    timestamp: "2 minutes ago",
    location: "Colaba, Mumbai",
  },
  {
    id: 2,
    type: "info",
    title: "Weather Update",
    message: "Heavy rainfall expected in your area. Carry umbrella and avoid low-lying areas.",
    timestamp: "1 hour ago",
    location: "Mumbai, Maharashtra",
  },
  {
    id: 3,
    type: "success",
    title: "Safe Zone",
    message: "You have entered a verified safe tourist zone with 24/7 security monitoring.",
    timestamp: "3 hours ago",
    location: "Gateway of India, Mumbai",
  },
]

const mockItinerary = [
  {
    date: "2024-01-15",
    location: "Mumbai",
    activities: ["Gateway of India", "Marine Drive", "Colaba Causeway"],
    status: "completed",
  },
  {
    date: "2024-01-16",
    location: "Mumbai",
    activities: ["Elephanta Caves", "Crawford Market", "Chhatrapati Shivaji Terminus"],
    status: "current",
  },
  {
    date: "2024-01-17",
    location: "Goa",
    activities: ["Baga Beach", "Fort Aguada", "Old Goa Churches"],
    status: "upcoming",
  },
]

export function TouristDashboard() {
  const [isTracking, setIsTracking] = useState(true)
  const [receiveAlerts, setReceiveAlerts] = useState(true)
  const [shareLocation, setShareLocation] = useState(false)
  const [panicMode, setPanicMode] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [idCardWhiteBackground, setIdCardWhiteBackground] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handlePanicButton = () => {
    setPanicMode(true)
    // Simulate emergency alert
    setTimeout(() => {
      setPanicMode(false)
      alert("Emergency alert sent to nearest police station and emergency contacts!")
    }, 3000)
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">SafeTour Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {mockTouristData.name}</p>
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
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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
                    <QrCode className="h-5 w-5" />
                    Digital Tourist ID
                  </CardTitle>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <img src="/qr-code.png" alt="Tourist QR Code" className="w-20 h-20" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{mockTouristData.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">ID: {mockTouristData.id}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Valid From:</span>
                        <p className="font-medium">{mockTouristData.arrivalDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Valid Until:</span>
                        <p className="font-medium">{mockTouristData.departureDate}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

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
                    <div className={`text-4xl font-bold mb-2 ${getSafetyScoreColor(mockTouristData.safetyScore)}`}>
                      {mockTouristData.safetyScore}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {getSafetyScoreLabel(mockTouristData.safetyScore)}
                    </p>
                    <Progress value={mockTouristData.safetyScore} className="mb-2" />
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
                      <span className="text-sm font-medium">{mockTouristData.currentLocation}</span>
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
            <Card className="border-red-200 bg-red-50/50">
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
                  onClick={handlePanicButton}
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
            </Card>

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
                  {mockItinerary.map((day, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                      <div
                        className={`w-3 h-3 rounded-full mt-2 ${
                          day.status === "completed"
                            ? "bg-green-500"
                            : day.status === "current"
                              ? "bg-blue-500 animate-pulse"
                              : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">
                            {day.date} - {day.location}
                          </h4>
                          <Badge
                            variant={
                              day.status === "completed"
                                ? "default"
                                : day.status === "current"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {day.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {day.activities.map((activity, actIndex) => (
                            <Badge key={actIndex} variant="outline" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
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
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTouristData.emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.relation}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Monitoring */}
            <Card>
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
            </Card>

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
      </div>
    </div>
  )
}
