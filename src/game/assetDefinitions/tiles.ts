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
    {
      name: 'interiors_tileset',
      key: 'interiors-tiles',
      source: getTileSetSource('interiors_tileset'),
    },
    {
      name: 'rooms_tileset',
      key: 'room-builder-tiles',
      source: getTileSetSource('room_builder_tileset'),
    },
    {
      name: 'coffee_tileset',
      key: 'coffee-tiles',
      source: getTileSetSource('coffee_spritesheet'),
    },
  ],
};
