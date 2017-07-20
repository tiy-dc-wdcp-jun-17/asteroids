(function gameSetup() {
  "use strict";

  let shipElem = document.getElementById("ship");

  // Create your "ship" object and any other variables you might need...
  const ship = {
    el: shipElem,
    velocity: 0,
    position: {
      top: window.innerHeight / 2,
      left: window.innerWidth / 2
    },
    angle: 0
  };

  let allAsteroids = [];
  shipElem.addEventListener("asteroidDetected", function(event) {
    allAsteroids.push(event.detail);
    // You can detect when a new asteroid appears with this event.
    // The new asteroid's HTML element will be in:  event.detail
    // What might you need/want to do in here?
  });

  /**
     * Use this function to handle when a key is pressed. Which key? Use the
     * event.keyCode property to know:
     *
     * 37 = left
     * 38 = up
     * 39 = right
     * 40 = down
     *
     * @param  {Event} event   The "keyup" event object with a bunch of data in it
     * @return {void}          In other words, no need to return anything
     */
  function handleKeys(event) {
    switch (event.keyCode) {
      case 37:
        ship.angle -= 10;
        break;
      case 39:
        ship.angle += 10;
        break;
      case 38:
        ship.velocity += 2;
        break;
      case 40:
        ship.velocity -= 2;
        break;
    }

    console.log("ship", ship);
  }
  document.querySelector("body").addEventListener("keyup", handleKeys);

  /**
     * This is the primary "game loop"... in traditional game development, things
     * happen in a loop like this. This function will execute every 20 milliseconds
     * in order to do various things. For example, this is when all game entities
     * (ships, etc) should be moved, and also when things like hit detection happen.
     *
     * @return {void}
     */
  function gameLoop() {
    // This function for getting ship movement is given to you (at the bottom).
    // NOTE: you will need to change these arguments to match your ship object!
    // What does this function return? What will be in the `move` variable?
    // Read the documentation!

    updateShipPosition();

    ship.el.style.top = `${ship.position.top}px`;
    ship.el.style.left = `${ship.position.left}px`;
    ship.el.style.transform = `rotate(${ship.angle}deg)`;

    // Time to check for any collisions (see below)...
    checkForCollisions();
  }

  /**
     * This function checks for any collisions between asteroids and the ship.
     * If a collision is detected, the crash method should be called with the
     * asteroid that was hit:
     *    crash(someAsteroidElement);
     *
     * You can get the bounding box of an element using:
     *    someElement.getBoundingClientRect();
     *
     * A bounding box is an object with top, left, width, and height properties
     * that you can use to detect whether one box is on top of another.
     *
     * @return {void}
     */
  function checkForCollisions() {
    let shipBounding = ship.el.getBoundingClientRect();
    allAsteroids.forEach(function(asteroid) {
      let asteroidBoundingBox = asteroid.getBoundingClientRect();
      
      let overlap = !(
        shipBounding.right < asteroidBoundingBox.left ||
        shipBounding.left > asteroidBoundingBox.right ||
        shipBounding.bottom < asteroidBoundingBox.top ||
        shipBounding.top > asteroidBoundingBox.bottom
      );

      if (overlap) {
        crash(asteroid);
      }
    });
  }

  function updateShipPosition() {
    let move = getShipMovement(ship.velocity, ship.angle);
    let bottomEdge = window.innerHeight;
    let rightEdge = window.innerWidth;

    if (ship.position.left > rightEdge) {
      ship.position.left = 0;
    } else {
      ship.position.left += move.left;
    }

    if (ship.position.top > bottomEdge) {
      ship.position.top = 0;
    } else {
      ship.position.top += move.top;
    }

    if (ship.position.left < 0) {
      ship.position.left = rightEdge;
    } else {
      ship.position.left += move.left;
    }

    if (ship.position.top < 0) {
      ship.position.top = bottomEdge;
    } else {
      ship.position.top += move.top;
    }
  }

  /**
     * This event handler will execute when a crash occurs
     *
     * @return {void}
     */
  document.querySelector("main").addEventListener("crash", function() {
    console.log("A crash occurred!");
    clearInterval(loopHandle)
    // What might you need/want to do in here?
  });

  /** ************************************************************************
     *             These functions and code are given to you.
     *
     *                   !!! DO NOT EDIT BELOW HERE !!!
     ** ************************************************************************/

  let loopHandle = setInterval(gameLoop, 20);

  /**
      * Executes the code required when a crash has occurred. You should call
      * this function when a collision has been detected with the asteroid that
      * was hit as the only argument.
      *
      * @param  {HTMLElement} asteroidHit The HTML element of the hit asteroid
      * @return {void}
      */
  function crash(asteroidHit) {
    document.querySelector("body").removeEventListener("keyup", handleKeys);
    asteroidHit.classList.add("hit");
    document.querySelector("#ship").classList.add("crash");

    let event = new CustomEvent("crash", { detail: asteroidHit });
    document.querySelector("main").dispatchEvent(event);
  }

  /**
     * Get the change in ship position (movement) given the current velocity
     * and angle the ship is pointing.
     *
     * @param  {Number} velocity The current speed of the ship (no units)
     * @param  {Number} angle    The angle the ship is pointing (no units)
     * @return {Object}          The amount to move the ship by with regard to left and top position (object with two properties)
     */
  function getShipMovement(velocity, angle) {
    return {
      left: velocity * Math.sin(angle * Math.PI / 180),
      top: velocity * Math.cos(angle * Math.PI / 180)
    };
  }
})();
