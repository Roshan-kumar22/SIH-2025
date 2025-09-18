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
import {
  Shield,
  MapPin,
  AlertTriangle,
  Users,
  Bell,
  Filter,
  Eye,
  Phone,
  FileText,
  BarChart3,
  Clock,
  AlertCircle,
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
} from "lucide-react"

// Mock data for demonstration
const mockTourists = [
  {
    id: "TST-2024-A7B9C2D1",
    name: "John Doe",
    nationality: "Indian",
    location: "Gateway of India, Mumbai",
    safetyScore: 85,
    status: "safe",
    lastSeen: "2 minutes ago",
    phone: "+91 9876543210",
    checkIn: "2024-01-15",
    checkOut: "2024-01-25",
  },
  {
    id: "TST-2024-B8C3D4E2",
    name: "Sarah Johnson",
    nationality: "American",
    location: "Baga Beach, Goa",
    safetyScore: 92,
    status: "safe",
    lastSeen: "5 minutes ago",
    phone: "+1 555-0123",
    checkIn: "2024-01-14",
    checkOut: "2024-01-28",
  },
  {
    id: "TST-2024-C9D4E5F3",
    name: "Raj Patel",
    nationality: "Indian",
    location: "Mysore Palace, Karnataka",
    safetyScore: 45,
    status: "alert",
    lastSeen: "15 minutes ago",
    phone: "+91 9876543211",
    checkIn: "2024-01-16",
    checkOut: "2024-01-20",
  },
]

const mockIncidents = [
  {
    id: "INC-2024-001",
    type: "emergency",
    title: "Emergency SOS Alert",
    tourist: "John Doe (TST-2024-A7B9C2D1)",
    location: "Colaba Fort, Mumbai",
    timestamp: "3 minutes ago",
    status: "active",
    priority: "high",
    description: "Tourist activated emergency SOS button. Location shared with emergency contacts.",
  },
  {
    id: "INC-2024-002",
    type: "geofence",
    title: "Geo-fence Violation",
    tourist: "Raj Patel (TST-2024-C9D4E5F3)",
    location: "Restricted Area, Mysore",
    timestamp: "12 minutes ago",
    status: "investigating",
    priority: "medium",
    description: "Tourist entered restricted military area. Automatic alert generated.",
  },
  {
    id: "INC-2024-003",
    type: "anomaly",
    title: "AI Anomaly Detection",
    tourist: "Sarah Johnson (TST-2024-B8C3D4E2)",
    location: "Anjuna Beach, Goa",
    timestamp: "1 hour ago",
    status: "resolved",
    priority: "low",
    description: "Unusual movement pattern detected. Tourist confirmed safe via automated check.",
  },
]

const mockAnalytics = {
  totalTourists: 1247,
  activeTourists: 892,
  totalIncidents: 23,
  activeIncidents: 3,
  safetyScore: 87,
  responseTime: "2.3 min",
}

const riskZones = [
  { name: "Colaba Fort Area", risk: "high", tourists: 12, incidents: 3 },
  { name: "Crawford Market", risk: "medium", tourists: 45, incidents: 1 },
  { name: "Marine Drive", risk: "low", tourists: 78, incidents: 0 },
  { name: "Gateway of India", risk: "low", tourists: 156, incidents: 0 },
]

export function PoliceDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const filteredTourists = mockTourists.filter((tourist) => {
    const matchesSearch =
      tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tourist.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || tourist.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "text-green-600 bg-green-50 border-green-200"
      case "alert":
        return "text-red-600 bg-red-50 border-red-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">Police Command Center</h1>
              <p className="text-sm text-muted-foreground">Tourist Safety Monitoring System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {currentTime.toLocaleString()}
            </div>
            <Badge variant="destructive" className="animate-pulse">
              {mockAnalytics.activeIncidents} Active Alerts
            </Badge>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tourists">Tourist Monitoring</TabsTrigger>
            <TabsTrigger value="incidents">Incident Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tourists</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.totalTourists.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+12%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Tourists</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.activeTourists.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Currently in monitored areas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{mockAnalytics.activeIncidents}</div>
                  <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockAnalytics.responseTime}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">-15%</span> improvement
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Live Map and Risk Zones */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Live Tourist Heat Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Interactive map showing real-time tourist locations</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {mockAnalytics.activeTourists} tourists currently tracked
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Zones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskZones.map((zone, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{zone.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {zone.tourists} tourists • {zone.incidents} incidents
                          </p>
                        </div>
                        <Badge className={getRiskColor(zone.risk)}>{zone.risk}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Incidents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Recent Incidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockIncidents.slice(0, 3).map((incident) => (
                    <Alert key={incident.id} className={getPriorityColor(incident.priority)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{incident.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {incident.priority}
                            </Badge>
                          </div>
                          <AlertDescription className="text-sm mb-2">{incident.description}</AlertDescription>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {incident.tourist}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {incident.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {incident.timestamp}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tourist Monitoring Tab */}
          <TabsContent value="tourists" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Tourist Search & Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="safe">Safe</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tourist List */}
            <Card>
              <CardHeader>
                <CardTitle>Active Tourists ({filteredTourists.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTourists.map((tourist) => (
                    <div key={tourist.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{tourist.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {tourist.id}</p>
                          <p className="text-sm text-muted-foreground">{tourist.nationality}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm font-medium">Safety Score</p>
                          <div
                            className={`text-lg font-bold ${
                              tourist.safetyScore >= 80
                                ? "text-green-600"
                                : tourist.safetyScore >= 60
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {tourist.safetyScore}
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">{tourist.location}</p>
                          <p className="text-xs text-muted-foreground">Last seen: {tourist.lastSeen}</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-medium">Status</p>
                          <Badge className={getStatusColor(tourist.status)}>{tourist.status}</Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Incident Management Tab */}
          <TabsContent value="incidents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Incident Management
                  </span>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate E-FIR
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockIncidents.map((incident) => (
                    <Card
                      key={incident.id}
                      className={`border-l-4 ${
                        incident.priority === "high"
                          ? "border-l-red-500"
                          : incident.priority === "medium"
                            ? "border-l-yellow-500"
                            : "border-l-blue-500"
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{incident.title}</CardTitle>
                            <Badge className={getPriorityColor(incident.priority)}>{incident.priority}</Badge>
                            <Badge variant="outline">{incident.status}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button size="sm">Respond</Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{incident.description}</p>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Tourist:</span>
                            <p className="text-muted-foreground">{incident.tourist}</p>
                          </div>
                          <div>
                            <span className="font-medium">Location:</span>
                            <p className="text-muted-foreground">{incident.location}</p>
                          </div>
                          <div>
                            <span className="font-medium">Time:</span>
                            <p className="text-muted-foreground">{incident.timestamp}</p>
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
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Tourist Inflow Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Week</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">+15%</span>
                      </div>
                    </div>
                    <Progress value={75} />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Month</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">+8%</span>
                      </div>
                    </div>
                    <Progress value={60} />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Year</span>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-600">-3%</span>
                      </div>
                    </div>
                    <Progress value={45} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Safety Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">{mockAnalytics.safetyScore}%</div>
                      <p className="text-sm text-muted-foreground">Overall Safety Score</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-green-600">98.5%</div>
                        <p className="text-xs text-muted-foreground">Safe Tourists</p>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-yellow-600">1.5%</div>
                        <p className="text-xs text-muted-foreground">At Risk</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Incident Reports
                  </span>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-red-600">23</div>
                    <p className="text-sm text-muted-foreground">Total Incidents</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">20</div>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-yellow-600">3</div>
                    <p className="text-sm text-muted-foreground">Active</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">2.3 min</div>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Emergency SOS</span>
                    <span className="font-medium">8 incidents</span>
                  </div>
                  <Progress value={35} />

                  <div className="flex items-center justify-between text-sm">
                    <span>Geo-fence Violations</span>
                    <span className="font-medium">10 incidents</span>
                  </div>
                  <Progress value={43} />

                  <div className="flex items-center justify-between text-sm">
                    <span>AI Anomaly Detection</span>
                    <span className="font-medium">5 incidents</span>
                  </div>
                  <Progress value={22} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
