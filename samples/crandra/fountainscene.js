var advent = advent || {};

/**
 * The fountain scene.
 * @constructor
 */
advent.FountainScene = function(parent) {
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
  this.backgroundImage = 'images/Garden.png';
  this.backgroundWidth = 1024;
  this.backgroundHeight = 550;

  /**
   * Scale factor to scale the player in this scene.
   * @type {number}
   */
  this.pcScale = 1.0;

  /**
   * Array of rows 25 pixels tall, each row contains 0 or more arrays.
   * Each of these arrays defines a valid x range that is walkable.
   */
  this.walkable = [
      [],[],[],[],[], // 125
      [],[],[],[],[], // 250
      [[200,1024]],[[200,1024]],[[200,1024]],[[200,1024]],[[200,1024]], // 375
      [[200,1024]],[[148,545]],[[148,545]],[[125,545]],[[46,545]], // 500
      [[0,545]],[[0,545]]]; // 550

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
  this.backgroundObjects = [];

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
      ['./images/Fountain-Filled-Dirty.png', 'obj-fountain',
       517, 191, 507, 359]
  ];

  this.talkObjects = [];
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
      ['castle', 'act-castle', 432, 0, 90, 103,
       advent.Verb.LOOKAT, 482, 293],

      ['gate', 'act-gate', 366, 103, 156, 166,
       advent.Verb.LOOKAT, 442, 293],

      ['path to town', 'act-town', 924, 0, 100, 400,
       advent.Verb.WALKTO, 758, 328],

      ['door', 'act-door', 0, 219, 100, 252,
       advent.Verb.LOOKAT, 143, 486],

      ['hedge', 'act-hedge', 523, 100, 401, 153,
       advent.Verb.LOOKAT, 743, 293],

      ['flower', 'act-flower1', 251, 182, 25, 25,
       advent.Verb.LOOKAT, 275, 293],
      ['flower', 'act-flower2', 308, 215, 25, 25,
       advent.Verb.LOOKAT, 332, 293],
      ['flower', 'act-flower3', 617, 113, 25, 25,
       advent.Verb.LOOKAT, 641, 293],
      ['flower', 'act-flower4', 577, 179, 25, 25,
       advent.Verb.LOOKAT, 601, 293],
      ['flower', 'act-flower5', 719, 201, 25, 25,
       advent.Verb.LOOKAT, 743, 293],
      ['flower', 'act-flower6', 818, 129, 25, 25,
       advent.Verb.LOOKAT, 842, 293],
      ['flower', 'act-flower7', 823, 224, 25, 25,
       advent.Verb.LOOKAT, 847, 293],

      ['cupid', 'act-cupid', 702, 202, 112, 160,
       advent.Verb.LOOKAT, 652, 380],

      ['fountain', 'act-fountain', 549, 384, 444, 150,
       advent.Verb.LOOKAT, 519, 460],
      ['pond scum', 'act-pondscum', 705, 410, 115, 45,
       advent.Verb.LOOKAT, 519, 460]
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
    [advent.Verb.LOOKAT, 'cupid', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'AWW! A CUTE LITTLE BABY', 1500])
      ],
    [advent.Verb.LOOKAT, 'fountain', null, true, new Script(this.game_)
      .add(0, Script.Ops.IF_FLAG, ['faucet-on', 0, 2])
      .add(0, Script.Ops.TALK, ['pctalk', 'WHERE\'D ALL THE WATER GO?', 1500])
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.IF_FLAG, ['has-scum', 0, 2])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'NOW IT\'S JUST AN UGLY FOUNTAIN', 2000])
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'WHAT AN UGLY DIRTY FOUNTAIN, YEACH!', 2000])
      ],
    [advent.Verb.USE, 'bucket', 'fountain', true, new Script(this.game_)
      .add(0, Script.Ops.IF_FLAG, ['faucet-on', 0, 2])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THERE\'S NO WATER IN THE FOUNTAIN', 2500])
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.IF_NOT_FLAG, ['has-scum', 0, 2])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'NO, THAT WATER IS NASTY!', 2500])
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THAT WATER MIGHT WORK', 2500])
      .add(0, Script.Ops.REMOVE_ITEM, ['bucket'])
      .add(0, Script.Ops.ADD_ITEM, ['bucket2'])
      ],
    [advent.Verb.LOOKAT, 'pond scum', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'WHEN WAS THE LAST TIME THIS FOUNTAIN WAS CLEANED?', 2500])
      ],
    [advent.Verb.PICKUP, 'pond scum', null, true, new Script(this.game_)
      .add(0, Script.Ops.IF_NOT_FLAG, ['faucet-on', 0, 2])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I\'M NOT SWIMMING IN TO GET THAT', 2000])
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'SCUMMY!', 1500])
      .add(0, Script.Ops.ADD_ITEM, ['scum'])
      .add(0, Script.Ops.ADD_FLAG, ['has-scum'])
      .add(0, Script.Ops.REMOVE_EL, ['act-pondscum'])
      .add(0, Script.Ops.CHANGE_IMAGE,
          ['obj-fountain', './images/Fountain-Empty-Clean.png'])
      ],
    [advent.Verb.LOOKAT, 'castle', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THAT\'S THE SECOND BIGGEST CASTLE I\'VE EVER SEEN!', 2500])
      ],
    [advent.Verb.LOOKAT, 'gate', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT\'S A GATE', 1500])
      ],
    [advent.Verb.LOOKAT, 'hedge', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT\'S A PRICKLY HEDGE', 1500])
      ],
    [advent.Verb.LOOKAT, 'flower', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'WHAT AN AMAZING SMELL!', 1500])
      ],
    [advent.Verb.PICKUP, 'flower', null, true, new Script(this.game_)
      .add(0, Script.Ops.ADD_ITEM, ['flower'])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'NOONE WILL MIND IF I BORROW ONE OF THESE', 2000])
      ],
    [advent.Verb.LOOKAT, 'path to town', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THAT MUST BE THE WAY BACK TO TOWN', 2000])
      ],
    [advent.Verb.LOOKAT, 'door', null, true, new Script(this.game_)
      .add(0, Script.Ops.IF_NOT_FLAG, ['opened-pantry-door', 0, 2])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'SHOULD I OPEN IT?', 1500])
      .add(0, Script.Ops.EXIT, [])
      .add(0, Script.Ops.WALK, [133, 486])
      .add(0, Script.Ops.LOAD, ['pantry', 981, 458])
      .add(0, Script.Ops.WALK, [921, 458])
      ],
    [advent.Verb.WALKTO, 'path to town', null, false, new Script(this.game_)
      .add(0, Script.Ops.WALK, [987, 327])
      .add(0, Script.Ops.LOAD, ['town', 0, 400])
      .add(0, Script.Ops.WALK, [133, 400])
      ],
    [advent.Verb.OPEN, 'door', null, false, new Script(this.game_)
      .add(0, Script.Ops.WALK, [133, 486])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'NOONE IS THERE, I\'LL LET MYSELF IN', 2000])
      .add(0, Script.Ops.ADD_FLAG, ['opened-pantry-door'])
      .add(1000, Script.Ops.LOAD, ['pantry', 981, 458])
      .add(0, Script.Ops.WALK, [921, 458])
      ],
    [advent.Verb.USE, 'crystal key', 'door', true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THERE\'S NO KEYHOLE', 1500])
      ]
  ];
};


advent.FountainScene.prototype.beforeLoad = function() {
  // Set the correct faucet state.
  if (this.game_.inventoryArea.hasFlag('faucet-on')) {
    if (this.game_.inventoryArea.hasFlag('has-scum')) {
      advent.SceneData.setObjectImage(this, 'obj-fountain',
          './images/Fountain-Empty-Clean.png');
      advent.SceneData.removeActionObject(this, 'act-pondscum');
    } else {
      advent.SceneData.setObjectImage(this, 'obj-fountain',
          './images/Fountain-Empty-Dirty.png');
      advent.SceneData.moveActionObject(this, 'act-pondscum', 551, 404);
    }
  } else {
    if (this.game_.inventoryArea.hasFlag('has-scum')) {
      advent.SceneData.setObjectImage(this, 'obj-fountain',
          './images/Fountain-Filled-Clean.png');
      advent.SceneData.removeActionObject(this, 'act-pondscum');
    } else {
      advent.SceneData.setObjectImage(this, 'obj-fountain',
          './images/Fountain-Filled-Dirty.png');
      advent.SceneData.moveActionObject(this, 'act-pondscum', 705, 410);
    }
  }
};