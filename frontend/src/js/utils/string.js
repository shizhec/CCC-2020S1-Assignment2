export function capitalizeString(targetingString) {
  return targetingString
    .split(" ")
    .map(
      (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    )
    .join(" ");
}
