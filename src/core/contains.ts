export default function contains<T>(array: T[], obj: T): boolean {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === obj) {
      return true;
    }
  }

  return false;
}
