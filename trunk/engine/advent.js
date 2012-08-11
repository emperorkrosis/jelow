// Copyright 2011 Craig Prince. All Rights Reserved.

var advent = advent || {};

/**
 * Construct the classes for the adventure game.
 */
advent.Game = function() {
  this.currentAction = new advent.Action();
  this.element_ = null;
  this.gameArea = new advent.GameArea(this);
  this.currentArea = new advent.CurrentArea(this);
  this.actionArea = new advent.ActionArea(this);
  this.inventoryArea = new advent.InventoryArea(this);;
  this.scenes = new advent.SceneData(this);
};


/**
 * Construct all the DOM elements for the adventure game.
 */
advent.Game.prototype.init = function(el) {
  this.element_ = el;
  this.gameArea.init(el);
  this.currentArea.init(el);
  this.actionArea.init(el);
  this.inventoryArea.init(el);
};
