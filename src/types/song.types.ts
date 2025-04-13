export interface MoodSelection {
  emotion: {
    happiness: number; // 0-100
    sadness: number; // 0-100
    energy: number; // 0-100
    calmness: number; // 0-100
  };
  color?: string; // hex color code
  description?: string;
}

export interface SongCustomization {
  genre: string[];
  instruments: string[];
  tempo: number; // BPM
  energyLevel: number; // 0-100
  duration: number; // in seconds
  includeLyrics: boolean;
}

export interface RecommendedSong {
  id: string;
  title: string;
  artist: string;
  genre: string;
  year: number;
  duration: string;
  mood: string;
  tempo: number;
  key: string;
  instruments: string[];
  whyThisSong: string;
  similarArtists: string[];
  perfectFor: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
}

export interface SongRecommendationResponse {
  songs: RecommendedSong[];
}

export interface SongMetadata {
  id: string;
  title: string;
  mood: MoodSelection;
  customization: SongCustomization;
  createdAt: Date;
  userId: string;
  isPublic: boolean;
  tags: string[];
}

export interface GeneratedSong extends SongMetadata {
  audioUrl: string;
  lyrics?: string;
  visualUrl?: string;
  duration: number;
  format: "mp3" | "wav";
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: GeneratedSong[];
  moodJourney: string;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
}

export interface UserPreferences {
  userId: string;
  favoriteGenres: string[];
  preferredInstruments: string[];
  moodHistory: {
    mood: MoodSelection;
    timestamp: Date;
  }[];
  feedbackHistory: {
    songId: string;
    rating: number;
    comments: string;
    timestamp: Date;
  }[];
}

export interface CommunitySong extends GeneratedSong {
  likes: number;
  shares: number;
  comments: {
    userId: string;
    text: string;
    timestamp: Date;
  }[];
}
