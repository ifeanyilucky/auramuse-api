// Types for Gemini API Response
export interface CitationSource {
  startIndex: number;
  endIndex: number;
  uri: string;
}

export interface CitationMetadata {
  citationSources: CitationSource[];
}

export interface ContentPart {
  text: string;
}

export interface Content {
  parts: ContentPart[];
  role: string;
}

export interface Candidate {
  content: Content;
  finishReason: string;
  citationMetadata: CitationMetadata;
  avgLogprobs: number;
}

export interface TokenDetails {
  modality: string;
  tokenCount: number;
}

export interface UsageMetadata {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
  promptTokensDetails: TokenDetails[];
  candidatesTokensDetails: TokenDetails[];
}

export interface GeminiResponse {
  candidates: Candidate[];
  usageMetadata: UsageMetadata;
  modelVersion: string;
}
