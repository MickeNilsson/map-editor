$(document).ready(function() {
    
    let mapTiles,
        mapContainer,
        tileContainer,
        app = new PIXI.Application({
            x: 100,
            y: 100,
            width: 800,
            height: 600,
            backgroundColor: 0xccc,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            legacy: true
        });
    app.stage.x = 100;
    app.view.x = 100;
    app.stop();   
    document.body.appendChild(app.view);

    $.get('./assets/graphics/textureatlas.json').then(function(textures) {
        app.loader
            .add('terrain', './assets/graphics/textureatlas.json')
            .load(function() {
                mapTiles = createMapTiles(textures);
                mapContainer = createMapContainer(mapTiles);
                tileContainer = createTileContainer(mapTiles, mapContainer);
                app.stage.addChild(tileContainer);
                app.stage.addChild(mapContainer);
                addEventListeners();
                app.start();
            });
    });

    function addEventListeners() {
        const CURSORKEY_UP = 38,
              CURSORKEY_DOWN = 40,
              CURSORKEY_LEFT = 37,
              CURSORKEY_RIGHT = 39,
              CKEY = 67,
              ENTERKEY = 13,
              SKEY = 83,
              LKEY = 76
              TKEY = 84;
        
        window.addEventListener('keydown', function(e) {
            if($('#save-map-modal').is(':visible') ||
                $('#load-map-modal').is(':visible') ||
                $('#create-map-modal').is(':visible')) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            const key = e.keyCode || e.which;
            console.log(key);
            switch(key) {
                case CURSORKEY_UP:
                    mapContainer.move('up');
                    break;
                case CURSORKEY_DOWN:
                    mapContainer.move('down');
                    break;
                case CURSORKEY_LEFT:
                    mapContainer.move('left');
                    break;
                case CURSORKEY_RIGHT:
                    mapContainer.move('right');
                    break;
                case CKEY: // Show "Create map" modal
                    $('#create-map-modal .map-width').val(1);
                    $('#create-map-modal .map-height').val(1);
                    $('#create-map-modal').modal();
                    break;
                case LKEY: // Show "Load map" modal
                    $('#load-map-modal .map-name').val('');
                    $('#load-map-modal').modal();
                    break;
                case SKEY: // Show "Save map" modal
                    $('#save-map-modal .map-name').val(mapContainer.mapName || '');
                    $('#save-map-modal').modal();
                    break;
                case TKEY:
                    $('#load-textureatlas-modal').modal();
            }
        });

        // Load saved map from database when user presses the ENTER key in the Load Map modal
        $('#load-map-modal .map-name').on('keydown', function(e) {
            const key = e.keyCode || e.which;
            if(key === ENTERKEY) {
                e.preventDefault();
                e.stopPropagation();
                const mapName = $(this).val();
                mapContainer.load(mapName);
                $('#load-map-modal').modal('hide');
            }
        });
    
        // Load saved map from database when user clicks the Load Map button
        $('#load-map-modal .load-btn').on('click', function() {
            const mapName = $('#load-map-modal .map-name').val();
            mapContainer.load(mapName);
            $('#load-map-modal').modal('hide');
        });
    
        // Save map to database when user presses the ENTER key in the Save Map modal
        $('#save-map-modal .map-name').on('keydown', function(e) {
            const key = e.keyCode || e.which;
            if(key === ENTERKEY) {
                e.preventDefault();
                e.stopPropagation();
                const mapName = $('#save-map-modal .map-name').val();
                mapContainer.save(mapName);
                $('#save-map-modal').modal('hide');
            }
        });
    
        // Save map to database when user clicks the Save Map button
        $('#save-map-modal .save-btn').on('click', function() {
            const mapName = $('#save-map-modal .map-name').val();
            mapContainer.save(mapName);
            $('#save-map-modal').modal('hide');
        });

        // Create new map when user clicks the Create Map button
        $('#create-map-modal .create-btn').on('click', function() {
            const mapWidth = $('#create-map-modal .map-width').val();
            const mapHeight = $('#create-map-modal .map-height').val();
            mapContainer.create(mapWidth, mapHeight);
            $('#create-map-modal').modal('hide');
        });
    
        // Auto focus the Name input field when Load Map and Save Map modals are shown
        $('#load-map-modal, #save-map-modal').on('shown.bs.modal', function() {
            $(this).find('.map-name').focus();
        });

        // Load texture atlas when user clicks the Load button in the Load textureatlas modal
        $('#load-textureatlas-modal .load-btn').on('click', function() {
            let formData = new FormData();
            formData.set('textureatlas', document.querySelector('#textureatlas-file'.files[0]));
            formData.set('textureatlasImage', document.querySelector('#textureatlas-image-file').files[0]);
            $.ajax({
                url: './api/textureatlas/',
                type: 'POST',
                enctype: 'multipart/form-data',
                data: formData_o,
                async: true,
                cache: false,
                contentType: false,
                processData: false,
                success: function (response) {
                    
                },
                failure: function(response) {

                }
            });



            // if(document.querySelector("#textureatlas-file").files.length === 0) {
            //     alert('Error: No file selected');
            //     return;
            // }
            // let file = document.querySelector("#textureatlas-file").files[0];
            // if(file.type !== 'application/json') {
            //     alert('Error: Invalid file type');
            //     return;
            // }
            // let fileReader = new FileReader();
            // fileReader.addEventListener('loadstart', function() {
            //     console.log('File reading started');
            // });
            // fileReader.addEventListener('load', function(e) {
            //     // contents of file in variable     
            //     let textureatlas = e.target.result;
            //     console.log(text);
            // });
            // fileReader.addEventListener('error', function() {
            //     alert('Error : Failed to read file');
            // });
            // fileReader.addEventListener('progress', function(e) {
            //     if(e.lengthComputable == true) {
            //         var percent_read = Math.floor((e.loaded/e.total)*100);
            //         console.log(percent_read + '% read');
            //     }
            // });
            // fileReader.readAsText(file);
        });
    }
    
    app.ticker.add((delta) => {
        //mapContainer.x += speedX * delta;
        //mapContainer.y += speedY * delta;
    });    
});