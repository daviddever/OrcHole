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
            // If an attacker, try to attack the target
            if (this.haxMixin('Attacker')) {
                this.attack(target);
                return true;
            } else {
                // If not, cannot move on to the tiel
                return false;
            }
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

// Main player's actor mixin
Game.Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function() {
        // Rerender the screen
        Game.refresh();
        // Lock the engine and wait asynchronously for the player
        // to press a key
        this.getMap().getEngine().lock();
    }
}

Game.Mixins.FungusActor = {
    name: 'FungusActor',
    groupName: 'Actor',
    init: function() {
        this._growthsRemainging = 5;
    },
    act: function() {
        // Check if the fungus can grow this turn
        if (this._growthsRemaining > 0) {
            if (Math.random() <= 0.02) {
                // Generate the coordinates of a random adjacent square
                // by generating an offset between [-1, 0, 1] for a both the x and
                // y diretions. By generating a number from 0-2 and then subtracting 1
                var xOffset = Math.floor(Math.random() * 3) - 1;
                var yOffset = Math.floor(Math.random() * 3) - 1;
                // Make sure not trying to spawn on original tile
                if (xOffset != 0 || yOffset != 0) {
                    // Check if fuguns can actually spawn at thelocation
                    // and if so, grow
                    if (this.getMap().isEmptyFloor(this.getX() + xOffset,
                                                   this.getY() + yOffset)) {
                        var entity = new Game.Entity(Game.FungusTemplate);
                        entity.setX(this.getX() + xOffset);
                        entity.setY(this.getY() + yOffset);
                        this.getMap().addEntity(entity);
                        this._growthsRemaining--;
                    }
                }
            }
        }
    }
}


Game.Mixins.SimpleAttacker = {
    name: 'SimpleAttacker',
    groupName: 'Attacker',
    attack: function(target) {
        // Only remove the entity if they were attackable
        if (target.hasMixin('Destructible')) {
            target.takeDamage(this, 1);
        }
    }
}


Game.Mixins.Destructible = {
    name: 'Destructible',
    init: function() {
        this._hp = 1;
    },
    takeDamage: function(attacker, damage) {
        this._hp -= damage;
        // If 0 or less HP, then remove from map
        if (this._hp <= 0) {
            this.getMap().removeEntity(this);
        }
    }
}

// Player template
Game.PlayerTemplate = {
    character: '@',
    foreground: 'white',
    background: 'black',
    mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor,
             Game.Mixins.SimpleAttacker, Game.Mixins.Destructible]
}

// Fungus template
Game.FungusTemplate = {
    character: 'F',
    foreground: 'green',
    mixins: [Game.Mixins.FungusActor, Game.Mixins.Destructible]
}

