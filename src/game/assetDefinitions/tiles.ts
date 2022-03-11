import { getTileMapSource, getTileSetSource } from '../helpers/getAssetSource';

import { TileMapDefinition } from '../types/assetDefinitions';

export const levelOneMapDefinition: TileMapDefinition = {
  key: 'level-one-map',
  source: getTileMapSource('level_one'),
  objectLayer: 'object_tiles',
  tilesets: [
    {
      name: 'nature tileset',
      key: 'nature-tiles',
      source: getTileSetSource('nature_tileset'),
    },
  ],
};
