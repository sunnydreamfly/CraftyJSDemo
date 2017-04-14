//战机定义
Crafty.c("Player",{
    //血条
    hp:{
        current:10,
        max:10,
        percent:100
    },
    //盾条
    shield:{
        current:10,
        max:10,
        percent:100
    },
    //冷却条
    heat:{
        current:0,
        max:100,
        percent:0
    },
    //移动速度
    movementSpeed:8,
    //3条命
    lives:3,
    //得分
    score:0,
    //武器默认设置
    weapon:{
        //开火频率
        firerate:5,
        //武器名称
        name:"Weapon2",
        //是否过热
        overheated:false
    },
    //奖励（加油箱）数组
    powerups:{},
    //战机定义
    ship:"ship1",
    //?
    bars:{},
    //?
    infos:{},
    //是否准备好
    preparing:true,
    //是否反弹？？说子弹吗？
    bounce:false,
    init:function(){
     
        var stage = $('#cr-stage');
        var keyDown = false; //Player didnt pressed a key
        this.requires("2D,Canvas,"+this.ship+",Multiway,Keyboard,Collision,Flicker") /*Add needed Components*/
        //移动键盘绑定
        .multiway(this.movementSpeed, { /*Enable Movement Control*/
            UP_ARROW: -90, 
            DOWN_ARROW: 90, 
            RIGHT_ARROW: 0, 
            LEFT_ARROW: 180
        })
        //绑定移动事件
        .bind('Moved', function(from) { /*Bind a function which is triggered if player is moved*/
            // console.log('Moved');
            // console.log(from.x);
            // console.log(from.y);
            /*Dont allow to move the player out of Screen*/
            //控制飞机在屏幕内移动
            if(this.x+this.w > Crafty.viewport.width ||
                this.x+this.w < this.w || 
                this.y+this.h-35 < this.h || 
                this.y+this.h+35 > Crafty.viewport.height || this.preparing){
                this.attr({
                    x:from.x, 
                    y:from.y
                });
            }
          
        })
        //绑定键盘KeyDown事件 判断是否是空格
        .bind("KeyDown", function(e) {
            if(e.keyCode === Crafty.keys.SPACE){
                keyDown = true;
            } 
        })
        //绑定键盘KeyUp事件 判断是否是空格
        .bind("KeyUp", function(e) {
            if(e.keyCode === Crafty.keys.SPACE){
                keyDown = false;
            } 
        })
        //每帧触发
        .bind("EnterFrame",function(frame){
            if(frame.frame % this.weapon.firerate == 0){
               
                if(keyDown && !this.weapon.overheated){
                    this.shoot();
                }else{
                    if(this.heat.current > 0) //Cooldown the weapon
                        //~~ 二进制按位取反，理解为是取整的简写,妙哉！
                        this.heat.current = ~~(this.heat.current*29/30); 
                }
                //触发更新战机状态
                Crafty.trigger("UpdateStats");
                
                //武器过热判断
                if(this.weapon.overheated && this.heat.percent < 85){
                    this.weapon.overheated = false;
                    //触发隐藏提醒文字
                    Crafty.trigger("HideText");
                }
                    
            }

            //没太理解场景
            if(this.preparing){
                this.y--;
                if(this.y < Crafty.viewport.height-this.h-Crafty.viewport.height/4){
                    this.preparing = false;
                    this.flicker=false;
                  
                }
            }
         
            
        })
        //杀敌触发
        .bind("Killed",function(points){
            this.score += points;
            //触发更新战机状态
            Crafty.trigger("UpdateStats");
        })
        //伤害触发
        .bind("Hurt",function(dmg){
            //无敌闪烁状态
            if(this.flicker) return;
            //震动
            if(this.bounce == false) {
                this.bounce = true;
                var t = this;
                //JQuery 方法
                stage.effect('highlight',{
                    color:'#990000'
                },100,function(){
                    t.bounce = false;
                });
            }

            //创建伤害对象
            Crafty.e("Damage").attr({
                x:this.x,
                y:this.y
            });

            //修改战机对应血与盾
            if(this.shield.current <= 0){
                this.shield.current = 0;
                this.hp.current -= dmg;
            }else{
                this.shield.current -= dmg;
            }
            //触发战机状态更新
            Crafty.trigger("UpdateStats");
            //判断没血了就挂
            if(this.hp.current <= 0) this.die();
        })
        //撞击敌人子弹触发
        .onHit("EnemyBullet",function(ent){
            var bullet = ent[0].obj;
            //触发伤害
            this.trigger("Hurt",bullet.dmg);
            //子弹销毁
            bullet.destroy();
        })
        //恢复血条
        .bind("RestoreHP",function(val){
            if(this.hp.current < this.hp.max){
                this.hp.current += val;
                //触发战机状态更新
                Crafty.trigger("UpdateStats");
            }
        })
        //恢复盾条
        .bind("RestoreShield",function(val){
            if(this.shield.current < this.shield.max){
                this.shield.current += val;
                //触发战机状态更新
                Crafty.trigger("UpdateStats");
            }  
        
        })
        .reset() /*Set initial points*/;
        return this;
    },
    //重置参数
    reset:function(){
        this.hp = {
            current:10,
            max:10,
            percent:100
        };
        this.shield = {
            current:10,
            max:10,
            percent:100
        };
        this.heat = {
            current:0,
            max:100,
            percent:0
        }
        Crafty.trigger("UpdateStats");
        //Init position
        this.x = Crafty.viewport.width/2-this.w/2;
        this.y = Crafty.viewport.height-this.h-36;
        
        //闪烁无敌
        this.flicker = true;
        //准备状态
        this.preparing = true;
    },
    //射击方法
    shoot:function(){ 
        if(this.preparing) return;
        
        //创建子弹
        var bullet = Crafty.e(this.weapon.name,"PlayerBullet");
        bullet.attr({
            //Where
            playerID:this[0],
            //居中
            x: this._x+this._w/2-bullet.w/2,
            y: this._y-this._h/2+bullet.h/2,
            rotation: this._rotation,
            //xy都有速度
            xspeed: 20 * Math.sin(this._rotation / (180 / Math.PI)),
            yspeed: 20 * Math.cos(this._rotation / (180 / Math.PI))
        }); 
        
        //武器温度上升
        if(this.heat.current < this.heat.max)
            this.heat.current ++;
        //武器过热无法使用 
        if(this.heat.current >= this.heat.max){
            Crafty.trigger("ShowText","Weapon Overheated!");
            this.weapon.overheated = true;
        }
           
    },
    
    //牺牲
    die:function(){
        Crafty.e("RandomExplosion").attr({
            x:this.x,
            y:this.y
        });
        this.lives--;
        Crafty.trigger("UpdateStats");
        if(this.lives <= 0){
            this.destroy();
            Crafty.trigger("GameOver",this.score);
        }else{
            this.reset();
        } 
    }

});
