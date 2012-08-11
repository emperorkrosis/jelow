// Copyright 2011 Craig Prince. All Rights Reserved.

var advent = advent || {};

/**
 * Constructor.
 */
advent.CurrentArea = function(parent) {
  this.game_ = parent;
  this.element_ = null;
};


/**
 * Initialize the current action notification area.
 */
advent.CurrentArea.prototype.init = function(el) {
  this.element_ = document.createElement('div');
  this.element_.id = 'currentarea';
  this.element_.innerHTML = 'Use Faucet Handle';
  el.appendChild(this.element_);
  this.setAction_(this.game_.currentAction);
};


/**
 * Takes the current action and displays the notification
 * message for this action.
 */
advent.CurrentArea.prototype.setAction_ = function(action) {
  var object = this;
  this.game_.currentAction.onchange.push(function(action) {
    object.setText_(action.getText());
  });
  this.setText_(this.game_.currentAction.getText());
};

advent.CurrentArea.prototype.setText_ = function(txt) {
  this.element_.innerHTML = txt;
};
