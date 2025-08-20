"use client"

import { useState } from "react"
import { Play, Clock, Hash, Sparkles, Youtube } from "lucide-react"
import InputForm from "@/components/InputForm"
import PlaylistInfo from "@/components/PlaylistInfo"
import Loader from "@/components/Loader"

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [playlist, setPlaylist] = useState<{
    title: string
    totalVideos: number
    totalDuration: string
    totalSeconds: number
  } | null>(null)

  const handleCheckLength = async (url: string) => {
    setLoading(true)
    setPlaylist(null)

    // Extract playlistId from URL
    const playlistId = new URL(url).searchParams.get("list")
    if (!playlistId) {
      alert("Invalid playlist URL")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/getPlaylistLength", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistId }),
      })

      const data = await res.json()
      setPlaylist(data)
    } catch (err) {
      console.error(err)
      alert("Failed to fetch playlist. Make sure your API key is correct.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-slate-900/40"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-500/5 to-slate-500/5 rounded-full blur-3xl"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/20 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-red-300/40 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Youtube className="w-16 h-16 text-red-500 animate-pulse" />
                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600 animate-in slide-in-from-top-4 duration-1000">
              YouTube Playlist
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-in slide-in-from-top-4 duration-1000 delay-200">
              Length Checker
            </h2>
            <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-top-4 duration-1000 delay-400">
              Discover the total duration and video count of any YouTube playlist instantly with our powerful analytics
              tool
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 animate-in slide-in-from-bottom-4 duration-1000 delay-600">
              <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-2">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-sm text-slate-300">Instant Analysis</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-2">
                <Hash className="w-4 h-4 text-red-400" />
                <span className="text-sm text-slate-300">Video Count</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-2">
                <Play className="w-4 h-4 text-red-400" />
                <span className="text-sm text-slate-300">Total Duration</span>
              </div>
            </div>
          </div>

          {/* Enhanced Main card */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 md:p-12 transform transition-all duration-500 hover:shadow-red-500/10 hover:shadow-2xl hover:scale-[1.02] animate-in slide-in-from-bottom-4 delay-800">
            <InputForm onSubmit={handleCheckLength} loading={loading} />

            {loading && (
              <div className="flex justify-center items-center my-12">
                <Loader />
              </div>
            )}

            {playlist && (
              <div className="mt-12 animate-in slide-in-from-bottom-4 duration-700">
                <PlaylistInfo
                  title={playlist.title}
                  totalVideos={playlist.totalVideos}
                  totalDuration={playlist.totalDuration}
                  totalSeconds={playlist.totalSeconds}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-12 animate-in slide-in-from-bottom-4 duration-1000 delay-1000">
            <p className="text-slate-400 text-sm">Built with ❤️ for YouTube creators and enthusiasts</p>
          </div>
        </div>
      </div>
    </div>
  )
}
