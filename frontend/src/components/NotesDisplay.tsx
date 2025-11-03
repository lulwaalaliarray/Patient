import React from 'react';
import { useNotesExpansion } from '../hooks/useNotesExpansion';
import { truncateNotes } from '../utils/notesUtils';

interface NotesDisplayProps {
  notes: string;
  maxLength?: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const NotesDisplay: React.FC<NotesDisplayProps> = ({
  notes,
  maxLength = 100,
  size = 'medium',
  showLabel = true,
  label = 'Notes:',
  className = ''
}) => {
  const { isExpanded, toggleExpansion } = useNotesExpansion();
  const { truncated, isTruncated } = truncateNotes(notes, maxLength);

  if (!notes || notes.trim() === '') {
    return null;
  }

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'notes-text-small';
      case 'large': return 'notes-text-large';
      default: return 'notes-text-truncated';
    }
  };

  return (
    <div className={`notes-container ${className}`}>
      <p className={`notes-text ${!isExpanded ? getSizeClass() : ''}`}>
        {showLabel && <strong>{label} </strong>}
        {isExpanded ? notes : (isTruncated ? truncated : notes)}
        {isTruncated && (
          <button
            className="notes-toggle-button"
            onClick={toggleExpansion}
            type="button"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </p>
    </div>
  );
};

export default NotesDisplay;