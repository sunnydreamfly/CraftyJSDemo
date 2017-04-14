//事件定义
//随机爆炸事件定义
Crafty.c("RandomExplosion",{
    init:function(){
        //定义1，2， 3 随机整数
        var rand = Crafty.math.randomInt(1,3);
        this.addComponent("2D","Canvas","explosion"+rand,"SpriteAnimation")
        //爆炸效果
        .animate("explode1",0,0,16)
        .animate("explode2",0,1,16)
        .animate("explode3",0,2,16)
        //Why 还有这么定义,没太看懂
        .animate("explode"+rand,10,0)
        //动画结束后自我销毁
        .bind("AnimationEnd",function(){
            this.destroy();
        });
        
        //爆炸音效
        Crafty.audio.play("explosion"+Crafty.math.randomInt(0,1),1,0.5);
    }
});

//攻击事件定义
Crafty.c("Damage",{
    init:function(){
        this.addComponent("2D","Canvas","dmg", "Delay")
        //伤害后，延时100毫毛，自我销毁
        .delay(function(){this.destroy()},100);
        
    }
});

//闪烁事件定义
Crafty.c("Flicker",{
   flicker:true,
   init:function(){
       this.flicker = true;
       //每5帧闪烁？
       this.bind("EnterFrame",function(frame){
           if(frame.frame % 5 == 0 && this.flicker){
               if(this.alpha == 0.0){
                   this.alpha = 1.0;
               }else{
                   this.alpha = 0.0;
               }
           }
           if(!this.flicker){
                this.alpha = 1.0;
           }
       });
   }
   
});