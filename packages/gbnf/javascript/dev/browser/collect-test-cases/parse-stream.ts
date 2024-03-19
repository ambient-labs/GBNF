const DEFAULT_PARSE_CHUNK = (chunk: string) => chunk;

export type Callback = (chunk: string) => void;

export async function parseStream(response: Response, parseChunk = DEFAULT_PARSE_CHUNK, callback?: Callback): Promise<string[]> {
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (reader === undefined) {
    throw new Error('Reader is undefined');
  }
  const decoder = new TextDecoder();

  const chunks: string[] = [];
  let chunk = '';
  while (true) {
    const { done, value, } = await reader.read();
    chunk += decoder.decode(value, { stream: true, });
    try {
      if (chunk === '' || done) {
        break;
      }
      const parsedChunk = parseChunk(chunk);
      JSON.parse(parsedChunk); // see if we're done with this particular chunk
      if (callback) {
        try {
          callback(parsedChunk);
        } catch (err) { }
      }
      chunks.push(parsedChunk);
      chunk = '';
    } catch (err) {

    }
  }
  return chunks;
};
