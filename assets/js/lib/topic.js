/**
 * Returns the topic named in a query string when it is one of validKeys, otherwise null (meaning all topics).
 * URLSearchParams never throws, even on malformed percent-encoding.
 */
export function parseTopic(search, validKeys) {
  const topic = new URLSearchParams(search).get('topic');
  return validKeys.includes(topic) ? topic : null;
}

/** Returns the sentence that announces how many entries the filter shows; topicTitle is null for all topics. */
export function filterStatus(shown, topicTitle) {
  if (topicTitle === null) return `Showing all ${shown} entries`;
  return `Showing ${shown} ${shown === 1 ? 'entry' : 'entries'} in ${topicTitle}`;
}
