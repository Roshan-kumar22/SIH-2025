"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"
import Link from "next/link"
import {
  Shield,
  MapPin,
  AlertTriangle,
  Brain,
  Smartphone,
  BarChart3,
  Globe,
  Lock,
  Users,
  Phone,
  Eye,
  Zap,
  Bed,
} from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "bn", name: "বাংলা" },
  { code: "te", name: "తెలుగు" },
  { code: "mr", name: "मराठी" },
  { code: "ta", name: "தமிழ்" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "ml", name: "മലയാളം" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "or", name: "ଓଡ଼ିଆ" },
]

const translations = {
  en: {
    title: "Smart Tourist Safety Monitoring System",
    subtitle: "AI-powered safety monitoring and emergency response for tourists",
    exploreFeatures: "Explore Features",
    features: "Key Features",
    digitalId: "Digital Tourist ID",
    digitalIdDesc: "Blockchain-secured digital identity with QR code verification",
    geoFencing: "Geo-Fencing Alerts",
    geoFencingDesc: "Real-time alerts when entering restricted or high-risk areas",
    panicButton: "Emergency SOS",
    panicButtonDesc: "One-tap emergency alert to nearest police and emergency contacts",
    aiSafety: "AI Safety Monitoring",
    aiSafetyDesc: "Intelligent anomaly detection and predictive risk assessment",
    iotIntegration: "IoT Integration",
    iotIntegrationDesc: "Smart wearables and sensors for continuous health monitoring",
    realTimeDashboard: "Real-Time Dashboards",
    realTimeDashboardDesc: "Live monitoring and incident management for authorities",
    trustedBy: "Trusted & Secure",
    blockchainVerified: "Blockchain Verified",
    dataPrivacy: "Data Privacy Compliant",
    multiLanguage: "Multi-Language Support",
    selectRole: "Login / Signup as",
    contactSupport: "Contact Support",
    accessDashboard: "Access Dashboard",
    getStarted: "Get Started Now",
    emergencySOS: "Emergency SOS",
  },
  hi: {
    title: "स्मार्ट पर्यटक सुरक्षा निगरानी प्रणाली",
    subtitle: "पर्यटकों के लिए AI-संचालित सुरक्षा निगरानी और आपातकालीन प्रतिक्रिया",
    exploreFeatures: "सुविधाएं देखें",
    features: "मुख्य विशेषताएं",
    digitalId: "डिजिटल पर्यटक पहचान",
    digitalIdDesc: "QR कोड सत्यापन के साथ ब्लॉकचेन-सुरक्षित डिजिटल पहचान",
    geoFencing: "भू-बाड़ अलर्ट",
    geoFencingDesc: "प्रतिबंधित या उच्च जोखिम वाले क्षेत्रों में प्रवेश करते समय रीयल-टाइम अलर्ट",
    panicButton: "आपातकालीन SOS",
    panicButtonDesc: "निकटतम पुलिस और आपातकालीन संपर्कों को एक-टैप आपातकालीन अलर्ट",
    aiSafety: "AI सुरक्षा निगरानी",
    aiSafetyDesc: "बुद्धिमान विसंगति का पता लगाना और भविष्यसूचक जोखिम मूल्यांकन",
    iotIntegration: "IoT एकीकरण",
    iotIntegrationDesc: "निरंतर स्वास्थ्य निगरानी के लिए स्मार्ट पहनने योग्य और सेंसर",
    realTimeDashboard: "रीयल-टाइम डैशबोर्ड",
    realTimeDashboardDesc: "अधिकारियों के लिए लाइव निगरानी और घटना प्रबंधन",
    trustedBy: "विश्वसनीय और सुरक्षित",
    blockchainVerified: "ब्लॉकचेन सत्यापित",
    dataPrivacy: "डेटा गोपनीयता अनुपालित",
    multiLanguage: "बहु-भाषा समर्थन",
    selectRole: "लॉगिन / साइनअप करें",
    contactSupport: "संपर्क सहायता",
    accessDashboard: "डैशबोर्ड खोलें",
    getStarted: "अभी शुरू करें",
    emergencySOS: "आपातकालीन SOS",
  },
}

export function LandingPage() {
  const [currentLang, setCurrentLang] = useState("en")
  const { user, logout } = useAuth()
  const t = translations[currentLang as keyof typeof translations]
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileOpen])

  const getDashboardRoute = () => {
    if (!user) return "/auth"
    switch (user.role) {
      case "tourist":
        return "/tourist"
      case "police":
        return "/police"
      case "airport":
        return "/airport"
      case "hotel":
        return "/hotel"
      case "admin":
        return "/admin"
      default:
        return "/auth"
    }
  }

  // Add your trip creation route here
  const getTripCreationRoute = () => "/tripCreate"

  const features = [
    {
      icon: Shield,
      title: t.digitalId,
      description: t.digitalIdDesc,
    },
    {
      icon: MapPin,
      title: t.geoFencing,
      description: t.geoFencingDesc,
    },
    {
      icon: AlertTriangle,
      title: t.panicButton,
      description: t.panicButtonDesc,
    },
    {
      icon: Brain,
      title: t.aiSafety,
      description: t.aiSafetyDesc,
    },
    {
      icon: Smartphone,
      title: t.iotIntegration,
      description: t.iotIntegrationDesc,
    },
    {
      icon: BarChart3,
      title: t.realTimeDashboard,
      description: t.realTimeDashboardDesc,
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">SafeTour</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {user ? (
              <>
                <Link href={getTripCreationRoute()}>
                  <Button size="sm" variant="outline" className="whitespace-nowrap">
                    <MapPin className="mr-2 h-5 w-5" />
                    Create Trip
                  </Button>
                </Link>
                <Link href={getDashboardRoute()}>
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90 whitespace-nowrap">
                    <Eye className="mr-2 h-5 w-5" />
                    Dashboard
                  </Button>
                </Link>
                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex items-center gap-2 px-2"
                    onClick={() => setProfileOpen((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={profileOpen}
                  >
                    <Avatar className="h-7 w-7">
                      <span className="sr-only">Profile</span>
                      {user.email?.[0]?.toUpperCase() || <Users className="h-5 w-5" />}
                    </Avatar>
                    <span className="hidden sm:inline font-medium">{user.email?.split("@")[0]}</span>
                  </Button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 animate-fade-in">
                      <div className="p-4 border-b">
                        <div className="font-medium break-all">{user.email}</div>
                        <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full text-left px-4 py-2 text-red-600 justify-start"
                        onClick={logout}
                      >
                        <LogOut className="inline-block mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth?role=tourist">
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90 whitespace-nowrap">
                    <Users className="mr-2 h-5 w-5" />
                    Tourist Login / Signup
                  </Button>
                </Link>
                <Link href="/auth?role=police">
                  <Button size="sm" variant="outline" className="whitespace-nowrap">
                    <Shield className="mr-2 h-5 w-5" />
                    Police Login
                  </Button>
                </Link>
                <Link href="/auth?role=hotel">
                  <Button size="sm" variant="outline" className="whitespace-nowrap">
                    <Bed className="mr-2 h-5 w-5" />
                    Hotel Login
                  </Button>
                </Link>
                <Link href="/auth?role=hospital">
                  <Button size="sm" variant="outline" className="whitespace-nowrap">
                    <Phone className="mr-2 h-5 w-5" />
                    Hospital Login
                  </Button>
                </Link>
                <Link href="/auth?role=admin">
                  <Button size="sm" variant="outline" className="whitespace-nowrap">
                    <Lock className="mr-2 h-5 w-5" />
                    Admin Login
                  </Button>
                </Link>
              </>
            )}
            {/* Language Selector */}
            <div className="flex items-center gap-2 ml-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="bg-background border border-border rounded-md px-2 py-1 text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Building_Tourist_Safety_System_Website-4XAwG91qy3j09IUDX93LnYsnPpvWMO.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container mx-auto text-center max-w-4xl relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">{t.title}</h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow">{t.subtitle}</p>
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Badge variant="secondary" className="px-4 py-2 bg-black/80 text-white border-white/20">
              <Lock className="mr-2 h-4 w-4" />
              {t.blockchainVerified}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 bg-black/80 text-white border-white/20">
              <Shield className="mr-2 h-4 w-4" />
              {t.dataPrivacy}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 bg-black/80 text-white border-white/20">
              <Globe className="mr-2 h-4 w-4" />
              {t.multiLanguage}
            </Badge>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.features}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive safety features powered by AI, blockchain, and IoT technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/90">
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to enhance tourist safety?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of tourists and authorities already using our platform for safer travel experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href={getDashboardRoute()}>
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                    <Zap className="mr-2 h-5 w-5" />
                    {t.accessDashboard}
                  </Button>
                </Link>
              ) : (
                <Link href="/auth">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                    <Zap className="mr-2 h-5 w-5" />
                    {t.getStarted}
                  </Button>
                </Link>
              )}
              <Button size="lg" variant="outline">
                <Phone className="mr-2 h-5 w-5" />
                {t.contactSupport}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 mt-auto">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-primary">SafeTour</span>
          </div>
          <p className="text-muted-foreground">© 2024 Smart Tourist Safety Monitoring System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
