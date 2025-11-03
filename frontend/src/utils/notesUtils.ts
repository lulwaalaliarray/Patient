export interface TruncatedNotesProps {
  notes: string;
  maxLength?: number;
  showFullText?: boolean;
  onToggle?: () => void;
}

export const truncateNotes = (notes: string, maxLength: number = 100): { truncated: string; isTruncated: boolean } => {
  if (!notes || notes.length <= maxLength) {
    return { truncated: notes, isTruncated: false };
  }
  
  // Find the last space before maxLength to avoid cutting words
  const lastSpaceIndex = notes.lastIndexOf(' ', maxLength);
  const cutIndex = lastSpaceIndex > maxLength * 0.8 ? lastSpaceIndex : maxLength;
  
  return {
    truncated: notes.substring(0, cutIndex).trim() + '...',
    isTruncated: true
  };
};

export const formatNotesForDisplay = (notes: string, maxLength: number = 100): string => {
  const { truncated } = truncateNotes(notes, maxLength);
  return truncated;
};