// Copyright 2011 Craig Prince. All Rights Reserved.

var advent = advent || {};

/**
 * Singleton class representing the entire game.
 * @constructor
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
 * Initialize and start the game. This should construct all DOM elements for
 * the adventure game and activate all appropriate UI elements.
 * @param {!HTMLElement} el The HTML element to act as a container for the
 *     game.
 */
advent.Game.prototype.init = function(el) {
  this.element_ = el;
  this.gameArea.init(el);
  this.currentArea.init(el);
  this.actionArea.init(el);
  this.inventoryArea.init(el);
};
