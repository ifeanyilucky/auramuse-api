import { Request, Response } from "express";
import { generateSong } from "../services/songGenerator.service";
import {
  MoodSelection,
  SongCustomization,
  GeneratedSong,
  RecommendedSong,
} from "../types/song.types";
import { v4 as uuidv4 } from "uuid";

// Temporary storage (replace with database in production)
const songs: GeneratedSong[] = [];
const recommendations: RecommendedSong[] = [];

const cleanJsonResponse = (text: string): string => {
  // Remove markdown code block indicators
  let cleaned = text.replace(/```json\n?/g, "");
  cleaned = cleaned.replace(/```\n?/g, "");

  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();

  return cleaned;
};

export const generateNewSong = async (req: Request, res: Response) => {
  try {
    const { mood, customization } = req.body as {
      mood: MoodSelection;
      customization: SongCustomization;
    };

    // Validate input
    if (!mood || !customization) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Generate song recommendations using Gemini AI
    const aiResponse = await generateSong(mood, customization);

    if (
      !aiResponse ||
      !aiResponse.candidates ||
      !aiResponse.candidates[0]?.content?.parts?.[0]?.text
    ) {
      return res.status(500).json({
        error: "Invalid AI response format",
        details: "The AI service returned an unexpected response format",
      });
    }

    // Clean and parse the AI response
    const cleanedResponse = cleanJsonResponse(
      aiResponse.candidates[0].content.parts[0].text
    );

    let recommendedSongs: RecommendedSong[];
    try {
      recommendedSongs = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return res.status(500).json({
        error: "Failed to parse AI response",
        details: "The AI service returned invalid JSON",
        rawResponse: cleanedResponse, // Include for debugging
      });
    }

    // Validate the parsed songs
    if (!Array.isArray(recommendedSongs)) {
      return res.status(500).json({
        error: "Invalid song recommendations format",
        details: "Expected an array of songs",
      });
    }

    // Add unique IDs to each song
    const songsWithIds = recommendedSongs.map((song) => ({
      ...song,
      id: uuidv4(),
    }));

    // Store the recommendations
    recommendations.push(...songsWithIds);

    res.status(201).json({
      message: "Songs recommended successfully",
      songs: songsWithIds,
    });
  } catch (error) {
    console.error("Error generating song recommendations:", error);
    res.status(500).json({
      error: "Failed to generate song recommendations",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getSong = (req: Request, res: Response) => {
  const { id } = req.params;
  const song = recommendations.find((s) => s.id === id);

  if (!song) {
    return res.status(404).json({ error: "Song not found" });
  }

  res.json(song);
};

export const getRecentSongs = (req: Request, res: Response) => {
  // Get the 10 most recent recommendations
  const recentSongs = [...recommendations]
    .sort((a, b) => b.year - a.year)
    .slice(0, 10);

  res.json(recentSongs);
};

export const getUserSongs = (req: Request, res: Response) => {
  const userId = "anonymous";
  const userSongs = songs.filter((s) => s.userId === userId);

  res.json(userSongs);
};

export const updateSong = (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const songIndex = songs.findIndex((s) => s.id === id);

  if (songIndex === -1) {
    return res.status(404).json({ error: "Song not found" });
  }

  // Update song properties
  songs[songIndex] = {
    ...songs[songIndex],
    ...updates,
  };

  res.json(songs[songIndex]);
};

export const deleteSong = (req: Request, res: Response) => {
  const { id } = req.params;
  const songIndex = songs.findIndex((s) => s.id === id);

  if (songIndex === -1) {
    return res.status(404).json({ error: "Song not found" });
  }

  songs.splice(songIndex, 1);
  res.json({ message: "Song deleted successfully" });
};
