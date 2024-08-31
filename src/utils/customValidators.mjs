// Checks if a string is valid by disallowing only whitespace characters
export const isValidString = value => typeof value === 'string' && value.trim() !== '';
