## DinoBot
A simple script to automatically play the chrome offline dinosaur dino.

## Controls
- **Space Bar / Up:** Jump (also to start the game)
- **Down:** Duck (pterodactyls appear after 450 points)
- **Alt:** Pause
- The game enters a **black background** mode after every multiple of 700 points for the next 100 points.


## Bot Logic
- The logic here is to look ahead of the dinosaur for obstacles when an obstacle is detected jump.
- If the obstacle is a `bird` then `duck`.
- The dinosaur's current state is tracked by the `eye` position.
- The logic is the dinosaur's eye is in a constant defined position in every state (running, duck).
- Using this we can reliably detect the current state the dinosaur is in. 

## Usage
- Open **chrome://dino** and open developer tools.
- Copy DinoBot script into the console in the browser and hit enter.
- Now start the dino by pressing space bar.
- The dinosaur should now be controlling itself !

## Immortality
- use code in ImmortalDino.js.
- 999,999 is the highest score and it resets after 1 million.
- or you can be immortal by tweaking speed by `Runner.instance_.setSpeed(9000)`.

## Demo

[![Immortality Demo](https://img.youtube.com/vi/4ehEikF9lQ0/0.jpg)](https://www.youtube.com/watch?v=4ehEikF9lQ0)

## Screenshot

![Jumping_Dino](screenshots/jump.png)

![Docking_Dino](screenshots/duck.png)

![First_Death](screenshots/death.png)
