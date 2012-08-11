var advent = advent || {};

/**
 * The study scene.
 * @constructor
 */
advent.StudyScene = function(parent) {
  /**
   * Global context.
   * @type {advent.Game}
   */
  this.game_ = parent;

  /**
   * The scene name.
   * @type {string}
   */
  this.name = 'study';

  /**
   * The scene background image.
   * @type {string}
   */
  this.backgroundImage = 'images/Study.png';
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
      [],[],[[0,200],[845,957]],[[0,330]],[[0,1024]], // 375
      [[0,1024]],[[0,1024]],[[0,1024]],[[117,1024]],[[0,1024]], // 500
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
			      ['./images/Bookshelf0.png', 'obj-bookshelf',0,0, 341, 460]
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
      ['./images/StudyForeground.png', 'obj-desk', 596, 314, 435, 244],
  ];

  this.talkObjects = [
		      ['talk-genie', 250, 250],
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
      ['door to hall', 'act-halldoor', 984, 75, 40, 327,
       advent.Verb.OPEN, 967, 393],
      ['fireplace', 'act-fireplace', 485, 169, 344, 187,
       advent.Verb.LOOKAT, 706, 460],
      ['mysterious journal', 'act-journal', 762, 403, 247, 57,
       advent.Verb.LOOKAT, 892, 533],
      ['lamp', 'act-lamp', 647, 318, 106, 145,
       advent.Verb.LOOKAT, 754, 545],
      ['mirror', 'act-mirror', 552, 0, 207,  92,
       advent.Verb.LOOKAT, 639, 403],
      ['hat', 'act-hat', 772, 85, 50, 61,
       advent.Verb.LOOKAT, 804, 419],
      ['Millennium Falcon', 'act-falcon',  679, 97, 87, 54,
       advent.Verb.LOOKAT, 707, 429],
      ['ship in bottle', 'act-ship', 580, 101, 87, 54,
       advent.Verb.LOOKAT, 607, 416],
      ['DeLorean', 'act-delorean', 490, 105, 83, 63,
       advent.Verb.LOOKAT, 531, 427],
      ['flower vase', 'act-flowervase', 363, 43, 104, 160,
       advent.Verb.LOOKAT, 404, 404], 
      ['portal', 'act-portal', 80, 90, 158, 285,
       advent.Verb.WALKTO, 280, 384],
      ['bookshelf', 'act-bookshelf',72, 0, 250, 440,
       advent.Verb.LOOKAT, 307, 384],
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
    [advent.Verb.OPEN, 'door to hall', null, false, new Script(this.game_)
      .add(0, Script.Ops.TALK, ['pctalk', 'HOPE THAT GUARD\'S STILL ASLEEP.', 2000])
      .add(2000, Script.Ops.WALK, [967, 375])
      .add(0, Script.Ops.LOAD, ['hall', 109, 431])
      .add(0, Script.Ops.WALK, [130, 500])
      ],
    [advent.Verb.LOOKAT, 'fireplace', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
	   ['pctalk', 'Mmm...Fire. Good for keeping warm, toasting marshmallows, or burning evidence.'.toUpperCase(), 3000])
      ],
    [advent.Verb.PICKUP, 'fireplace', null, true, new Script(this.game_)
      .add(0, Script.Ops.TALK,
	   ['pctalk', 'I can\'t pick up a whole fireplace.'.toUpperCase(), 3000])
      ],
    [advent.Verb.LOOKAT, 'mysterious journal', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', 'I wish I could read Klingon. But the pictures are pretty.'.toUpperCase(), 3000])
     ],
    [advent.Verb.LOOKAT, 'lamp', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', 'Wonder what will happen if I pull on this lamp cord.'.toUpperCase(), 3000])
     ],
    [advent.Verb.PULL, 'lamp', null, true, new Script(this.game_)
     .add(0, Script.Ops.WALK, [650, 540])
     .add(100, Script.Ops.TALK, ['talk-genie', 'You have released the Genie of the Lamp! He will kill you now, hope you saved your game!'.toUpperCase(), 5000])
     .add(250, Script.Ops.CHANGE_IMAGE, ['kg', 'images/chars/kg/kgFearL.png'])
     .add(7000, Script.Ops.TALK, ['talk-genie', 'Just kidding! The lamp wasn\'t even plugged in.'.toUpperCase(), 3000])
     .add(100, Script.Ops.CHANGE_IMAGE, ['kg', 'images/chars/kg/kgStandL.png'])
     ],
    [advent.Verb.LOOKAT, 'mirror', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', 'Hey! Who\'s the man in the mirror?'.toUpperCase(), 3000])
     ],
    [advent.Verb.PICKUP, 'mirror', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', "It's too heavy, and I'm too short.".toUpperCase(), 3000])
     ],
    [advent.Verb.LOOKAT, 'hat', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', "What a nice hat! But not as nice as mine.".toUpperCase(), 3000])
     ],
    [advent.Verb.PICKUP, 'hat', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', "Too bad I've already got a hat, or I'd steal this one.".toUpperCase(), 3000])
     ],
    [advent.Verb.LOOKAT, 'Millennium Falcon', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', "This looks like it could make the Kessel run in 12 parsecs".toUpperCase(), 3000])
     ],
    [advent.Verb.PICKUP, 'Millennium Falcon', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', "I doubt a spaceship would fit in my pocket.".toUpperCase(), 3000])
     ],
    [advent.Verb.LOOKAT, 'ship in bottle', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', "How'd that ship get in there?".toUpperCase(), 3000])
     ],
    [advent.Verb.LOOKAT, 'DeLorean', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', "No use. I'd need a nuclear reaction to generate the 1.21 gigawatts of electricity I need.".toUpperCase(), 3000])
     ],
    [advent.Verb.PICKUP, 'DeLorean', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', "Time machines and pockets don't go together.".toUpperCase(), 3000])
     ],
    [advent.Verb.LOOKAT, 'flower vase', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', "This vase nicely complements the eclectic decor of the study.".toUpperCase(),3000])
     ],
    [advent.Verb.PICKUP, 'flower vase', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', "Uh-uh. I'd get water in my pockets..".toUpperCase(),3000])
     ],
    [advent.Verb.LOOKAT, 'portal', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', "Looks like I've found the secret portal!".toUpperCase(), 3000])
     ],
    [advent.Verb.PICKUP, 'portal', null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', "Don't be silly, you can't pick up a portal!".toUpperCase(), 3000])
     ],
    [advent.Verb.LOOKAT, 'bookshelf', null, true, new Script(this.game_)
     .add(0, Script.Ops.IF_NOT_FLAG, ['book1',0,3] )
     .add(0, Script.Ops.TALK, ['pctalk', "Gee, that's a lot of books. Let's take a look....".toUpperCase(), 3000])
     .add(0, Script.Ops.ADD_FLAG, ['book1'])
     .add(0, Script.Ops.END, [])

     .add(0, Script.Ops.IF_NOT_FLAG, ['book2',0,3] )
     .add(0, Script.Ops.TALK, ['pctalk', "'Hitchiker's Guide to the Galaxy.' That looks almost as useful as a towel.".toUpperCase(), 3000])
     .add(0, Script.Ops.ADD_FLAG, ['book2'])
     .add(0, Script.Ops.END, [])

     .add(0, Script.Ops.IF_NOT_FLAG, ['book3',0,3] )
     .add(0, Script.Ops.TALK, ['pctalk', "Ahhh...'The Dream of the Fire.' A classic Klingon novel by K'Ratak.".toUpperCase(), 3000])
     .add(0, Script.Ops.ADD_FLAG, ['book3'])
     .add(0, Script.Ops.END, [])

     .add(0, Script.Ops.IF_NOT_FLAG, ['book4',0,3] )
     .add(0, Script.Ops.TALK, ['pctalk', "Hey. I'd been meaning to finish reading 'The Help.'".toUpperCase(), 3000])
     .add(0, Script.Ops.ADD_FLAG, ['book4'])
     .add(0, Script.Ops.END, [])

     .add(0, Script.Ops.IF_NOT_FLAG, ['book5',0,3] )
     .add(0, Script.Ops.TALK, ['pctalk', "'Ready Player Two: The Sequel'.".toUpperCase(), 3000])
     .add(0, Script.Ops.ADD_FLAG, ['book5'])
     .add(0, Script.Ops.END, [])
     .add(0, Script.Ops.TALK, ['pctalk', "I'll never find the right book! Time to try something else.".toUpperCase(), 3000])

     .add(0, Script.Ops.REMOVE_FLAG, ['book1'])
     .add(0, Script.Ops.REMOVE_FLAG, ['book2'])
     .add(0, Script.Ops.REMOVE_FLAG, ['book3'])
     .add(0, Script.Ops.REMOVE_FLAG, ['book4'])
     .add(0, Script.Ops.REMOVE_FLAG, ['book5'])
     ],

    [advent.Verb.USE, "pixel hunter's pixel", "bookshelf", true, new Script(this.game_)
     .add(0, Script.Ops.CHANGE_IMAGE, ["scene-background","images/StudyPortalOpen.png"])
     .add(0, Script.Ops.TALK, ['pctalk',"Hey presto! Something's happening.".toUpperCase(), 3000])
     .add(200, Script.Ops.CHANGE_IMAGE, ['obj-bookshelf', 'images/Bookshelf1.png'])
     .add(200, Script.Ops.CHANGE_IMAGE, ['obj-bookshelf', 'images/Bookshelf2.png'])
     .add(200, Script.Ops.CHANGE_IMAGE, ['obj-bookshelf', 'images/Bookshelf3.png'])
     .add(200, Script.Ops.CHANGE_IMAGE, ['obj-bookshelf', 'images/Bookshelf4.png'])
     .add(200, Script.Ops.CHANGE_IMAGE, ['obj-bookshelf', 'images/Bookshelf5.png'])
     .add(200, Script.Ops.CHANGE_IMAGE, ['obj-bookshelf', 'images/Bookshelf6.png'])
     .add(200, Script.Ops.CHANGE_IMAGE, ['obj-bookshelf', 'images/Bookshelf7.png'])
     .add(200, Script.Ops.CHANGE_IMAGE, ['obj-bookshelf', 'images/Bookshelf8.png'])
     .add(0, Script.Ops.REMOVE_EL, ['act-bookshelf'])
     .add(0, Script.Ops.ADD_FLAG, ['portal-open'])
      ],
    [advent.Verb.WALKTO, "portal", null, true, new Script(this.game_)
     .add(0, Script.Ops.TALK, ['pctalk', "Well, I guess all that's left is to walk through this secret portal".toUpperCase(), 3000])
     .add(2000, Script.Ops.WALK, [169, 357] )
     .add(0, Script.Ops.CHANGE_IMAGE, ['kg', 'images/chars/kg/kgFearL.png'])
     .add(1000, Script.Ops.FINISH, ['endCredits.html'])
     ],
  ];
};


advent.StudyScene.prototype.beforeLoad = function() {
    if(this.game_.inventoryArea.hasFlag('portal-open')) {
	this.backgroundImage = "images/StudyPortalOpen.png";
	advent.SceneData.setObjectImage(this, 'obj-bookshelf',
					'./images/Bookshelf8.png');
	advent.SceneData.removeActionObject(this, 'act-bookshelf');
    } else {
	this.backgroundImage = "images/Study.png";
    }

};