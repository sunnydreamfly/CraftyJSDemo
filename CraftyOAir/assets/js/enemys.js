/**
 * This File describes all enemies
 */
//定义奖励类型
var powerUps = ["Heal","Shield"];
//Basic enemy component
//定义敌机基类
Crafty.c("Enemy",{
    //定义Which Player
    playerID:null, //ID of player which has something todo with that enemy
    init:function(){
        //All enemies will get same basic components
        this.requires("2D,Canvas,Collision")  
        //Destroy all enemies if they leave the viewport
        //超出屏幕的敌机，自我销毁
        .bind("EnterFrame",function(){
            if(this.x > Crafty.viewport.width + this.w ||
                this.x < -this.w || 
                this.y < -this.h || 
                this.y > Crafty.viewport.height +this.h){
                this.destroy();
            }
        })
        //Describe behavior on getting hitted by Player Bullet
        //触发被子弹撞击事件
        .onHit("PlayerBullet",function(ent){
            var bullet = ent[0].obj;
            //从子弹中获取是谁打的
            this.playerID = bullet.playerID; //Which player hurted you
            //触发伤害
            this.trigger("Hurt",bullet.dmg); //Hurt the enemy with bullet damage
            //子弹自我销毁
            bullet.destroy(); //Destroy the bullet
        })
        //Describe behavior on getting hitted by Player
        //触发被战机撞击事件
        .onHit("Player",function(ent){
            var player = ent[0].obj;
            //Hurt the player with my hp
            //触发战机的伤害事件，战机受损失.
            Crafty(player[0]).trigger("Hurt",this.hp);
            //Hurt enemy with all hp he has
            //触发伤害,战机有多少血，敌人就伤多少血，这个逻辑有点意思
            this.trigger("Hurt",this.hp);
        })
        //Event triggered when enemy was hurt
        //绑定伤害
        .bind("Hurt",function(dmg){
            //Create a damage effect
            //创建伤害对象
            Crafty.e("Damage").attr({
                x:this.x,
                y:this.y
            });
            //Reduce HP
            //扣血
            this.hp -= dmg;
            //Die if hp is 0
            //血不够就挂
            if(this.hp <= 0) this.trigger("Die");
        })
        //绑定挂
        .bind("Die",function(){
            //Create a random explosion at his position
            //创建爆炸对象
            Crafty.e("RandomExplosion").attr({
                x:this.x-this.w,
                y:this.y-this.h
            });
            //Trigger the player event to calculate points
            //触发战斗杀敌事件
            Crafty(this.playerID).trigger("Killed",this.points);
            //Destroy the asteroid
            //敌机自我销毁，并随机创建一个奖励（加油箱）
            this.destroy();
            if(Crafty.math.randomInt(0, 100) > 70){
                var powerUp = powerUps[Crafty.math.randomInt(0, powerUps.length-1)];
                Crafty.e(powerUp).attr({
                    x:this.x,
                    y:this.y
                });
            }
        });
    }
});

//Enemy type Asteroid
//大行星
Crafty.c("Asteroid",{
    //血
    hp:2, //Has 2 HP
    //分值
    points:5, //Give 5 points if killed
    init:function(){
        //移动速度
        var speed =  Crafty.math.randomInt(1,2); //get Random movin speed
        //移动方向
        var direction = Crafty.math.randomInt(-speed,speed); //Get ramdom moving direction
      
        //Asteroid requires Enemy so it gets their functions and behavior
        this.requires("Enemy,asteroid64,SpriteAnimation")
        //居中
        .origin("center")
        //define animation
        //旋转
        .animate("rotate",0,0,63)
        //start animation without end
        //不停旋转
        .animate("rotate",15,-1)
        //每帧按速度与方向运动起来
        .bind("EnterFrame",function(){
            //Move the Enemy in game loop
            this.y += speed;
            this.x += direction;
        })
        //Set initial attributes
        //初始化位置
        .attr({
            //屏幕外生成
            y:-this.h, //display asteroid over the viewport at start
            //屏幕宽度方位内生成，注意 -this.w
            x:Crafty.math.randomInt(this.w,Crafty.viewport.width - this.w),//random position within the viewport
            //旋转角度随机
            rotation:Crafty.math.randomInt(0,360) //rotate it random
        })
        //与小行星撞击触发,挂
        .onHit("SmallAsteroid",function(){
            this.trigger("Die");
        })
        //Event to die
        //绑定挂事件
        .bind("Die",function(){
            //Create a random explosion at his position
            //创建爆炸对象
            Crafty.e("RandomExplosion").attr({
                x:this.x,
                y:this.y
            });
            //Create 1-4 Small asteroids
            //生成1-4个小行星，厉害
            for(var i = 0;i<Crafty.math.randomInt(1,4);i++){
                Crafty.e("SmallAsteroid").attr({
                    x:this.x,
                    y:this.y
                });
            }
         
        });
    }
});

//Same like Asteroid but dont create smaller asteroids
//小行星
Crafty.c("SmallAsteroid",{
    //血
    hp:1,
    //分值
    points:10,
    init:function(){
        var speed =  Crafty.math.randomInt(1,3);
        var direction = Crafty.math.randomInt(-speed,speed);

        this.requires("Enemy,asteroid32,SpriteAnimation")
        .origin("center")
        .animate("rotate",0,0,63)
        .animate("rotate",15,-1)

        .bind("EnterFrame",function(){
            this.y += speed;
            this.x += direction;
        })
        .attr({
            rotation:Crafty.math.randomInt(0,360)
        });
       
    }
});

//EnemyType Kamikaze
//定义神风特攻队对象，只会撞击型
Crafty.c("Kamikaze",{
    //血
    hp:3,
    //分值
    points:15,
    init:function(){
        //获取战机对象
        var player = Crafty("Player");
        //是否被攻击
        var attacking = false;
        this.requires("Enemy,ship11")
        .origin("center")
        .attr({
            //旋转一下机头朝下
            rotation:180,
            //屏幕外面生成
            y:-this.h,
            //屏幕宽度方位内生成，注意 -this.w
            x:Crafty.math.randomInt(this.w,Crafty.viewport.width - this.w)
        })

        .bind("EnterFrame",function(){
            player = Crafty(player[0]);
            if(this.y < 0)
                this.y +=2;

            if(this.x < player.x && !attacking)
                this.x++;
            
            if(this.x > player.x && !attacking)
                this.x--;
        
            if(this.x == player.x)
                attacking = true;
            
            if(attacking)
                this.y += 4;
        });

    }
});

//一号敌机
Crafty.c("Level1",{
    hp:2,
    points:5,
    init:function(){
        var player = Crafty("Player");
        var x = 0;
        this.addComponent("Enemy","ship9")
        .origin("center")
        .attr({
            rotation:180,
            y:-this.h,
            x:Crafty.math.randomInt(this.w,Crafty.viewport.width - this.w)
        })
        .bind("EnterFrame",function(frame){
            player = Crafty(player[0]);
            x = Math.abs((this.x+this._w/2)-player.x);
        
            if((x<40)&& this._y < player.y && frame.frame % 20 == 0){
                //一号敌机 (TMD 是我理解错了x 不是this.x)
                this.trigger("Shoot");
            }

            this.y += 1.5;
        })
        .bind("Shoot",function(){
            //？Weapon1,EnemyBullet???
            var bullet = Crafty.e("Weapon1","EnemyBullet");
            bullet.attr({
                //居中发射
                x: this._x+this._w/2-bullet.w/2,
                y: this._y+this._h-bullet.h/2,
                //子弹向下
                rotation: this._rotation,
                //子弹速度
                xspeed: 5 * Math.sin(this._rotation / (180 / Math.PI)),
                yspeed: 5 * Math.cos(this._rotation / (180 / Math.PI))
            });   
        });
    }
});

//二号敌机
Crafty.c("Level2",{
    hp:2,
    points:10,
    init:function(){
        var player = Crafty("Player");
        var x = 0;
        this.addComponent("Enemy","ship10")
        .origin("center")
        .attr({
            rotation:180,
            y:-this.h,
            x:Crafty.math.randomInt(this.w,Crafty.viewport.width - this.w)
        })
        .bind("EnterFrame",function(frame){
            player = Crafty(player[0]);
            x = Math.abs((this.x+this._w/2)-player.x);
            if(this.x < player.x)
                this.x++;
            if(this.x > player.x)
                this.x--;

            //二号敌机 还是只会在x< 40 触发发射(TMD 是我理解错了x 不是this.x)
            if((x<40)&& this._y < player.y && frame.frame % 20 == 0){
                console.log("x:" + x  +" shoot Now");
                this.trigger("Shoot");
            }
            this.y += 1.5;
        })
        .bind("Shoot",function(){
            var bullet = Crafty.e("Weapon1","EnemyBullet");
            bullet.attr({
                x: this._x+this._w/2-bullet.w/2,
                y: this._y+this._h-bullet.h/2,
                rotation: this._rotation,
                xspeed: 5 * Math.sin(this._rotation / (180 / Math.PI)),
                yspeed: 5 * Math.cos(this._rotation / (180 / Math.PI))
            });  
        });
    }
});
