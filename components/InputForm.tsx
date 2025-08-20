"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Link2, Sparkles } from "lucide-react"

interface InputFormProps {
  onSubmit: (url: string) => void
  loading?: boolean
}

export default function InputForm({ onSubmit, loading = false }: InputFormProps) {
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSubmit(url.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-red-400" />
          <h3 className="text-2xl font-semibold text-white">Enter Playlist URL</h3>
          <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
        </div>
        <p className="text-slate-400">Paste any YouTube playlist URL to get detailed analytics</p>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
        <div className="relative flex gap-3">
          <div className="flex-1 relative">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=..."
              className="h-14 text-lg bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-red-500/50 focus:ring-red-500/20 rounded-xl transition-all duration-300"
              disabled={loading}
              required
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <Link2 className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !url.trim()}
            className="h-14 px-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-red-500/25"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                <span>Analyze</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-slate-500">Example: https://www.youtube.com/playlist?list=PLrAXtmRdnEQy4Qy...</p>
      </div>
    </form>
  )
}
