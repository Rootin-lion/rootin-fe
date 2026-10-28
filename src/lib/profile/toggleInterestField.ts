const MAX_INTEREST_FIELDS = 3;

export function toggleInterestField(current: string[], value: string) {
  if (current.includes(value)) {
    return current.filter((interest) => interest !== value);
  }

  return current.length < MAX_INTEREST_FIELDS ? [...current, value] : current;
}
