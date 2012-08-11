var advent = advent || {};

advent.Inventory = {};

/**
 * Game inventory items.
 */
advent.Inventory.Items = [
  {
    id: 'bucket',
    name: 'bucket',
    src: 'images/inventory/Bucket.png'
  },
  {
    id: 'bucket2',
    name: 'filled bucket',
    src: 'images/inventory/BucketWater.png'
  },
  {
    id: 'cheese',
    name: 'tasty cheese',
    src: 'images/inventory/Cheese.png'
  },
  {
    id: 'cheese2',
    name: 'sleeping pill-laced cheese',
    src: 'images/inventory/CheesePoisoned.png'
  },
  {
    id: 'crystal',
    name: 'crystal key',
    src: 'images/inventory/CrystalKey.png'
  },
  {
    id: 'flower',
    name: 'smelly flower',
    src: 'images/inventory/Flower.png'
  },
  {
    id: 'ham',
    name: 'ham',
    src: 'images/inventory/HockOfHam.png'
  },
  {
    id: 'pixel',
    name: 'pixel hunter\'s pixel',
    src: 'images/inventory/Pixel.png'
  },
  {
    id: 'scum',
    name: 'SCUMM(R)',
    src: 'images/inventory/PondScum.png'
  },
  {
    id: 'bottle',
    name: 'bottle with liquid',
    src: 'images/inventory/PotionLabel.png'
  },
  {
    id: 'ember',
    name: 'warm ember',
    src: 'images/inventory/Embers.png'
  }
];


/**
 * Get an item from the inventory array by id.
 */
advent.Inventory.getItem = function(id) {
  for (var i = 0; i < advent.Inventory.Items.length; i++) {
    if (advent.Inventory.Items[i].id == id) {
      return advent.Inventory.Items[i];
    }
  }
  return null;
};
