import { GeminiResponse } from "../types/gemini.types";
import { MoodSelection, SongCustomization } from "../types/song.types";

const generateSongPrompt = (
  mood: MoodSelection,
  customization: SongCustomization
): string => {
  return `Based on the user's emotional state and preferences, recommend 3 existing songs that would resonate with them. Return the response as a JSON array of song objects.

Emotional Profile:
- Happiness Level: ${mood.emotion.happiness}/100
- Sadness Level: ${mood.emotion.sadness}/100
- Energy Level: ${mood.emotion.energy}/100
- Calmness Level: ${mood.emotion.calmness}/100
${mood.description ? `- Additional Feelings: ${mood.description}` : ""}
${mood.color ? `- Color Inspiration: ${mood.color}` : ""}

Musical Preferences:
- Genre: ${customization.genre.join(", ")}
- Instruments: ${customization.instruments.join(", ")}
- Tempo: ${customization.tempo} BPM
- Energy Level: ${customization.energyLevel}/100
- Duration: ${customization.duration} seconds
- Include Lyrics: ${customization.includeLyrics ? "Yes" : "No"}

Return the response in the following JSON format:
[
  {
    "id": "unique_id_1",
    "title": "Song Title",
    "artist": "Artist Name",
    "genre": "Primary Genre",
    "year": 2022,
    "duration": "3:45",
    "mood": "Describe the emotional tone",
    "tempo": 120,
    "key": "Musical Key",
    "instruments": ["Instrument 1", "Instrument 2"],
    "whyThisSong": "Explain why this song matches the user's current emotional state",
    "similarArtists": ["Artist 1", "Artist 2", "Artist 3"],
    "perfectFor": "Describe when/where this song would be perfect to listen to",
    "spotifyUrl": "Optional Spotify URL if available, leave blank if not available",
    "youtubeUrl": "Optional YouTube URL if available, leave blank if not available"
  },
  // ... more songs
]

Each song should be an existing song that matches the user's emotional state and preferences. Focus on helping the user find music that resonates with their current feelings.`;
};

export const generateSong = async (
  mood: MoodSelection,
  customization: SongCustomization
): Promise<GeminiResponse> => {
  const prompt = generateSongPrompt(mood, customization);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const contents = [
    {
      parts: [{ text: prompt }],
    },
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contents }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate song: ${response.statusText}`);
  }

  return response.json();
};
