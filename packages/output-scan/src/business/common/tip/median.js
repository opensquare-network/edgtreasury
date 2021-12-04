function computeTipValue(tipMeta) {
  const tipValues = (tipMeta?.tips ?? []).map((tip) => tip[1]);
  return median(tipValues);
}

function median(values) {
  if (!Array.isArray(values)) {
    return 0;
  }

  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

module.exports = {
  computeTipValue,
}
