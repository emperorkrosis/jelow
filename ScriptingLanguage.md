# Introduction #

The scripting language is an op-code based language similar to assembly.

# Details #

## Engine Overview ##

One of the elements of a game scene are one or more scripts that can run in different situations. For example, a script can run whenever the scene is loaded, or whenever objects are used with each other. The scene itself determines when a particular script will run.

## Op Codes ##

This section contains information on each of the op codes that make up the scripting language.

### Summary ###

The following op codes are supported by the language:
  * NOP: Does nothing.
  * TALK: Adds text to the speech bubble of a character.
  * ADD\_ITEM: Add an item to the user's inventory.
  * REMOVE\_ITEM: Remove an item from the user's inventory.
  * WALK: Move a character from one location to another.
  * LOAD: Load a new scene.
  * ADD\_FLAG: Add a non-visible flag to the user.
  * REMOVE\_FLAG: Remove a non-visible flag from the user.
  * REMOVE\_EL: Remove an object from the scene.
  * MOVE\_EL: Move an object in the scene.
  * IF\_FLAG: Conditional don't jump depending on the value of a flag.
  * IF\_NOT\_FLAG: Conditional jump depending on the value of a flag.
  * EXIT: Exit the script, useful for terminating a script early.
  * CHANGE\_IMAGE: Change the image of an object in a scene.
  * FINISH: Finish the game and navigate the user to a new page.

### Commands with Async Side Effects ###

Some commands execute synchronously, but have an asynchronous side effect, for example the WALK command starts the character walking toward a particular destination, but does not wait for the character to reach that destination before continuing.

### Detailed Description ###

**NOP**: This command is a no-op.

### Examples ###