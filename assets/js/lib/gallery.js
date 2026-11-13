/**
 * Returns index wrapped into 0..count-1, so stepping past either end of the gallery continues
 * from the other end.
 * @param {number} index
 * @param {number} count the number of photographs, at least 1
 * @returns {number}
 */
export function wrapIndex(index, count) {
  return ((index % count) + count) % count;
}
