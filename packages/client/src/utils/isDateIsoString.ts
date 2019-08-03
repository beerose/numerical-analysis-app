export function isDateIsoString(s: string) {
  return !Number.isNaN(Date.parse(s)) && Number.isNaN(Number(s));
}
