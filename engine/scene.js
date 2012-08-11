var advent = advent || {};

/**
 * Class that acts as an index for all the scene data.
 */
advent.SceneData = function(parent) {
  this.game_ = parent;
  this.data = [];
  this.data.push({n: 'global', d: new advent.GlobalScene(this.game_)});
  this.data.push({n: 'town', d: new advent.TownScene(this.game_)});
  this.data.push({n: 'fountain', d: new advent.FountainScene(this.game_)});
  this.data.push({n: 'pantry', d: new advent.PantryScene(this.game_)});
  this.data.push({n: 'hall', d: new advent.HallScene(this.game_)});
  this.data.push({n: 'study', d: new advent.StudyScene(this.game_)});
};


/**
 * Get the scene data given the scene name.
 */
advent.SceneData.prototype.get = function(name) {
  for (var i=0; i < this.data.length; i++) {
    if (this.data[i].n == name) {
      return this.data[i].d;
    }
  }
  return null;
};


advent.SceneData.getActionObject = function(scene, id) {
  for (var i = 0; i < scene.actionObjects.length; i++) {
    if (scene.actionObjects[i][1] == id)
      return scene.actionObjects[i];
  }
  return null;
};

advent.SceneData.matchAction = function(scene, global, action) {
  // Check the scene actions first.
  var actions = scene.actions;
  for (var i = 0; i < actions.length; i++) {
    if (actions[i][0] === action.getVerb()) {
      if ((actions[i][1] instanceof RegExp &&
              actions[i][1].test(action.getDirectObject())) ||
          (actions[i][1] == action.getDirectObject())) {
        if ((actions[i][2] instanceof RegExp &&
                actions[i][2].test(action.getIndirectObject())) ||
            (actions[i][2] == action.getIndirectObject())) {
          return actions[i];
        }
      }
    }
  }

  // Check the global actions next.
  if (global) {
    actions = global.actions;
    for (var j = 0; j < actions.length; j++) {
      if (actions[j][0] === action.getVerb()) {
        if ((actions[j][1] instanceof RegExp &&
                actions[j][1].test(action.getDirectObject())) ||
            (actions[j][1] == action.getDirectObject())) {
          if ((actions[j][2] instanceof RegExp &&
                  actions[j][2].test(action.getIndirectObject())) ||
              (actions[j][2] == action.getIndirectObject())) {
            return actions[j];
          }
        }
      }
    }
  }
  return null;
};


advent.SceneData.setObjectImage = function(scene, id, src) {
  for(var i = 0; i < scene.foregroundObjects.length; i++) {
    var obj = scene.foregroundObjects[i];
    if (obj[1] == id) {
      obj[0] = src;
      return;
    }
  }

  for(var j = 0; j < scene.backgroundObjects.length; j++) {
    var obj = scene.backgroundObjects[j];
    if (obj[1] == id) {
      obj[0] = src;
      return;
    }
  }
};

advent.SceneData.setObjectDimensions = function(scene, id, x, y, w, h) {
  for(var i = 0; i < scene.foregroundObjects.length; i++) {
    var obj = scene.foregroundObjects[i];
    if (obj[1] == id) {
      obj[2] = x;
      obj[3] = y;
      obj[4] = w;
      obj[5] = h;
      return;
    }
  }

  for(var j = 0; j < scene.backgroundObjects.length; j++) {
    var obj = scene.backgroundObjects[j];
    if (obj[1] == id) {
      obj[2] = x;
      obj[3] = y;
      obj[4] = w;
      obj[5] = h;
      return;
    }
  }
};


/*
advent.SceneData.removeBackgroundObject = function(scene, id) {
  var newBackObjects = [];
  for(var i = 0; i < scene.backgroundObjects.length; i++) {
    var obj = scene.backgroundObjects[i];
    if (obj[1] != id) {
      newBackObjects.push(obj);
    }
  }
  scene.backgroundObjects = newBackObjects;
};
*/
advent.SceneData.removeBackgroundObject = function(scene, id) {
  for(var i = 0; i < scene.backgroundObjects.length; i++) {
    var obj = scene.backgroundObjects[i];
    if (obj[1] == id) {
      obj.hidden = true;
    }
  }
};
advent.SceneData.restoreBackgroundObject = function(scene, id) {
  for(var i = 0; i < scene.backgroundObjects.length; i++) {
    var obj = scene.backgroundObjects[i];
    if (obj[1] == id && obj.hidden) {
      obj.hidden = false;
    }
  }
};


/*
advent.SceneData.removeForegroundObject = function(scene, id) {
  var newForeObjects = [];
  for(var i = 0; i < scene.foregroundObjects.length; i++) {
    var obj = scene.foregroundObjects[i];
    if (obj[1] != id) {
      newForeObjects.push(obj);
    }
  }
  scene.foregroundObjects = newForeObjects;
};
*/
advent.SceneData.removeForegroundObject = function(scene, id) {
  for(var i = 0; i < scene.foregroundObjects.length; i++) {
    var obj = scene.foregroundObjects[i];
    if (obj[1] == id) {
      obj.hidden = true;
    }
  }
};
advent.SceneData.restoreForegroundObject = function(scene, id) {
  for(var i = 0; i < scene.foregroundObjects.length; i++) {
    var obj = scene.foregroundObjects[i];
    if (obj[1] == id && obj.hidden) {
      obj.hidden = false;
    }
  }
};

advent.SceneData.moveActionObject = function(scene, id, x, y) {
  for(var i = 0; i < scene.actionObjects.length; i++) {
    var actObject = scene.actionObjects[i];
    if (actObject[1] == id) {
      actObject[2] = x;
      actObject[3] = y;
    }
  }
};

/*
advent.SceneData.removeActionObject = function(scene, id) {
  var newActionObjects = [];
  for(var i = 0; i < scene.actionObjects.length; i++) {
    var actObject = scene.actionObjects[i];
    if (actObject[1] != id) {
      newActionObjects.push(actObject);
    }
  }
  scene.actionObjects = newActionObjects;
};
*/
advent.SceneData.removeActionObject = function(scene, id) {
  for(var i = 0; i < scene.actionObjects.length; i++) {
    var actObject = scene.actionObjects[i];
    if (actObject[1] == id) {
      actObject.hidden = true;
    }
  }
};
advent.SceneData.restoreActionObject = function(scene, id) {
  for(var i = 0; i < scene.actionObjects.length; i++) {
    var actObject = scene.actionObjects[i];
    if (actObject[1] == id && actObject.hidden) {
      actObject.hidden = false;
    }
  }
};
