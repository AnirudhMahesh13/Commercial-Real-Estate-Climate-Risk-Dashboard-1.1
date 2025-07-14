"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, BarChart, Bar } from "recharts"
import { Download, MapPin, TrendingUp, TrendingDown, Minus } from "lucide-react"
import Link from "next/link"

const noiProjectionData = [
  { year: 2025, baseline: 5.2, payFines: 4.8, retrofit: 4.9 },
  { year: 2030, baseline: 5.5, payFines: 4.2, retrofit: 5.8 },
  { year: 2035, baseline: 5.8, payFines: 3.8, retrofit: 6.2 },
  { year: 2040, baseline: 6.0, payFines: 3.2, retrofit: 6.8 },
  { year: 2045, baseline: 6.2, payFines: 2.8, retrofit: 7.2 },
  { year: 2050, baseline: 6.5, payFines: 2.5, retrofit: 7.8 },
]

const revenueOpexData = [
  { year: 2025, revenue: 8.8, opex: 3.6 },
  { year: 2030, revenue: 9.2, opex: 3.4 },
  { year: 2035, revenue: 9.8, opex: 3.6 },
  { year: 2040, revenue: 10.2, opex: 3.4 },
  { year: 2045, revenue: 10.8, opex: 3.6 },
  { year: 2050, revenue: 11.5, opex: 3.7 },
]

const kpiData = [
  {
    asset: "100 King St W",
    riskRating: "M",
    dscrDelta: "+0.15",
    ltvDirectionality: "↓",
    energyIntensityDelta: "-12%",
    retrofitCost: "$4,680",
  },
  {
    asset: "Benchmark",
    riskRating: "M",
    dscrDelta: "0.00",
    ltvDirectionality: "→",
    energyIntensityDelta: "0%",
    retrofitCost: "$5,200",
  },
]

export default function AssetViewPage() {
  const [scenario, setScenario] = React.useState("baseline")
  const [paymentPlan, setPaymentPlan] = React.useState("upfront")
  const [loanTerm, setLoanTerm] = React.useState("10")
  const [interestRate, setInterestRate] = React.useState("5.5")
  const [showBreakdown, setShowBreakdown] = React.useState(false)
  const [selectedYear, setSelectedYear] = React.useState<number | null>(null)

  const handleChartClick = (data: any) => {
    setSelectedYear(data.year)
    setShowBreakdown(true)
  }

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Year,Baseline NOI,Pay Fines NOI,Retrofit NOI\n" +
      noiProjectionData.map((row) => `${row.year},${row.baseline},${row.payFines},${row.retrofit}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "asset_projections.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getRiskColor = (rating: string) => {
    switch (rating) {
      case "L":
        return "bg-green-100 text-green-800"
      case "M":
        return "bg-yellow-100 text-yellow-800"
      case "H":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDirectionalityIcon = (direction: string) => {
    switch (direction) {
      case "↑":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "↓":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case "→":
        return <Minus className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#003DA5] text-white p-6 border-b">
        <h1 className="text-3xl font-bold">Here's What We Expect...</h1>
        <p className="text-blue-200 mt-2">Climate transition risk projections for your selected assets</p>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#003DA5]">NOI Projections (2025-2050)</CardTitle>
                <CardDescription>Net Operating Income projections under different scenarios</CardDescription>

                <div className="flex gap-4 flex-wrap">
                  <Select value={scenario} onValueChange={setScenario}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baseline">Baseline</SelectItem>
                      <SelectItem value="2deg-immediate">2.0° Immediate</SelectItem>
                      <SelectItem value="2deg-delayed">2.0° Delayed</SelectItem>
                      <SelectItem value="1.5deg-immediate">1.5° Immediate</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={paymentPlan} onValueChange={setPaymentPlan}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upfront">Pay All Upfront</SelectItem>
                      <SelectItem value="financing">Loan Financing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentPlan === "financing" && (
                  <div className="flex gap-4">
                    <div className="space-y-2">
                      <Label>Loan Term (years)</Label>
                      <Input value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-24" />
                    </div>
                    <div className="space-y-2">
                      <Label>Interest Rate (%)</Label>
                      <Input value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-24" />
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={noiProjectionData} onClick={handleChartClick}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis label={{ value: "NOI ($M)", angle: -90, position: "insideLeft" }} />
                    <Legend />
                    <Line type="monotone" dataKey="baseline" stroke="#003DA5" strokeWidth={2} name="Baseline" />
                    <Line type="monotone" dataKey="payFines" stroke="#EF4444" strokeWidth={2} name="Pay Fines" />
                    <Line type="monotone" dataKey="retrofit" stroke="#10B981" strokeWidth={2} name="Retrofit" />
                  </LineChart>
                </ResponsiveContainer>

                <Popover open={showBreakdown} onOpenChange={setShowBreakdown}>
                  <PopoverTrigger asChild>
                    <div />
                  </PopoverTrigger>
                  <PopoverContent className="w-96">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[#003DA5]">Revenue vs OpEx Breakdown - {selectedYear}</h3>
                      {selectedYear && (
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={[revenueOpexData.find((d) => d.year === selectedYear)]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Bar dataKey="revenue" fill="#003DA5" name="Revenue" />
                            <Bar dataKey="opex" fill="#FDB913" name="OpEx" />
                            <Legend />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - KPI Table */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-[#003DA5]">Key Performance Indicators</CardTitle>
                <CardDescription>Asset performance vs benchmark</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>DSCR Δ</TableHead>
                      <TableHead>LTV</TableHead>
                      <TableHead>Energy Δ</TableHead>
                      <TableHead>Retrofit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kpiData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-xs">{row.asset}</TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(row.riskRating)}>{row.riskRating}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{row.dscrDelta}</TableCell>
                        <TableCell>
                          <div className="flex items-center">{getDirectionalityIcon(row.ltvDirectionality)}</div>
                        </TableCell>
                        <TableCell className="text-xs">{row.energyIntensityDelta}</TableCell>
                        <TableCell className="text-xs">{row.retrofitCost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-[#003DA5] flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Risk Zone Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Interactive Risk Map</p>
                    <p className="text-xs">Asset pins + regional overlays</p>
                    <div className="flex gap-2 mt-2 justify-center">
                      <Badge className="bg-green-100 text-green-800 text-xs">Low Risk</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">Medium Risk</Badge>
                      <Badge className="bg-red-100 text-red-800 text-xs">High Risk</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Link href="/asset-search">
            <Button variant="outline">Compare More Assets</Button>
          </Link>

          <Button onClick={exportCSV} className="bg-[#FDB913] hover:bg-yellow-500 text-black">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  )
}
