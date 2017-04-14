//子弹基类定义
Crafty.c("Bullet",{
    //攻击伤害力默认定义 0
    dmg:0,
    //攻击火力默认定义 0
    firerate:0,
    init:function(){
        this.addComponent("2D","Canvas","Collision")
        .bind("EnterFrame",function(){
            //子弹超出屏幕范围，自我销毁
            if(this.x > Crafty.viewport.width+this.w ||
                this.x < -this.w || 
                this.y < -this.h || 
                this.y > Crafty.viewport.height+this.h){
                this.destroy();
            }
        })
        //子弹撞击到子弹，两个子弹都销毁，游戏中感觉只有子弹速度变化是才会触发
        .onHit("Bullet",function(ent){
            this.destroy();
            ent[0].obj.destroy();
        });
    }
});

//激光1（子弹子类）
Crafty.c("Weapon1",{
    init:function(){
        this
        .addComponent("Bullet","laser1")
        //居中发射
        .origin("center")
        //每帧 x,y + 偏移量  speed 在？定义
        .bind("EnterFrame", function() {
            this.x += this.xspeed;
            this.y -= this.yspeed; 
        })
        //设置攻击伤害力 1
        .attr({
            dmg:1
        });
        //播放音效
        Crafty.audio.play("laser1",1,0.8);
    } 
});
//激光2（子弹子类）
Crafty.c("Weapon2",{
    init:function(){
        this
        .addComponent("Bullet","laser2")
        //居中发射
        .origin("center")
        //每帧 x,y + 偏移量  speed 在？定义
        .bind("EnterFrame", function() {
            this.x += this.xspeed;
            this.y -= this.yspeed;  
        })
        //设置攻击伤害力 2
        .attr({
            dmg:2
        });
        //播放音效
        Crafty.audio.play("laser2",1,0.8);
    } 
});
