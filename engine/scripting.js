var advent = advent || {};

/**
 * Construct a script.
 * @constructor
 */
Script = function(context) {
  this.context = context;
  this.timeoutId = null;
  this.nextStep = 0;
  this.steps = [];
  this.isCancelled = false;
  this.walkToObject = false;
  this.objectX = 0;
  this.objectY = 0;
};

/**
 * The opcodes.
 * @enum {number}
 */
Script.Ops = {
  NOP: 0,
  TALK: 1,
  ADD_ITEM: 2,
  REMOVE_ITEM: 3,
  WALK: 4,
  LOAD: 5,
  ADD_FLAG: 6,
  REMOVE_FLAG: 7,
  REMOVE_EL: 8,
  MOVE_EL: 9,
  IF_FLAG: 10,
  IF_NOT_FLAG: 11,
  EXIT: 12,
  CHANGE_IMAGE: 13,
  FINISH: 14
};


/**
 * Set the initial coordinates to walk to.
 * @param {number} x The x coord of the object.
 * @param {number} y The y coord of the object.
 */
Script.prototype.setWalkToObject = function(x, y) {
  this.nextStep = -1;
  this.walkToObject_ = true;
  this.objectX_ = x;
  this.objectY_ = y;
};


/**
 * Cancel this script.
 */
Script.prototype.cancel = function() {
  window.clearTimeout(this.timeoutId);
  this.isCancelled = true;
};


/**
 * Reset the script.
 */
Script.prototype.reset = function() {
  this.nextStep = 0;
  this.walkToObject_ = false;
  this.objectX_ = 0;
  this.objectY_ = 0;
  this.isCancelled = false;
};


/**
 * Start this script running.
 */
Script.prototype.start = function() {
  if (!this.isCancelled) {
    var nextStep = null;

    // Determine the initial delay.
    if (this.nextStep == -1 && this.walkToObject_) {
      nextStep = {delay: 0};
    } else if (this.nextStep < this.steps.length) {
      nextStep = this.steps[this.nextStep];
    }

    // Set a timeout.
    if (nextStep != null) {
      var object = this;
      this.timeoutId =
          window.setTimeout(function() {object.tick_();}, nextStep.delay);
    }
  }
};


/**
 * Handle the next step of the script executing.
 * @private
 */
Script.prototype.tick_ = function() {
  if (!this.isCancelled) {
    var nextStep = null;
    if (this.nextStep == -1 && this.walkToObject_) {
      nextStep = {
          delay: 0,
          func: Script.funcs_[Script.Ops.WALK],
          params: [this.objectX_, this.objectY_]
        };
    } else {
      nextStep = this.steps[this.nextStep];
    }
    nextStep.func.apply(this, nextStep.params);
    this.nextStep++;
    this.start();
  }
};


/**
 * Add a step to the script.
 * @param {number} delay The delay before this step executes.
 * @param {Script.Ops} op The operation to perform.
 * @param {Array.<*>} params Array of parameters for the operation.
 */
Script.prototype.add = function(delay, op, params) {
  this.steps.push( {delay: delay, func: Script.funcs_[op], params: params });
  return this;
};


// ############# METHODS ##################
/**
 * Talk.
 */
Script.talk = function(personId, txt, delay) {
  var el = document.getElementById(personId);
  el.innerHTML = txt;
  window.setTimeout(function() {
        if (el.innerHTML == txt) {
          el.innerHTML = '';
        }
      }, delay);
};


/**
 * Allow a script to give the player an item.
 */
Script.addItem = function(itemId) {
  this.context.inventoryArea.addItemById(itemId);
};


/**
 * Allow a script to remove an item from a player.
 */
Script.removeItem = function(itemId) {
  this.context.inventoryArea.removeItemById(itemId);
};


/**
 * Walk to a point.
 */
Script.walk = function(x,y) {
  if (!this.context.gameArea.isWalkAt(x,y)) {
    this.context.gameArea.startWalk(x,y);
    this.nextStep--;
  }
};


/**
 * Walk to a point.
 */
Script.load = function(scene, x,y) {
  this.context.gameArea.loadScene(scene, x, y);
};


/**
 * Allow a script to give the player a flag.
 */
Script.addFlag = function(flagId) {
  this.context.inventoryArea.addFlag(flagId);
};


/**
 * Allow a script to remove an item from a player.
 */
Script.removeFlag = function(flagId) {
  this.context.inventoryArea.removeFlag(flagId);
};


/**
 * Allow a script to remove an item from a player.
 */
Script.removeEl = function(objId) {
  this.context.gameArea.removeSceneObject(objId);
};


/**
 * Allow a script to remove an item from a player.
 */
Script.moveEl = function(objId, x, y, w, h) {
  var el = document.getElementById(objId);
  if (el) {
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = w + 'px';
    el.style.height = h + 'px';
  }
};


/**
 */
Script.ifFlag = function(flagId, jumpTAmt, jumpFAmt) {
  if (this.context.inventoryArea.hasFlag(flagId)) {
    this.nextStep += jumpTAmt;
  } else {
    this.nextStep += jumpFAmt;
  }
};


/**
 */
Script.ifNotFlag = function(flagId, jumpTAmt, jumpFAmt) {
  if (!this.context.inventoryArea.hasFlag(flagId)) {
    this.nextStep += jumpTAmt;
  } else {
    this.nextStep += jumpFAmt;
  }
};


/**
 * Exit the script.
 */
Script.exit = function(flagId, jumpTAmt, jumpFAmt) {
  this.nextStep = this.steps.length - 1;
};


/**
 * Exit the script.
 */
Script.changeImage = function(sceneId, newImageSrc) {
  var el = document.getElementById(sceneId);
  el.src = newImageSrc;
};

/**
 * Game is finished, go to a new page.
 */
Script.finish = function(path) {
    document.location.href=path;
}

/**
 * The functions.
 */
Script.funcs_ = [
  function() {},
  Script.talk,
  Script.addItem,
  Script.removeItem,
  Script.walk,
  Script.load,
  Script.addFlag,
  Script.removeFlag,
  Script.removeEl,
  Script.moveEl,
  Script.ifFlag,
  Script.ifNotFlag,
  Script.exit,
  Script.changeImage,
  Script.finish
];
