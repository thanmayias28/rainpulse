export function generateSuggestion(data) {
  const { rain, moisture, light, temperature, humidity } = data;

  // Basic rule-based logic; tune thresholds to your sensor calibration
  if (isHigh(rain) && isLow(moisture)) {
    return 'High rainfall detected. Stop irrigation to prevent waterlogging.';
  }
  if (isLow(rain) && isLow(moisture)) {
    return 'Low rainfall and dry soil. Irrigation recommended.';
  }
  if (isLow(light) && isHigh(humidity)) {
    return 'Low light and high humidity. Consider fungal disease prevention measures.';
  }
  if (temperature != null && temperature > 35 && isLow(moisture)) {
    return 'High temperature with dry soil. Irrigate during early morning or evening.';
  }
  return 'Normal conditions. No immediate action needed.';
}

function isHigh(value) {
  return value != null && value > 800;
}

function isLow(value) {
  return value != null && value < 300;
}



