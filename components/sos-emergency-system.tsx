"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import {
  Zap,
  AlertTriangle,
  Phone,
  MapPin,
  Clock,
  Shield,
  Users,
  Heart,
  Camera,
  Mic,
  VolumeX,
  Radio,
  CheckCircle,
  Navigation,
  Battery,
  Wifi,
  MessageSquare,
  Send,
  Eye,
  Download,
} from "lucide-react"

// Mock data for emergency system
const mockEmergencyContacts = [
  { name: "Police Control Room", number: "+91-100", type: "police", priority: 1 },
  { name: "Medical Emergency", number: "+91-108", type: "medical", priority: 1 },
  { name: "Fire Department", number: "+91-101", type: "fire", priority: 1 },
  { name: "Tourist Helpline", number: "+91-1363", type: "tourist", priority: 2 },
  { name: "Jane Smith (Emergency Contact)", number: "+1-555-0123", type: "personal", priority: 3 },
]

const mockSOSHistory = [
  {
    id: "SOS-2024-001",
    timestamp: "2024-01-16 14:30:25",
    location: "Gateway of India, Mumbai",
    type: "panic_button",
    status: "resolved",
    responseTime: "2.3 min",
    responders: ["Police", "Hotel Security"],
    description: "Tourist activated panic button, false alarm - tourist was lost",
  },
  {
    id: "SOS-2024-002",
    timestamp: "2024-01-15 22:15:10",
    location: "Baga Beach, Goa",
    type: "medical_emergency",
    status: "resolved",
    responseTime: "4.1 min",
    responders: ["Medical Team", "Police"],
    description: "Tourist reported chest pain, transported to hospital",
  },
]

export function SOSEmergencySystem() {
  const [isSOSActive, setIsSOSActive] = useState(false)
  const [sosCountdown, setSOSCountdown] = useState(0)
  const [emergencyType, setEmergencyType] = useState<string | null>(null)
  const [locationSharing, setLocationSharing] = useState(true)
  const [audioRecording, setAudioRecording] = useState(false)
  const [videoRecording, setVideoRecording] = useState(false)
  const [silentMode, setSilentMode] = useState(false)
  const [currentLocation, setCurrentLocation] = useState("Gateway of India, Mumbai")
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [signalStrength, setSignalStrength] = useState(4)
  const [emergencyMessage, setEmergencyMessage] = useState("")
  const [sosPressed, setSOSPressed] = useState(false)
  const [pressStartTime, setPressStartTime] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (sosCountdown > 0) {
      const timer = setTimeout(() => setSOSCountdown(sosCountdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (sosCountdown === 0 && isSOSActive) {
      triggerEmergencyAlert()
    }
  }, [sosCountdown, isSOSActive])

  const handleSOSPress = () => {
    if (!sosPressed) {
      setSOSPressed(true)
      setPressStartTime(Date.now())
      setSOSCountdown(3)

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - (pressStartTime || Date.now())
        const remaining = Math.max(0, 3 - Math.floor(elapsed / 1000))
        setSOSCountdown(remaining)

        if (remaining === 0) {
          triggerEmergencyAlert()
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
        }
      }, 100)
    }
  }

  const handleSOSRelease = () => {
    if (sosPressed && sosCountdown > 0) {
      setSOSPressed(false)
      setPressStartTime(null)
      setSOSCountdown(0)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }

  const triggerEmergencyAlert = () => {
    setIsSOSActive(true)
    setSOSPressed(false)
    setPressStartTime(null)

    // Simulate emergency alert process
    setTimeout(() => {
      alert(
        "🚨 EMERGENCY ALERT SENT!\n\n✅ Police notified\n✅ Medical services alerted\n✅ Emergency contacts informed\n✅ Location shared\n✅ Audio recording started",
      )
    }, 500)
  }

  const cancelSOS = () => {
    setIsSOSActive(false)
    setSOSCountdown(0)
    setSOSPressed(false)
    setPressStartTime(null)
    setEmergencyType(null)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const selectEmergencyType = (type: string) => {
    setEmergencyType(type)
    setIsSOSActive(true)
    triggerEmergencyAlert()
  }

  const sendQuickMessage = (message: string) => {
    alert(`Quick message sent: "${message}"`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-green-600 bg-green-50 border-green-200"
      case "active":
        return "text-red-600 bg-red-50 border-red-200"
      case "responding":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Zap className="h-8 w-8 text-red-600" />
            <div>
              <h1 className="text-xl font-bold text-red-600">SOS Emergency System</h1>
              <p className="text-sm text-muted-foreground">24/7 Tourist Safety & Emergency Response</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Battery className={`h-4 w-4 ${batteryLevel > 20 ? "text-green-600" : "text-red-600"}`} />
              <span className={batteryLevel > 20 ? "text-green-600" : "text-red-600"}>{batteryLevel}%</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`w-1 h-3 rounded-sm ${i < signalStrength ? "bg-green-600" : "bg-gray-300"}`} />
              ))}
              <Wifi className="h-4 w-4 text-green-600 ml-1" />
            </div>
            <Badge variant={isSOSActive ? "destructive" : "secondary"} className={isSOSActive ? "animate-pulse" : ""}>
              {isSOSActive ? "EMERGENCY ACTIVE" : "SYSTEM READY"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Emergency Alert Banner */}
        {isSOSActive && (
          <Alert className="mb-6 border-red-200 bg-red-50 animate-pulse">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-red-800">🚨 EMERGENCY ALERT ACTIVE</h4>
                  <p className="text-red-700">Emergency services have been notified. Help is on the way.</p>
                  <p className="text-sm text-red-600 mt-1">Location: {currentLocation}</p>
                </div>
                <Button variant="outline" onClick={cancelSOS}>
                  Cancel SOS
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main SOS Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary SOS Button */}
            <Card className="border-red-200 bg-red-50/30">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-red-700">Emergency SOS</CardTitle>
                <CardDescription>Press and hold for 3 seconds to send emergency alert</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="relative">
                  <Button
                    size="lg"
                    className={`w-48 h-48 rounded-full text-2xl font-bold transition-all duration-200 ${
                      sosPressed
                        ? "bg-red-700 hover:bg-red-800 scale-110 animate-pulse"
                        : isSOSActive
                          ? "bg-red-600 hover:bg-red-700 animate-pulse"
                          : "bg-red-500 hover:bg-red-600"
                    }`}
                    onMouseDown={handleSOSPress}
                    onMouseUp={handleSOSRelease}
                    onTouchStart={handleSOSPress}
                    onTouchEnd={handleSOSRelease}
                    disabled={isSOSActive}
                  >
                    {sosPressed ? (
                      <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold">{sosCountdown}</div>
                        <div className="text-sm">SENDING...</div>
                      </div>
                    ) : isSOSActive ? (
                      <div className="flex flex-col items-center">
                        <Zap className="h-12 w-12 mb-2" />
                        <div>ACTIVE</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Zap className="h-12 w-12 mb-2" />
                        <div>SOS</div>
                      </div>
                    )}
                  </Button>

                  {sosPressed && (
                    <div className="absolute inset-0 rounded-full border-4 border-white animate-ping"></div>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  {sosPressed
                    ? "Keep holding to send emergency alert..."
                    : "Hold button for 3 seconds to activate emergency response"}
                </div>
              </CardContent>
            </Card>

            {/* Quick Emergency Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Quick Emergency Types
                </CardTitle>
                <CardDescription>Select specific emergency type for faster response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col border-red-200 hover:bg-red-50 bg-transparent"
                    onClick={() => selectEmergencyType("medical")}
                    disabled={isSOSActive}
                  >
                    <Heart className="h-8 w-8 text-red-600 mb-2" />
                    Medical Emergency
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col border-blue-200 hover:bg-blue-50 bg-transparent"
                    onClick={() => selectEmergencyType("police")}
                    disabled={isSOSActive}
                  >
                    <Shield className="h-8 w-8 text-blue-600 mb-2" />
                    Security/Crime
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col border-orange-200 hover:bg-orange-50 bg-transparent"
                    onClick={() => selectEmergencyType("fire")}
                    disabled={isSOSActive}
                  >
                    <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
                    Fire Emergency
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col border-purple-200 hover:bg-purple-50 bg-transparent"
                    onClick={() => selectEmergencyType("general")}
                    disabled={isSOSActive}
                  >
                    <Phone className="h-8 w-8 text-purple-600 mb-2" />
                    General Help
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Quick Messages
                </CardTitle>
                <CardDescription>Send pre-written messages to emergency contacts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type custom emergency message..."
                      value={emergencyMessage}
                      onChange={(e) => setEmergencyMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={() => sendQuickMessage(emergencyMessage)} disabled={!emergencyMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => sendQuickMessage("I need help immediately!")}>
                      "I need help immediately!"
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendQuickMessage("I'm lost and need directions")}
                    >
                      "I'm lost and need directions"
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => sendQuickMessage("I'm safe, false alarm")}>
                      "I'm safe, false alarm"
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => sendQuickMessage("Send my location to family")}>
                      "Send my location to family"
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SOS History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Emergency History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSOSHistory.map((incident) => (
                    <div key={incident.id} className="flex items-start justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
                          <span className="text-sm font-medium">{incident.type.replace("_", " ")}</span>
                          <span className="text-xs text-muted-foreground">{incident.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {incident.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Response: {incident.responseTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {incident.responders.join(", ")}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Location Sharing</span>
                  <Switch checked={locationSharing} onCheckedChange={setLocationSharing} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Silent Mode</span>
                  <Switch checked={silentMode} onCheckedChange={setSilentMode} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto Recording</span>
                  <Switch checked={audioRecording} onCheckedChange={setAudioRecording} />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Current Location</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{currentLocation}</p>
                  <p className="text-xs text-muted-foreground mt-1">Accuracy: ±5 meters • Updated 30 seconds ago</p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockEmergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.number}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recording Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Emergency Recording
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={audioRecording ? "destructive" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setAudioRecording(!audioRecording)}
                  >
                    {audioRecording ? <VolumeX className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                    {audioRecording ? "Stop Audio" : "Start Audio"}
                  </Button>

                  <Button
                    variant={videoRecording ? "destructive" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setVideoRecording(!videoRecording)}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {videoRecording ? "Stop Video" : "Start Video"}
                  </Button>
                </div>

                {(audioRecording || videoRecording) && (
                  <Alert className="border-red-200 bg-red-50">
                    <Radio className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      <div className="flex items-center justify-between">
                        <span>Recording in progress...</span>
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Recordings
                </Button>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GPS Signal</span>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      Strong
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Network Connection</span>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      4G LTE
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Emergency Services</span>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last System Check</span>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
