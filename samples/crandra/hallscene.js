var advent = advent || {};

/**
 * The fountain scene.
 * @constructor
 */
advent.HallScene = function(parent) {
  /**
   * Global context.
   * @type {advent.Game}
   */
  this.game_ = parent;

  /**
   * The scene name.
   * @type {string}
   */
  this.name = 'fountain';

  /**
   * The scene background image.
   * @type {string}
   */
  this.backgroundImage = 'images/Hall.png';
  this.backgroundWidth = 1024;
  this.backgroundHeight = 550;

  /**
   * Scale factor to scale the player in this scene.
   * @type {number}
   */
  this.pcScale = 1.5;

  /**
   * Array of rows 25 pixels tall, each row contains 0 or more arrays.
   * Each of these arrays defines a valid x range that is walkable.
   */
  this.walkable = [
      [],[],[],[],[], // 125
      [],[],[],[],[], // 250
      [],[],[],[],[], // 375
      [[0,1024]],[[0,1024]],[[0,1024]],[[0,1024]],[[0,1024]], // 500
      [[0,1024]],[[0,1024]]]; // 550

  /**
   * These are objects that will appear behind the player.
   * Format is:
   * [0] image source,
   * [1] image id
   * [2] image x
   * [3] image y
   * [4] image width
   * [5] image height
   */
  this.backgroundObjects = [
      ['./images/Mousetrap.png', 'obj-mousetrap', 620, 370, 60, 30],
      ['./images/inventory/CheesePoisoned.png', 'obj-badcheese',
          620, 370, 40, 30],
      ['./images/chars/guard/GuardStandFront.png', 'obj-hallguard',
          100, 140, 160, 272],     
      ['./images/Stool.png', 'obj-stool', 195, 280, 126, 169],
      ['./images/Mug.png', 'obj-mug', 235, 260, 60, 43]
  ];

  /**
   * These are objects that will appear in front of the player.
   * Format is:
   * [0] image source,
   * [1] image id
   * [2] image x
   * [3] image y
   * [4] image width
   * [5] image height
   */
  this.foregroundObjects = [
      ['./images/HallTable.png', 'obj-table', 780, 348, 243, 206],
      ['./images/Globe.png', 'obj-globe', 809, 295, 130, 95]
  ];

  this.talkObjects = [
      ['talk-hallguard', 15, 15]
  ];
  this.animationObjects = [];

  /**
   * These are all the active regions in the scene.
   * Format is:
   * [0] friendly name,
   * [1] object id
   * [2] object x
   * [3] object y
   * [4] object width
   * [5] object height
   * [6] default action
   * [7] x position the player should walk to when interacting with this object
   * [8] y position the player should walk to when interacting with this object
   */
  this.actionObjects = [
      ['door to town', 'act-towndoor', 924, 112, 100, 288,
       advent.Verb.OPEN, 758, 328],
      ['door', 'act-studydoor', 30, 116, 55, 300,
       advent.Verb.OPEN, 80, 435],
      ['painting', 'act-painting', 672, 54, 170, 224,
       advent.Verb.LOOKAT, 758, 384],
      ['table', 'act-table', 791, 363, 220, 177,
       advent.Verb.LOOKAT, 840, 466],
      ['globe', 'act-globe', 836, 303, 74, 82,
       advent.Verb.LOOKAT, 840, 466],
      ['mouse hole', 'act-mousehole', 617, 345, 25, 25,
       advent.Verb.LOOKAT, 574, 417],
      ['mouse trap', 'act-mousetrap', 620, 370, 60, 30,
       advent.Verb.LOOKAT, 574, 417],
      ['window', 'act-window', 273, 88, 243, 227,
       advent.Verb.LOOKAT, 386, 375],
      ['bad cheese', 'act-badcheese', 620, 370, 40, 30,
       advent.Verb.LOOKAT, 574, 417],
      ['guard', 'act-hallguard', 100, 140, 160, 272,
       advent.Verb.TALKTO, 299, 470],
      ['mug', 'act-mug', 235, 260, 60, 43,
       advent.Verb.LOOKAT, 299, 470]
  ];

  /**
   * These are all the valid actions on the scene.
   * Format is:
   * [0] verb,
   * [1] direct object (string or RegExp)
   * [2] indirect object (string or RegExp) (can also be null based on the verb)
   * [3] Whether to automatically walk to the object first for this action
   * [4] the script for this action
   */
  this.actions = [
    [advent.Verb.OPEN, 'door', null, true, new Script(this.game_)
      .add(0, Script.Ops.IF_NOT_FLAG, ['hallguard-dead', 0, 7])
      .add(0, Script.Ops.IF_NOT_FLAG, ['hallguard-distracted', 0, 2])
      .add(0, Script.Ops.TALK,
          ['talk-hallguard', 'HEY! YOU CAN\'T GO IN THERE.', 3000])
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.REMOVE_FLAG, ['hallguard-distracted', 0, 2])
      .add(0, Script.Ops.CHANGE_IMAGE,
          ['obj-hallguard', './images/chars/guard/GuardStandFront.png'])
      .add(0, Script.Ops.TALK,
          ['talk-hallguard', 'HEY! YOU CAN\'T GO IN THERE.', 3000])
      .add(0, Script.Ops.END, [])
      .add(1000, Script.Ops.LOAD, ['study', 981, 458])
      .add(0, Script.Ops.WALK, [921, 458])
      ],
    [advent.Verb.LOOKAT, 'door', null, false, new Script(this.game_)
      .add(0, Script.Ops.WALK, [160, 445])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I WONDER WHAT IS BEHIND THAT DOOR', 3000])
      ],

    [advent.Verb.OPEN, 'door to town', null, false, new Script(this.game_)
      .add(0, Script.Ops.WALK, [987, 434])
      .add(0, Script.Ops.LOAD, ['town', 794, 360])
      .add(0, Script.Ops.WALK, [794, 380])
      ],
    [advent.Verb.LOOKAT, 'door to town', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THAT\'S THE WAY BACK TO TOWN', 1500])
      ],

    [advent.Verb.LOOKAT, 'globe', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'EARTH. THE BLUE PLANET', 1500])
      ],
    [advent.Verb.USE, 'bucket', 'globe', true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THE EARTH WON\'T MIND IF I TAKE SOME SALTY WATER', 3000])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-salty'])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-not-empty'])
      .add(0, Script.Ops.REMOVE_ITEM, ['bucket'])
      .add(0, Script.Ops.ADD_ITEM, ['bucket2'])
      .add(0, Script.Ops.CHANGE_IMAGE, ['obj-globe', './images/Globe-Empty.png'])
      ],

    [advent.Verb.LOOKAT, 'table', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'WHAT FINE CRAFTSMANSHIP', 1500])
      ],
    [advent.Verb.LOOKAT, 'painting', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'SCARY!', 1500])
      ],
    [advent.Verb.LOOKAT, 'mouse hole', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'AWW! THEY HAVE A TINY CRITTER IN RESIDENCE', 1500])
      ],
    [advent.Verb.LOOKAT, 'mouse trap', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'A MOUSE SERVING PLATTER?', 1500])
      ],

    [advent.Verb.LOOKAT, 'mug', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'AN A.C.M.E. PEWTER MUG WITH A STRANGE BREW INSIDE', 3000])
      ],
    [advent.Verb.PICKUP, 'mug', null, true, new Script(this.game_)
      .add(0, Script.Ops.IF_NOT_FLAG, ['hallguard-distracted', 0, 2])
      .add(0, Script.Ops.TALK,
          ['talk-hallguard', 'HEY! DON\'T TOUCH THAT.', 3000]) 
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'HE\'LL MAY NOTICE I\'VE TAKEN IT', 3000])
      ],
    [advent.Verb.USE, 'filled bucket', 'mug', true, new Script(this.game_)
      .add(0, Script.Ops.IF_NOT_FLAG, ['hallguard-distracted', 0, 2])
      .add(0, Script.Ops.TALK,
          ['talk-hallguard', 'HEY! DON\'T TOUCH THAT.', 3000])
      .add(0, Script.Ops.END, [])

      .add(0, Script.Ops.REMOVE_FLAG, ['hallguard-distracted'])
      .add(2000, Script.Ops.CHANGE_IMAGE,
          ['obj-hallguard', './images/chars/guard/GuardStandFront.png'])
      .add(0, Script.Ops.TALK,
          ['talk-hallguard', 'AH MY DRINK!', 2000])
      
      .add(2000, Script.Ops.IF_FLAG, ['bucket-smell', 0, 12])
      .add(0, Script.Ops.IF_FLAG, ['bucket-taste', 0, 13])
      .add(0, Script.Ops.IF_FLAG, ['bucket-sight', 0, 14])
      .add(0, Script.Ops.IF_FLAG, ['bucket-hot', 0, 15])
      .add(0, Script.Ops.IF_FLAG, ['bucket-salty', 0, 16])
      .add(0, Script.Ops.IF_FLAG, ['bucket-badcheese', 0, 17])

      .add(0, Script.Ops.TALK,
          ['talk-hallguard', 'SO SLEEPY...', 2000])
      .add(0, Script.Ops.ADD_FLAG, ['hallguard-distracted'])
      .add(0, Script.Ops.ADD_FLAG, ['hallguard-dead'])
      .add(0, Script.Ops.CHANGE_IMAGE,
          ['obj-hallguard', './images/chars/guard/GuardDown.png'])
      .add(0, Script.Ops.REMOVE_EL, ['act-hallguard'])
      .add(0, Script.Ops.MOVE_EL, ['obj-hallguard', 230, 410, 396, 115])
      .add(0, Script.Ops.IF_NOT_FLAG, ['not-a-flag', 11, 0])

      .add(0, Script.Ops.TALK,
          ['talk-hallguard', 'YEACH! THIS DRINK SMELLS WRONG!', 2000])
      .add(0, Script.Ops.IF_NOT_FLAG, ['not-a-flag', 9, 0])

      .add(0, Script.Ops.TALK,
          ['talk-hallguard', 'YEACH! THIS DRINK ISN\'T PORKY ENOUGH!', 2000])
      .add(0, Script.Ops.IF_NOT_FLAG, ['not-a-flag', 7, 0])

      .add(0, Script.Ops.TALK,
          ['talk-hallguard', 'YEACH! THIS DRINK IS THE WRONG COLOR!', 2000])
      .add(0, Script.Ops.IF_NOT_FLAG, ['not-a-flag', 5, 0])

      .add(0, Script.Ops.TALK,
          ['talk-hallguard', 'YEACH! THIS DRINK IS TOO COLD!', 2000])
      .add(0, Script.Ops.IF_NOT_FLAG, ['not-a-flag', 3, 0])

      .add(0, Script.Ops.TALK,
          ['talk-hallguard', 'YEACH! THIS DRINK ISN\'T SALTY ENOUGH!', 2000])
      .add(0, Script.Ops.IF_NOT_FLAG, ['not-a-flag', 1, 0])

      .add(0, Script.Ops.TALK,
          ['talk-hallguard', 'WHAT A WONDERFUL DRINK!', 2000])

      .add(0, Script.Ops.REMOVE_FLAG, ['bucket-smell'])
      .add(0, Script.Ops.REMOVE_FLAG, ['bucket-taste'])
      .add(0, Script.Ops.REMOVE_FLAG, ['bucket-sight'])
      .add(0, Script.Ops.REMOVE_FLAG, ['bucket-hot'])
      .add(0, Script.Ops.REMOVE_FLAG, ['bucket-warm'])
      .add(0, Script.Ops.REMOVE_FLAG, ['bucket-salty'])
      .add(0, Script.Ops.REMOVE_FLAG, ['bucket-goodcheese'])
      .add(0, Script.Ops.REMOVE_FLAG, ['bucket-badcheese'])
      .add(0, Script.Ops.REMOVE_FLAG, ['bucket-goodcheese'])
      .add(0, Script.Ops.REMOVE_ITEM, ['bucket2'])
      .add(0, Script.Ops.ADD_ITEM, ['bucket'])
      ],

    [advent.Verb.LOOKAT, 'window', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I HOPE THEY HAVE ALL THE ENVIRONMENTAL PERMITS FOR THAT BUILDING', 3000])
      .add(3000, Script.Ops.TALK,
          ['pctalk', 'I COULD STARE HERE FOR HOURS...', 3000])
      ],
    [advent.Verb.USE, 'window', 'guard', true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'HEY! LOOK A THREE HEADED MONKEY!', 2000])
      .add(2000, Script.Ops.TALK,
          ['talk-hallguard', 'WHERE?', 3000])
      .add(0, Script.Ops.ADD_FLAG, ['hallguard-distracted'])
      .add(2000, Script.Ops.CHANGE_IMAGE,
          ['obj-hallguard', './images/chars/guard/GuardStandBack.png'])
      ],


    [advent.Verb.LOOKAT, 'bad cheese', null, true, new Script(this.game_)
      .add(0, Script.Ops.IF_NOT_FLAG, ['has-bad-cheese', 0, 2])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'SOMETHING DOESN\'T LOOK RIGHT ABOUT THAT CHEESE', 3000])
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THE BAD CHEESE IS NOW THE GOOD CHEESE', 2000])
      ],
    [advent.Verb.PICKUP, 'bad cheese', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THEN WHAT WOULD THE MOUSE EAT?', 3000])
      ],
    [advent.Verb.USE, 'tasty cheese', 'bad cheese', true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'LET\'S DO THE SWITCHEROO', 3000])
      .add(0, Script.Ops.CHANGE_IMAGE,
          ['obj-badcheese', './images/inventory/Cheese.png'])
      .add(0, Script.Ops.REMOVE_ITEM, ['cheese'])
      .add(0, Script.Ops.ADD_ITEM, ['cheese2'])
      .add(0, Script.Ops.ADD_FLAG, ['has-bad-cheese'])
      ],

    [advent.Verb.TALKTO, 'guard', null, true, new Script(this.game_)
      .add(0, Script.Ops.IF_NOT_FLAG, ['hallguard-distracted', 0, 6])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'HELLO AGAIN!', 1500]) 
      .add(1500, Script.Ops.TALK,
          ['talk-hallguard', 'HAIL! YOU SHOULDN\'T BE IN HERE.', 3000]) 
      .add(3000, Script.Ops.TALK,
          ['talk-hallguard', 'I AM GUARDING SOMETHING VERY SECRET AND IMPORTANT', 3000]) 
      .add(3000, Script.Ops.TALK,
          ['pctalk', 'LIKE WHAT?', 1500]) 
      .add(1500, Script.Ops.TALK,
          ['talk-hallguard', 'YOU *WOULD* LIKE TO KNOW!', 3000]) 
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I DON\'T WANT TO DISTURB HIS SEARCH FOR THE ELLUSIVE THREE-HEADED MONKEY', 3000])
      ],
    [advent.Verb.LOOKAT, 'guard', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'OH GREAT! NOW HE\'S STANDING GUARD IN HERE', 3000])
      ]
  ];
};


advent.HallScene.prototype.beforeLoad = function() {
  // Set if he is sleeping.
  if (this.game_.inventoryArea.hasFlag('hallguard-dead')) {  
    advent.SceneData.setObjectImage(this, 'obj-hallguard',
        './images/chars/guard/GuardDown.png');
    advent.SceneData.setObjectDimensions(this, 'obj-hallguard',
        230, 410, 396, 115);
    advent.SceneData.removeActionObject(this, 'act-hallguard');
  } else {
    this.game_.inventoryArea.removeFlag('hallguard-distracted');
  }

  // Set the cheese state.
  if (this.game_.inventoryArea.hasFlag('has-bad-cheese')) {
    advent.SceneData.setObjectImage(this, 'obj-badcheese',
          './images/inventory/Cheese.png');
  }
};