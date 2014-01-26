// Copyright 2011 Craig Prince. All rights reserved.
var advent = advent || {};

/**
 * A script that can be executed.
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
 * Add a step to the script.
 * @param {number} delay The delay before this step executes.
 * @param {Script.Ops} op The operation to perform.
 * @param {Array.<*>} params Array of parameters for the operation.
 * @returns {Script} This object so that adds can be chained together.
 */
Script.prototype.add = function(delay, op, params) {
  this.steps.push({
      delay: delay,
      func: Script.funcs_[op],
      params: params});
  return this;
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
 * Cancel the currently running script.
 */
Script.prototype.cancel = function() {
  window.clearTimeout(this.timeoutId);
  this.isCancelled = true;
};


/**
 * Reset the currently running script so it can be executed again.
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


// ################# OPCODE METHODS ##################
/**
 * The opcodes available in the scripting language.
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
  END: 12,
  CHANGE_IMAGE: 13,
  FINISH: 14
};


/**
 * TALK: Make a given character speak the given text for the given time.
 * @param {string} personId Id of the actor to speak.
 * @param {string} The text to speak.
 * @param {number} The delay in milliseconds that the speech should remain.
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
 * ADD_ITEM: Add an item to the player's inventory.
 * @param {string} The item id to add to the inventory.
 */
Script.addItem = function(itemId) {
  this.context.inventoryArea.addItemById(itemId);
};


/**
 * REMOVE_ITEM: Remove an item from the player's inventory.
 * @param {string} The item id to remove from the inventory.
 */
Script.removeItem = function(itemId) {
  this.context.inventoryArea.removeItemById(itemId);
};


/**
 * WALK: Walk the player to the given point. Executes until interrupted or the
 * character reaches the point.
 * @param {number} x The x-coord to walk to -- in scene coordinates.
 * @param {number} y The y-coord to walk to -- in scene coordinates.
 */
Script.walk = function(x, y) {
  if (!this.context.gameArea.isWalkAt(x,y)) {
    this.context.gameArea.startWalk(x,y);
    this.nextStep--;
  }
};


/**
 * LOAD: Load a new scene and position the player at the given point.
 * @param {string} The scene name to load.
 * @param {number} x The x-coord to position the player at -- in scene
 *     coordinates.
 * @param {number} y The y-coord to position the player at -- in scene
 *     coordinates.
 */
Script.load = function(scene, x, y) {
  this.context.gameArea.loadScene(scene, x, y);
};


/**
 * ADD_FLAG: Add a flag to the player. Flags are used to track game state.
 * @param {string} flagId The flag id to add.
 */
Script.addFlag = function(flagId) {
  this.context.inventoryArea.addFlag(flagId);
};


/**
 * REMOVE_FLAG: Remove a flag from the player. Flags are used to track game
 * state.
 * @param {string} flagId The flag id to remove.
 */
Script.removeFlag = function(flagId) {
  this.context.inventoryArea.removeFlag(flagId);
};


/**
 * REMOVE_EL: Remove an item from a scene.
 * @param {string} objId The object to remove from the scene.
 */
Script.removeEl = function(objId) {
  this.context.gameArea.removeSceneObject(objId);
};


/**
 * MOVE_EL: Move an element to a new location in the scene.
 * @param {string} objId The object to move.
 * @param {number} x The x-coordinate of the object - in scene coordinates.
 * @param {number} y The y-coordinate of the object - in scene coordinates.
 * @param {number} w The width of the object.
 * @param {number} h The height of the object.
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
 * IF_FLAG: Perform a relative jump within a script if the given flag is set.
 * The script program counter will naturally move by one after each step so a 
 * jump of 0 will execute the next line in the script.
 * @param {string} The flag to check.
 * @param {number} The amount to jump if the flag is set.
 * @param {number} The amount to jump if the flag is not set.
 */
Script.ifFlag = function(flagId, jumpTAmt, jumpFAmt) {
  if (this.context.inventoryArea.hasFlag(flagId)) {
    this.nextStep += jumpTAmt;
  } else {
    this.nextStep += jumpFAmt;
  }
};


/**
 * IF_NOT_ FLAG: Perform a relative jump within a script if the given flag is
 * not set. The script program counter will naturally move by one after each
 * step so a jump of 0 will execute the next line in the script.
 * @param {string} The flag to check.
 * @param {number} The amount to jump if the flag is not set.
 * @param {number} The amount to jump if the flag is set.
 */
Script.ifNotFlag = function(flagId, jumpTAmt, jumpFAmt) {
  if (!this.context.inventoryArea.hasFlag(flagId)) {
    this.nextStep += jumpTAmt;
  } else {
    this.nextStep += jumpFAmt;
  }
};


/**
 * END: End the currently running script.
 */
Script.end = function() {
  this.nextStep = this.steps.length - 1;
};


/**
 * CHANGE_IMAGE: Change an image in the scene. Allows scripts to do keyframe
 * animation of scene objects.
 * @param {string} sceneId The id of the object in the scene.
 * @param {string} newImageSrc The path to the new image for the object.
 */
Script.changeImage = function(sceneId, newImageSrc) {
  var el = document.getElementById(sceneId);
  el.src = newImageSrc;
};


/**
 * FINISH: Finish the game and go to a new page.
 * @param {string} The URL of the new page to visit...probably a credits page?
 */
Script.finish = function(path) {
  document.location.href=path;
}


/**
 * Array mapping opcode to the function that executes that opcode. NOTE: This
 * array must be kept in sync with Script.Ops.
 * @private {Array.<Script.Ops,Function>}
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
  Script.end,
  Script.changeImage,
  Script.finish
];
