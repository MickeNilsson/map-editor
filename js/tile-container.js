function createTileContainer(mapTiles, mapContainer) {
    const tileContainer = new PIXI.Container();
    tileContainer.addTile = addTile;
    tileContainer.interactive = true;
    let x = 0;
    let y = 0;
    for(const tile in mapTiles) {
        let mapTile = mapTiles[tile];
        mapTile.x = x;
        mapTile.y = y;
        mapTile.type = tile;
        tileContainer.addTile(mapTile);
        x += 34;
        if(x > 750) {
            x = 0;
            y += 34;
        }
    }

    return tileContainer;

    function addTile(mapTile) {
        const sprite = new PIXI.Sprite(mapTile);
        sprite.x = mapTile.x;
        sprite.y = mapTile.y;
        sprite.tileType = mapTile.type;
        sprite.interactive = true;
        sprite.on('pointerdown', function(e) {
            mapContainer.chosenTileType = this.tileType;
        });
        this.addChild(sprite);
    };
}