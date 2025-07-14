"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Upload, FileText, TrendingUp, MapPin } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import Link from "next/link"

const riskExposureData = [
  { name: "Low Risk", value: 45, color: "#10B981" },
  { name: "Medium Risk", value: 35, color: "#FDB913" },
  { name: "High Risk", value: 20, color: "#EF4444" },
]

const geographyData = [
  { name: "Canada", properties: 125, value: 2.8 },
  { name: "United States", properties: 89, value: 3.2 },
  { name: "United Kingdom", properties: 34, value: 1.1 },
  { name: "European Union", properties: 28, value: 0.9 },
]

export default function HomePage() {
  const [splitMethod, setSplitMethod] = React.useState("properties")
  const [groupingDimension, setGroupingDimension] = React.useState("geography")
  const [showUploadPopover, setShowUploadPopover] = React.useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Mock file processing
      console.log("Processing file:", file.name)
      setShowUploadPopover(false)
      // In real app, this would populate data and enable Portfolio View
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#003DA5] text-white p-6 border-b">
        <h1 className="text-3xl font-bold">Welcome to ARC</h1>
        <p className="text-blue-200 mt-2">
          Evaluate climate transition risk across your commercial real estate portfolio
        </p>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        {/* Call to Action Buttons */}
        <div className="flex gap-4">
          <Link href="/asset-search">
            <Button size="lg" className="bg-[#003DA5] hover:bg-blue-800 text-white px-8 py-4 text-lg">
              <TrendingUp className="mr-2 h-5 w-5" />
              Asset-Level Analysis
            </Button>
          </Link>

          <Popover open={showUploadPopover} onOpenChange={setShowUploadPopover}>
            <PopoverTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="border-[#003DA5] text-[#003DA5] hover:bg-[#E6ECF0] px-8 py-4 text-lg bg-transparent"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Portfolio Breakdown
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-semibold text-[#003DA5]">Portfolio Analysis Options</h3>

                <div className="space-y-2">
                  <label htmlFor="csv-upload" className="block">
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <div>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload CSV
                      </div>
                    </Button>
                  </label>
                  <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                </div>

                <div className="border-t pt-2">
                  <Link href="/filter">
                    <Button className="w-full bg-[#003DA5] hover:bg-blue-800">
                      <FileText className="mr-2 h-4 w-4" />
                      Navigate to Filter Page
                    </Button>
                  </Link>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Exposure Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003DA5]">Risk Exposure</CardTitle>
              <CardDescription>Portfolio risk distribution</CardDescription>
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
                    data={riskExposureData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {riskExposureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Geography Exposure Chart */}
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
                <BarChart data={geographyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey={splitMethod === "properties" ? "properties" : "value"} fill="#003DA5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#003DA5]">276</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#003DA5]">$8.0B</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">High Risk Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">55</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg. Retrofit Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#FDB913]">$125K</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
