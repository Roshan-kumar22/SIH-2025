"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Plane,
  Users,
  Scan,
  FileCheck,
  AlertTriangle,
  Clock,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  Globe,
  Calendar,
  QrCode,
  UserCheck,
  Dessert as Passport,
  CreditCard,
} from "lucide-react"

// Mock data for airport operations
const mockArrivals = [
  {
    id: "ARR-2024-001",
    flightNumber: "AI-101",
    origin: "New York",
    scheduledTime: "14:30",
    actualTime: "14:25",
    status: "landed",
    passengers: 245,
    touristsExpected: 89,
    touristsProcessed: 67,
  },
  {
    id: "ARR-2024-002",
    flightNumber: "EK-507",
    origin: "Dubai",
    scheduledTime: "15:45",
    actualTime: "15:50",
    status: "boarding",
    passengers: 380,
    touristsExpected: 156,
    touristsProcessed: 0,
  },
  {
    id: "ARR-2024-003",
    flightNumber: "LH-763",
    origin: "Frankfurt",
    scheduledTime: "16:20",
    actualTime: "16:20",
    status: "approaching",
    passengers: 298,
    touristsExpected: 78,
    touristsProcessed: 0,
  },
]

const mockDepartures = [
  {
    id: "DEP-2024-001",
    flightNumber: "AI-102",
    destination: "London",
    scheduledTime: "18:30",
    status: "boarding",
    passengers: 267,
    touristsCheckedOut: 45,
    touristsExpected: 52,
  },
  {
    id: "DEP-2024-002",
    flightNumber: "EK-508",
    destination: "Dubai",
    scheduledTime: "20:15",
    status: "scheduled",
    passengers: 356,
    touristsCheckedOut: 12,
    touristsExpected: 89,
  },
]

const mockTouristQueue = [
  {
    id: "TST-2024-A7B9C2D1",
    name: "John Smith",
    nationality: "American",
    passportNumber: "US123456789",
    flightNumber: "AI-101",
    purpose: "Tourism",
    duration: "10 days",
    status: "pending_verification",
    documents: ["passport", "visa", "return_ticket"],
    riskLevel: "low",
  },
  {
    id: "TST-2024-B8C3D4E2",
    name: "Maria Garcia",
    nationality: "Spanish",
    passportNumber: "ES987654321",
    flightNumber: "AI-101",
    purpose: "Business",
    duration: "5 days",
    status: "verified",
    documents: ["passport", "visa", "invitation_letter"],
    riskLevel: "low",
  },
  {
    id: "TST-2024-C9D4E5F3",
    name: "Ahmed Hassan",
    nationality: "Egyptian",
    passportNumber: "EG456789123",
    flightNumber: "EK-507",
    purpose: "Tourism",
    duration: "14 days",
    status: "flagged",
    documents: ["passport", "visa"],
    riskLevel: "medium",
  },
]

const mockAnalytics = {
  dailyArrivals: 1247,
  dailyDepartures: 1156,
  touristsProcessed: 456,
  averageProcessingTime: "3.2 min",
  verificationSuccess: 94.5,
  flaggedCases: 12,
}

export function AirportDashboard() {
  const [selectedTab, setSelectedTab] = useState("arrivals")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTourist, setSelectedTourist] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "landed":
      case "verified":
        return "text-green-600 bg-green-50 border-green-200"
      case "boarding":
      case "pending_verification":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "approaching":
      case "scheduled":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "flagged":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const handleTouristVerification = (touristId: string, action: "approve" | "flag" | "reject") => {
    // Simulate verification process
    alert(`Tourist ${touristId} has been ${action}ed`)
  }

  const generateDigitalId = (touristId: string) => {
    // Simulate digital ID generation
    alert(`Digital Tourist ID generated for ${touristId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Plane className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">Airport Control Center</h1>
              <p className="text-sm text-muted-foreground">Tourist Entry & Exit Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {currentTime.toLocaleString()}
            </div>
            <Badge variant="secondary">{mockAnalytics.touristsProcessed} Processed Today</Badge>
            <Button variant="ghost" size="sm">
              <AlertTriangle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="arrivals">Arrivals</TabsTrigger>
            <TabsTrigger value="departures">Departures</TabsTrigger>
            <TabsTrigger value="verification">Tourist Verification</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          {/* Arrivals Tab */}
          <TabsContent value="arrivals" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Arrivals</CardTitle>
                  <Plane className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.dailyArrivals.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+8%</span> from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tourists Processed</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.touristsProcessed}</div>
                  <p className="text-xs text-muted-foreground">
                    Out of {mockArrivals.reduce((sum, flight) => sum + flight.touristsExpected, 0)} expected
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockAnalytics.averageProcessingTime}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">-12%</span> improvement
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Flagged Cases</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{mockAnalytics.flaggedCases}</div>
                  <p className="text-xs text-muted-foreground">Requiring manual review</p>
                </CardContent>
              </Card>
            </div>

            {/* Flight Arrivals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  Incoming Flights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockArrivals.map((flight) => (
                    <div key={flight.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Plane className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{flight.flightNumber}</h3>
                          <p className="text-sm text-muted-foreground">From {flight.origin}</p>
                          <p className="text-xs text-muted-foreground">
                            Scheduled: {flight.scheduledTime} | Actual: {flight.actualTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm font-medium">Passengers</p>
                          <p className="text-lg font-bold">{flight.passengers}</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-medium">Tourists</p>
                          <p className="text-lg font-bold">
                            {flight.touristsProcessed}/{flight.touristsExpected}
                          </p>
                          <Progress
                            value={(flight.touristsProcessed / flight.touristsExpected) * 100}
                            className="w-16 mt-1"
                          />
                        </div>

                        <div className="text-center">
                          <Badge className={getStatusColor(flight.status)}>{flight.status}</Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Users className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departures Tab */}
          <TabsContent value="departures" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5 rotate-45" />
                  Outgoing Flights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDepartures.map((flight) => (
                    <div key={flight.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                          <Plane className="h-6 w-6 text-secondary rotate-45" />
                        </div>
                        <div>
                          <h3 className="font-medium">{flight.flightNumber}</h3>
                          <p className="text-sm text-muted-foreground">To {flight.destination}</p>
                          <p className="text-xs text-muted-foreground">Departure: {flight.scheduledTime}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm font-medium">Passengers</p>
                          <p className="text-lg font-bold">{flight.passengers}</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-medium">Tourist Checkout</p>
                          <p className="text-lg font-bold">
                            {flight.touristsCheckedOut}/{flight.touristsExpected}
                          </p>
                          <Progress
                            value={(flight.touristsCheckedOut / flight.touristsExpected) * 100}
                            className="w-16 mt-1"
                          />
                        </div>

                        <div className="text-center">
                          <Badge className={getStatusColor(flight.status)}>{flight.status}</Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm">Process Checkout</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tourist Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Tourist Verification Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Input
                    placeholder="Search by name, passport, or flight..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Scan className="h-4 w-4 mr-2" />
                    Scan Document
                  </Button>
                </div>

                <div className="space-y-4">
                  {mockTouristQueue.map((tourist) => (
                    <Card
                      key={tourist.id}
                      className={`border-l-4 ${
                        tourist.status === "flagged"
                          ? "border-l-red-500"
                          : tourist.status === "verified"
                            ? "border-l-green-500"
                            : "border-l-yellow-500"
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <UserCheck className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{tourist.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {tourist.nationality} • {tourist.passportNumber}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Flight: {tourist.flightNumber} • {tourist.purpose} • {tourist.duration}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getRiskColor(tourist.riskLevel)}>{tourist.riskLevel} risk</Badge>
                            <Badge className={getStatusColor(tourist.status)}>{tourist.status}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3">Documents Submitted</h4>
                            <div className="flex flex-wrap gap-2">
                              {tourist.documents.map((doc, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                  {doc === "passport" && <Passport className="h-3 w-3" />}
                                  {doc === "visa" && <CreditCard className="h-3 w-3" />}
                                  {doc === "return_ticket" && <Plane className="h-3 w-3" />}
                                  {doc === "invitation_letter" && <FileCheck className="h-3 w-3" />}
                                  {doc.replace("_", " ")}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2">
                            {tourist.status === "pending_verification" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleTouristVerification(tourist.id, "flag")}
                                >
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Flag
                                </Button>
                                <Button size="sm" onClick={() => handleTouristVerification(tourist.id, "approve")}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                              </>
                            )}
                            {tourist.status === "verified" && (
                              <Button size="sm" onClick={() => generateDigitalId(tourist.id)}>
                                <QrCode className="h-4 w-4 mr-2" />
                                Generate ID
                              </Button>
                            )}
                            {tourist.status === "flagged" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleTouristVerification(tourist.id, "reject")}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button size="sm" onClick={() => handleTouristVerification(tourist.id, "approve")}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Override
                                </Button>
                              </>
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verification Success</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockAnalytics.verificationSuccess}%</div>
                  <Progress value={mockAnalytics.verificationSuccess} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Departures</CardTitle>
                  <Plane className="h-4 w-4 text-muted-foreground rotate-45" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.dailyDepartures.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+5%</span> from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nationality Distribution</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>American</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} />
                    <div className="flex justify-between text-sm">
                      <span>European</span>
                      <span>28%</span>
                    </div>
                    <Progress value={28} />
                    <div className="flex justify-between text-sm">
                      <span>Asian</span>
                      <span>22%</span>
                    </div>
                    <Progress value={22} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">14:00-18:00</div>
                  <p className="text-xs text-muted-foreground">Highest tourist traffic</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Processing Statistics
                  </span>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-lg border">
                    <div className="text-3xl font-bold text-green-600">892</div>
                    <p className="text-sm text-muted-foreground">Approved Today</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <div className="text-3xl font-bold text-yellow-600">45</div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <div className="text-3xl font-bold text-red-600">12</div>
                    <p className="text-sm text-muted-foreground">Flagged Cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  System Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-red-800">High Risk Tourist Detected</h4>
                          <p className="text-red-700">
                            Tourist Ahmed Hassan flagged by security system - requires manual verification
                          </p>
                          <p className="text-xs text-red-600 mt-1">Flight EK-507 • 15 minutes ago</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-yellow-200 bg-yellow-50">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-yellow-800">Processing Delay Warning</h4>
                          <p className="text-yellow-700">Tourist verification queue exceeding normal processing time</p>
                          <p className="text-xs text-yellow-600 mt-1">Current wait time: 8 minutes • 1 hour ago</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Optimize
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-blue-200 bg-blue-50">
                    <Plane className="h-4 w-4 text-blue-600" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-blue-800">Flight Delay Notification</h4>
                          <p className="text-blue-700">Flight LH-763 from Frankfurt delayed by 30 minutes</p>
                          <p className="text-xs text-blue-600 mt-1">78 tourists affected • 2 hours ago</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Acknowledge
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
