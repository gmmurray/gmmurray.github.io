export const getTileSource = (filename: string) => `tiles/${filename}`;
export const getTileMapSource = (filename: string) =>
  getTileSource(`${filename}.json`);
export const getTileSetSource = (filename: string) =>
  getTileSource(`${filename}.png`);

export const getSpriteSource = (filename: string) => `sprites/${filename}.png`;
