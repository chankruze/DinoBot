
/*
 * Logic:
 *
 * Store the original game over function in a variable.Then make the game over function empty. (hehe !)
 * To stop we can revert to original game over function.
 *
 */
 // Store original game over or this will be infinite !
var original = Runner.prototype.gameOver
// Make game over function empty 
Runner.prototype.gameOver = function(){}
// To stop
Runner.prototype.gameOver = original