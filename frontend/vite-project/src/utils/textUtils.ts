export function toSentenceCase(str: string | undefined) {
  if (!str || typeof str !== "string") return "";

  // Trim any leading/trailing whitespace and lowercase the whole string
  const lowerCasedStr = str.trim().toLowerCase();

  // Capitalize the first letter and concatenate with the rest of the string
  return lowerCasedStr.charAt(0).toUpperCase() + lowerCasedStr.slice(1);
}
