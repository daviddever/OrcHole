// Create mixins namespaces
Game.Mixins = {};

// Define Moveable mixin
Game.Mixins.Moveable = {
    name: 'Moveable',
    tryMove: function(x, y, map) {
        var tile = map.getTile(x, y);
        // Check if we can walk on the tile and if so walk on it
        if (tile.isWalkable()) {
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
    mixins: [Game.Mixins.Moveable]
}

