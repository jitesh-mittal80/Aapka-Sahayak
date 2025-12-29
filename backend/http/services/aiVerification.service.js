/**
 * Converts AI response to complaint status
 * @param {string} aiResponse - YES or NO
 * @returns {string} ComplaintStatus
 */
export const mapAIResponseToStatus = (aiResponse) => {
  if (!aiResponse) return null;

  const response = aiResponse.toUpperCase();

  if (response === "YES") {
    return "CLOSED";
  }

  if (response === "NO") {
    return "REOPENED";
  }

  return null;
};
