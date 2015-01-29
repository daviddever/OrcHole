var Game = {
    _display: null,
    _currentScreen: null,
    init: function() {
        // Initialization
        this._diplay = new ROT.Display({width: 80, height: 24});
        // Create a helper function for binding an event and sending to the screen
        var game = this;
        var bindEventToScreen = function(event) {
            window.addEventListener(event, function(e) {
                // When an event is recieved send it to the screen if there is one
                if (game._currentScreen !== null) {
                    // Send the event type and data to the screen
                    game._currentScreen.handleInput(event, e);
                }
            });
        }
        // Dind keyboard input events
        bindEventToScreen('keydown');
        bindEventToScreen('keyup');
        bindEventToScreen('keypress');
    },
    getDisplay: function() {
        return this._display;
    },

    switchScreen: function(screen) {
        // If existing screen, notify it of exit
        if (this._currentScreen !== null) {
            this._currentScreen.exit();
        }
        // Clear the display
        this.getDisplay().clear();
        // Update the current screen, notify it and render it
        this._currentScreen = screen;
        if (!this._currentScreen !== null) {
            this._currentScreen.enter();
            this._currentScreen.render(this._display);
        }
    }
}

window.onload = function() {
    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {
        // Initialize the game
        Game.init();
        // Add the container to the HTML page
        document.body.appendChild(Game.getDisplay().getContainer());
        // Load the start screen
        Game.switchScreen(Game.Screen.startScreen);
    }
}
