var advent = advent || {};

advent.PantryScene = function(parent) {
  this.game_ = parent;
  this.name = 'pantry';
  this.backgroundImage = 'images/Pantry.png';
  this.backgroundWidth = 1024;
  this.backgroundHeight = 550;
  this.pcScale = 1.5;
  this.walkable = [
      [],[],[],[],[], // 125
      [],[],[],[],[], // 250
      [],[],[],[],[], // 375
      [],[[432,875]],[[432,900]],[[432,1024]],[[376,1024]], // 500
      [[134,1024]],[[134,1024]]]; // 550
  this.backgroundObjects = [
     ['./images/FaucetOff.png', 'obj-faucet',
       401, 132, 109, 121],
     ['./images/inventory/Cheese.png', 'obj-cheese',
       47, 242, 80, 80],
     ['./images/inventory/Potion.png', 'obj-bottle',
       37, 232, 90, 90],
     ['./images/HockOfHam-PantryHanging.png', 'obj-ham',
       742, 37, 78, 95]
  ];
  this.foregroundObjects = [
  ];
  this.talkObjects = [];
  this.animationObjects = [];
  this.actionObjects = [
      ['door', 'act-door', 934, 120, 90, 335,
       advent.Verb.OPEN, 981, 458],
      ['salami', 'act-meat1', 638, 0, 71, 198,
       advent.Verb.LOOKAT, 678, 400],
      ['head cheese', 'act-meat2', 709, 0, 54, 155,
       advent.Verb.LOOKAT, 734, 400],
      ['meats', 'act-meat3', 796, 0, 106, 207,
       advent.Verb.LOOKAT, 844, 400],
      ['hock of ham', 'act-ham', 744, 36, 67, 91,
       advent.Verb.LOOKAT, 781, 400],
      ['sauces and spices', 'act-sauces', 272, 0, 344, 98,
       advent.Verb.LOOKAT, 448, 400],
      ['sink', 'act-sink', 337, 195, 221, 114,
       advent.Verb.LOOKAT, 448, 400],
      ['faucet', 'act-faucet', 418, 140, 68, 62,
       advent.Verb.LOOKAT, 448, 400],
      ['plate', 'act-r-plate', 252, 176, 57, 35,
       advent.Verb.LOOKAT, 255, 517],
      ['tea cup', 'act-r-teacup', 197, 169, 48, 40,
       advent.Verb.LOOKAT, 204, 517],
      ['fruit bowl', 'act-r-fruitbowl', 118, 189, 68, 40,
       advent.Verb.LOOKAT, 157, 517],
      ['container', 'act-r-container', 107, 29, 88, 94,
       advent.Verb.LOOKAT, 157, 517],
      ['mortar and pestle', 'act-r-mortar', 48, 63, 97, 108,
       advent.Verb.LOOKAT, 157, 517],
      ['loaf of bread', 'act-r-bread', 11, 173, 96, 39,
       advent.Verb.LOOKAT, 157, 517],
      ['cheese wheel', 'act-cheesewheel', 66, 225, 88, 47,
       advent.Verb.LOOKAT, 157, 517],
      ['cheese wedge', 'act-cheese', 52, 261, 60, 50,
       advent.Verb.LOOKAT, 157, 517],
      ['bottle', 'act-bottle', 52, 234, 60, 87,
       advent.Verb.LOOKAT, 157, 517]
  ];
  this.actions = [
    [advent.Verb.OPEN, 'door', null, false, new Script(this.game_)
      .add(0, Script.Ops.WALK, [981, 458])
      .add(0, Script.Ops.LOAD, ['fountain', 143, 486])
      .add(0, Script.Ops.WALK, [163, 486])
      ],
    [advent.Verb.LOOKAT, 'door', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THAT\'s THE DOOR I CAME IN', 1500])
      ],
    [advent.Verb.LOOKAT, 'salami', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'YUMM! SALAMI', 1500])
      ],
    [advent.Verb.PICKUP, 'salami', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'BUT WHERE WOULD I PUT IT?', 1500])
      ],
    [advent.Verb.LOOKAT, 'head cheese', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'WHY IS HEAD CHEESE CALLED \'CHEESE\'?', 2000])
      ],
    [advent.Verb.PICKUP, 'head cheese', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THAT\'S ALRIGHT. I ALREADY HAVE ONE HEAD', 2000])
      ],
    [advent.Verb.LOOKAT, 'meats', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'LOTS OF HANGING MEATS', 1500])
      ],
    [advent.Verb.PICKUP, 'meats', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I\'M VERY TEMPTED, BUT THEY LOOK HEAVY', 1500])
      ],
    [advent.Verb.LOOKAT, 'hock of ham', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'STOP BEING SUCH A HAM', 2000])
      ],
    [advent.Verb.PICKUP, 'hock of ham', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I CAN USE THIS', 1500])
      .add(0, Script.Ops.ADD_ITEM, ['ham'])
      .add(0, Script.Ops.ADD_FLAG, ['pantry-ham'])
      .add(0, Script.Ops.REMOVE_EL, ['obj-ham'])
      .add(0, Script.Ops.REMOVE_EL, ['act-ham'])
      ],
    [advent.Verb.LOOKAT, 'sink', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'A WONDERFULLY DINGY PORCELAIN SINK', 2500])
      ],
    [advent.Verb.LOOKAT, 'faucet', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THE RUSTY OLD SINK FAUCET', 2500])
      ],
    [advent.Verb.PULL, 'faucet', null, true, new Script(this.game_)
      .add(0, Script.Ops.IF_FLAG, ['faucet-on', 0, 2])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT\'S ALREADY OPENED', 1500])
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.ADD_FLAG, ['faucet-on'])
      .add(0, Script.Ops.TALK,
          ['pctalk', '*CREAK*', 1500])
      .add(0, Script.Ops.CHANGE_IMAGE,
          ['obj-faucet', './images/FaucetOn.png'])
      ],
    [advent.Verb.PUSH, 'faucet', null, true, new Script(this.game_)
      .add(0, Script.Ops.IF_NOT_FLAG, ['faucet-on', 0, 2])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT\'S ALREADY CLOSED', 1500])
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.REMOVE_FLAG, ['faucet-on'])
      .add(0, Script.Ops.TALK,
          ['pctalk', '*CLUNK*', 1500])
      .add(0, Script.Ops.CHANGE_IMAGE,
          ['obj-faucet', './images/FaucetOff.png'])
      ],
    [advent.Verb.USE, 'bucket', 'faucet', true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT WON\'T FIT UNDER THE NOZZLE', 2500])
      ],

    [advent.Verb.LOOKAT, 'plate', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THE BLUE PLATE SPECIAL?', 2000])
      ],
    [advent.Verb.PICKUP, 'plate', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'JUST OUT OF REACH', 2500])
      ],
    [advent.Verb.LOOKAT, 'tea cup', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'HE\'S A LITTLE TEA CUP', 2000])
      ],
    [advent.Verb.PICKUP, 'tea cup', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'JUST OUT OF REACH', 2500])
      ],
    [advent.Verb.LOOKAT, 'fruit bowl', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'AWW, SOMEONE LEFT A FRUIT BASKET FOR ME', 2000])
      ],
    [advent.Verb.PICKUP, 'fruit bowl', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'JUST OUT OF REACH', 2500])
      ],
    [advent.Verb.PICKUP, 'container', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'JUST OUT OF REACH', 2500])
      ],
    [advent.Verb.LOOKAT, 'container', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT PROBABLY HAS KIMCHI IN IT', 2000])
      ],
    [advent.Verb.PICKUP, 'container', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'JUST OUT OF REACH', 2500])
      ],
    [advent.Verb.LOOKAT, 'mortar and pestle', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IMAGINE HOW MUCH GUACAMOLE YOU COULD MAKE IN THAT THING', 2500])
      ],
    [advent.Verb.PICKUP, 'mortar and pestle', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'JUST OUT OF REACH', 2500])
      ],
    [advent.Verb.LOOKAT, 'loaf of bread', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT\'S A BAGGGAT, BARGEURT, BRAGGLET...ER, BREAD', 2500])
      ],
    [advent.Verb.PICKUP, 'loaf of bread', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'JUST OUT OF REACH', 2500])
      ],
    [advent.Verb.LOOKAT, 'cheese wheel', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THAT\'SA GOUDA!', 2000])
      ],
    [advent.Verb.PICKUP, 'cheese wheel', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I CAN\'T CARRY A WHOLE WHEEL', 2000])
      ],
    [advent.Verb.LOOKAT, 'bottle', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'A BOTTLE OF SOME NON-DESCRIPT LIQUID', 2000])
      ],
    [advent.Verb.PICKUP, 'bottle', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I SHOULD BE ABLE TO FIT THIS IN MY POCKET', 2000])
      .add(0, Script.Ops.ADD_ITEM, ['bottle'])
      .add(0, Script.Ops.ADD_FLAG, ['pantry-bottle'])
      .add(0, Script.Ops.REMOVE_EL, ['obj-bottle'])
      .add(0, Script.Ops.REMOVE_EL, ['act-bottle'])
      .add(2000, Script.Ops.TALK,
          ['pctalk', 'PERFECT FIT!', 1500])
      ],
    [advent.Verb.LOOKAT, 'cheese wedge', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'A MUCH MORE MANAGEABLE PIECE OF CHEESE', 2000])
      ],
    [advent.Verb.PICKUP, 'cheese wedge', null, true, new Script(this.game_)
      .add(0, Script.Ops.ADD_ITEM, ['cheese'])
      .add(0, Script.Ops.ADD_FLAG, ['pantry-cheese'])
      .add(0, Script.Ops.REMOVE_EL, ['obj-cheese'])
      .add(0, Script.Ops.REMOVE_EL, ['act-cheese'])
      ],
    [advent.Verb.LOOKAT, 'sauces and spices', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'SPICY! SAUCY!', 1500])
      ],
    [advent.Verb.PICKUP, 'sauces and spices', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'TOO DANGEROUS...I\'M NOT A COOK', 2000])
      ]
  ];
};

/**
 * Function that is called before the scene is loaded.
 */
advent.PantryScene.prototype.beforeLoad = function() {
  // Set the correct faucet state.
  if (this.game_.inventoryArea.hasFlag('faucet-on')) {
    advent.SceneData.setObjectImage(this, 'obj-faucet',
        './images/FaucetOn.png');
  } else {
    advent.SceneData.setObjectImage(this, 'obj-faucet',
        './images/FaucetOff.png');      
  }

  // Maybe remove the ham
  if (this.game_.inventoryArea.hasFlag('pantry-ham')) {
    advent.SceneData.removeBackgroundObject(this, 'obj-ham');
    advent.SceneData.removeActionObject(this, 'act-ham');
  }
  // Maybe remove the bottle
  if (this.game_.inventoryArea.hasFlag('pantry-bottle')) {
    advent.SceneData.removeBackgroundObject(this, 'obj-bottle');
    advent.SceneData.removeActionObject(this, 'act-bottle');
  }
  // Maybe remove the cheese
  if (this.game_.inventoryArea.hasFlag('pantry-cheese')) {
    advent.SceneData.removeBackgroundObject(this, 'obj-cheese');
    advent.SceneData.removeActionObject(this, 'act-cheese');
  }
};
