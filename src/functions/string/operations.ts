/**
 * String manipulation functions
 * Provides comprehensive string operations for the expression parser
 */

/**
 * Returns the length of a string
 */
export function stringLength(str: string | undefined): number | undefined {
  if (str === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('Argument to stringLength must be a string');
  }
  return str.length;
}

/**
 * Checks if a string is empty (length === 0)
 */
export function isEmpty(str: string | undefined): boolean | undefined {
  if (str === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('Argument to isEmpty must be a string');
  }
  return str.length === 0;
}

/**
 * Checks if a string contains a substring
 */
export function stringContains(str: string | undefined, substring: string | undefined): boolean | undefined {
  if (str === undefined || substring === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('First argument to contains must be a string');
  }
  if (typeof substring !== 'string') {
    throw new Error('Second argument to contains must be a string');
  }
  return str.includes(substring);
}

/**
 * Checks if a string starts with a substring
 */
export function startsWith(str: string | undefined, substring: string | undefined): boolean | undefined {
  if (str === undefined || substring === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('First argument to startsWith must be a string');
  }
  if (typeof substring !== 'string') {
    throw new Error('Second argument to startsWith must be a string');
  }
  return str.startsWith(substring);
}

/**
 * Checks if a string ends with a substring
 */
export function endsWith(str: string | undefined, substring: string | undefined): boolean | undefined {
  if (str === undefined || substring === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('First argument to endsWith must be a string');
  }
  if (typeof substring !== 'string') {
    throw new Error('Second argument to endsWith must be a string');
  }
  return str.endsWith(substring);
}

/**
 * Counts the number of non-overlapping occurrences of a substring in a string
 */
export function searchCount(text: string | undefined, substring: string | undefined): number | undefined {
  if (text === undefined || substring === undefined) {
    return undefined;
  }
  if (typeof text !== 'string') {
    throw new Error('First argument to searchCount must be a string');
  }
  if (typeof substring !== 'string') {
    throw new Error('Second argument to searchCount must be a string');
  }
  if (substring.length === 0) {
    return 0;
  }

  let count = 0;
  let position = 0;
  while ((position = text.indexOf(substring, position)) !== -1) {
    count++;
    position += substring.length;
  }
  return count;
}

/**
 * Removes whitespace (or specified characters) from both ends of a string
 */
export function trim(str: string | undefined, chars?: string): string | undefined {
  if (str === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('First argument to trim must be a string');
  }
  if (chars !== undefined && typeof chars !== 'string') {
    throw new Error('Second argument to trim must be a string');
  }

  if (chars === undefined) {
    return str.trim();
  }

  // Trim custom characters from both ends
  let start = 0;
  let end = str.length;

  while (start < end && chars.includes(str[start])) {
    start++;
  }

  while (end > start && chars.includes(str[end - 1])) {
    end--;
  }

  return str.slice(start, end);
}

/**
 * Converts a string to uppercase
 */
export function toUpper(str: string | undefined): string | undefined {
  if (str === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('Argument to toUpper must be a string');
  }
  return str.toUpperCase();
}

/**
 * Converts a string to lowercase
 */
export function toLower(str: string | undefined): string | undefined {
  if (str === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('Argument to toLower must be a string');
  }
  return str.toLowerCase();
}

/**
 * Converts a string to title case (first letter of each word capitalized)
 */
export function toTitle(str: string | undefined): string | undefined {
  if (str === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('Argument to toTitle must be a string');
  }
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Joins an array of strings with a glue string
 * Note: This extends the existing join function to handle string arrays specifically
 */
export function stringJoin(arr: string[] | undefined, glue: string | undefined): string | undefined {
  if (arr === undefined || glue === undefined) {
    return undefined;
  }
  if (!Array.isArray(arr)) {
    throw new Error('First argument to join must be an array');
  }
  if (typeof glue !== 'string') {
    throw new Error('Second argument to join must be a string');
  }
  return arr.join(glue);
}

/**
 * Splits a string by a delimiter
 */
export function split(str: string | undefined, delimiter: string | undefined): string[] | undefined {
  if (str === undefined || delimiter === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('First argument to split must be a string');
  }
  if (typeof delimiter !== 'string') {
    throw new Error('Second argument to split must be a string');
  }
  return str.split(delimiter);
}

/**
 * Repeats a string a specified number of times
 */
export function repeat(str: string | undefined, times: number | undefined): string | undefined {
  if (str === undefined || times === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('First argument to repeat must be a string');
  }
  if (typeof times !== 'number') {
    throw new Error('Second argument to repeat must be a number');
  }
  if (times < 0 || !Number.isInteger(times)) {
    throw new Error('Second argument to repeat must be a non-negative integer');
  }
  return str.repeat(times);
}

/**
 * Reverses a string
 */
export function reverse(str: string | undefined): string | undefined {
  if (str === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('Argument to reverse must be a string');
  }
  return str.split('').reverse().join('');
}

/**
 * Returns the leftmost count characters from a string
 */
export function left(str: string | undefined, count: number | undefined): string | undefined {
  if (str === undefined || count === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('First argument to left must be a string');
  }
  if (typeof count !== 'number') {
    throw new Error('Second argument to left must be a number');
  }
  if (count < 0) {
    throw new Error('Second argument to left must be non-negative');
  }
  return str.slice(0, count);
}

/**
 * Returns the rightmost count characters from a string
 */
export function right(str: string | undefined, count: number | undefined): string | undefined {
  if (str === undefined || count === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('First argument to right must be a string');
  }
  if (typeof count !== 'number') {
    throw new Error('Second argument to right must be a number');
  }
  if (count < 0) {
    throw new Error('Second argument to right must be non-negative');
  }
  if (count === 0) {
    return '';
  }
  return str.slice(-count);
}

/**
 * Replaces all occurrences of oldValue with newValue in a string
 */
export function replace(str: string | undefined, oldValue: string | undefined, newValue: string | undefined): string | undefined {
  if (str === undefined || oldValue === undefined || newValue === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('First argument to replace must be a string');
  }
  if (typeof oldValue !== 'string') {
    throw new Error('Second argument to replace must be a string');
  }
  if (typeof newValue !== 'string') {
    throw new Error('Third argument to replace must be a string');
  }
  // Use split and join for compatibility with older JS targets
  return str.split(oldValue).join(newValue);
}

/**
 * Replaces the first occurrence of oldValue with newValue in a string
 */
export function replaceFirst(str: string | undefined, oldValue: string | undefined, newValue: string | undefined): string | undefined {
  if (str === undefined || oldValue === undefined || newValue === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('First argument to replaceFirst must be a string');
  }
  if (typeof oldValue !== 'string') {
    throw new Error('Second argument to replaceFirst must be a string');
  }
  if (typeof newValue !== 'string') {
    throw new Error('Third argument to replaceFirst must be a string');
  }
  return str.replace(oldValue, newValue);
}

/**
 * Sorts an array of strings using natural sort order (alphanumeric aware)
 */
export function naturalSort(arr: string[] | undefined): string[] | undefined {
  if (arr === undefined) {
    return undefined;
  }
  if (!Array.isArray(arr)) {
    throw new Error('Argument to naturalSort must be an array');
  }

  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base'
  });

  return [...arr].sort(collator.compare);
}

/**
 * Converts a string to a number
 */
export function toNumber(str: string | undefined): number | undefined {
  if (str === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('Argument to toNumber must be a string');
  }
  const num = Number(str);
  if (isNaN(num)) {
    throw new Error(`Cannot convert "${str}" to a number`);
  }
  return num;
}

/**
 * Converts a string to a boolean
 * Recognizes: 'true', '1', 'yes', 'on' as true (case-insensitive)
 * Recognizes: 'false', '0', 'no', 'off', '' as false (case-insensitive)
 */
export function toBoolean(str: string | undefined): boolean | undefined {
  if (str === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('Argument to toBoolean must be a string');
  }

  const lower = str.toLowerCase().trim();

  if (lower === 'true' || lower === '1' || lower === 'yes' || lower === 'on') {
    return true;
  }
  if (lower === 'false' || lower === '0' || lower === 'no' || lower === 'off' || lower === '') {
    return false;
  }

  throw new Error(`Cannot convert "${str}" to a boolean`);
}

/**
 * Pads a string on the left to reach the target length
 */
export function padLeft(str: string | undefined, targetLength: number | undefined, padString?: string): string | undefined {
  if (str === undefined || targetLength === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('First argument to padLeft must be a string');
  }
  if (typeof targetLength !== 'number') {
    throw new Error('Second argument to padLeft must be a number');
  }
  if (targetLength < 0 || !Number.isInteger(targetLength)) {
    throw new Error('Second argument to padLeft must be a non-negative integer');
  }
  if (padString !== undefined && typeof padString !== 'string') {
    throw new Error('Third argument to padLeft must be a string');
  }
  return str.padStart(targetLength, padString);
}

/**
 * Pads a string on the right to reach the target length
 */
export function padRight(str: string | undefined, targetLength: number | undefined, padString?: string): string | undefined {
  if (str === undefined || targetLength === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('First argument to padRight must be a string');
  }
  if (typeof targetLength !== 'number') {
    throw new Error('Second argument to padRight must be a number');
  }
  if (targetLength < 0 || !Number.isInteger(targetLength)) {
    throw new Error('Second argument to padRight must be a non-negative integer');
  }
  if (padString !== undefined && typeof padString !== 'string') {
    throw new Error('Third argument to padRight must be a string');
  }
  return str.padEnd(targetLength, padString);
}

/**
 * Pads a string on both sides to reach the target length
 * If an odd number of padding characters is needed, the extra character is added on the right
 */
export function padBoth(str: string | undefined, targetLength: number | undefined, padString?: string): string | undefined {
  if (str === undefined || targetLength === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('First argument to padBoth must be a string');
  }
  if (typeof targetLength !== 'number') {
    throw new Error('Second argument to padBoth must be a number');
  }
  if (targetLength < 0 || !Number.isInteger(targetLength)) {
    throw new Error('Second argument to padBoth must be a non-negative integer');
  }
  if (padString !== undefined && typeof padString !== 'string') {
    throw new Error('Third argument to padBoth must be a string');
  }

  const totalPadding = targetLength - str.length;
  if (totalPadding <= 0) {
    return str;
  }

  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  const actualPadString = padString ?? ' ';
  const leftPad = actualPadString.repeat(Math.ceil(leftPadding / actualPadString.length)).slice(0, leftPadding);
  const rightPad = actualPadString.repeat(Math.ceil(rightPadding / actualPadString.length)).slice(0, rightPadding);

  return leftPad + str + rightPad;
}

/**
 * Extracts a portion of a string or array
 * Supports negative indices (counting from the end)
 * @param s - The string or array to slice
 * @param start - Start index (negative counts from end)
 * @param end - End index (optional, negative counts from end)
 */
export function slice(
  s: string | any[] | undefined,
  start: number | undefined,
  end?: number
): string | any[] | undefined {
  if (s === undefined || start === undefined) {
    return undefined;
  }
  if (typeof s !== 'string' && !Array.isArray(s)) {
    throw new Error('First argument to slice must be a string or array');
  }
  if (typeof start !== 'number') {
    throw new Error('Second argument to slice must be a number');
  }
  if (end !== undefined && typeof end !== 'number') {
    throw new Error('Third argument to slice must be a number');
  }

  return s.slice(start, end);
}

/**
 * URL-encodes a string
 * Uses encodeURIComponent for safe encoding
 */
export function urlEncode(str: string | undefined): string | undefined {
  if (str === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('Argument to urlEncode must be a string');
  }
  return encodeURIComponent(str);
}

/**
 * Base64-encodes a string
 * Handles UTF-8 encoding properly
 */
export function base64Encode(str: string | undefined): string | undefined {
  if (str === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new Error('Argument to base64Encode must be a string');
  }

  // Base64 alphabet
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  
  // Convert string to UTF-8 bytes
  const utf8: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (code < 0x80) {
      utf8.push(code);
    } else if (code < 0x800) {
      utf8.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code >= 0xd800 && code < 0xdc00 && i + 1 < str.length) {
      // Surrogate pair - check bounds before accessing next character
      const low = str.charCodeAt(i + 1);
      if (low >= 0xdc00 && low < 0xe000) {
        i++;
        code = 0x10000 + ((code - 0xd800) << 10) + (low - 0xdc00);
        utf8.push(
          0xf0 | (code >> 18),
          0x80 | ((code >> 12) & 0x3f),
          0x80 | ((code >> 6) & 0x3f),
          0x80 | (code & 0x3f)
        );
      } else {
        // Unpaired high surrogate - encode as-is (will produce invalid UTF-8, but matches typical behavior)
        utf8.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
      }
    } else {
      utf8.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }

  // Encode bytes to base64
  let result = '';
  for (let i = 0; i < utf8.length; i += 3) {
    const b1 = utf8[i];
    const b2 = utf8[i + 1];
    const b3 = utf8[i + 2];

    result += base64Chars[b1 >> 2];
    result += base64Chars[((b1 & 0x03) << 4) | ((b2 ?? 0) >> 4)];
    result += b2 !== undefined ? base64Chars[((b2 & 0x0f) << 2) | ((b3 ?? 0) >> 6)] : '=';
    result += b3 !== undefined ? base64Chars[b3 & 0x3f] : '=';
  }

  return result;
}

/**
 * Returns the first non-null and non-empty string value from the arguments
 * @param args - Any number of values to check
 */
export function coalesceString(...args: any[]): any {
  for (const arg of args) {
    if (arg !== undefined && arg !== null && arg !== '') {
      return arg;
    }
  }
  return args.length > 0 ? args[args.length - 1] : undefined;
}
