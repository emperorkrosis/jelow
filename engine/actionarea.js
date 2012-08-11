// Copyright 2011 Craig Prince. All Rights Reserved.

var advent = advent || {};

/**
 * Constructor.
 */
advent.ActionArea = function(parent) {
  this.game_ = parent;
  this.element_ = null;
  this.baseClassNames_ = new Array(9);
  this.buttons_ = new Array(9);
};


/**
 * Initialize the actions panel by creating all the buttons and assigning
 * their event handlers.
 */
advent.ActionArea.prototype.init = function(el) {
  this.element_ = document.createElement('div');
  this.element_.id = 'actionarea';
  var object = this;

  var button = this.createButton_('Give', 'givebutton', true,
      advent.Verb.GIVE);
  button.onclick = function(e) {
    object.handleGiveClick();
  };
  this.element_.appendChild(button);

  button = this.createButton_('Pick Up', 'pickupbutton', false,
      advent.Verb.PICKUP);
  button.onclick = function(e) {
    object.handlePickUpClick();
  };
  this.element_.appendChild(button);

  button = this.createButton_('Use', 'usebutton', true,
      advent.Verb.USE);
  button.onclick = function(e) {
    object.handleUseClick();
  };
  this.element_.appendChild(button);

  button = this.createButton_('Open', 'openbutton', true,
      advent.Verb.OPEN);
  button.onclick = function(e) {
    object.handleOpenClick();
  };
  this.element_.appendChild(button);

  button = this.createButton_('Look At', 'lookbutton', false,
      advent.Verb.LOOKAT);
  button.onclick = function(e) {
    object.handleLookAtClick();
  };
  this.element_.appendChild(button);

  button = this.createButton_('Push', 'pushbutton', true,
      advent.Verb.PUSH);
  button.onclick = function(e) {
    object.handlePushClick();
  };
  this.element_.appendChild(button);

  button = this.createButton_('Close', 'closebutton', true,
      advent.Verb.CLOSE);
  button.onclick = function(e) {
    object.handleCloseClick();
  };
  this.element_.appendChild(button);

  button = this.createButton_('Talk To', 'talkbutton', false,
      advent.Verb.TALKTO);
  button.onclick = function(e) {
    object.handleTalkToClick();
  };
  this.element_.appendChild(button);

  button = this.createButton_('Pull', 'pullbutton', true,
      advent.Verb.PULL);
  button.onclick = function(e) {
    object.handlePullClick();
  };
  this.element_.appendChild(button);

  el.appendChild(this.element_);

  // Listen for changes
  this.game_.currentAction.onchange.push(function(action) {
    object.updateClassNames(action.getVerb());
  });
};


advent.ActionArea.prototype.updateClassNames = function(verb) {
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
 * Helper method for creating an action button.
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
 * Handle the Give action button being clicked.
 */
advent.ActionArea.prototype.handleGiveClick = function() {
  this.game_.currentAction.setVerb(advent.Verb.GIVE);
};


/**
 * Handle the Pick Up action button being clicked.
 */
advent.ActionArea.prototype.handlePickUpClick = function() {
  this.game_.currentAction.setVerb(advent.Verb.PICKUP);
};


/**
 * Handle the Use action button being clicked.
 */
advent.ActionArea.prototype.handleUseClick = function() {
  this.game_.currentAction.setVerb(advent.Verb.USE);
};


/**
 * Handle the Open action button being clicked.
 */
advent.ActionArea.prototype.handleOpenClick = function() {
  this.game_.currentAction.setVerb(advent.Verb.OPEN);
};

/**
 * Handle the Look At action button being clicked.
 */
advent.ActionArea.prototype.handleLookAtClick = function() {
  this.game_.currentAction.setVerb(advent.Verb.LOOKAT);
};


/**
 * Handle the Push action button being clicked.
 */
advent.ActionArea.prototype.handlePushClick = function() {
  this.game_.currentAction.setVerb(advent.Verb.PUSH);
};


/**
 * Handle the Close action button being clicked.
 */
advent.ActionArea.prototype.handleCloseClick = function() {
  this.game_.currentAction.setVerb(advent.Verb.CLOSE);
};


/**
 * Handle the Talk To action button being clicked.
 */
advent.ActionArea.prototype.handleTalkToClick = function() {
  this.game_.currentAction.setVerb(advent.Verb.TALKTO);
};


/**
 * Handle the Pull action button being clicked.
 */
advent.ActionArea.prototype.handlePullClick = function() {
  this.game_.currentAction.setVerb(advent.Verb.PULL);
};
