// aiPrompt.js (or wherever you're storing this)
export const AI_PROMPT = 
  "Generate a Travel Plan for the location: {location}, for {noOfDays} days, for a {travelType} with a {budgetType} budget. " +
  "The response should include: " +
  "1. Hotel Options List: " +
  "- Hotel Address " +
  "- Price per night (approximate) " +
  "- Hotel Image URL " +
  "- Geo Coordinates (latitude, longitude) " +
  "- Rating " +
  "- Short Description " +
  "2. Suggested Itinerary (Day-wise): For each day, list: " +
  "- Place Name " +
  "- Place Description " +
  "- Place Image URL " +
  "- Geo Coordinates " +
  "- Ticket Price (if any) " +
  "- Timings " +
  "- Best Time to Visit " +
  "3. Format the entire response in proper JSON format.";

/**
 * Generates a final prompt string by replacing placeholders with actual form values
 * @param {Object} params
 * @param {string} params.location
 * @param {number} params.noOfDays
 * @param {string} params.travelType
 * @param {string} params.budgetType
 * @returns {string}
 */
export const generatePrompt = ({ location, noOfDays, travelType, budgetType }) => {
  return AI_PROMPT
    .replace("{location}", location)
    .replace("{noOfDays}", noOfDays.toString())
    .replace("{travelType}", travelType)
    .replace("{budgetType}", budgetType);
};
