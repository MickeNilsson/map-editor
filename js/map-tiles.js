function createMapTiles(textures) {

    const mapTiles = {};
    let textureNames = Object.keys(textures.frames);
    


    textureNames.forEach(function(textureName) {
        mapTiles[textureName] = PIXI.Texture.from(textureName);
    });
    return mapTiles;
    // const mapTiles = {
    //     grass: PIXI.Texture.from('grass.png'),
    //     water: PIXI.Texture.from('water.png'),
    //     path: PIXI.Texture.from('path.png')
    // };
}