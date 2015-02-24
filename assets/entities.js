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
            if (this.hasMixin('Attacker')) {
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
        // Clear the message queue
        this.clearMessages();
    }
}

Game.Mixins.MessageRecipient = {
    name: 'MessageRecipient',
    init: function(template) {
        this._messages = [];
    },
    receiveMessage: function(message) {
        this._messages.push(message);
    },
    getMessages: function() {
        return this._messages;
    },
    clearMessages: function() {
        this._messages = [];
    }
}

Game.sendMessageNearby = function(map, centerX, centerY, message, args) {
    // If args were passed, then format the message, else
    // no formatting is neccesary
    if (args) {
        message = vsprintf(message, args);
    }
    // Get the nearby entities
    entities = map.getEntitiesWithinRadius(centerX, centerY, 5);
    // Iterate through the nearby entities, sending the message if
    // they can recieve it
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].hasMixin(Game.Mixins.MessageRecipient)) {
            entities[i].receiveMessage(message);
        }
    }
}


Game.Mixins.FungusActor = {
    name: 'FungusActor',
    groupName: 'Actor',
    init: function() {
        this._growthsRemaining = 5;
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

                        // Send a message nearby
                        Game.sendMessageNearby(this.getMap(),
                                entity.getX(), entity.getY(),
                                'The fungus is spreading!');
                    }
                }
            }
        }
    }
}


Game.Mixins.Attacker = {
    name: 'Attacker',
    groupName: 'Attacker',
    init: function(template) {
        this._attackValue = template['attackValue'] || 1;
    },
    getAttackValue: function() {
        return this._attackValue;
    },
    attack: function(target) {
        // If the target is destructible calculate the damage based on the attack
        // and defense value
        if (target.hasMixin('Destructible')) {
            var attack = this.getAttackValue();
            var defense = target.getDefenseValue();
            var max = Math.max(0, attack - defense);
            var damage = 1 + Math.floor(Math.random() * max);

            Game.sendMessage(this, 'You strike the %s for %d damage!',
                    [target.getName(), damage]);
            Game.sendMessage(target, 'The %s strikes you for %d damage!',
                    [this.getName(), damage]);

            target.takeDamage(this, damage);
        }
    }
}

Game.Mixins.Destructible = {
    name: 'Destructible',
    init: function(template) {
        this._maxHp = template['maxHp'] || 10;
        // Take in health from template in case the entity starts with a different
        // amount of HP than the max specified
        this._hp = template['hp'] || this._maxHp;
        this._defenseValue = template['defenseValue'] || 0;

    },
    getDefenseValue: function() {
        return this._defenseValue;
    },
    getHp: function() {
        return this._hp;
    },
    getMaxHp: function() {
        return this._maxHp;
    },
    takeDamage: function(attacker, damage) {
        this._hp -= damage;
        // If 0 or less HP, then remove from map
        if (this._hp <= 0) {
            Game.sendMessage(attacker, 'You kill the %s!', [this.getName()]);
            Game.sendMessage(this, 'You die!');
            this.getMap().removeEntity(this);
        }
    }
}

Game.sendMessage = function(recipient, message, args) {
    // Make sure the recipient can recieve the message before doing anything
    if (recipient.hasMixin(Game.Mixins.MessageRecipient)) {
        // If args were passed, then format the message
        // else no is neccesary
        if (args) {
            message = vsprintf(message, args);
        }
        recipient.receiveMessage(message);
    }
}

// Player template
Game.PlayerTemplate = {
    character: '@',
    foreground: 'white',
    background: 'black',
    maxHp: 40,
    attackValue: 10,
    mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor,
             Game.Mixins.Attacker, Game.Mixins.Destructible,
             Game.Mixins.MessageRecipient]
}

// Fungus template
Game.FungusTemplate = {
    name: 'fungus',
    character: 'F',
    foreground: 'green',
    maxHp: 10,
    mixins: [Game.Mixins.FungusActor, Game.Mixins.Destructible]
}

