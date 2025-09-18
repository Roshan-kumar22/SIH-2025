"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Upload, MapPin, User, FileText, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

const steps = [
  { id: 1, title: "Personal Information", description: "Basic details and contact information" },
  { id: 2, title: "Document Verification", description: "Upload Aadhaar/Passport for KYC" },
  { id: 3, title: "Travel Itinerary", description: "Trip details and emergency contacts" },
  { id: 4, title: "Digital ID Generation", description: "Generate blockchain-secured tourist ID" },
]

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
]

export function TouristRegistration() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    dateOfBirth: "",
    gender: "",

    // Document Verification
    documentType: "",
    documentNumber: "",
    documentFile: null as File | null,

    // Travel Itinerary
    visitPurpose: "",
    arrivalDate: "",
    departureDate: "",
    accommodationAddress: "",
    visitingStates: [] as string[],
    emergencyContact1Name: "",
    emergencyContact1Phone: "",
    emergencyContact2Name: "",
    emergencyContact2Phone: "",

    // Preferences
    allowTracking: false,
    receiveAlerts: true,
    shareWithFamily: false,
  })

  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [generatingId, setGeneratingId] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadStatus("uploading")
      // Simulate file upload
      setTimeout(() => {
        setFormData((prev) => ({ ...prev, documentFile: file }))
        setUploadStatus("success")
      }, 2000)
    }
  }

  const handleStateToggle = (state: string) => {
    setFormData((prev) => ({
      ...prev,
      visitingStates: prev.visitingStates.includes(state)
        ? prev.visitingStates.filter((s) => s !== state)
        : [...prev.visitingStates, state],
    }))
  }

  const generateDigitalId = () => {
    setGeneratingId(true)
    // Simulate blockchain ID generation
    setTimeout(() => {
      setGeneratingId(false)
      setCurrentStep(5) // Success step
    }, 3000)
  }

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone
      case 2:
        return formData.documentType && formData.documentNumber && formData.documentFile
      case 3:
        return formData.arrivalDate && formData.departureDate && formData.accommodationAddress
      default:
        return false
    }
  }

  const canProceed = isStepComplete(currentStep)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">SafeTour</span>
          </Link>
          <Badge variant="secondary">Tourist Registration</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep > step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "border-primary text-primary"
                        : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-0.5 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
          </p>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <User className="h-5 w-5" />}
              {currentStep === 2 && <FileText className="h-5 w-5" />}
              {currentStep === 3 && <MapPin className="h-5 w-5" />}
              {currentStep === 4 && <Shield className="h-5 w-5" />}
              {steps[currentStep - 1]?.title}
            </CardTitle>
            <CardDescription>{steps[currentStep - 1]?.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select
                    value={formData.nationality}
                    onValueChange={(value) => handleInputChange("nationality", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="foreign">Foreign National</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Document Verification */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type *</Label>
                    <Select
                      value={formData.documentType}
                      onValueChange={(value) => handleInputChange("documentType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="voter">Voter ID</SelectItem>
                        <SelectItem value="driving">Driving License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentNumber">Document Number *</Label>
                    <Input
                      id="documentNumber"
                      value={formData.documentNumber}
                      onChange={(e) => handleInputChange("documentNumber", e.target.value)}
                      placeholder="Enter document number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentFile">Upload Document *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    {uploadStatus === "success" ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>Document uploaded successfully</span>
                      </div>
                    ) : uploadStatus === "uploading" ? (
                      <div className="flex items-center justify-center gap-2 text-blue-600">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span>Uploading document...</span>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Secure Document Processing</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your documents are encrypted and processed using blockchain technology for maximum security. We
                        comply with all data protection regulations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Travel Itinerary */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="visitPurpose">Purpose of Visit</Label>
                    <Select
                      value={formData.visitPurpose}
                      onValueChange={(value) => handleInputChange("visitPurpose", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tourism">Tourism</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="pilgrimage">Pilgrimage</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrivalDate">Arrival Date *</Label>
                    <Input
                      id="arrivalDate"
                      type="date"
                      value={formData.arrivalDate}
                      onChange={(e) => handleInputChange("arrivalDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departureDate">Departure Date *</Label>
                    <Input
                      id="departureDate"
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) => handleInputChange("departureDate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accommodationAddress">Accommodation Address *</Label>
                  <Textarea
                    id="accommodationAddress"
                    value={formData.accommodationAddress}
                    onChange={(e) => handleInputChange("accommodationAddress", e.target.value)}
                    placeholder="Enter your accommodation address"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>States/UTs to Visit</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-4">
                    {indianStates.map((state) => (
                      <div key={state} className="flex items-center space-x-2">
                        <Checkbox
                          id={state}
                          checked={formData.visitingStates.includes(state)}
                          onCheckedChange={() => handleStateToggle(state)}
                        />
                        <Label htmlFor={state} className="text-sm">
                          {state}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.visitingStates.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.visitingStates.map((state) => (
                        <Badge key={state} variant="secondary" className="text-xs">
                          {state}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Emergency Contact 1</h4>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact1Name">Name</Label>
                      <Input
                        id="emergencyContact1Name"
                        value={formData.emergencyContact1Name}
                        onChange={(e) => handleInputChange("emergencyContact1Name", e.target.value)}
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact1Phone">Phone</Label>
                      <Input
                        id="emergencyContact1Phone"
                        value={formData.emergencyContact1Phone}
                        onChange={(e) => handleInputChange("emergencyContact1Phone", e.target.value)}
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Emergency Contact 2 (Optional)</h4>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact2Name">Name</Label>
                      <Input
                        id="emergencyContact2Name"
                        value={formData.emergencyContact2Name}
                        onChange={(e) => handleInputChange("emergencyContact2Name", e.target.value)}
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact2Phone">Phone</Label>
                      <Input
                        id="emergencyContact2Phone"
                        value={formData.emergencyContact2Phone}
                        onChange={(e) => handleInputChange("emergencyContact2Phone", e.target.value)}
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Privacy Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowTracking"
                        checked={formData.allowTracking}
                        onCheckedChange={(checked) => handleInputChange("allowTracking", checked)}
                      />
                      <Label htmlFor="allowTracking" className="text-sm">
                        Allow location tracking for safety monitoring
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="receiveAlerts"
                        checked={formData.receiveAlerts}
                        onCheckedChange={(checked) => handleInputChange("receiveAlerts", checked)}
                      />
                      <Label htmlFor="receiveAlerts" className="text-sm">
                        Receive safety alerts and notifications
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shareWithFamily"
                        checked={formData.shareWithFamily}
                        onCheckedChange={(checked) => handleInputChange("shareWithFamily", checked)}
                      />
                      <Label htmlFor="shareWithFamily" className="text-sm">
                        Share location with emergency contacts
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Digital ID Generation */}
            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-12 w-12 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Generate Your Digital Tourist ID</h3>
                  <p className="text-muted-foreground">
                    Your blockchain-secured digital identity will be created with all the information provided. This ID
                    will be valid only during your visit period.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-6 text-left">
                  <h4 className="font-medium mb-4">Registration Summary:</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span> {formData.firstName} {formData.lastName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span> {formData.email}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Visit Period:</span> {formData.arrivalDate} to{" "}
                      {formData.departureDate}
                    </div>
                    <div>
                      <span className="text-muted-foreground">States to Visit:</span> {formData.visitingStates.length}{" "}
                      selected
                    </div>
                  </div>
                </div>

                {generatingId ? (
                  <div className="space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
                    <p className="text-muted-foreground">Generating your blockchain-secured Digital Tourist ID...</p>
                    <Progress value={66} />
                  </div>
                ) : (
                  <Button size="lg" onClick={generateDigitalId} className="bg-secondary hover:bg-secondary/90">
                    <Shield className="mr-2 h-5 w-5" />
                    Generate Digital ID
                  </Button>
                )}
              </div>
            )}

            {/* Step 5: Success */}
            {currentStep === 5 && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Registration Successful!</h3>
                  <p className="text-muted-foreground">
                    Your Digital Tourist ID has been generated successfully. You can now access your dashboard.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                      <img src="/qr-code.png" alt="QR Code" className="w-10 h-10" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">
                        Tourist ID: TST-2024-{Math.random().toString(36).substr(2, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Valid from {formData.arrivalDate} to {formData.departureDate}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-green-700">
                    Your QR code and digital credentials have been sent to your email address.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                    Access Dashboard
                  </Button>
                  <Button size="lg" variant="outline">
                    Download ID Card
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={() => (currentStep === 4 ? generateDigitalId() : setCurrentStep((prev) => prev + 1))}
              disabled={!canProceed}
              className="bg-secondary hover:bg-secondary/90"
            >
              {currentStep === 4 ? "Generate ID" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
