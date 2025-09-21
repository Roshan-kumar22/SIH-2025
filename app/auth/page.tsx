"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const roleLabels: Record<string, string> = {
  tourist: "Tourist",
  police: "Police",
  hotel: "Hotel",
  hospital: "Hospital",
  admin: "Admin",
}

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, login, signup } = useAuth()

  const role = searchParams.get("role") || "tourist"
  const [isLogin, setIsLogin] = useState(true)
  // Tourist fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dob, setDob] = useState("")
  const [idType, setIdType] = useState("aadhaar")
  const [idNumber, setIdNumber] = useState("")
  const [sex, setSex] = useState("male")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setError("")
    setIsLogin(true)
    setFirstName("")
    setLastName("")
    setDob("")
    setIdType("aadhaar")
    setIdNumber("")
    setSex("male")
    setPhone("")
    setEmail("")
    setPassword("")
  }, [role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      if (isLogin) {
        const { error } = await login(email, password)
        if (error) throw error
      } else {
        // Call your API route
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            profile: {
              first_name: firstName,
              last_name: lastName,
              dob,
              id_type: idType,
              id_number: idNumber,
              sex,
              phone,
              role,
            }
          })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Signup failed")
      }
      // redirect based on role
      router.push(`/${role}`)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>
            {isLogin ? `${roleLabels[role] || "User"} Login` : `${roleLabels[role] || "User"} Sign Up`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && role === "tourist" && (
              <>
                <div>
                  <Label>First Name</Label>
                  <Input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input type="date" value={dob} onChange={e => setDob(e.target.value)} required />
                </div>
                <div>
                  <Label>ID Type</Label>
                  <Select value={idType} onValueChange={setIdType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>ID Number</Label>
                  <Input type="text" value={idNumber} onChange={e => setIdNumber(e.target.value)} required />
                </div>
                <div>
                  <Label>Sex</Label>
                  <Select value={sex} onValueChange={setSex}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
              </>
            )}
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
          <div className="text-center mt-4">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don’t have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
