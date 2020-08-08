function createMapContainer(mapTiles) {

    const mapContainer = new PIXI.Container();

    mapContainer.interactive = true;
    mapContainer.tileWidth = 32;
    mapContainer.tileHeight = 32;
    mapContainer.chosenTileType = 'water.png';

    // Event listeners

    mapContainer.on('pointerdown', function(point) {
        this.pointerDown(point);
    });

    mapContainer.on('pointerup', function() {
        this.pointerUp();
    });

    mapContainer.on('pointermove', function(point) {
        this.pointerMove(point);
    });

    // Public functions

    mapContainer.addTile = function(tile) {
        const sprite = new PIXI.Sprite(mapTiles[tile.type]);
        sprite.x = tile.x;
        sprite.y = tile.y;
        this.addChild(sprite);
    };

    mapContainer.create = function(mapWidth, mapHeight) {
        mapWidth = parseInt(mapWidth);
        mapHeight = parseInt(mapHeight);
        const tile = {type: 'water01.png'};
        this.removeAllChildren();
        for(let y = 0; y < mapHeight; y++) {
            for(let x = 0; x < mapWidth; x++) {
                tile.x = x * this.tileWidth;
                tile.y = y * this.tileHeight;
                this.addTile(tile);
            }
        }
        this.x = 5 * 32;
        this.y = 5 * 32;
        this.mapName = '';
    };

    mapContainer.draw = function(point) {
        const pointCoords = point.data.getLocalPosition(this.parent);
        point.x = pointCoords.x - this.x;
        point.y = pointCoords.y - this.y;
        this.children.forEach((tile) => {
            const rect = {
                x1: tile.x,
                y1: tile.y,
                x2: tile.x + this.tileWidth,
                y2: tile.y + this.tileHeight
            };
            if(isPointInRect(point, rect)) {
                tile.texture = mapTiles[this.chosenTileType];
            }
        });
    };

    mapContainer.load = function(mapName) {
        const self = this;
        const queryParameters = {name: mapName};
        $.ajax({
            data: queryParameters,
            dataType: 'json',
            success: function(response) {
                self.mapName = mapName;
                self.removeAllChildren();
                response.data.map.forEach(function(tile) {
                    self.addTile(tile);
                });
                self.x = 5 * 32; // Set starting position of map
                self.y = 5 * 32;
            },
            error: function() {
                
            },
            type: 'GET',
            url: 'http://digizone.se/map-editor/api/map/'
        });
    };

    mapContainer.pointerDown = function(point) {
        this.dragging = true;
        this.data = point.data;
        this.draw(point);
    };

    mapContainer.pointerMove = function(point) {
        if(this.dragging) {
            this.draw(point);
        }
    };

    mapContainer.pointerUp = function() {
        this.dragging = false;
    };

    mapContainer.removeAllChildren = function() {
        while(this.children[0]) {
            this.removeChild(this.children[0]);
        }
    };

    mapContainer.save = function(mapName) {
        let map = [];
        this.children.forEach((tile) => {
            let type = tile.texture.textureCacheIds[0];
            //type = type.substring(0, type.indexOf('.png'));

            map.push({
                type: type,
                x: tile.x,
                y: tile.y
            });
        });
        const payload = {
            name: mapName,
            map: map
        };
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(payload),
            dataType: 'json',
            success: function(data){
                
            },
            error: function(){
                
            },
            type: 'POST',
            url: 'http://digizone.se/map-editor/api/map/'
        });
    };

    mapContainer.move = function(direction) {

        switch(direction) {
            case 'up':
                this.y -= this.tileHeight;
                break;
            case 'down':
                this.y += this.tileHeight;
                break;
            case 'left':
                this.x -= this.tileWidth;
                break;
            case 'right':
                this.x += this.tileWidth;
                break;
        }
    };

    // Private functions

    function isPointInRect(point, rect) {
        return (point.x > rect.x1 && point.x < rect.x2) &&
                (point.y > rect.y1 && point.y < rect.y2);
    }

    return mapContainer;
}