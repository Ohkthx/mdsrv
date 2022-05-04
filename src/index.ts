/**
 * Delays nodejs by a specified amount of time.
 *
 * @param {number} ms - Time in milliseconds (ms) to delay by.
 */
export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
