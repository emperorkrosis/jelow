// Copyright 2011 Craig Prince. All Rights Reserved.

var advent = advent || {};

/**
 * Constructor.
 */
advent.GameArea = function(parent) {
  this.debugObjects = false;

  // Get a context to the globals.
  this.game_ = parent;

  this.globalScene_ = null;

  // The current game scene.
  this.currentScene_ = null;

  // The frame surrounding the world view.
  this.element_ = null;

  // The layer that display the world.
  this.area_ = null;
  this.areaWidth = 0;

  // The background image of the world.
  this.background_ = null;

  // PC layer
  this.pc_ = null;

  // PC image
  this.pcimage_ = null;
  this.pcScale = 1.0;

  this.talkDiv_ = null;

  // PC Movement
  this.pcX = 0;
  this.pcY = 0;
  this.currentDestX = 0;
  this.currentDestY = 0;
  this.currentMoving = false;
  this.lastDirection = 1;

  // PC animation
  this.pcAnimsCounter = 0;
  this.pcAnims = [
      ['images/chars/kg/kgStandRTake.png',
       'images/chars/kg/kgWalkR2.png',
       'images/chars/kg/kgStandRTake.png',
       'images/chars/kg/kgWalkR2.png'],
      ['images/chars/kg/kgStandLTake.png',
       'images/chars/kg/kgWalkL2.png',
       'images/chars/kg/kgStandLTake.png',
       'images/chars/kg/kgWalkL2.png']];

  // Scene animations
  this.animations_ = [];

  this.currentAction_ = null;
};


/**
 * Create the DOM for the play area.
 */
advent.GameArea.prototype.init = function(el) {
  this.element_ = document.createElement('div');
  this.element_.id = 'gamearea';

  this.area_ = document.createElement('div');
  this.area_.style.position = 'absolute';
  this.element_.appendChild(this.area_);

  el.appendChild(this.element_);

  this.globalScene_ = this.game_.scenes.get('global');
  //this.loadScene('town', 456, 362);
  this.loadScene('town', 456, 362);

  var object = this;
  this.game_.currentAction.onchange.push(function(action) {
    if (action.isComplete()) {
      object.handleActionDone(action);
      action.clearAction();
    }
  });
};


/**
 * Load the scene.
 */
advent.GameArea.prototype.loadScene = function(name, x, y) {
  // Find the scene in the array.
  this.currentScene_ = this.game_.scenes.get(name);
  this.currentScene_.beforeLoad();

  // Remove all the children of the scene
  while (this.area_.childNodes.length > 0) {
    this.area_.removeChild(this.area_.childNodes[0]);
  }

  // Cancel all continuous animations.
  for (var l = 0; l < this.animations_.length; l++) {
    this.animations_[l].stop();
  }
  this.animations_ = [];
  
  // Create the background image of the scene
  this.background_ = document.createElement('img');
  this.background_.draggable = false;
  this.background_.id = 'scene-background';
  this.background_.src = this.currentScene_.backgroundImage;
  this.areaWidth = this.currentScene_.backgroundWidth;
  this.background_.style.position = 'absolute';
  this.area_.appendChild(this.background_);

  // Handle clicking on the background images (default action...walk).
  var object = this;
  this.background_.onclick = function(e) {
    if (object.currentScript_ != null) {
      object.currentScript_.cancel();	  
    }
    object.startWalk(e.offsetX, e.offsetY);
  };

  // Create all the items behind the character.
  for (var i = 0; i < this.currentScene_.backgroundObjects.length; i++) {
    var sceneObject = this.currentScene_.backgroundObjects[i];
    if (!sceneObject.hidden) {
      var imgDiv = document.createElement('img');
      imgDiv.src = sceneObject[0];
      imgDiv.id = sceneObject[1];
      imgDiv.style.position = 'absolute';
      var left = sceneObject[2];
      imgDiv.style.left = left + 'px';
      var top = sceneObject[3];
      imgDiv.style.top = top + 'px';
      imgDiv.style.width = sceneObject[4] + 'px';
      imgDiv.style.height = sceneObject[5] + 'px';
      imgDiv.onclick = (function(left, top) {
        return function(e) {
          if (object.currentScript_ != null) {
            object.currentScript_.cancel();	  
          }
          object.startWalk(e.offsetX + left, e.offsetY + top);
        };
      })(left, top);
      this.area_.appendChild(imgDiv);
    }
  }

  // Create the talk divs.
  for (var t = 0; t < this.currentScene_.talkObjects.length; t++) {
    var talkObject = this.currentScene_.talkObjects[t];
    var talkEl = document.createElement('div');
    talkEl.id = talkObject[0];
    talkEl.className = 'talk';
    talkEl.innerHTML = '';
    talkEl.style.position = 'absolute';
    talkEl.style.left = talkObject[1] + 'px';
    talkEl.style.top = talkObject[2] + 'px';
    this.area_.appendChild(talkEl);
  }

  // Create the character animations.
  for (var anim = 0; anim < this.currentScene_.animationObjects.length;
      anim++) {
    var animObject = this.currentScene_.animationObjects[anim];
    var animEl = document.createElement('img');
    animEl.src = animObject[0];
    animEl.id = animObject[1];
    animEl.style.position = 'absolute';
    var left = animObject[2];
    animEl.style.left = left + 'px';
    var top = animObject[3];
    animEl.style.top = top + 'px';
    animEl.style.width = animObject[4] + 'px';
    animEl.style.height = animObject[5] + 'px';
    animEl.onclick = (function(left, top) {
      return function(e) {
        if (object.currentScript_ != null) {
          object.currentScript_.cancel();	  
        }
        object.startWalk(e.offsetX + left, e.offsetY + top);
      };
    })(left, top);
    this.area_.appendChild(animEl);
    var animation = new advent.Animation(animEl, animObject[6]);
    this.animations_.push(animation);
    animation.start();
  }

  // Create the player image in the scene
  this.pcScale = this.currentScene_.pcScale;
  this.pc_ = document.createElement('div');
  this.pc_.style.position = 'absolute';

  this.pcimage_ = document.createElement('img');
  this.pcimage_.id = 'kg';
  this.pcimage_.draggable = false;
  this.pcimage_.src = 'images/chars/kg/kgStandR.png';
  this.pcimage_.style.position = 'absolute';
  this.pcimage_.style.width = Math.round(110 * this.pcScale) + 'px';
  this.pcimage_.style.height = Math.round(185 * this.pcScale) + 'px';
  this.pc_.appendChild(this.pcimage_);

  this.talkDiv_ = document.createElement('div');
  this.talkDiv_.id = 'pctalk';
  this.talkDiv_.className = 'talk';
  this.talkDiv_.innerHTML = '';
  this.pc_.appendChild(this.talkDiv_);

  this.area_.appendChild(this.pc_);

  // Create all the items in front of the character.
  for (var j = 0; j < this.currentScene_.foregroundObjects.length; j++) {
    var sceneObject = this.currentScene_.foregroundObjects[j];
    if (!sceneObject.hidden) {
      var imgDiv = document.createElement('img');
      imgDiv.src = sceneObject[0];
      imgDiv.id = sceneObject[1];
      imgDiv.style.position = 'absolute';
      var left = sceneObject[2];
      imgDiv.style.left = left + 'px';
      var top = sceneObject[3];
      imgDiv.style.top = top + 'px';
      imgDiv.style.width = sceneObject[4] + 'px';
      imgDiv.style.height = sceneObject[5] + 'px';
      imgDiv.onclick = (function(left, top) {
        return function(e) {
          if (object.currentScript_ != null) {
            object.currentScript_.cancel();	  
          }
          object.startWalk(e.offsetX + left, e.offsetY + top);
        };
      })(left, top);
      this.area_.appendChild(imgDiv);
    }
  }

  // Create all the clickable regions.
  for (var k = 0; k < this.currentScene_.actionObjects.length; k++) {
    var actionObject = this.currentScene_.actionObjects[k];
    if (!actionObject.hidden) {
      var tempDiv = document.createElement('div');
      tempDiv.id = actionObject[1];
      tempDiv.style.position = 'absolute';
      tempDiv.style.width = actionObject[4] + 'px';
      tempDiv.style.height = actionObject[5] + 'px';
      tempDiv.style.left = actionObject[2] + 'px';
      tempDiv.style.top = actionObject[3] + 'px';
      if (this.debugObjects) {
        tempDiv.style.borderStyle = 'solid';
        tempDiv.style.borderSize = '2px';
        tempDiv.style.borderColor = 'rgb(' +
          Math.round(255*Math.random()) + ',' +
          Math.round(255*Math.random()) + ',' +
          Math.round(255*Math.random()) + ')';
      }
      tempDiv.onclick = function(e) {
	    var actObject = advent.SceneData.getActionObject(object.currentScene_,
                e.target.id);
	    object.game_.currentAction.setObject(
	      actObject[0], e.target.id,
              (actObject[6] !== null) ? actObject[6] : undefined);
          };
      tempDiv.onmouseover = function(e) {
	    var actObject = advent.SceneData.getActionObject(object.currentScene_,
                e.target.id);
            object.game_.currentAction.setTentativeObject(
	      actObject[0],
              (actObject[6] !== null) ? actObject[6] : undefined);
          };
      tempDiv.onmouseout = function() {
            object.game_.currentAction.clearTentative();
          };
      this.area_.appendChild(tempDiv);
    }
  }

  // Draw the PC
  this.drawPC(x, y);
};


/**
 * Remove an object from the game area.
 * @param {string} id The id of the object to remove.
 */
advent.GameArea.prototype.removeSceneObject = function(id) {
  var el = document.getElementById(id);
  if (el) {
    this.area_.removeChild(el);
  }
};


/**
 * Initiate a walk of the PC.
 */
advent.GameArea.prototype.startWalk = function(x,y) {
  this.currentDestX = x;
  this.currentDestY = y;
  if (x > this.pcX) {
    this.lastDirection = 1;
  } else {
    this.lastDirection = -1;
  }
  if (!this.currentMoving) {
    this.walkTowardDest();  
  }    
};

/**
 * Initiate a walk of the PC.
 */
advent.GameArea.prototype.isWalkAt = function(x,y) {
  return (Math.abs(this.pcX - x) + Math.abs(this.pcY - y)) < 10;
};


/**
 * Handle the user completing an action.
 */
advent.GameArea.prototype.handleActionDone = function(action) {
  debugger;
  var act = advent.SceneData.matchAction(this.currentScene_,
      this.globalScene_, action);
  if (act) {
    // Cancel any old script.
    if (this.currentScript_ != null) {
      this.currentScript_.cancel();	  
    }

    this.currentScript_ = act[4];
    this.currentScript_.reset();
    if (act[3] == true) {
      // Find the object in the current scene.
      var actObjectId = (action.getIndirectObjectId() != null) ?
          action.getIndirectObjectId() : action.getDirectObjectId();
      var actObject = advent.SceneData.getActionObject(this.currentScene_,
          actObjectId);
      if (actObject) {
        this.currentScript_.setWalkToObject(actObject[7], actObject[8]);  
      }
    }

    this.currentScript_.start();
  }
};


/**
 * Take a step toward a target.
 */
advent.GameArea.prototype.walkTowardDest = function() {
  var diffX = this.currentDestX - this.pcX;
  var diffY = this.currentDestY - this.pcY;
  var deltaX;
  var deltaY;

  // Determine the about in the X and Y direction
  if (Math.abs(diffX) > Math.abs(diffY)) {
    deltaX = Math.min(10, Math.abs(diffX)) ;
    deltaY = Math.round(deltaX * (Math.abs(diffY) / Math.abs(diffX)));
  } else {
    deltaY = Math.min(10, Math.abs(diffY));
    deltaX = Math.round(deltaY * (Math.abs(diffX) / Math.abs(diffY)));
  }

  // Determine the quadrant of movement
  if (diffX < 0) {
    deltaX = -deltaX;
  }
  if (diffY < 0) {
    deltaY = -deltaY;
  }


  // Check if we can move there
  var newX = this.pcX + deltaX;
  var newY = this.pcY + deltaY;

  // Try to move there.
  if (this.isMoveable(newX, newY)) {
    this.commitMove_(newX, newY);
  } else if (newX != this.pcX && this.isMoveable(newX, this.pcY)) {
    var nX = (deltaX > 0) ? this.pcX + 10 : this.pcX - 10;;
    this.commitMove_(nX, this.pcY);
  } else if (newY != this.pcY && this.isMoveable(this.pcX, newY)) {   
    var nY = (deltaY > 0) ? this.pcY + 10 : this.pcY - 10;;
    this.commitMove_(this.pcX, nY);
  } else {
    if (this.lastDirection < 0) {
      this.pcimage_.src = 'images/chars/kg/kgStandL.png';
    } else {
      this.pcimage_.src = 'images/chars/kg/kgStandR.png';
    }
    this.currentMoving = false;
  }
};


/**
 * Helper to move the character in the given direction.
 */
advent.GameArea.prototype.commitMove_ = function(x, y) {
  this.drawPC(x, y);
  var object = this;
  this.currentMoving = true;
  if (this.lastDirection < 0) {
    this.pcimage_.src = this.pcAnims[1][this.pcAnimsCounter];
  } else {
    this.pcimage_.src = this.pcAnims[0][this.pcAnimsCounter];
  }
  this.pcAnimsCounter++;
  if (this.pcAnimsCounter >= this.pcAnims[0].length) {
    this.pcAnimsCounter -= this.pcAnims[0].length;
  }
  window.setTimeout(function() {
        object.walkTowardDest();
      }, 100);
};

/**
 * Return true if the PC can move to the given position.
 */
advent.GameArea.prototype.isMoveable = function(x, y) {
  if (this.currentScene_) {
    var found = false;
    var yLoc = Math.floor(y / 25);
    var row = this.currentScene_.walkable[yLoc];
    for (var xLoc = 0; xLoc < row.length; xLoc++) {
      var rowPart = row[xLoc];
      if (x > rowPart[0] && x < rowPart[1]) {
	found = true;
        break;
      }
    }
    if (found) {
      return true;
    }
  }
  return false;
};


/**
 * Draw the NPC at the correct position on the screen.
 */
advent.GameArea.prototype.drawPC = function(x, y) {
  // Calculate the offset of the background.
  var screenWidth = 1024;
  var halfScreenWidth = screenWidth / 2;
  var offset = x - halfScreenWidth;
  if (offset < 0) {
    offset = 0;
  }
  if (offset + screenWidth > this.areaWidth) {
    offset = this.areaWidth - screenWidth;
  }

  // Move the pc.
  // TODO(cmprince): Divide by half of the player width.
  this.pc_.style.left = (x - Math.round(55 * this.pcScale)) + 'px';
  this.pc_.style.top = (y - Math.round(185 * this.pcScale)) + 'px';
  this.pcX = x;
  this.pcY = y;

  // Keep the background centered.
  this.area_.style.left = (-offset) + 'px';

  // TODO(cmprince): Make sure talk bubble stays on the screen.

  // TODO(cmprince): Remove. For debugging only.
  //document.title = '[' + x  + ',' + y  + ']';
};
