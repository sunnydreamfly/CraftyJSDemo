//奖励（加油箱）基类
Crafty.c("PowerUp",{
    init:function(){
        this.requires("2D,Canvas,Collision")
        //与子弹撞击事件，自我销毁
        .onHit("PlayerBullet",function(){
           this.destroy(); 
        })
        //与飞机撞击事件，触发奖励事件，自我销毁
        .onHit("Player",function(ent){
            //触发奖励 TODO Read 没太看懂
            ent[0].obj.trigger(this.effect,this.value);
            this.destroy(); 
        })
        //奖励（加油箱）已每帧2个位移向下位移
        .bind("EnterFrame",function(){
            this.y+=2;
        });
    }
});

//治疗奖励
Crafty.c("Heal",{
    //恢复HP +1
    effect:"RestoreHP",
    value:1,
    init:function(){
        this.requires("PowerUp,heal");
    }
});

//加盾奖励
Crafty.c("Shield",{
    //恢复盾数 +1
    effect:"RestoreShield",
    value:1,
    init:function(){
        this.requires("PowerUp,shield");
    }
});