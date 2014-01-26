// Copyright 2011 Craig Prince. All Rights Reserved.

var advent = advent || {};

/**
 * Wrapper around the interface element that is responsible for displaying
 * the current action.
 * @param {!advent.Game} parent The parent game object.
 * @constructor
 */
advent.CurrentArea = function(parent) {
  /**
   * The main game object, needed for access to the current action.
   * @private {!advent.Game}
   */
  this.game_ = parent;

  /**
   * The HTML element that is managed by this class.
   * @private {HTMLElement}
   */
  this.element_ = null;
};


/**
 * Initialize the current action notification area.
 * @param {HTMLElement} el The parent element to populate with this control.
 */
advent.CurrentArea.prototype.init = function(el) {
  // Create the main element for the control and add it to the parent UI.
  this.element_ = document.createElement('div');
  this.element_.id = 'currentarea';
  this.element_.innerHTML = this.game_.currentAction.getText();
  el.appendChild(this.element_);

  // Listen for changes to the current action in order to update the display.
  var object = this;
  this.game_.currentAction.onchange.push(function(action) {
    object.element_.innerHTML = action.getText();
  });
};
