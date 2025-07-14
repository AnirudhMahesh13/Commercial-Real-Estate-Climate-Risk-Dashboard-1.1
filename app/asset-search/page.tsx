"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Building, ArrowRight, Plus, FileText } from "lucide-react"
import Link from "next/link"

const mockAddresses = [
  "100 King Street West, Toronto, ON",
  "1 Place Ville Marie, Montreal, QC",
  "1055 West Georgia Street, Vancouver, BC",
  "400 3rd Avenue SW, Calgary, AB",
  "150 Elgin Street, Ottawa, ON",
  "200 Bay Street, Toronto, ON",
  "1250 René-Lévesque Blvd West, Montreal, QC",
  "1021 West Hastings Street, Vancouver, BC",
  "525 8th Avenue SW, Calgary, AB",
  "Constitution Square, Ottawa, ON",
]

const mockAssets = [
  {
    id: 1,
    address: "100 King Street West, Toronto, ON",
    type: "Office Tower",
    value: "$45M",
    risk: "Medium",
    selected: false,
  },
  {
    id: 2,
    address: "1 Place Ville Marie, Montreal, QC",
    type: "Mixed Use",
    value: "$78M",
    risk: "Low",
    selected: false,
  },
  {
    id: 3,
    address: "1055 West Georgia Street, Vancouver, BC",
    type: "Office Tower",
    value: "$92M",
    risk: "High",
    selected: false,
  },
]

export default function AssetSearchPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  const [selectedAssets, setSelectedAssets] = React.useState<typeof mockAssets>([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      const filtered = mockAddresses.filter((addr) => addr.toLowerCase().includes(query.toLowerCase()))
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectAsset = (address: string) => {
    const asset = mockAssets.find((a) => a.address === address)
    if (asset && selectedAssets.length < 3 && !selectedAssets.find((a) => a.id === asset.id)) {
      setSelectedAssets([...selectedAssets, { ...asset, selected: true }])
    }
    setSearchQuery("")
    setShowSuggestions(false)
  }

  const removeAsset = (id: number) => {
    setSelectedAssets(selectedAssets.filter((a) => a.id !== id))
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#003DA5] text-white p-6 border-b">
        <h1 className="text-3xl font-bold">Asset Search</h1>
        <p className="text-blue-200 mt-2">Search and select up to 3 assets for detailed analysis</p>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Search Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#003DA5]">Search by Address</CardTitle>
            <CardDescription>Enter a property address to find assets in your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter property address..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 text-lg py-6"
                />
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                  {suggestions.map((address, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-2"
                      onClick={() => selectAsset(address)}
                    >
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{address}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Selected Assets */}
        {selectedAssets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003DA5]">Selected Assets ({selectedAssets.length}/3)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Building className="h-5 w-5 text-[#003DA5]" />
                      <div>
                        <div className="font-medium">{asset.address}</div>
                        <div className="text-sm text-gray-600">
                          {asset.type} • {asset.value}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(asset.risk)}>{asset.risk} Risk</Badge>
                      <Button variant="outline" size="sm" onClick={() => removeAsset(asset.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link href="/asset-overview">
            <Button className="bg-[#003DA5] hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              Add Your Own
            </Button>
          </Link>

          <Button variant="outline" disabled>
            <FileText className="mr-2 h-4 w-4" />
            Extract from PDF
          </Button>
        </div>

        {/* Navigation */}
        {selectedAssets.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <Link href="/asset-overview">
              <Button size="lg" className="bg-[#FDB913] hover:bg-yellow-500 text-black shadow-lg">
                Continue to Asset Overview
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}

        {/* Quick Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#003DA5]">Quick Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-[#E6ECF0]">
                Toronto
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-[#E6ECF0]">
                Montreal
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-[#E6ECF0]">
                Vancouver
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-[#E6ECF0]">
                Calgary
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-[#E6ECF0]">
                Office
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-[#E6ECF0]">
                Retail
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-[#E6ECF0]">
                Mixed Use
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-[#E6ECF0]">
                High Risk
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
