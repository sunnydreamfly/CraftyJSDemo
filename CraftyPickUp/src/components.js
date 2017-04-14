Crafty.c("Player", {
	score:0,
	init:function() {
		this.requires("2D, Canvas, Collision, Twoway, spr_hero, SpriteAnimation'")
			.attr({w: 100, h: 116})
			.bind('Moved',function(evt) {
				if( this.x+this.w > Crafty.viewport.width ||
                	this.x+this.w < this.w || 
                	this.y+this.h < this.h || 
                	this.y+this.h > Crafty.viewport.height
                	){
	                this[evt.axis] = evt.oldValue;
            	}
			})
			.onHit("Money", function(hitDatas) {
				for (var i = 0; i < hitDatas.length; i++) {
					this.score+= hitDatas[i].obj.value;
					hitDatas[i].obj.destroy();
				}
				Crafty.audio.play('getmoney');
				Crafty.trigger("UpdateStats");
			})
			.onHit("Bomb", function(hitDatas) {
				for (var i = 0; i < hitDatas.length; i++) {
					this.score+= hitDatas[i].obj.value;
					hitDatas[i].obj.destroy();
				}
				this.destroy();
				Crafty.audio.play('over');
				Crafty.trigger("GameOver");
			})
	}
});

Crafty.c("Money", {
	value:5,
	init:function() {
		this.requires("2D, Canvas, Gravity, spr_money, SpriteAnimation'")
			.attr({w:64, h:64});
	}
});

Crafty.c("Bomb", {
	init:function() {
		this.requires("2D, Canvas, Gravity, spr_bomb, SpriteAnimation'")
			.attr({w:65, h:64});
	}
});