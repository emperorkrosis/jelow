var advent = advent || {};

/**
 * The town scene.
 */
advent.TownScene = function(parent) {
  this.game_ = parent;
  this.name = 'town';

  this.backgroundImage = 'images/Town.png';
  this.backgroundWidth = 1400;
  this.backgroundHeight = 550;

  this.pcScale = 1.0;

  this.walkable = [
      [],[],[],[],[], // 120
      [],[],[],[],[], // 250
      [],[],[[991, 1258]],[[991,1258]],[[188,1258]], // 375
      [[0,1258]],[[0,1258]],[[0,1258]],[[0,1258]],[[0,1258]], // 500
      [[0,1258]],[]]; // 550

  this.backgroundObjects = [
    ['./images/chars/ph/PixelHunter.png', 'obj-hunter', 250, 180, 109, 185],
    ['./images/inventory/Embers.png', 'obj-embers', 1338, 299, 40, 30]
  ];

  this.foregroundObjects = [
    ['./images/Well.png', 'obj-well', 500, 345, 159, 192],
    ['./images/Anvil.png', 'obj-anvil', 1195, 465, 100, 79],
    ['./images/chars/guard/GuardStandFront.png', 'obj-guard',
        670, 350, 109, 185],
    ['./images/inventory/Bucket.png', 'obj-bucket', 497, 508, 40, 30]
  ];

  this.talkObjects = [
    ['talk-ph', 198, 80],
    ['talk-guard', 615, 227],
    ['talk-bs', 1100, 253]
  ];

  this.animationObjects = [
    [ './images/chars/bs/Blacksmith-Hammering0.png', 'anim-bs',
      1180, 315, 209, 235,
      [
        ['./images/chars/bs/Blacksmith-Hammering0.png', 160],
        ['./images/chars/bs/Blacksmith-Hammering1.png', 130],
        ['./images/chars/bs/Blacksmith-Hammering2.png', 100],
        ['./images/chars/bs/Blacksmith-Hammering3.png', 60],
        ['./images/chars/bs/Blacksmith-Hammering4.png', 60],
        ['./images/chars/bs/Blacksmith-Hammering5.png', 60],
        ['./images/chars/bs/Blacksmith-Hammering6.png', 60],
        ['./images/chars/bs/Blacksmith-Hammering7.png', 60],
        ['./images/chars/bs/Blacksmith-Hammering8.png', 60],
        ['./images/chars/bs/Blacksmith-Hammering9.png', 100],
        ['./images/chars/bs/Blacksmith-Hammering8.png', 100],
        ['./images/chars/bs/Blacksmith-Hammering7.png', 60],
        ['./images/chars/bs/Blacksmith-Hammering6.png', 60],
        ['./images/chars/bs/Blacksmith-Hammering5.png', 60],
        ['./images/chars/bs/Blacksmith-Hammering4.png', 60],
        ['./images/chars/bs/Blacksmith-Hammering3.png', 60],
        ['./images/chars/bs/Blacksmith-Hammering2.png', 60],
        ['./images/chars/bs/Blacksmith-Hammering1.png', 60],
        ['./images/chars/bs/Blacksmith-Hammering0.png', 60]
      ]
    ]
  ];

  this.actionObjects = [
      ['path to fountain', 'act-path', 0, 0, 75, 550,
       advent.Verb.WALKTO, 133, 400],
      ['door to hallway', 'act-doorhallway', 724, 124, 132, 227,
       advent.Verb.WALKTO, 794, 360],
      ['flowers', 'act-plasticflowers', 131, 222, 83, 37,
       advent.Verb.LOOKAT, 171, 392],
      ['hunter', 'act-pixelhunter', 260, 179, 89, 186,
       advent.Verb.TALKTO, 356, 388],
      ['stained glass window', 'act-stainedglass', 411, 59, 136, 77,
       advent.Verb.LOOKAT, 445, 362],
      ['door to real world', 'act-doorworld', 417, 170, 120, 174,
       advent.Verb.OPEN, 445, 362],
      ['well', 'act-well', 519, 461, 114, 74,
       advent.Verb.LOOKAT, 576, 486],
      ['guard', 'act-guard', 674, 351, 92, 185,
       advent.Verb.TALKTO, 780, 486],//576, 486],
      ['window', 'act-homewindow', 1101, 65, 124, 164,
       advent.Verb.LOOKAT, 1136, 309],
      ['dark alley', 'act-alley', 967, 0, 93, 290,
       advent.Verb.LOOKAT, 1015, 309],
      ['forge', 'act-forge', 1302, 240, 98, 163,
       advent.Verb.LOOKAT, 1250, 404],
      ['anvil', 'act-anvil', 1198, 482, 93, 61,
       advent.Verb.LOOKAT, 1211, 515],
      ['obligatory blacksmith', 'act-blacksmith', 1291, 366, 83, 186,
       advent.Verb.TALKTO, 1211, 515],
      ['hot ember', 'act-ember', 1338, 299, 31, 22,
       advent.Verb.LOOKAT, 1250, 404],
      // TODO(cmprince): REMOVE THIS
      //['warp', 'act-warp', 562, 225, 50, 50,
      // advent.Verb.LOOKAT, 567, 366],
      // TODO(cmprince): REMOVE THIS
      //['warp2', 'act-warp2', 562, 170, 50, 50,
      // advent.Verb.LOOKAT, 567, 366],
      ['well bucket', 'act-bucket', 497, 508, 30, 30,
       advent.Verb.LOOKAT, 461, 510]

  ];

  this.actions = [
    // TODO(cmprince): REMOVE THIS
    [advent.Verb.LOOKAT, 'warp', null, false,
      new Script(this.game_)
      .add(0, Script.Ops.WALK, [567, 366])
      .add(0, Script.Ops.LOAD, ['study', 981, 458])
      .add(0, Script.Ops.WALK, [921, 458])
      ], 
    // TODO(cmprince): REMOVE THIS
    [advent.Verb.LOOKAT, 'warp2', null, false,
      new Script(this.game_)
      .add(0, Script.Ops.WALK, [567, 366])
      .add(0, Script.Ops.LOAD, ['hall', 987, 434])
      .add(0, Script.Ops.WALK, [927, 434])
      ],

    [advent.Verb.LOOKAT, 'door to hallway', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT\'S LOCKED', 1500])
      ],
    [advent.Verb.OPEN, 'door to hallway', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.IF_FLAG, ['has-scum', 0, 5])
      .add(0, Script.Ops.IF_NOT_FLAG, ['faucet-on', 0, 4])
      .add(0, Script.Ops.WALK, [794, 360])
      .add(0, Script.Ops.LOAD, ['hall', 987, 434])
      .add(0, Script.Ops.WALK, [927, 434])
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.TALK, ['pctalk', 'IT\'S LOCKED', 1500])     
      ],
    [advent.Verb.WALKTO, 'door to hallway', null, true, new Script(this.game_)
      .add(0, Script.Ops.IF_FLAG, ['has-scum', 0, 5])
      .add(0, Script.Ops.IF_NOT_FLAG, ['faucet-on', 0, 4])
      .add(0, Script.Ops.WALK, [794, 360])
      .add(0, Script.Ops.LOAD, ['hall', 987, 434])
      .add(0, Script.Ops.WALK, [927, 434])
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.TALK, ['pctalk', 'IT\'S LOCKED', 1500])     
      ],

    [advent.Verb.WALKTO, 'path to fountain', null, false,
      new Script(this.game_)
      .add(0, Script.Ops.WALK, [10, 410])
      .add(0, Script.Ops.LOAD, ['fountain', 1023, 327])
      .add(0, Script.Ops.WALK, [987, 327])
      ],
    [advent.Verb.LOOKAT, 'path to fountain', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I SEE A FOUNTAIN IN THE DISTANCE', 2000])
      ],

    [advent.Verb.LOOKAT, 'hunter', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'HE LOOKS LIKE A SUAVE FELLOW', 1500])
      ],
    [advent.Verb.TALKTO, 'hunter', null, true, new Script(this.game_)
      .add(0, Script.Ops.IF_NOT_FLAG, ['pixelhunter-first', 0, 11])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'HEY THERE! I\'M NEW TO THESE PARTS...', 1500])
      .add(1500, Script.Ops.TALK,
          ['talk-ph', 'AHOY THERE GOOD CHAP! WAIT JUST A MINUTE', 2000])
      .add(2000, Script.Ops.TALK,
          ['talk-ph', 'I KNOW EXACTLY WHAT YOU WERE GOING TO SAY', 2000])
      .add(2000, Script.Ops.TALK,
          ['talk-ph', 'BUT...I DON\'T GIVE AUTOGRAPHS', 1500])
      .add(2000, Script.Ops.TALK,
          ['pctalk', 'ACTUALLY. I WAS WONDERING WHO YOU WERE', 2000])
      .add(2000, Script.Ops.TALK,
          ['talk-ph', 'OH! I\'M THE WORLD FAMOUS FRANCOIS', 2000])
      .add(1500, Script.Ops.TALK,
          ['talk-ph', 'MIGHTY PIXEL HUNTER EXTRAORDINAIRE', 2000])
      .add(1500, Script.Ops.TALK,
          ['talk-ph', 'HERE TAKE A SOUVENIR PIXEL HUNTED BY YOURS TRULY!', 2000])
      .add(0, Script.Ops.ADD_ITEM, ['pixel'])
      .add(0, Script.Ops.ADD_FLAG, ['pixelhunter-first'])
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.TALK,
          ['talk-ph', 'I ALREADY GAVE YOU A SOUVENIR PIXEL. WHAT MORE DO YOU WANT?', 2500])
      ],

    [advent.Verb.LOOKAT, 'door to real world', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'LOOKS LIKE THERE IS NO GOING BACK NOW', 2000])
      ],
    [advent.Verb.OPEN, 'door to real world', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT\'S SEALED UP TIGHT. NO GOING BACK NOW', 2000])
      ],

    [advent.Verb.LOOKAT, 'well bucket', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'A BUCKET. BETTER NOT KICK IT', 2000])
      ],
    [advent.Verb.PICKUP, 'well bucket', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I CAN USE THIS', 1500])
      .add(0, Script.Ops.ADD_ITEM, ['bucket'])
      .add(0, Script.Ops.ADD_FLAG, ['town-bucket'])
      .add(0, Script.Ops.REMOVE_EL, ['obj-bucket'])
      .add(0, Script.Ops.REMOVE_EL, ['act-bucket'])
      ],

    [advent.Verb.LOOKAT, 'well', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I SHOULD LEAVE THE WELL ALONE', 2000])
      ],
    [advent.Verb.USE, 'bucket', 'well', true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THERE\'S NO ROPE ATTACHED!', 2000])
      ],

    [advent.Verb.LOOKAT, 'guard', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT\'S JOHNNY LAW', 1500])
      ],
    [advent.Verb.TALKTO, 'guard', null, true,
      new Script(this.game_)
     .add(250, Script.Ops.CHANGE_IMAGE, ['kg', 'images/chars/kg/kgStandL.png'])
      .add(0, Script.Ops.IF_NOT_FLAG, ['faucet-on', 0, 9])
      .add(0, Script.Ops.TALK,
          ['talk-guard', 'HALT! ARE YOU THE GATEKEEPER?', 2500])
      .add(2500, Script.Ops.TALK,
          ['pctalk', 'NO I\'M THE KEYMASTER. WHO ARE YOU?', 2500])
      .add(2500, Script.Ops.TALK,
          ['talk-guard', 'ERR...I\'M THE TOWN GUARD. BUT WE HAVE A PROBLEM',
           3000])
      .add(3000, Script.Ops.TALK,
          ['pctalk', 'ANYTHING I CAN HELP WITH?', 2500])
      .add(2500, Script.Ops.TALK,
          ['talk-guard', 'NOT UNLESS YOU KNOW A PLUMBER', 2500])
      .add(2500, Script.Ops.TALK,
          ['talk-guard', 'YOU SEE THE TOWN WELL HAS BECOME DIRTY AND UNDRINKABLE', 2500])
      .add(2500, Script.Ops.TALK,
          ['pctalk', 'OH NO!', 1500])
      .add(1500, Script.Ops.TALK,
          ['talk-guard', 'MY THOUGHTS EXACTLY', 1500])
      .add(0, Script.Ops.END, [])
      .add(0, Script.Ops.TALK,
          ['talk-guard', 'WHOA THERE MARIO! HAVE YOU BEEN TINKERING IN THE SEWERS?', 3000])
      .add(3000, Script.Ops.TALK,
          ['talk-guard', 'NOW THERE\'S NO WATER IN THE WELL AT ALL', 2500])
      .add(2500, Script.Ops.TALK,
          ['pctalk', 'BUT...', 1500])
      .add(1500, Script.Ops.TALK,
	   ['talk-guard', 'ZIP IT! I\'M WATCHING YOU', 2500])
      ],

    [advent.Verb.LOOKAT, 'flowers', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'WHAT BEAUTIFUL FLOWERS! OH WAIT, THEY\'RE PLASTIC',
           2500])
      ],
    [advent.Verb.LOOKAT, 'stained glass window', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I\'VE ALWAYS LIKED THE NBC PEACOCK', 2000])
      ],
    [advent.Verb.LOOKAT, 'dark alley', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'KNOWING MY LUCK THOSE ARE PROBABLY KILLER VINES', 2500])
      ],
    [advent.Verb.LOOKAT, 'window', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'HEY! I\'M NOT A PEEPING TOM', 2500])
      ],
    [advent.Verb.LOOKAT, 'forge', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'LA FORGE! GEORDI', 2500])
      ],

    [advent.Verb.LOOKAT, 'obligatory blacksmith', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'DOESN\'T HE GET TIRED?', 2500])
      ],
    [advent.Verb.TALKTO, 'obligatory blacksmith', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'WHO ARE YOU?', 2000])
      .add(2000, Script.Ops.TALK,
          ['talk-bs', 'ANGUS THE BLACKSMITH IS MY NAME, BLACK SMITHING IS MY GAME', 3000])
      .add(3000, Script.Ops.TALK,
          ['talk-bs', 'EVERY ADVENTURE GAME HAS GOT TO HAVE A BLACKSMITH RIGHT?', 3000])
      .add(3000, Script.Ops.TALK,
          ['pctalk', 'I GUESS SO, BUT DO YOU ACTUALLY MAKE ANYTHING?', 2500])
      .add(2500, Script.Ops.TALK,
          ['talk-bs', 'OF COURSE NOT! I\'VE NEVER EVEN PUT THIS PIECE OF METAL IN THE FORGE', 3000])
      .add(3000, Script.Ops.TALK,
          ['talk-bs', 'I JUST LIKE THE CLANKING SOUND', 2500])
      .add(2500, Script.Ops.TALK,
          ['pctalk', 'UMM..OKAY, WELL GOODBYE FOR NOW', 2500])
      .add(2500, Script.Ops.TALK,
          ['talk-bs', 'SO LONG', 1500])
      ],

    [advent.Verb.LOOKAT, 'hot ember', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'SMOKIN\'', 2500])
      ],
    [advent.Verb.USE, 'bucket', 'hot ember', true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THERE NEEDS TO BE LIQUID TO WARM FIRST', 2000])
      ],
    [advent.Verb.USE, 'filled bucket', 'hot ember', true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'NOW IT\'S SUPER HOT', 2000])
      .add(0, Script.Ops.REMOVE_FLAG, ['bucket-warm'])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-hot'])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-not-empty'])
      ],
    [advent.Verb.PICKUP, 'hot ember', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'OW! HOT, HOT!', 2000])
      .add(0, Script.Ops.ADD_ITEM, ['ember'])
      ],

    [advent.Verb.LOOKAT, 'anvil', null, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'DON\'T EVEN THINK ABOUT MAKING ME CARRY THAT', 2500])
      ]
  ];
};


/**
 * Setup the scene for loading.
 */
advent.TownScene.prototype.beforeLoad = function() {
  // Maybe display different background and make guard invisible.
  if (!this.game_.inventoryArea.hasFlag('faucet-on') &&
      this.game_.inventoryArea.hasFlag('has-scum')) {
    advent.SceneData.removeForegroundObject(this, 'obj-guard');
    advent.SceneData.removeActionObject(this, 'act-guard');
    this.backgroundImage = 'images/TownDoorOpen.png';
  } else {
    advent.SceneData.restoreForegroundObject(this, 'obj-guard');
    advent.SceneData.restoreActionObject(this, 'act-guard');
    this.backgroundImage = 'images/Town.png';
  }

  // Maybe make the bucket disappear.
  if (this.game_.inventoryArea.hasFlag('town-bucket')) {
    advent.SceneData.removeForegroundObject(this, 'obj-bucket');
    advent.SceneData.removeActionObject(this, 'act-bucket');
  }  
};