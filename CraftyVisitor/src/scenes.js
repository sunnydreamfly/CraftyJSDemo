Crafty.scene('Game',function() {
	console.log('To Game');
	// A 2D array to keep track of all occupied tiles
	this.occupied = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		this.occupied[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			this.occupied[i][y] = false;
		}
	}

	// Player character, placed at 5, 5 on our grid
    this.player = Crafty.e('Player').at(5, 5);
    this.occupied[this.player.at().x][this.player.at().y] = true;

    // Place a tree at every dge square on our grid of 16x16 tiles
	for (var  x= 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			var at_edge =  x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;

			if (at_edge) {
				// Place a tree entity at the current tile
				// Crafty.e('2D, Canvas, Color')
				// 	.attr( {
				// 		x: x * Game.map_grid.tile.width,
				// 		y: y * Game.map_grid.tile.height,
				// 		w: Game.map_grid.tile.width,
				// 		h: Game.map_grid.tile.height
				// 	})
				// 	.color('rgb(20, 125, 40');
				Crafty.e('Tree').at(x, y);
				this.occupied[x][y] = true;
			}
			else if (Math.random() < 0.06 && !this.occupied[x][y]) {
				// Place a bush entity at the current tile
				// Crafty.e('2D, Canvas, Color')
				// 	.attr( {
				// 		x: x * Game.map_grid.tile.width,
				// 		y: y * Game.map_grid.tile.height,
				// 		w: Game.map_grid.tile.width,
				// 		h: Game.map_grid.tile.height
				// 	})
				// 	.color('rgb(20, 185, 40');
				var bush_or_rock = (Math.random() > 0.3) ? 'Bush' : 'Rock';
				Crafty.e(bush_or_rock).at(x, y);
				this.occupied[x][y] = true;
			}
		}
	}

	// Generate up to five villages on the map in random locations
	var max_villages = 5;
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height;y++) {
			if (Math.random() < 0.03) {
				if (Crafty('Village').length < max_villages && !this.occupied[x][y]) {
					Crafty.e('Village').at(x, y);
				}
			}
		}
	}

	// Play a ringing sound to indicate the start of the journey
    Crafty.audio.play('ring');

	this.show_victory = this.bind('VillageVisited',function() {
		if(!Crafty('Village').length) {
			Crafty.scene('Victory');
		}
	});
	console.log(this.show_victory);
}, function() {
	console.log('unbind VillageVisited');
	console.log(this.show_victory);
	//this.unbind('VillageVisited', this.show_victory);
	this.unbind('VillageVisited');
	console.log('unbind VillageVisited2');
});

Crafty.scene('Victory',function() {
	console.log('To Victory Scene');
	Crafty.e('2D, DOM, Text')
		.attr({x: 0, y :0})
		.text('All villages visited!')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.css($text_css);

	// Give'em a round of applause!
    Crafty.audio.play('applause');

    // After a short delay, watch for the player to press a key, then restart
    // the game when a key is pressed
    var delay = true;
    setTimeout(function() { delay = false; }, 5000);	
	this.restart_game = this.bind('KeyDown', function(){
		if (!delay) {
			Crafty.scene('Game');
		}
	});
	console.log(this.restart_game);
}, function() {
	console.log('unbind KeyDown');
	// Every Time To KeyDown,Start Game Loop,Why, Unbind Error
	console.log(this.restart_game);
	// this.unbind('KeyDown', this.restart_game);
	this.unbind('KeyDown');
	console.log('unbind KeyDown2');
});

//Loading Scene
//-------------
//Handles the loading of binary assets such as images and audio files
Crafty.scene('loading',function() {
	// Draw some text for the player to see in case the file
	// takes a noticeable amount of time to load
	Crafty.e('2D, DOM, Text')
		.text('Loading; please wait...')
		.attr({x: Game.width()/2 -24, y: Game.height()/2 -24, w:Game.width})
		.css($text_css);
	// Load our sprite map image
	Crafty.load(['assets/16x16_forest_2.gif',
				 'assets/hunter.png',
                 'assets/door_knock_3x.mp3',
                 'assets/door_knock_3x.ogg',
                 'assets/door_knock_3x.aac',
                 'assets/board_room_applause.mp3',
    			 'assets/board_room_applause.ogg',
    			 'assets/board_room_applause.aac',
    			 'assets/candy_dish_lid.mp3',
    			 'assets/candy_dish_lid.ogg',
    			 'assets/candy_dish_lid.aac'], function() {
		// Once the image is loaded..

		// Difine the individual sprites in the image
		// Each on (spr_tree, etc.) becomes a component
		// These components's names are prefixed with "spr_"
		// to remind us that they simply cause the entity
		// to be drawn with a certain sprite
		Crafty.sprite(16, 'assets/16x16_forest_2.gif', {
			spr_tree: [0, 0],
			spr_bush: [1, 0],
			spr_village: [0, 1],
			//spr_player: [1,1]
			spr_rock:[1,1]
		});

		// Define the PC's sprite to be the first sprite in the third row of the
        //  animation sprite map
        Crafty.sprite(16, 'assets/hunter.png',{
        	spr_player: [0, 2]
        }, 0, 2);

        // Define our sounds for later use
	    Crafty.audio.add({
	      knock: 	['assets/door_knock_3x.mp3',
	              	 'assets/door_knock_3x.ogg',
	              	 'assets/door_knock_3x.aac'],
	      applause: ['assets/board_room_applause.mp3',
                  	 'assets/board_room_applause.ogg',
                  	 'assets/board_room_applause.aac'],
      	  ring: 	['assets/candy_dish_lid.mp3',
                 	 'assets/candy_dish_lid.ogg',
                 	 'assets/candy_dish_lid.aac']
	    });

		//Now that our sprites are ready to draw, start the game
		Crafty.scene('Game');
	});
});