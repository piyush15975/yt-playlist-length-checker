import { type NextRequest, NextResponse } from "next/server"

// Types for YouTube API responses
interface PlaylistSnippet {
  title: string
}

interface PlaylistItem {
  snippet: PlaylistSnippet
}

interface PlaylistResponse {
  items?: PlaylistItem[]
}

interface VideoContentDetails {
  contentDetails: {
    videoId: string
    duration: string
  }
}

interface PlaylistItemsResponse {
  items?: VideoContentDetails[]
  nextPageToken?: string
}

interface VideosResponse {
  items?: VideoContentDetails[]
}

export async function POST(request: NextRequest) {
  try {
    const { playlistId } = await request.json()

    if (!playlistId) {
      return NextResponse.json({ error: "Playlist ID is required" }, { status: 400 })
    }

    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 })
    }

    // Get playlist details
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`
    )
    const playlistData: PlaylistResponse = await playlistResponse.json()

    if (!playlistData.items || playlistData.items.length === 0) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 })
    }

    const playlistTitle = playlistData.items[0].snippet.title

    // Get all videos in the playlist
    let allVideos: VideoContentDetails[] = []
    let nextPageToken = ""

    do {
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`
      )
      const videosData: PlaylistItemsResponse = await videosResponse.json()

      if (videosData.items) {
        allVideos = allVideos.concat(videosData.items)
      }

      nextPageToken = videosData.nextPageToken || ""
    } while (nextPageToken)

    // Get video durations
    const videoIds = allVideos.map((video) => video.contentDetails.videoId).join(",")
    const durationsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`
    )
    const durationsData: VideosResponse = await durationsResponse.json()

    // Calculate total duration
    const totalSeconds = durationsData.items?.reduce((acc, video) => {
      return acc + parseDuration(video.contentDetails.duration)
    }, 0) || 0

    const totalDuration = formatDuration(totalSeconds)

    return NextResponse.json({
      title: playlistTitle,
      totalVideos: allVideos.length,
      totalDuration,
      totalSeconds,
    })
  } catch (error) {
    console.error("Error fetching playlist:", error)
    return NextResponse.json({ error: "Failed to fetch playlist data" }, { status: 500 })
  }
}

// Parse ISO 8601 duration (PT#H#M#S) into seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = Number.parseInt(match[1] || "0", 10)
  const minutes = Number.parseInt(match[2] || "0", 10)
  const seconds = Number.parseInt(match[3] || "0", 10)

  return hours * 3600 + minutes * 60 + seconds
}

// Format seconds to "Xh Ym Zs" or "Ym Zs"
function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`
}
