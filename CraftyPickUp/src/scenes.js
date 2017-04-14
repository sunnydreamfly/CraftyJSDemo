Crafty.scene("Game", function() {
		Crafty.audio.play('music');

		// Player character, placed at 5, 5 on our grid
    	var player = Crafty.e("Player");
    						
    	player.attr({x:Game.width()/2-player.w/2, y:Game.height() - player.h})
    		  .twoway(400);

    	//撒钱
		var displayMoney = function(frame){
        	if(frame % 50 == 0 ){
        		//console.log(Crafty.viewport.width);
            	var money = Crafty.e('Money');
            					  
            	money.attr({x: Crafty.math.randomInt(0,Crafty.viewport.width -money.w), y: 0})
            		 .gravity();
					
        	}
    	};

	    Crafty.bind("EnterFrame",function(frame){
	    	console.log('EnterFrame');
	        //Trigger Event to display enemies
	        displayMoney(Crafty.frame());
	        
	    });

	    //投炸弹
		var displayBomb= function(frame){
        	if(frame % 120 == 0 ){
        		//console.log(Crafty.viewport.width);
            	var bomb = Crafty.e('Bomb');
            					  
            	bomb.attr({x: Crafty.math.randomInt(0,Crafty.viewport.width-bomb.w), y: 0})
            		 .gravity();
					
        	}
    	};

	    Crafty.bind("EnterFrame",function(frame){
	    	console.log('EnterFrame');
	        //Trigger Event to display enemies
	        displayBomb(Crafty.frame());
	        
	    });

	    Crafty.bind("UpdateStats", function() {
	    	var showScore = document.getElementById('score');
	    	showScore.innerText = 'Score:' + player.score; 
	    });

	    Crafty.bind("GameOver", function() {
	    	Crafty.scene("Over");
	    });
});


// Game Over scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene("Over", function() {
	var showOver = document.getElementById('alert');
	showOver.innerText = 'Game Over!'; 

  // Display some text in celebration of the victory

  // Crafty.e("2D, DOM, Text")
  //   .attr({ x: 100, y: 200 })
  //   .text("Game Over!")
  //   .css($text_css);

  // Watch for the player to press a key, then restart the game
  //  when a key is pressed
  // this.restart_game = this.bind('KeyDown', function() {
  //   Crafty.scene('Game');
  // });
}, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  // this.unbind("KeyDown", this.restart_game);
});

//Loading
Crafty.scene("Loading",function(){

	//Loading
	Crafty.e("2D, DOM, Text")
	    .text("Loading...")
	    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() });
	    // .css($text_css);

    Crafty.sprite(100,116,"assets/hero.png", {
		spr_hero: [0, 0]
	});

	Crafty.sprite(64, 64,"assets/money.png", {
		spr_money: [0, 0]
	});

	Crafty.sprite(65,64,"assets/bomb.png", {
		spr_bomb: [0, 0]
	});


    // Crafty.audio.add({
    //   music	: ['media/through-space.mp3',
    //           'media/through-space.ogg']
    // });

    Crafty.audio.add({
      music	: ['media/wf.mp3',
              'media/wf.ogg']
    });


	Crafty.audio.add({
      getmoney: ['media/door_knock_3x.mp3',
              'media/door_knock_3x.ogg',
              'media/door_knock_3x.aac']
    });


    Crafty.audio.add({
      over	: ['media/explode.mp3',
              'media/explode.ogg']
    });

	// Now that our sprites are ready to draw, start the game
	Crafty.scene("Game");
});