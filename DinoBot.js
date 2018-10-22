
let dino = (function(document) {
    'use strict';

    let canvas = document.getElementsByClassName('runner-canvas')[0];
    let ctx = canvas.getContext('2d');

    // constants
    let data = {
        // pixels
        blankPixel: {r: 0, g: 0, b: 0, a: 0},
        blackPixel: {r: 83, g: 83, b: 83, a: 255},
        dinoEyeColor: {r: 255, g: 255, b: 255, a: 255},

        // moves
        mJump: 'M_JUMP',
        mDuck: 'M_DUCK',
        mSpace: 'M_SPACE',

        // states
        stateAirbone: 'S_AIRBONE',
        stateGround: 'S_GROUND',
        stateDuck: 'S_DUCK',

        // dimensions
        width: canvas.width,
        height: canvas.height,

        // reference positions
        groundY: 131,
        dinoEndX: 70,

        // position of dino eye in running state
        dinoEyeX: 50,
        dinoEyeY: 99,

        // position of dino eye in duck state
        dinoDuckEyeX: 68,
        dinoDuckEyeY: 116,

        // position to look for birds in
        midBirdX: 75 + 5,
        midBirdY: 98 - 10,

        // interval between bot function runs
        runIntervalMs: 50,

        // look ahead configurations
        lookAheadX: 70 + 5,
        lookAheadY: 131 - 10,

        lookDownWidth: 60,
        lookDownStartX: 10,
        lookDownStartY: 131 - 10,

        midBirdLookAhead: 50,
    };

    // dino logic
    let runIntervalId = -1;
    let currentDinoState = data.stateGround;
    let stateCommanded = false;
    let oldDinoState = data.stateGround;
    let currentTime = 0;
    let currentLookAheadBuffer;
    let currentBirdLookAheadBuffer;
    function run() {
        let i;

        if (runIntervalId == -1) {
            runIntervalId = setInterval(run, data.runIntervalMs);
        }

        currentLookAheadBuffer = getLookAheadBuffer(currentTime);
        currentBirdLookAheadBuffer = getLookAheadBufferBird(currentTime);

        let imageData = ctx.getImageData(0, 0, data.width, data.height);

        let eyePixel = getPixel(imageData, data.dinoEyeX, data.dinoEyeY);
        let eyePixelDuck = getPixel(imageData, data.dinoDuckEyeX, data.dinoDuckEyeY);
        if (isPixelEqual(eyePixel, data.dinoEyeColor)) {
            currentDinoState = data.stateGround;
        } else if (isPixelEqual(eyePixelDuck, data.dinoEyeColor)) {
            currentDinoState = data.stateDuck;
        } else {
            currentDinoState = data.stateAirbone;
        }

        let lookforwardDanger = false;
        for (i = 0; i < currentLookAheadBuffer; i += 2) {
            if (isPixelEqual(getPixel(imageData, data.lookAheadX + i, data.lookAheadY), data.blackPixel)) {
                lookforwardDanger = true;
                break;
            }
        }

        if (currentDinoState === data.stateGround) {
            // if dino on ground, scan ahead to see if there are obstacles. If there are
            // jump

            if (lookforwardDanger && !stateCommanded) {
                issueMove(data.mJump);
                stateCommanded = true;
                console.log('JUMP!');

            } else {
                // watch for birds in mid level
                let birdDanger = false;
                for (i = data.midBirdX; i < data.midBirdX + currentBirdLookAheadBuffer; i += 2) {
                    if (isPixelEqual(getPixel(imageData, i, data.midBirdY), data.blackPixel)) {
                        birdDanger = true;
                        break;
                    }
                }

                if (birdDanger) {
                    issueMove(data.mDuck, 400);
                    console.log('DUCK!');
                }
            }

        }
        // when in air and the dino crosses the obstacle press down
        // to goto ground faster. This could be an improvement if tuned
        // properly. Removed as of now.
        // else if (currentDinoState === data.stateAirbone) {
        //     let downClear = true;
        //     for (i = 0; i < data.lookDownWidth; i++) {
        //         if (!isPixelEqual(getPixel(imageData, data.lookDownStartX + i, data.lookDownStartY), data.blankPixel)) {
        //             downClear = false;
        //         }
        //     }
        //
        //     if (!lookforwardDanger && downClear && !stateCommanded) {
        //         console.log('DOWN!');
        //         stateCommanded = true;
        //         issueMove(data.mDuck);
        //     }
        // }

        if (oldDinoState !== currentDinoState) {
            stateCommanded = false;
        }

        oldDinoState = currentDinoState;
        currentTime += data.runIntervalMs;

        console.log({
            currentDinoState: currentDinoState,
            lookForwardDanger: lookforwardDanger,
            birdDanger: birdDanger,
            // downClear: downClear,
            stateCommanded: stateCommanded,
            currentTime: currentTime,
            lookAheadBuffer: currentLookAheadBuffer,
            birdLookAhead: currentBirdLookAheadBuffer,
        });
    }

    /**
     * Given a move and an optional timeout, execute the
     * move by issuing required keystrokes
     *
     * @param move the state to move to from Constants
     * @param timeout optional value for how long to keep the button pressed
     */
    function issueMove(move, timeout) {
        switch (move) {
            case data.mJump:
                if (!timeout) {
                    timeout = 85;
                }

                issueKeyPress('keydown', 38);
                setTimeout(function() {
                    issueKeyPress('keyup', 38);
                }, timeout);
                break;

            case data.mDuck:
                if (!timeout) {
                    timeout = 200;
                }

                issueKeyPress('keydown', 40);
                setTimeout(function() {
                    issueKeyPress('keyup', 40);
                }, timeout);
                break;

            default:
                console.log('Invalid move ' + move);
        }
    }

    /**
     * Given the current time return the distance to look
     * ahead for. This changes with time as the dino goes
     * faster it helps to look further. As you've to jump
     * earlier to cross obstacles.
     *
     * @param time the current in dino time
     * @return number of look ahead pixels
     */
    function getLookAheadBuffer(time) {
        if (time < 40000) {
            return 62;

        } else if (time < 60000) {
            return 92;

        } else if (time < 70000) {
            return 110;

        } else if (time < 85000) {
            return 120;

        } else if (time < 100000) {
            return 135;

        } else if (time < 115000) {
            return 150;

        } else if (time < 140000) {
            return 180;

        } else if (time < 170000) {
            return 190;
        }

        return 190;
    }

    /**
     * Given the current dino time return the look ahead
     * pixels for birds
     * 
     * @param time current in dino time
     * @return number of pixels to look ahead for birds
     */
    function getLookAheadBufferBird(time) {
        if (time < 50000) {
            return 50;
        }

        return 70;
    }

    /**
     * Helper which given an event type and a key code
     * dispatches this event
     */
    function issueKeyPress(type, keycode) {
        let eventObj = document.createEventObject ?
            document.createEventObject() : document.createEvent("Events");

        if(eventObj.initEvent){
            eventObj.initEvent(type, true, true);
        }

        eventObj.keyCode = keycode;
        eventObj.which = keycode;

        document.dispatchEvent ? document.dispatchEvent(eventObj) : el.fireEvent("onkeydown", eventObj);

    }

    /**
     * Given an image data array from a canvas and an x and y
     * position, return an object representing the pixel 
     * at the given point. The x and y values must be 
     * within bounds
     */
    function getPixel(imgData, x, y) {
        let dataStart = (x + y * data.width) * 4;

        return {
            r: imgData.data[dataStart],
            g: imgData.data[dataStart + 1],
            b: imgData.data[dataStart + 2],
            a: imgData.data[dataStart + 3]
        };
    }

    /**
     * Given two standard pixel objects check for their
     * equality
     */
    function isPixelEqual(p1, p2) {
        return  p1.r === p2.r &&
                p1.g === p2.g &&
                p1.b === p2.b &&
                p1.a === p2.a;
    }

    // exports
    return {
        run: run
    };

})(document)


dino.run();
