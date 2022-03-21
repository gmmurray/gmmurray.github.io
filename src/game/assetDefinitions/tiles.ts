import { getTileMapSource, getTileSetSource } from '../helpers/getAssetSource';

import { TileMapDefinition } from '../types/assetDefinitions';

export const levelOneMapDefinition: TileMapDefinition = {
  key: 'level-one-map',
  source: getTileMapSource('level_one'),
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
    {
      name: 'fishtank_spritesheet',
      key: 'fishtank-tiles',
      source: getTileSetSource('fishtank_spritesheet'),
    },
  ],
};

export const levelTwoMapDefinition: TileMapDefinition = {
  key: 'level-two-map',
  source: getTileMapSource('level_two'),
  animatedLayer: 'animated',
  tilesets: [
    {
      name: 'simple_pixel_grass_tileset',
      key: 'simple-pixel-grass-tiles',
      source: getTileSetSource('simple_pixel_grass_tileset'),
    },
    {
      name: 'simple_pixel_plants_tileset',
      key: 'simple-pixel-plants-tiles',
      source: getTileSetSource('simple_pixel_plants_tileset'),
    },
    {
      name: 'simple_pixel_props_tileset',
      key: 'simple-pixel-props-tiles',
      source: getTileSetSource('simple_pixel_props_tileset'),
    },
    {
      name: 'simple_pixel_stone_tileset',
      key: 'simple-pixel-stone-tiles',
      source: getTileSetSource('simple_pixel_stone_tileset'),
    },
    {
      name: 'simple_pixel_structures_tileset',
      key: 'simple-pixel-structures-tiles',
      source: getTileSetSource('simple_pixel_structures_tileset'),
    },
    {
      name: 'simple_pixel_wall_tileset',
      key: 'simple-pixel-wall-tiles',
      source: getTileSetSource('simple_pixel_wall_tileset'),
    },
  ],
  characterLayer: {
    lower: 'ground',
    upper: 'platform',
    transitions: [
      {
        x: 33,
        y: 42,
        toUpper: true,
      },
      {
        x: 34,
        y: 42,
        toUpper: true,
      },
      {
        x: 33,
        y: 43,
        toUpper: false,
      },
      {
        x: 34,
        y: 43,
        toUpper: false,
      },
      {
        x: 9,
        y: 15,
        toUpper: true,
      },
      {
        x: 10,
        y: 15,
        toUpper: true,
      },
      {
        x: 9,
        y: 16,
        toUpper: false,
      },
      {
        x: 10,
        y: 16,
        toUpper: false,
      },
    ],
  },
};
