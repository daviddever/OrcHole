// Create mixins namespaces
Game.Mixins = {};

// Define Moveable mixin
Game.Mixins.Moveable = {
    name: 'Moveable',
    tryMove: function(x, y, map) {
        var tile = map.getTile(x, y);
        var target = map.getEntityAt(x, y);
        // If an entity was present at the tile, cannot move there
        if (target) {
            return false;
        // Check if we can walk on the tile and if so walk on it
        } else if (tile.isWalkable()) {
            // Update the enitity's position
            this._x = x;
            this._y = y;
            return true;
        // Check if the tile is diggable, and if so try to dig out
        } else if (tile.isDiggable()) {
            map.dig(x, y);
            return true;
        }
        return false;
    }
}

// Player template
Game.PlayerTemplate = {
    character: '@',
    foreground: 'white',
    background: 'black',
    mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor]
}

// Main player's actor mixin
Game.Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function() {
        // Rerender the screen
        Game.refresh();
        // Lock the engine and wait asynchronously for the player
        // to press a key
        this.getMap().getEngine.lock();
    }
}

Game.FungusActor = {
    name: 'FungusActor',
    groupName: 'Actor',
    act: function() { }
}

Game.FungusTemplate = {
    character: '#',
    foreground: 'green',
    mixins: [Game.Mixins.FungusActor]
}
