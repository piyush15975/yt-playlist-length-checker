import { type NextRequest, NextResponse } from "next/server"

// Types
interface PlaylistSnippet {
  title: string
}
interface PlaylistItem {
  contentDetails: { videoId: string }
}
interface PlaylistResponse {
  items?: { snippet: PlaylistSnippet }[]
}
interface PlaylistItemsResponse {
  items?: PlaylistItem[]
  nextPageToken?: string
}
interface VideoItem {
  contentDetails: { duration: string }
}
interface VideosResponse {
  items?: VideoItem[]
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

    // Get playlist title
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`
    )
    const playlistData: PlaylistResponse = await playlistResponse.json()
    if (!playlistData.items?.length) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 })
    }
    const playlistTitle = playlistData.items[0].snippet.title

    // Fetch all video IDs
    let videoIds: string[] = []
    let nextPageToken = ""
    do {
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`
      )
      const videosData: PlaylistItemsResponse = await videosResponse.json()
      if (videosData.items) {
        videoIds = videoIds.concat(videosData.items.map(v => v.contentDetails.videoId))
      }
      nextPageToken = videosData.nextPageToken || ""
    } while (nextPageToken)

    // Fetch durations in chunks of 50
    let totalSeconds = 0
    for (let i = 0; i < videoIds.length; i += 50) {
      const chunk = videoIds.slice(i, i + 50).join(",")
      const durationsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${chunk}&key=${apiKey}`
      )
      const durationsData: VideosResponse = await durationsResponse.json()
      if (durationsData.items) {
        for (const video of durationsData.items) {
          totalSeconds += parseDuration(video.contentDetails.duration)
        }
      }
    }

    const totalDuration = formatDuration(totalSeconds)

    return NextResponse.json({
      title: playlistTitle,
      totalVideos: videoIds.length,
      totalDuration,
      totalSeconds,
    })
  } catch (error) {
    console.error("Error fetching playlist:", error)
    return NextResponse.json({ error: "Failed to fetch playlist data" }, { status: 500 })
  }
}

// Parse ISO 8601 -> seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || "0", 10)
  const minutes = parseInt(match[2] || "0", 10)
  const seconds = parseInt(match[3] || "0", 10)
  return hours * 3600 + minutes * 60 + seconds
}

// Format seconds nicely
function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`
}
