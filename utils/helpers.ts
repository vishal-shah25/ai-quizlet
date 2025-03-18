export function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((item) => ({item, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({item}) => item);
}

export function capitalizeString(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
