Game = {
	// This defines our grid's size and the size of each of its tiles
	map:{
		width: 800,
		height: 480,
		
	},

	width:function() {
		return this.map.width;
	},

    height:function() {
    	return this.map.height;
    },


	// Initialize and start our game
	start: function () {
		// Start crafty and set a background color so that we can see it's working
		Crafty.init(Game.width(), Game.height());
		//Crafty.background('blue');
		Crafty.background('url(assets/map.jpg) no-repeat center center');

		Crafty.scene('Loading');

	}
}