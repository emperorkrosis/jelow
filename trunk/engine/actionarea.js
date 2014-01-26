// Copyright 2011 Craig Prince. All Rights Reserved.

var advent = advent || {};

/**
 * Wrapper around the interface element that is responsible for allowing the
 * user to select actions in the interface.
 * @param {!advent.Game} parent The parent game object.
 * @constructor
 */
advent.ActionArea = function(parent) {
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

  /**
   * Array containing the base class names for each of the child buttons.
   * @private {!Array.<string>}
   */
  this.baseClassNames_ = new Array(9);

  /**
   * Array of the button elements for each child button.
   * @private {!Array.<HTMLElement>}
   */
  this.buttons_ = new Array(9);
};


/**
 * Initialize the actions panel by creating all the buttons and assigning
 * their event handlers.
 * @param {HTMLElement} el The parent element to populate with this control.
 */
advent.ActionArea.prototype.init = function(el) {
  // Create the main element for this control.
  this.element_ = document.createElement('div');
  this.element_.id = 'actionarea';
  var object = this;
  // TODO: This should eventually be passed in.
  var buttonParams = [
      ['Give', 'givebutton', true, advent.Verb.GIVE],
      ['Pick Up', 'pickupbutton', false, advent.Verb.PICKUP],
      ['Use', 'usebutton', true, advent.Verb.USE],
      ['Open', 'openbutton', true, advent.Verb.OPEN],
      ['Look At', 'lookatbutton', false, advent.Verb.LOOKAT],
      ['Push', 'pushbutton', true, advent.Verb.PUSH],
      ['Close', 'closebutton', true, advent.Verb.CLOSE],
      ['Talk To', 'talkbutton', false, advent.Verb.TALKTO],
      ['Pull', 'pullbutton', true, advent.Verb.PULL]
    ];

  // Add all the buttons to the control.
  for (var i = 0; i < buttonParams.length; i++) {
    var p = buttonParams[i];
    var button = this.createButton_(p[0], p[1], p[2], p[3]);
    button.onclick = function(e) {
      object.handleClick_(p[3]);
    };
    this.element_.appendChild(button);
  }

  // Add this control to the main UI.
  el.appendChild(this.element_);

  // Listen for changes to the current action in order to update button
  // highlighting.
  this.game_.currentAction.onchange.push(function(action) {
    object.updateHighlighting(action.getVerb());
  });
};


/**
 * Given a verb, update the button highlighting so that the given verb is
 * lighlighted.
 * @param {advent.Verb} verb The current verb whose button should be
 *     highlighted.
 */
advent.ActionArea.prototype.updateHighlighting = function(verb) {
  for(var i = 0; i < this.buttons_.length; i++) {
    if (i == verb) {
      this.buttons_[i].className = this.baseClassNames_[i] + ' active-button'; 
    } else {
      if (this.buttons_[i].className != this.baseClassNames_[i]) {
        this.buttons_[i].className = this.baseClassNames_[i];
      }
    }
  }
};


/**
 * Helper method for creating an action button in the DOM.
 * @param {string} name Textual name.
 * @param {string} className Component of the class name specific to this
 *     button.
 * @param {boolean} narrow Whether or not the button is narrow.
 * @param {number} index The index of the button.
 * @returns {HTMLElement} The create button element.
 * @private
 */
advent.ActionArea.prototype.createButton_ = function(name, className, narrow,
    index) {
  var button = document.createElement('div');
  button.innerHTML = name;
  button.className = 'button-' + ((narrow) ? 'narrow' : 'wide') + ' ' +
      className;
  this.buttons_[index] = button;
  this.baseClassNames_[index] = button.className;
  return button;
};


/**
 * Handle an action button being clicked.
 * @param {advent.Verb} verb The verb to set.
 * @private
 */
advent.ActionArea.prototype.handleClick_ = function(verb) {
  this.game_.currentAction.setVerb(verb);
};
