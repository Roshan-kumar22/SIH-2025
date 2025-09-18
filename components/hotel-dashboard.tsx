"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Hotel,
  Users,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Shield,
  QrCode,
  UserCheck,
  Calendar,
  BarChart3,
  Bell,
  Eye,
  Download,
  LogIn,
  LogOut,
  Heart,
} from "lucide-react"

// Mock data for hotel operations
const mockGuests = [
  {
    id: "TST-2024-A7B9C2D1",
    name: "John Smith",
    nationality: "American",
    roomNumber: "205",
    checkInDate: "2024-01-15",
    checkOutDate: "2024-01-20",
    status: "checked_in",
    safetyScore: 92,
    lastSeen: "2 hours ago",
    emergencyContacts: [{ name: "Jane Smith", phone: "+1-555-0123", relation: "Spouse" }],
    itinerary: ["Gateway of India", "Marine Drive", "Colaba Market"],
    specialRequests: ["Late checkout", "Airport transfer"],
  },
  {
    id: "TST-2024-B8C3D4E2",
    name: "Maria Garcia",
    nationality: "Spanish",
    roomNumber: "312",
    checkInDate: "2024-01-14",
    checkOutDate: "2024-01-18",
    status: "checked_in",
    safetyScore: 88,
    lastSeen: "30 minutes ago",
    emergencyContacts: [{ name: "Carlos Garcia", phone: "+34-600-123456", relation: "Brother" }],
    itinerary: ["Baga Beach", "Old Goa", "Spice Plantation"],
    specialRequests: ["Vegetarian meals"],
  },
  {
    id: "TST-2024-C9D4E5F3",
    name: "Ahmed Hassan",
    nationality: "Egyptian",
    roomNumber: "108",
    checkInDate: "2024-01-16",
    checkOutDate: "2024-01-22",
    status: "alert",
    safetyScore: 45,
    lastSeen: "4 hours ago",
    emergencyContacts: [{ name: "Fatima Hassan", phone: "+20-100-1234567", relation: "Wife" }],
    itinerary: ["Mysore Palace", "Chamundi Hills", "Brindavan Gardens"],
    specialRequests: ["Halal meals", "Prayer room access"],
  },
]

const mockReservations = [
  {
    id: "RES-2024-001",
    guestName: "Robert Johnson",
    nationality: "Canadian",
    touristId: "TST-2024-D1E2F4G5",
    roomNumber: "401",
    checkInDate: "2024-01-17",
    checkOutDate: "2024-01-24",
    status: "arriving_today",
    verificationStatus: "pending",
    specialRequests: ["Airport pickup", "Sea view room"],
  },
  {
    id: "RES-2024-002",
    guestName: "Li Wei",
    nationality: "Chinese",
    touristId: "TST-2024-E2F3G4H6",
    roomNumber: "215",
    checkInDate: "2024-01-18",
    checkOutDate: "2024-01-25",
    status: "confirmed",
    verificationStatus: "verified",
    specialRequests: ["Chinese breakfast", "Late arrival"],
  },
]

const mockIncidents = [
  {
    id: "INC-HTL-001",
    type: "safety_alert",
    guestId: "TST-2024-C9D4E5F3",
    guestName: "Ahmed Hassan",
    roomNumber: "108",
    description: "Guest safety score dropped significantly. Last seen 4 hours ago.",
    timestamp: "2 hours ago",
    status: "investigating",
    priority: "high",
  },
  {
    id: "INC-HTL-002",
    type: "sos_alert",
    guestId: "TST-2024-A7B9C2D1",
    guestName: "John Smith",
    roomNumber: "205",
    description: "Guest activated SOS button from room. Emergency services notified.",
    timestamp: "1 day ago",
    status: "resolved",
    priority: "critical",
  },
]

const mockAnalytics = {
  totalGuests: 156,
  checkedInGuests: 142,
  arrivingToday: 8,
  departingToday: 12,
  occupancyRate: 89.5,
  averageSafetyScore: 87.2,
  incidentsToday: 2,
}

export function HotelDashboard() {
  const [selectedTab, setSelectedTab] = useState("guests")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [autoNotifications, setAutoNotifications] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "checked_in":
      case "verified":
      case "resolved":
        return "text-green-600 bg-green-50 border-green-200"
      case "alert":
      case "investigating":
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "arriving_today":
      case "confirmed":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getSafetyScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const handleCheckIn = (reservationId: string) => {
    alert(`Processing check-in for reservation ${reservationId}`)
  }

  const handleCheckOut = (guestId: string) => {
    alert(`Processing check-out for guest ${guestId}`)
  }

  const handleEmergencyResponse = (incidentId: string) => {
    alert(`Initiating emergency response for incident ${incidentId}`)
  }

  const filteredGuests = mockGuests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.roomNumber.includes(searchTerm)
    const matchesFilter = filterStatus === "all" || guest.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Hotel className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">Hotel Management Center</h1>
              <p className="text-sm text-muted-foreground">Tourist Guest Safety & Services</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {currentTime.toLocaleString()}
            </div>
            <Badge variant="secondary">{mockAnalytics.checkedInGuests} Guests</Badge>
            <Badge variant="destructive" className={mockAnalytics.incidentsToday > 0 ? "animate-pulse" : ""}>
              {mockAnalytics.incidentsToday} Alerts
            </Badge>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="guests">Current Guests</TabsTrigger>
            <TabsTrigger value="checkin">Check-In/Out</TabsTrigger>
            <TabsTrigger value="safety">Safety Monitoring</TabsTrigger>
            <TabsTrigger value="incidents">Emergency Response</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Current Guests Tab */}
          <TabsContent value="guests" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.totalGuests}</div>
                  <p className="text-xs text-muted-foreground">{mockAnalytics.checkedInGuests} currently checked in</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                  <Hotel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockAnalytics.occupancyRate}%</div>
                  <Progress value={mockAnalytics.occupancyRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Safety Score</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockAnalytics.averageSafetyScore}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+2.1</span> from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Arriving:</span>
                      <span className="font-medium text-blue-600">{mockAnalytics.arrivingToday}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Departing:</span>
                      <span className="font-medium text-orange-600">{mockAnalytics.departingToday}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Guest Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Input
                    placeholder="Search by name, ID, or room number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="checked_in">Checked In</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {filteredGuests.map((guest) => (
                    <Card key={guest.id} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <UserCheck className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{guest.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {guest.nationality} • Room {guest.roomNumber} • ID: {guest.id}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Check-in: {guest.checkInDate} • Check-out: {guest.checkOutDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-center">
                              <p className="text-sm font-medium">Safety Score</p>
                              <div className={`text-lg font-bold ${getSafetyScoreColor(guest.safetyScore)}`}>
                                {guest.safetyScore}
                              </div>
                            </div>
                            <Badge className={getStatusColor(guest.status)}>{guest.status.replace("_", " ")}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Emergency Contacts</h4>
                            {guest.emergencyContacts.map((contact, index) => (
                              <div key={index} className="text-sm">
                                <p className="font-medium">{contact.name}</p>
                                <p className="text-muted-foreground">
                                  {contact.relation} • {contact.phone}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Today's Itinerary</h4>
                            <div className="space-y-1">
                              {guest.itinerary.slice(0, 3).map((item, index) => (
                                <Badge key={index} variant="outline" className="text-xs mr-1">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="h-4 w-4 mr-2" />
                              Contact
                            </Button>
                            {guest.status === "alert" && (
                              <Button size="sm" variant="destructive">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Respond
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Check-In/Out Tab */}
          <TabsContent value="checkin" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Arriving Today */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Arriving Today ({mockReservations.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockReservations.map((reservation) => (
                      <div key={reservation.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <LogIn className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{reservation.guestName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {reservation.nationality} • Room {reservation.roomNumber}
                            </p>
                            <p className="text-xs text-muted-foreground">Tourist ID: {reservation.touristId}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <Badge className={getStatusColor(reservation.verificationStatus)}>
                              {reservation.verificationStatus}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <QrCode className="h-4 w-4 mr-2" />
                              Scan ID
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleCheckIn(reservation.id)}
                              disabled={reservation.verificationStatus !== "verified"}
                            >
                              Check In
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Departing Today */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    Departing Today ({mockAnalytics.departingToday})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockGuests.slice(0, 2).map((guest) => (
                      <div key={guest.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <LogOut className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{guest.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Room {guest.roomNumber} • Check-out: {guest.checkOutDate}
                            </p>
                            <p className="text-xs text-muted-foreground">Safety Score: {guest.safetyScore}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Review Stay
                          </Button>
                          <Button size="sm" onClick={() => handleCheckOut(guest.id)}>
                            Check Out
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <QrCode className="h-6 w-6 mb-2" />
                    Bulk QR Scan
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Download className="h-6 w-6 mb-2" />
                    Export Guest List
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Calendar className="h-6 w-6 mb-2" />
                    Room Assignment
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Bell className="h-6 w-6 mb-2" />
                    Send Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Safety Monitoring Tab */}
          <TabsContent value="safety" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Guest Safety Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockGuests.map((guest) => (
                      <div key={guest.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              guest.safetyScore >= 80
                                ? "bg-green-500"
                                : guest.safetyScore >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          <div>
                            <h3 className="font-medium">{guest.name}</h3>
                            <p className="text-sm text-muted-foreground">Room {guest.roomNumber}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm font-medium">Safety Score</p>
                            <div className={`text-lg font-bold ${getSafetyScoreColor(guest.safetyScore)}`}>
                              {guest.safetyScore}
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="text-sm font-medium">Last Seen</p>
                            <p className="text-sm text-muted-foreground">{guest.lastSeen}</p>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <MapPin className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Safety Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-notifications" className="text-sm">
                      Auto Notifications
                    </Label>
                    <Switch
                      id="auto-notifications"
                      checked={autoNotifications}
                      onCheckedChange={setAutoNotifications}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Low Safety Score Alert</span>
                      <Badge variant="outline">60</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Inactivity Alert</span>
                      <Badge variant="outline">6 hours</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Geo-fence Violations</span>
                      <Badge variant="outline">Enabled</Badge>
                    </div>
                  </div>

                  <Button className="w-full bg-transparent" variant="outline">
                    Configure Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Emergency Response Tab */}
          <TabsContent value="incidents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Incidents & Emergency Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockIncidents.map((incident) => (
                    <Alert
                      key={incident.id}
                      className={
                        incident.priority === "critical"
                          ? "border-red-200 bg-red-50"
                          : incident.priority === "high"
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-blue-200 bg-blue-50"
                      }
                    >
                      <AlertTriangle
                        className={`h-4 w-4 ${
                          incident.priority === "critical"
                            ? "text-red-600"
                            : incident.priority === "high"
                              ? "text-yellow-600"
                              : "text-blue-600"
                        }`}
                      />
                      <AlertDescription>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{incident.type.replace("_", " ").toUpperCase()}</h4>
                              <Badge className={getStatusColor(incident.priority)}>{incident.priority}</Badge>
                              <Badge variant="outline">{incident.status}</Badge>
                            </div>
                            <p className="text-sm mb-2">{incident.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Guest: {incident.guestName}</span>
                              <span>Room: {incident.roomNumber}</span>
                              <span>Time: {incident.timestamp}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="h-4 w-4" />
                            </Button>
                            {incident.status !== "resolved" && (
                              <Button size="sm" onClick={() => handleEmergencyResponse(incident.id)}>
                                Respond
                              </Button>
                            )}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
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
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg border">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium">Police Station</h3>
                    <p className="text-sm text-muted-foreground">+91-100</p>
                    <Button size="sm" className="mt-2">
                      Call Now
                    </Button>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <h3 className="font-medium">Medical Emergency</h3>
                    <p className="text-sm text-muted-foreground">+91-108</p>
                    <Button size="sm" className="mt-2">
                      Call Now
                    </Button>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-medium">Fire Department</h3>
                    <p className="text-sm text-muted-foreground">+91-101</p>
                    <Button size="sm" className="mt-2">
                      Call Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Guest Satisfaction</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">4.8/5</div>
                  <Progress value={96} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Based on 156 reviews</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Safety Incidents</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">-50%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">1.8 min</div>
                  <p className="text-xs text-muted-foreground">Average emergency response</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+12%</div>
                  <p className="text-xs text-muted-foreground">Safety system ROI</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Guest Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">American</span>
                      <div className="flex items-center gap-2">
                        <Progress value={35} className="w-20" />
                        <span className="text-sm font-medium">35%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">European</span>
                      <div className="flex items-center gap-2">
                        <Progress value={28} className="w-20" />
                        <span className="text-sm font-medium">28%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Asian</span>
                      <div className="flex items-center gap-2">
                        <Progress value={22} className="w-20" />
                        <span className="text-sm font-medium">22%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Others</span>
                      <div className="flex items-center gap-2">
                        <Progress value={15} className="w-20" />
                        <span className="text-sm font-medium">15%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Monthly Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Occupancy Rate</span>
                      <span className="text-sm font-medium text-green-600">↗ +5.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Safety Score</span>
                      <span className="text-sm font-medium text-green-600">↗ +2.1%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Guest Satisfaction</span>
                      <span className="text-sm font-medium text-green-600">↗ +0.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Incidents</span>
                      <span className="text-sm font-medium text-green-600">↘ -50%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
