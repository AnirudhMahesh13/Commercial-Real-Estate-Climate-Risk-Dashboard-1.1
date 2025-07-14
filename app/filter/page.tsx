"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown, Search, ArrowRight, X } from "lucide-react"
import Link from "next/link"

const filterOptions = {
  geography: {
    label: "Geography",
    options: [
      { value: "north-america", label: "North America", count: 156 },
      { value: "canada", label: "Canada", count: 89 },
      { value: "toronto", label: "Toronto", count: 34 },
      { value: "montreal", label: "Montreal", count: 23 },
      { value: "vancouver", label: "Vancouver", count: 18 },
      { value: "calgary", label: "Calgary", count: 14 },
    ],
  },
  propertyType: {
    label: "Property Type",
    options: [
      { value: "office", label: "Office", count: 78 },
      { value: "retail", label: "Retail", count: 45 },
      { value: "mixed-use", label: "Mixed Use", count: 34 },
      { value: "industrial", label: "Industrial", count: 28 },
      { value: "hospitality", label: "Hospitality", count: 19 },
    ],
  },
  lob: {
    label: "LOB/Sub-LOB",
    options: [
      { value: "commercial-banking", label: "Commercial Banking", count: 89 },
      { value: "corporate-banking", label: "Corporate Banking", count: 67 },
      { value: "real-estate", label: "Real Estate", count: 45 },
      { value: "capital-markets", label: "Capital Markets", count: 23 },
    ],
  },
  energySource: {
    label: "Energy Source",
    options: [
      { value: "natural-gas", label: "Natural Gas", count: 98 },
      { value: "electricity", label: "Electricity", count: 76 },
      { value: "oil", label: "Oil", count: 34 },
      { value: "renewable", label: "Renewable", count: 28 },
      { value: "mixed", label: "Mixed", count: 18 },
    ],
  },
  efficiencyRange: {
    label: "Efficiency Range",
    options: [
      { value: "high", label: "High Efficiency", count: 45 },
      { value: "medium", label: "Medium Efficiency", count: 89 },
      { value: "low", label: "Low Efficiency", count: 67 },
    ],
  },
  certifications: {
    label: "Certifications",
    options: [
      { value: "leed-gold", label: "LEED Gold", count: 34 },
      { value: "leed-silver", label: "LEED Silver", count: 28 },
      { value: "energy-star", label: "ENERGY STAR", count: 45 },
      { value: "boma-best", label: "BOMA BEST", count: 23 },
      { value: "none", label: "No Certification", count: 89 },
    ],
  },
}

export default function FilterPage() {
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string[]>>({})
  const [searchTerms, setSearchTerms] = React.useState<Record<string, string>>({})
  const [openPopovers, setOpenPopovers] = React.useState<Record<string, boolean>>({})

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category] || []
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]

      return { ...prev, [category]: updated }
    })
  }

  const removeFilter = (category: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: (prev[category] || []).filter((v) => v !== value),
    }))
  }

  const getFilteredOptions = (category: string) => {
    const searchTerm = searchTerms[category] || ""
    return filterOptions[category as keyof typeof filterOptions].options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const getTotalSelectedFilters = () => {
    return Object.values(selectedFilters).reduce((total, filters) => total + filters.length, 0)
  }

  const getTopFilters = () => {
    const allSelected: Array<{ category: string; value: string; label: string }> = []

    Object.entries(selectedFilters).forEach(([category, values]) => {
      values.forEach((value) => {
        const option = filterOptions[category as keyof typeof filterOptions].options.find((o) => o.value === value)
        if (option) {
          allSelected.push({
            category,
            value,
            label: option.label,
          })
        }
      })
    })

    return allSelected.slice(0, 3)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#003DA5] text-white p-6 border-b">
        <h1 className="text-3xl font-bold">Portfolio Filters</h1>
        <p className="text-blue-200 mt-2">Choose how to break down your portfolio view</p>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Top 3 Selected Filters */}
        {getTotalSelectedFilters() > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003DA5]">Active Filters ({getTotalSelectedFilters()})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {getTopFilters().map((filter, index) => (
                  <Badge
                    key={`${filter.category}-${filter.value}`}
                    variant="secondary"
                    className="bg-[#E6ECF0] text-[#003DA5] flex items-center gap-1"
                  >
                    {filter.label}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-600"
                      onClick={() => removeFilter(filter.category, filter.value)}
                    />
                  </Badge>
                ))}
                {getTotalSelectedFilters() > 3 && (
                  <Badge variant="outline">+{getTotalSelectedFilters() - 3} more</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(filterOptions).map(([category, config]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-[#003DA5] text-lg">{config.label}</CardTitle>
                <CardDescription>{selectedFilters[category]?.length || 0} selected</CardDescription>
              </CardHeader>
              <CardContent>
                <Popover
                  open={openPopovers[category]}
                  onOpenChange={(open) => setOpenPopovers((prev) => ({ ...prev, [category]: open }))}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      Select {config.label}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder={`Search ${config.label.toLowerCase()}...`}
                          value={searchTerms[category] || ""}
                          onChange={(e) => setSearchTerms((prev) => ({ ...prev, [category]: e.target.value }))}
                          className="pl-8"
                        />
                      </div>

                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {getFilteredOptions(category).map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${category}-${option.value}`}
                              checked={selectedFilters[category]?.includes(option.value) || false}
                              onCheckedChange={() => toggleFilter(category, option.value)}
                            />
                            <label
                              htmlFor={`${category}-${option.value}`}
                              className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <span>{option.label}</span>
                                <span className="text-gray-500 text-xs">({option.count})</span>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Show selected items */}
                {selectedFilters[category] && selectedFilters[category].length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {selectedFilters[category].slice(0, 2).map((value) => {
                      const option = config.options.find((o) => o.value === value)
                      return option ? (
                        <Badge key={value} variant="secondary" className="text-xs bg-[#E6ECF0] text-[#003DA5]">
                          {option.label}
                        </Badge>
                      ) : null
                    })}
                    {selectedFilters[category].length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{selectedFilters[category].length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#003DA5]">Filter Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#003DA5]">
                  {Math.max(1, 276 - getTotalSelectedFilters() * 15)}
                </div>
                <div className="text-sm text-gray-600">Assets Match</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#FDB913]">
                  ${(8.0 - getTotalSelectedFilters() * 0.3).toFixed(1)}B
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.max(5, 45 - getTotalSelectedFilters() * 2)}%
                </div>
                <div className="text-sm text-gray-600">Low Risk</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {Math.min(35, 20 + getTotalSelectedFilters() * 2)}%
                </div>
                <div className="text-sm text-gray-600">High Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        {getTotalSelectedFilters() > 0 && (
          <div className="fixed bottom-6 right-6">
            <Link href="/portfolio-view">
              <Button size="lg" className="bg-[#FDB913] hover:bg-yellow-500 text-black shadow-lg">
                View Portfolio Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
