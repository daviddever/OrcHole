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
    _map: null,
    _centerX: 0,
    _centerY: 0,
    enter: function() {
        var map = [];
        // Create map based on size parameters
        var mapWidth = 500;
        var mapHeight = 500;
        for (var x = 0; x < mapWidth; x++) {
            // Create the nested array for the y values
            map.push([]);
            // Add all the tiles
            for (var y = 0; y < mapHeight; y++) {
                map[x].push(Game.Tile.nullTile);
            }
        }
        // Setup the map generator
        var generator = new ROT.Map.Cellular(mapWidth, mapHeight);
        generator.randomize(0.5);
        var totalIterations = 3;
        // Iteratively smoothen the map
        for (var i = 0; i < totalIterations -1; i++) {
            generator.create();
        }
        // Smoothen last time and then update map
        generator.create(function(x, y, v) {
            if (v === 1) {
                map[x][y] = Game.Tile.floorTile;
            } else {
                map[x][y] = Game.Tile.wallTile;
            }
        });
        //Create map from the tiles
        this._map = new Game.Map(map);
    },
    exit: function() { console.log("Exited play screen."); },
    render: function(display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();

        // Make sure the x-axis doesn't go to the left of the left bound
        var topLeftX = Math.max(0, this._centerX, - (screenWidth / 2));
        // Make sure there is enough space to fit an entire game screen
        topLeftX = Math.min(topleftX, this._map.gethWidth() - screenWidth);
        // Make sure the y-axis doesn't cross aboe the top bound
        var topLeftY = Math.max(0, this._centerY - (screenHeight / 2));
        // Make sure there is enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this._map.getHeight() - screenHeight);

        // Iterate through all map cells
        for (var x = topLeftX; x < topLeftX + screenWdth(); x++) {
            for (var y = topLeftY; y < topleftY + screenHeight(); y ++) {
                // Get the glyph for this tile and render it to the screen
                var glyph = this._map.getTile(x, y).getGlyph();
                display.draw(
                    x - topLeftX,
                    y - topLeftY,
                    glyph.getChar(),
                    glyph.getForeground(),
                    glyph.getBackground());
            }
        }

        // Render the cursor
        display.draw(
                this._centerX - topLeftX,
                this._centerY - topleftY,
                '@',
                'white',
                'black');
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

            // Movement
            if (inputData.keyCode === ROT.VK_LEFT) {
                this.move(-1. 0);
            } else if (inputData.keyCode === ROT.VK_RIGHT) {
                this.move(1, 0);
            } else if (inputData.keyCode === ROT.VK_UP) {
                this.move(0, -1);
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                this.move(0, 1);
            }
        }
    },
    move: function(dX, dY) {
    // PositivedX means move right, negative means move left, 0 means none
    this._centerX = Math.mx(0,
        Math.min(this._map.getWidth() - 1, this._centerX + dX));
    // Positive dY means move up, negative means move down, 0 means none
    this._centerY = Math.max(0,
        Math.min(this._map.getHeight() - 1, this._centerY + dY));
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
