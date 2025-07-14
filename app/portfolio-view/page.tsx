"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { Download, Filter, MapPin, TrendingUp, TrendingDown, Minus } from "lucide-react"
import Link from "next/link"

const portfolioRiskData = [
  { name: "Low Risk", value: 42, color: "#10B981" },
  { name: "Medium Risk", value: 38, color: "#FDB913" },
  { name: "High Risk", value: 20, color: "#EF4444" },
]

const portfolioGeographyData = [
  { name: "Toronto", properties: 45, value: 1.8 },
  { name: "Montreal", properties: 32, value: 1.2 },
  { name: "Vancouver", properties: 28, value: 1.5 },
  { name: "Calgary", properties: 24, value: 0.9 },
  { name: "Ottawa", properties: 18, value: 0.7 },
]

const portfolioNoiData = [
  { year: 2025, benchmark: 45.2, retrofit: 44.8, payFines: 42.1 },
  { year: 2030, benchmark: 48.5, retrofit: 52.8, payFines: 38.2 },
  { year: 2035, benchmark: 51.8, retrofit: 58.2, payFines: 34.8 },
  { year: 2040, benchmark: 55.0, retrofit: 64.8, payFines: 31.2 },
  { year: 2045, benchmark: 58.2, retrofit: 71.2, payFines: 27.8 },
  { year: 2050, benchmark: 61.5, retrofit: 78.8, payFines: 24.5 },
]

const portfolioRevenueOpexData = [
  { year: 2025, revenue: 88.8, opex: 43.6 },
  { year: 2030, revenue: 95.2, opex: 42.4 },
  { year: 2035, revenue: 102.8, opex: 44.6 },
  { year: 2040, revenue: 110.2, opex: 45.4 },
  { year: 2045, revenue: 118.8, opex: 47.6 },
  { year: 2050, revenue: 128.5, opex: 50.7 },
]

const assetTableData = [
  {
    postalCode: "M5X 1A9",
    riskRating: "M",
    dscrDelta: "+0.15",
    ltvDelta: "↓",
    energyIntensityDelta: "-12%",
    retrofitCost: "$4,680",
  },
  {
    postalCode: "H3B 4W8",
    riskRating: "L",
    dscrDelta: "+0.08",
    ltvDelta: "→",
    energyIntensityDelta: "-8%",
    retrofitCost: "$3,200",
  },
  {
    postalCode: "V6C 2T8",
    riskRating: "H",
    dscrDelta: "-0.05",
    ltvDelta: "↑",
    energyIntensityDelta: "+5%",
    retrofitCost: "$8,900",
  },
  {
    postalCode: "T2P 2M5",
    riskRating: "M",
    dscrDelta: "+0.12",
    ltvDelta: "↓",
    energyIntensityDelta: "-15%",
    retrofitCost: "$5,400",
  },
  {
    postalCode: "K1P 1J1",
    riskRating: "L",
    dscrDelta: "+0.18",
    ltvDelta: "↓",
    energyIntensityDelta: "-20%",
    retrofitCost: "$2,800",
  },
]

export default function PortfolioViewPage() {
  const [splitMethod, setSplitMethod] = React.useState("properties")
  const [groupingDimension, setGroupingDimension] = React.useState("geography")
  const [climateScenario, setClimateScenario] = React.useState("baseline")
  const [showBreakdown, setShowBreakdown] = React.useState(false)
  const [selectedYear, setSelectedYear] = React.useState<number | null>(null)
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")

  const handleChartClick = (data: any) => {
    setSelectedYear(data.year)
    setShowBreakdown(true)
  }

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Postal Code,Risk Rating,DSCR Delta,LTV Delta,Energy Intensity Delta,Retrofit Cost\n" +
      assetTableData
        .map(
          (row) =>
            `${row.postalCode},${row.riskRating},${row.dscrDelta},${row.ltvDelta},${row.energyIntensityDelta},${row.retrofitCost}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "portfolio_analysis.csv")
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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#003DA5] text-white p-6 border-b">
        <h1 className="text-3xl font-bold">Here's What We Expect...</h1>
        <p className="text-blue-200 mt-2">Portfolio-wide climate transition risk analysis</p>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Risk Exposure */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003DA5]">Portfolio Risk Exposure</CardTitle>
              <CardDescription>Risk distribution across portfolio</CardDescription>
              <div className="flex gap-4">
                <Select value={splitMethod} onValueChange={setSplitMethod}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="properties">By Number of Properties</SelectItem>
                    <SelectItem value="value">By Total Value</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={groupingDimension} onValueChange={setGroupingDimension}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geography">Geography</SelectItem>
                    <SelectItem value="lob">LOB/Sub-LOB</SelectItem>
                    <SelectItem value="type">Property Type</SelectItem>
                    <SelectItem value="energy">Energy Source</SelectItem>
                    <SelectItem value="certifications">Certifications</SelectItem>
                    <SelectItem value="intensity">Intensity Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={portfolioRiskData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {portfolioRiskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Exposure by Geography */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003DA5]">Exposure by Geography</CardTitle>
              <CardDescription>Regional portfolio distribution</CardDescription>
              <div className="flex gap-4">
                <Select value={splitMethod} onValueChange={setSplitMethod}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="properties">By Number of Properties</SelectItem>
                    <SelectItem value="value">By Total Value</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={groupingDimension} onValueChange={setGroupingDimension}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geography">Geography</SelectItem>
                    <SelectItem value="lob">LOB/Sub-LOB</SelectItem>
                    <SelectItem value="type">Property Type</SelectItem>
                    <SelectItem value="energy">Energy Source</SelectItem>
                    <SelectItem value="certifications">Certifications</SelectItem>
                    <SelectItem value="intensity">Intensity Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={portfolioGeographyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey={splitMethod === "properties" ? "properties" : "value"} fill="#003DA5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio NOI Projection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#003DA5]">Portfolio-Wide NOI Projections</CardTitle>
            <CardDescription>Net Operating Income projections across all assets</CardDescription>

            <div className="flex gap-4">
              <Select value={climateScenario} onValueChange={setClimateScenario}>
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
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={portfolioNoiData} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: "NOI ($M)", angle: -90, position: "insideLeft" }} />
                <Legend />
                <Line type="monotone" dataKey="benchmark" stroke="#003DA5" strokeWidth={3} name="Benchmark" />
                <Line type="monotone" dataKey="payFines" stroke="#EF4444" strokeWidth={3} name="Pay Fines" />
                <Line type="monotone" dataKey="retrofit" stroke="#10B981" strokeWidth={3} name="Retrofit" />
              </LineChart>
            </ResponsiveContainer>

            <Popover open={showBreakdown} onOpenChange={setShowBreakdown}>
              <PopoverTrigger asChild>
                <div />
              </PopoverTrigger>
              <PopoverContent className="w-96">
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#003DA5]">Portfolio Revenue vs OpEx - {selectedYear}</h3>
                  {selectedYear && (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={[portfolioRevenueOpexData.find((d) => d.year === selectedYear)]}>
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

        {/* Asset Table and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#003DA5]">Asset Performance Table</CardTitle>
                <CardDescription>Individual asset metrics and risk indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("postalCode")}>
                        Postal Code
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("riskRating")}>
                        Risk Rating
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("dscrDelta")}>
                        DSCR Delta
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("ltvDelta")}>
                        LTV Delta
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("energyIntensityDelta")}
                      >
                        Energy Intensity Δ
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("retrofitCost")}>
                        Retrofit Cost/unit
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetTableData.map((row, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{row.postalCode}</TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(row.riskRating)}>{row.riskRating}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{row.dscrDelta}</TableCell>
                        <TableCell>
                          <div className="flex items-center">{getDirectionalityIcon(row.ltvDelta)}</div>
                        </TableCell>
                        <TableCell className="text-sm">{row.energyIntensityDelta}</TableCell>
                        <TableCell className="text-sm">{row.retrofitCost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-[#003DA5] flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Portfolio Risk Map
                </CardTitle>
                <CardDescription>All assets with regional risk overlays</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center border">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive Portfolio Map</p>
                    <p className="text-sm">147 asset pins across Canada</p>
                    <div className="flex flex-col gap-2 mt-3">
                      <Badge className="bg-green-100 text-green-800 text-xs">62 Low Risk</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">56 Medium Risk</Badge>
                      <Badge className="bg-red-100 text-red-800 text-xs">29 High Risk</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Link href="/filter">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Adjust Filters
            </Button>
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
