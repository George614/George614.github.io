/**
 * Returns the topic named in a query string when it is one of validKeys, otherwise null (meaning all topics).
 * URLSearchParams never throws, even on malformed percent-encoding.
 */
export function parseTopic(search, validKeys) {
  const topic = new URLSearchParams(search).get('topic');
  return validKeys.includes(topic) ? topic : null;
}
