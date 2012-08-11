var advent = advent || {};

/**
 * The global scene.
 * @constructor
 */
advent.GlobalScene = function(parent) {
  /**
   * Global context.
   * @type {advent.Game}
   */
  this.game_ = parent;

  /**
   * The scene name.
   * @type {string}
   */
  this.name = 'global';

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
    [advent.Verb.LOOKAT, 'crystal key', null, false, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'AMAZING I FOUND THE KEY ALREADY!', 2500])
      ],

    [advent.Verb.LOOKAT, 'smelly flower', null, false, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'SMELLS LIKE A PETUNIA', 1500])
      .add(1500, Script.Ops.TALK,
          ['pctalk', '...OR A ROSE', 1500])
      .add(1500, Script.Ops.TALK,
          ['pctalk', '...OR A LILAC?', 1500])
      ],

    [advent.Verb.LOOKAT, 'ham', null, false, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT SAYS HERE THAT IT COMES PRECOOKED', 2500])
      ],

    [advent.Verb.LOOKAT, 'warm ember', null, false, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT\'S COOLED DOWN SOME', 2500])
      ],

    [advent.Verb.LOOKAT, 'pixel hunter\'s pixel', null, false,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', '\"HUNT YOUR OWN PIXELS TODAY!\", SIGNED FRANCOIS', 2500])
      ],

    [advent.Verb.LOOKAT, 'bottle with liquid', null, false,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT\'S A USELESS BOTTLE OF LIQUID', 2000])
      ],

    [advent.Verb.LOOKAT, 'tasty cheese', null, false,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'A WEDGE OF GOUDA', 2000])
      ],

    [advent.Verb.LOOKAT, 'sleeping pill-laced cheese', null, false,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THAT\'LL MAKE YOU SLEEPY', 2000])
      ],

    [advent.Verb.LOOKAT, 'SCUMM(R)', null, false,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'NASTY SLUDGE...OR THE BEST ADVENTURE GAME ENGINE EVER?', 2000])
      ],

    [advent.Verb.LOOKAT, 'bucket', null, false, new Script(this.game_)
      .add(0, Script.Ops.IF_NOT_FLAG, ['bucket-not-empty', 0, 2])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'A BUCKET', 2000])
      .add(0, Script.Ops.END, [])

      .add(0, Script.Ops.TALK,
          ['pctalk', 'AN UNFILLED BUCKET CONTAINING...', 2000])

      .add(0, Script.Ops.IF_FLAG, ['bucket-smell', 0, 1])
      .add(2000, Script.Ops.TALK,
          ['pctalk', 'A SMELLY FLOWER', 2000])

      .add(0, Script.Ops.IF_FLAG, ['bucket-goodcheese', 0, 1])
      .add(2000, Script.Ops.TALK,
          ['pctalk', 'SOME TASTY CHEESE', 2000])

      .add(0, Script.Ops.IF_FLAG, ['bucket-badcheese', 0, 1])
      .add(2000, Script.Ops.TALK,
          ['pctalk', 'SOME POISONED CHEESE', 2000])

      .add(0, Script.Ops.IF_FLAG, ['bucket-taste', 0, 1])
      .add(2000, Script.Ops.TALK,
          ['pctalk', 'SOME DELICIOUS HAM', 2000])

      .add(0, Script.Ops.IF_FLAG, ['bucket-sight', 0, 1])
      .add(2000, Script.Ops.TALK,
          ['pctalk', 'SOME COLORFUL SCUM', 2000])
      ],

    [advent.Verb.LOOKAT, 'filled bucket', null, false, new Script(this.game_)
      .add(0, Script.Ops.IF_NOT_FLAG, ['bucket-not-empty', 0, 2])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'A FILLED BUCKET', 2000])
      .add(0, Script.Ops.END, [])

      .add(0, Script.Ops.IF_FLAG, ['bucket-hot', 0, 2])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'A HOT BREW-FILLED BUCKET CONTAINING...', 2000])
      .add(0, Script.Ops.IF_FLAG, ['not-a-flag', 0, 4])
      .add(0, Script.Ops.IF_FLAG, ['bucket-warm', 0, 2])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'A WARM BREW-FILLED BUCKET CONTAINING...', 2000])
      .add(0, Script.Ops.IF_FLAG, ['not-a-flag', 0, 1])
      .add(0, Script.Ops.TALK,
          ['pctalk', 'A BREW-FILLED BUCKET CONTAINING...', 2000])

      .add(0, Script.Ops.IF_FLAG, ['bucket-salty', 0, 1])
      .add(2000, Script.Ops.TALK,
          ['pctalk', 'SALTY WATER', 2000])

      .add(0, Script.Ops.IF_FLAG, ['bucket-smell', 0, 1])
      .add(2000, Script.Ops.TALK,
          ['pctalk', 'A SMELLY FLOWER', 2000])

      .add(0, Script.Ops.IF_FLAG, ['bucket-goodcheese', 0, 1])
      .add(2000, Script.Ops.TALK,
          ['pctalk', 'SOME TASTY CHEESE', 2000])

      .add(0, Script.Ops.IF_FLAG, ['bucket-badcheese', 0, 1])
      .add(2000, Script.Ops.TALK,
          ['pctalk', 'SOME POISONED CHEESE', 2000])

      .add(0, Script.Ops.IF_FLAG, ['bucket-taste', 0, 1])
      .add(2000, Script.Ops.TALK,
          ['pctalk', 'SOME DELICIOUS HAM', 2000])

      .add(0, Script.Ops.IF_FLAG, ['bucket-sight', 0, 1])
      .add(2000, Script.Ops.TALK,
          ['pctalk', 'SOME COLORFUL SCUM', 2000])
      ],

    
    [advent.Verb.USE, 'smelly flower', /filled bucket|bucket/, false,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'AH, WHAT A WONDERING AROMA', 2000])
      .add(0, Script.Ops.REMOVE_ITEM, ['flower'])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-smell'])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-not-empty'])
      ],

    [advent.Verb.USE, 'warm ember', 'bucket', false, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THERE NEEDS TO BE LIQUID TO WARM FIRST', 2000])
      ],
    [advent.Verb.USE, 'warm ember', 'filled bucket', false,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'NOW IT\'S LUKE WARM', 2000])
      .add(0, Script.Ops.REMOVE_ITEM, ['ember'])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-warm'])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-not-empty'])
      ],

    [advent.Verb.USE, 'tasty cheese', /filled bucket|bucket/, false,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I\'LL JUST ADD A LITTLE', 2000])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-goodcheese'])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-not-empty'])
      ],
    [advent.Verb.USE, 'sleeping pill-laced cheese', /filled bucket|bucket/,
      false, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'BEDTIME FOR BONZO', 2000])
      .add(0, Script.Ops.REMOVE_FLAG, ['bucket-goodcheese'])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-badcheese'])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-not-empty'])
      ],

    [advent.Verb.USE, 'ham', /filled bucket|bucket/, false,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'WITH A DASH OF HAM FOR TASTE', 2000])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-taste'])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-not-empty'])
      ],

    [advent.Verb.USE, 'SCUMM(R)', /filled bucket|bucket/, false,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THE SCUM GIVES IT A NICE COLOR!', 2000])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-sight'])
      .add(0, Script.Ops.ADD_FLAG, ['bucket-not-empty'])
      ],

    [advent.Verb.USE, 'crystal key', /.*/, true,
      new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THIS KEY DOESN\'T UNLOCK THAT', 2000])
      ],

    [advent.Verb.GIVE, /.*/, /.*/, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I DON\'T WANT TO GIVE THAT AWAY', 2000])
      ],
    [advent.Verb.OPEN, /.*/, null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THAT DOESN\'T OPEN', 1500])
      ],
    [advent.Verb.CLOSE, /.*/, null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THAT DOESN\'T CLOSE', 1500])
      ],
    [advent.Verb.PICKUP, /.*/, null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'I CAN\'T GO AROUND STEALING EVERYTHING', 2500])
      ],
    [advent.Verb.LOOKAT, /.*/, null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT\'S...A THING', 1500])
      ],
    [advent.Verb.TALKTO, /.*/, null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'WELL HELLO THERE!', 1500])
      .add(2000, Script.Ops.TALK,
          ['pctalk', '...NOTHING', 1500])
      ],
    [advent.Verb.USE, /.*/, /.*/, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'THOSE DON\'T GO TOGETHER', 2000])
      ],
    [advent.Verb.PUSH, /.*/, null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT WON\'T BUDGE', 1500])
      ],
    [advent.Verb.PUSH, /.*/, null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
          ['pctalk', 'IT WON\'T BUDGE', 1500])
      ]
  ];
};
