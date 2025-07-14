"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, MapPin, Edit2 } from "lucide-react"
import Link from "next/link"

const mockAssetData = {
  company: "RBC Real Estate Holdings",
  lob: "Commercial Banking",
  propertyType: "Office Tower",
  size: "450,000 sq ft",
  value: "$45,000,000",
  age: "15 years",
  heatSource: "Natural Gas",
  certifications: "LEED Gold, ENERGY STAR",
  loanAmount: "$32,000,000",
  loanTerm: "84 months",
  annualDebtPayments: "$4,800,000",
  revenue2024: "$8,500,000",
  opex2024: "$3,200,000",
  address: "100 King Street West, Toronto, ON M5X 1A9",
}

export default function AssetOverviewPage() {
  const [currentAsset, setCurrentAsset] = React.useState(1)
  const [totalAssets] = React.useState(3)
  const [editingField, setEditingField] = React.useState<string | null>(null)
  const [assetData, setAssetData] = React.useState(mockAssetData)

  const handleEdit = (field: string) => {
    setEditingField(field)
  }

  const handleSave = (field: string, value: string) => {
    setAssetData({ ...assetData, [field]: value })
    setEditingField(null)
  }

  const EditableField = ({
    label,
    field,
    value,
    type = "text",
  }: {
    label: string
    field: string
    value: string
    type?: string
  }) => {
    const [tempValue, setTempValue] = React.useState(value)

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        {editingField === field ? (
          <div className="flex gap-2">
            <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="flex-1" autoFocus />
            <Button size="sm" onClick={() => handleSave(field, tempValue)}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
              Cancel
            </Button>
          </div>
        ) : (
          <div
            className="p-2 border rounded cursor-pointer hover:bg-gray-50 flex items-center justify-between group"
            onDoubleClick={() => handleEdit(field)}
          >
            <span>{value}</span>
            <Edit2 className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#003DA5] text-white p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Asset Overview</h1>
            <p className="text-blue-200 mt-2">Review and edit asset details</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">
              Asset {currentAsset} of {totalAssets}
            </div>
            <div className="text-blue-200 text-sm">Double-click fields to edit</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asset Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#003DA5]">Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EditableField label="Company" field="company" value={assetData.company} />
                <EditableField label="Line of Business" field="lob" value={assetData.lob} />
                <EditableField label="Property Type" field="propertyType" value={assetData.propertyType} />
                <EditableField label="Size" field="size" value={assetData.size} />
                <EditableField label="Value" field="value" value={assetData.value} />
                <EditableField label="Age" field="age" value={assetData.age} />
                <EditableField label="Heat Source" field="heatSource" value={assetData.heatSource} />
                <EditableField label="Certifications" field="certifications" value={assetData.certifications} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#003DA5]">Loan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EditableField label="Loan Amount" field="loanAmount" value={assetData.loanAmount} />
                <EditableField label="Term (TTM)" field="loanTerm" value={assetData.loanTerm} />
                <EditableField
                  label="Annual Debt Payments"
                  field="annualDebtPayments"
                  value={assetData.annualDebtPayments}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#003DA5]">NOI 2024 Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EditableField label="Revenue" field="revenue2024" value={assetData.revenue2024} />
                <EditableField label="Operating Expenses" field="opex2024" value={assetData.opex2024} />
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Net Operating Income</span>
                    <span className="text-lg font-bold text-[#003DA5]">
                      $
                      {(
                        Number.parseInt(assetData.revenue2024.replace(/[$,]/g, "")) -
                        Number.parseInt(assetData.opex2024.replace(/[$,]/g, ""))
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#003DA5] flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Property Location
                </CardTitle>
                <CardDescription>{assetData.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center border">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive Map</p>
                    <p className="text-sm">100 King Street West, Toronto</p>
                    <Badge className="mt-2 bg-red-100 text-red-800">High Risk Zone</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#003DA5]">Risk Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Climate Risk Rating</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Energy Efficiency</span>
                    <Badge className="bg-green-100 text-green-800">LEED Gold</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Retrofit Priority</span>
                    <Badge className="bg-blue-100 text-blue-800">Moderate</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Est. Retrofit Cost</span>
                    <span className="font-semibold text-[#FDB913]">$2.1M</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button
            variant="outline"
            disabled={currentAsset === 1}
            onClick={() => setCurrentAsset(Math.max(1, currentAsset - 1))}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous Asset
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalAssets }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentAsset === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentAsset(i + 1)}
                className={currentAsset === i + 1 ? "bg-[#003DA5]" : ""}
              >
                {i + 1}
              </Button>
            ))}
          </div>

          {currentAsset < totalAssets ? (
            <Button
              onClick={() => setCurrentAsset(Math.min(totalAssets, currentAsset + 1))}
              className="bg-[#003DA5] hover:bg-blue-800"
            >
              Next Asset
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Link href="/asset-view">
              <Button className="bg-[#FDB913] hover:bg-yellow-500 text-black">
                Proceed to Analysis
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
