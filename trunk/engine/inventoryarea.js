// Copyright 2011 Craig Prince. All Rights Reserved.

var advent = advent || {};

/**
 * Constructor for the inventory object.
 * @constructor
 */
advent.InventoryArea = function(parent) {
  /**
   * Global context.
   * @type {advent.Game}
   * @private
   */
  this.game_ = parent;

  /**
   * The container for the inventory UI.
   * @type {Element}
   * @private
   */
  this.element_ = null;

  /**
   * Element that contains all the user's items. Will be hidden by the
   * itemAreaElTop_.
   * @type {Element}
   * @private
   */
  this.itemAreaEl_ = null;

  /**
   * The current top location value for the scrollable item area.
   * @type {number}
   * @private
   */
  this.itemAreaElTop_ = 0;

  /**
   * Array containing all the non-visible objects that the character has.
   * This can be used to store state about the world.
   * @type {Array.<string>}
   */
  this.flags_ = [];
};


/**
 * Initialize the inventory building all the appropriate DOM objects.
 * @param {Element} el The parent element to place to inventory area in.
 */
advent.InventoryArea.prototype.init = function(el) {
  this.element_ = document.createElement('div');
  this.element_.id = 'inventoryarea';

  // Create a closure for event handlers.
  var object = this;

  // Add the up and down arrows for scrolling the inventory.
  var upArrow = document.createElement('div');
  upArrow.className = 'uparrow';
  upArrow.onclick = function(e) {
    object.handleUpClick_();
  };
  this.element_.appendChild(upArrow);

  var downArrow = document.createElement('div');
  downArrow.className = 'downarrow';
  downArrow.onclick = function(e) {
    object.handleDownClick_();
  };
  this.element_.appendChild(downArrow);

  // Add the inventory item area elements.
  var itemAreaParentEl = document.createElement('div');
  itemAreaParentEl.className = 'inventorycontainer';

  this.itemAreaEl_ = document.createElement('div');
  this.itemAreaEl_.className = 'inventorylayer';
  itemAreaParentEl.appendChild(this.itemAreaEl_);

  this.element_.appendChild(itemAreaParentEl);

  el.appendChild(this.element_);

  // TODO(cmprince): Remove, only testing adding items to the inventory.
  this.addItemById('crystal');
};


/**
 * Handle scrolling the inventory up when the up arrow graphic is clicked.
 * @private
 */
advent.InventoryArea.prototype.handleUpClick_ = function() {
  this.itemAreaElTop_ += 190;
  if (this.itemAreaElTop_ >= 0) {
    this.itemAreaElTop_ = 0;
  }

  this.itemAreaEl_.style.top = this.itemAreaElTop_ + 'px';
};


/**
 * Handle scrolling the inventory down when the down arrow graphic is clicked.
 * @private
 */
advent.InventoryArea.prototype.handleDownClick_ = function() {
  // Calculate the height based on the fact that 8 inventory objects
  // appear per screen.
  var minHeight = -190 * Math.floor(this.itemAreaEl_.childNodes.length / 8);
  this.itemAreaElTop_ -= 190;
  if (this.itemAreaElTop_ <= minHeight) {
    this.itemAreaElTop_ = minHeight;
  }

  this.itemAreaEl_.style.top = this.itemAreaElTop_ + 'px';
};


/**
 * Add an item to the inventory by adding its image to the list of inventory
 * objects.
 * @param {{id: string, name: string, src: string}} obj Inventory object.
 */
advent.InventoryArea.prototype.addItem = function(obj) {
  var object = this;

  // Create the inventory item div
  var item = document.createElement('div');
  item.draggable = false;
  item.id = obj.id;
  item.className = 'inventoryitem';
  item.style.backgroundImage = 'url(\'' + obj.src + '\')';
  item.style.backgroundColor = 'black';

  // Setup the event handles for the inventory items.
  item.onclick = function(e) {
    object.game_.currentAction.setObject(
        advent.Inventory.getItem(e.target.id).name, e.target.id);
  };
  item.onmouseover = function(e) {
    object.game_.currentAction.setTentativeObject(
        advent.Inventory.getItem(e.target.id).name);
  };
  item.onmouseout =  function(e) {
    object.game_.currentAction.setTentativeObject(null);
  };

  this.itemAreaEl_.appendChild(item);
};


/**
 * Add an inventory item by inventory id in {@code advent.Inventory}.
 * @param {string} id Inventory identifier.
 */
advent.InventoryArea.prototype.addItemById = function(id) {
  this.addItem(advent.Inventory.getItem(id));
};


/**
 * Remove an inventory item by inventory id in {@code advent.Inventory}.
 * @param {string} id Inventory identifier.
 */
advent.InventoryArea.prototype.removeItemById = function(id) {
  for (var i = 0; i < this.itemAreaEl_.childNodes.length; i++) {
    var childNode = this.itemAreaEl_.childNodes[i];
    if (childNode.id == id) {
      this.itemAreaEl_.removeChild(childNode);
      return;
    }
  }
};


/**
 * Check for an inventory item by inventory id in {@code advent.Inventory}.
 * @param {string} id Inventory identifier.
 * @return {boolean} True if the player has the item.
 */
advent.InventoryArea.prototype.hasItemById = function(id) {
  for (var i = 0; i < this.itemAreaEl_.childNodes.length; i++) {
    var childNode = this.itemAreaEl_.childNodes[i];
    if (childNode.id == id) {
      return true;
    }
  }
  return false;
};


/**
 * Add a non-visible inventory flag.
 * @param {string} id .
 * @param {boolean=} opt_allowMultiple Allow the flag to appear multiple times.
 */
advent.InventoryArea.prototype.addFlag = function(id, opt_allowMultiple) {
  if (opt_allowMultiple || !this.hasFlag(id)) {
    this.flags_.push(id);
  }
};


/**
 * Remove a non-visible inventory flag.
 * @param {string} id .
 */
advent.InventoryArea.prototype.removeFlag = function(id) {
  for (var i = 0; i < this.flags_.length; i++) {
    if (this.flags_[i] == id) {
      if (i == this.flags_.length-1) {
        this.flags_.pop();
      } else {
        var item = this.flags_.pop();
        this.flags_[i] = item;
      }
      return;
    }
  }
};


/**
 * Check for a non-visible inventory flag.
 * @param {string} id .
 * @return {boolean} True if the flag exists.
 */
advent.InventoryArea.prototype.hasFlag = function(id) {
  for (var i = 0; i < this.flags_.length; i++) {
    if (this.flags_[i] == id) {
      return true;
    }
  }
  return false;
};
