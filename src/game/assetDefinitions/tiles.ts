import { getTileMapSource, getTileSetSource } from '../helpers/getAssetSource';

import { TileMapDefinition } from '../types/assetDefinitions';

export const levelOneMapDefinition: TileMapDefinition = {
  key: 'level-one-map',
  source: getTileMapSource('level_one'),
  objectLayer: 'object_tiles',
  animatedLayer: 'animated',
  tilesets: [
    {
      name: 'nature tileset',
      key: 'nature-tiles',
      source: getTileSetSource('nature_tileset'),
    },
    {
      name: 'serene_village_tileset',
      key: 'serene-village-tiles',
      source: getTileSetSource('serene_village_tileset'),
    },
    {
      name: 'serene_village_objects_tileset',
      key: 'serene-village-object-tiles',
      source: getTileSetSource('serene_village_objects_tileset'),
    },
    {
      name: 'portal_tileset',
      key: 'portal-tiles',
      source: getTileSetSource('portal_spritesheet'),
    },
  ],
};
