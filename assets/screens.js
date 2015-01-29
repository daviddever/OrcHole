Game.Screen = {};

// Define intial start screen
Game.Screen.startScreen = {
    enter: function() { console.log("Entered start screen."); },
    exit: function() { console.log("Exited start screen."); },
    render: function(display) {
        // Render prompt to the screen
        display.drawText(1, 1, "%c{yellow}Orc Hole");
        display.drawText(1, 2, "Press [Enter] to start.");
    },
    handleInput: function(inputType, inputData) {
        // When Enter is pressed, go to the play screen
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.playScreen);
            }
        }
    }
}

// Define play screen
Game.Screen.playScreen = {
    enter: function() { console.log("Entered play screen."); },
    exit: function() { console.log("Exited play screen."); },
    render: function(display) {
        display.drawText(3, 5, "%c(red)%b(white)Orcs are in the hole!");
        display.drawText(4, 6, "Press [Enter] to clean out the Orcs or [Esc] to leave them alone");
    },
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            // If Enter go to win screen
            // If Escape is pressed go to lose screen
            if (inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.winScreen);
            } else if (inputData.keyCode === ROT.VK_ESCAPE) {
                Game.switchScreen(Game.Screen.loseScreen);
            }
        }
    }
}

// Define winning screen
Game.Screen.winScreen = {
    enter: function() { console.log("Entered win screen."); },
    exit: function() { console.log("Exited win screen."); },
    render: function(display) {
        // Render our promot to the screen
        for (var i = 0; i < 22; i++) {
            // Generate random background colors
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
            var background = ROT.Color.toRGB([r, g, b]);
            display.drawText(2, i + 1, "%b{" + background + "}You won!");
        }
    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here
    }
}

// Define our losing screen
Game.Screen.loseScreen = {
    enter: function() {    console.log("Entered lose screen."); },
    exit: function() { console.log("Exited lose screen."); },
    render: function(display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            display.drawText(2, i + 1, "%b{red}You lose! :(");
        }
    },
    handleInput: function(inputType, inputData) {
            // Nothing to do here
    }
}
