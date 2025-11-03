// Utility functions for input validation to prevent emojis and symbols

export const inputValidation = {
  // Remove emojis and symbols from text, keeping only letters, numbers, spaces, and basic punctuation
  sanitizeText: (text: string): string => {
    // Allow letters (including Arabic), numbers, spaces, and basic punctuation
    return text.replace(/[^\p{L}\p{N}\s.,!?'-]/gu, '');
  },

  // Remove emojis and symbols from names (more restrictive)
  sanitizeName: (text: string): string => {
    // Allow only letters (including Arabic), spaces, hyphens, and apostrophes
    return text.replace(/[^\p{L}\s'-]/gu, '');
  },

  // Remove emojis and symbols from email (keep email-valid characters)
  sanitizeEmail: (text: string): string => {
    // Allow letters, numbers, and email-specific characters
    return text.replace(/[^\p{L}\p{N}@._-]/gu, '');
  },

  // Remove emojis and symbols from numbers (keep only digits and basic formatting)
  sanitizeNumber: (text: string): string => {
    // Allow only digits, spaces, hyphens, and plus sign
    return text.replace(/[^\d\s+-]/g, '');
  },

  // Remove emojis and symbols from medical text (allow more punctuation for medical terms)
  sanitizeMedicalText: (text: string): string => {
    // Allow letters, numbers, spaces, and medical punctuation
    return text.replace(/[^\p{L}\p{N}\s.,!?'"-:;()/]/gu, '');
  },

  // Handle input events to prevent emojis and symbols
  handleTextInput: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setter: (value: string) => void,
    type: 'text' | 'name' | 'email' | 'number' | 'medical' = 'text'
  ) => {
    const value = event.target.value;
    let sanitizedValue: string;

    switch (type) {
      case 'name':
        sanitizedValue = inputValidation.sanitizeName(value);
        break;
      case 'email':
        sanitizedValue = inputValidation.sanitizeEmail(value);
        break;
      case 'number':
        sanitizedValue = inputValidation.sanitizeNumber(value);
        break;
      case 'medical':
        sanitizedValue = inputValidation.sanitizeMedicalText(value);
        break;
      default:
        sanitizedValue = inputValidation.sanitizeText(value);
    }

    // Only update if the value changed (to prevent cursor jumping)
    if (sanitizedValue !== value) {
      setter(sanitizedValue);
    } else {
      setter(value);
    }
  },

  // Validate if text contains emojis or unwanted symbols
  containsEmojisOrSymbols: (text: string, type: 'text' | 'name' | 'email' | 'number' | 'medical' = 'text'): boolean => {
    let sanitized: string;
    
    switch (type) {
      case 'name':
        sanitized = inputValidation.sanitizeName(text);
        break;
      case 'email':
        sanitized = inputValidation.sanitizeEmail(text);
        break;
      case 'number':
        sanitized = inputValidation.sanitizeNumber(text);
        break;
      case 'medical':
        sanitized = inputValidation.sanitizeMedicalText(text);
        break;
      default:
        sanitized = inputValidation.sanitizeText(text);
    }

    return sanitized !== text;
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Sanitize and format Bahrain phone number
  sanitizeBahrainPhone: (phone: string): string => {
    // Remove all non-digits first
    let digits = phone.replace(/\D/g, '');
    
    // If it starts with 973, keep it
    // If it starts with 0, remove the 0 and add 973
    // If it's 8 digits, add 973 prefix
    if (digits.startsWith('973')) {
      digits = digits.substring(3);
    } else if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }
    
    // Ensure we only have 8 digits after the country code
    if (digits.length > 8) {
      digits = digits.substring(0, 8);
    }
    
    // Format as +973 XXXX XXXX
    if (digits.length === 8) {
      return `+973 ${digits.substring(0, 4)} ${digits.substring(4)}`;
    } else if (digits.length > 0) {
      return `+973 ${digits}`;
    }
    
    return '+973 ';
  },

  // Validate Bahrain phone number format
  isValidBahrainPhone: (phone: string): boolean => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Should be exactly 11 digits (973 + 8 digits) or 8 digits (without country code)
    if (digits.length === 11 && digits.startsWith('973')) {
      return true;
    } else if (digits.length === 8) {
      return true;
    }
    
    return false;
  }
};