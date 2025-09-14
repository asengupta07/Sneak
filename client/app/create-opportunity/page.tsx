"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "../components/Navbar"
import { Upload, X, Calendar, DollarSign, FileText, Image as ImageIcon, AlertCircle } from "lucide-react"

interface FormData {
  title: string
  description: string
  resolutionCriteria: string
  resolutionDate: string
  initialLiquidity: string
  category: string
  images: File[]
  banners: File[]
}

export default function CreateOpportunity() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    resolutionCriteria: "",
    resolutionDate: "",
    initialLiquidity: "",
    category: "",
    images: [],
    banners: []
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    "Technology",
    "Finance",
    "Sports",
    "Politics",
    "Entertainment",
    "Science",
    "Business",
    "Crypto",
    "Other"
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileUpload = (field: 'images' | 'banners', files: FileList | null) => {
    if (!files) return
    
    const newFiles = Array.from(files)
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ...newFiles]
    }))
  }

  const removeFile = (field: 'images' | 'banners', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    if (!formData.resolutionCriteria.trim()) {
      newErrors.resolutionCriteria = "Resolution criteria is required"
    }
    if (!formData.resolutionDate) {
      newErrors.resolutionDate = "Resolution date is required"
    } else if (new Date(formData.resolutionDate) <= new Date()) {
      newErrors.resolutionDate = "Resolution date must be in the future"
    }
    if (!formData.initialLiquidity || parseFloat(formData.initialLiquidity) <= 0) {
      newErrors.initialLiquidity = "Initial liquidity must be greater than 0"
    }
    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // TODO: Implement actual opportunity creation logic
      console.log("Creating opportunity:", formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to success page or back to home
      router.push("/")
    } catch (error) {
      console.error("Error creating opportunity:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      {/* Navbar */}
      <Navbar variant="home" />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-gray-900/50 border border-orange-500/20 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-orange-500 mb-4">Create New Opportunity</h1>
            <p className="text-lg text-gray-300">
              Create a new opportunity market where users can speculate on binary outcomes
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <FileText className="mr-3 text-orange-500" />
                Basic Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Opportunity Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    placeholder="e.g., Will Bitcoin reach $100k by end of 2024?"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  placeholder="Provide a detailed description of the opportunity..."
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Resolution Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <Calendar className="mr-3 text-orange-500" />
                Resolution Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Resolution Criteria *
                </label>
                <textarea
                  value={formData.resolutionCriteria}
                  onChange={(e) => handleInputChange("resolutionCriteria", e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  placeholder="Define clear, objective criteria for how this opportunity will be resolved..."
                />
                {errors.resolutionCriteria && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.resolutionCriteria}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Resolution Date *
                </label>
                <input
                  type="datetime-local"
                  value={formData.resolutionDate}
                  onChange={(e) => handleInputChange("resolutionDate", e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
                {errors.resolutionDate && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.resolutionDate}
                  </p>
                )}
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <DollarSign className="mr-3 text-orange-500" />
                Financial Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Initial Liquidity (ETH) *
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.initialLiquidity}
                  onChange={(e) => handleInputChange("initialLiquidity", e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  placeholder="0.1"
                />
                <p className="text-sm text-gray-400 mt-1">
                  This will be split equally between YES and NO tokens
                </p>
                {errors.initialLiquidity && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.initialLiquidity}
                  </p>
                )}
              </div>
            </div>

            {/* Media Upload */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <ImageIcon className="mr-3 text-orange-500" />
                Media Upload
              </h2>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Images
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload("images", e.target.files)}
                    className="hidden"
                    id="images-upload"
                  />
                  <label htmlFor="images-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Click to upload images or drag and drop</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                  </label>
                </div>
                
                {/* Display uploaded images */}
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile("images", index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Banners Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Banners
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload("banners", e.target.files)}
                    className="hidden"
                    id="banners-upload"
                  />
                  <label htmlFor="banners-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Click to upload banners or drag and drop</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                  </label>
                </div>
                
                {/* Display uploaded banners */}
                {formData.banners.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.banners.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Banner ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile("banners", index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-lg transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Opportunity...
                  </>
                ) : (
                  "Create Opportunity"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
