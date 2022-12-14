class Fight {
    constructor(game, player, enemyArray, canvas, pet, audioLoader, imageLoader, bottomBar) {
        this.game = game;
        this.player = player;
        this.enemyArray = enemyArray;
        this.pet = pet;
        this.bottomBar = bottomBar;
        this.audioLoader = audioLoader;
        this.imageLoader = imageLoader;

        this.flag = false;


        this.runHoverDisplay = [false];
        this.runRect = [{
            x: 900,
            y: 0,
            width: 48,
            height: 52,
            scaled_width: 58,
            scaled_height: 62,
            original_width: 48,
            original_height: 52
        }];
        this.attackImageSize = 40;

        this.canvas = canvas;

        this.playerSpeed = this.player.speed;

        if (this.pet != undefined) {
            this.petSpeed = this.pet.speed;

        }

        this.selectedEnemy = 0;

        this.enemySpeedArray = [];
        this.enemyAttackTimeArray = [];
        this.enemyImageIndexArray = [];
        this.enemyOpacityArray = [];
        this.displayHoverItem = [];
        this.enemyDodged = [];

        this.cancelFrame = false;

        for (let i = 0; i < this.enemyArray.length; i++) {
            this.enemySpeedArray.push(this.enemyArray[i].speed);
            this.enemyAttackTimeArray.push(true);
            this.enemyImageIndexArray.push(0);
            this.displayHoverItem.push(false);
            this.enemyDodged.push(false);
            this.enemyOpacityArray.push(1);
        };

        if (this.enemyArray.length === 1) {
            this.enemyOne = true;
        } else {
            this.enemyOne = false;
        }
        this.selectJutsuenabled = false;

        this.playerOpacity = 1;

        this.enemyOneDaggerPosition = [{
            x: 840,
            y: 130
        }];

        this.enemyDaggerFixedPosition = [{
                top: 60,
                bottom: 90
        },
            {
                top: 120,
                bottom: 150
             }
            ];


        this.chakraChargeCoordinates = [{
            x: 800,
            y: 0,
            width: 63,
            height: 54,
            scaled_width: 73,
            scaled_height: 64,
            original_width: 63,
            original_height: 54
        }];

        this.chakraHoverDisplay = [false];

        this.statBarArray = [
            this.imageLoader.images.sasuke_stat,
            this.imageLoader.images.naruto_stat,
            this.imageLoader.images.sakura_stat
        ]

        this.jutsuOpacity = [];

        for (let i = 0; i < this.player.jutsu.length; i++) {
            this.jutsuOpacity.push(1);
        }

        this.enemyHealthBarCoordinates = [
            {
                x: 650,
                y: 250
            },
            {
                x: 800,
                y: 300
            }
        ];

        this.enemyDaggerPosition = [
            {
                x: 700,
                y: 70
            },
            {
                x: 840,
                y: 130
            }
        ];


        this.actionBarPlayerCoordinates = {
            x: 200,
            y: 380
        };

        this.actionBarPetCoordinates = {
            x: 200,
            y: 400
        }


        this.actionBarEnemyCoordinates = [
            {
                x: 200,
                y: 380
        }, {
                x: 200,
                y: 380
        }
        ];

        this.EnemydodgeCoordinates = [

            {
                x: 680,
                y: 190
            }, {
                x: 820,
                y: 100
            }
        ]

        this.enemyCoordinates = [
            {
                x: 650,
                y: 140
            },

            {
                x: 800,
                y: 140
            }
        ];


        this.petImageIndex = 0;
        this.totalHealth = 100;
        this.jutsuIndex = 0;


        this.playerImageIndex = 0;

        this.clicked = false;

        this.selectJutsuenabled = false;

        this.startFrame = true;

        this.playerTitleBar = false;

        this.renderPlayerAttacks = false;

        this.dodged = false;

        this.count = 0;

        this.speed = 1;

        this.petAttackTime = true;

        this.originalJutsuArray = this.player.jutsu;

        this.player.jutsu = this.player.jutsu.filter(attack => attack.selected === true);

        this.hostMessage = "";
    }

    drawDagger(ctx) {
        if (this.enemyOne === true) {
            ctx.drawImage(
                this.imageLoader.images.dagger,
                this.enemyOneDaggerPosition[0].x,
                this.enemyOneDaggerPosition[0].y
            );

        } else {
            ctx.drawImage(
                this.imageLoader.images.dagger,
                this.enemyDaggerPosition[this.selectedEnemy].x,
                this.enemyDaggerPosition[this.selectedEnemy].y
            );

        }

    }

    updateDagger() {

        if (this.enemyOne === true) {
            this.enemyOneDaggerPosition[0].y += this.speed;
            if (reboundItem(this.enemyOneDaggerPosition, enemyOneFixedDaggerPosition, 0)) {
                this.speed = -this.speed;
            }
        } else {
            this.enemyDaggerPosition[this.selectedEnemy].y += this.speed;
            if (reboundItem(this.enemyDaggerPosition, this.enemyDaggerFixedPosition, this.selectedEnemy)) {
                this.speed = -this.speed;
            }
        }

    }



    draw(ctx, gameEngine, gameLoop) {
        if (this.cancelFrame === false) {
            this.drawFightBackground(ctx);
            this.player.draw(ctx, this.playerImageIndex, 100, this.playerOpacity);

            this.drawDagger(ctx);
            this.updateDagger();
            for (let i = 0; i < this.enemyArray.length; i++) {
                this.enemyArray[i].draw(ctx, this.enemyImageIndexArray[i], 100, this.enemyOpacityArray[i]);
                this.drawEnemyHealthBar(ctx);
            }

            this.drawPlayerHealthBar(ctx);

            if (this.renderPlayerAttacks === true) {
                this.drawPlayerAttacks(ctx);
            }

            if (this.renderPlayerAttacks === false) {
                ctx.drawImage(this.imageLoader.images.speed, speedRect.x, speedRect.y, speedRect.width, speedRect.height);

            }

            this.drawActionBar(ctx, gameEngine);

            this.drawPlayerStatBar(ctx);

            this.drawAttackHoverInfo(ctx);

            this.drawChakraHover(ctx);

            this.drawRunHover(ctx);
            if (this.pet != undefined) {
                this.pet.draw(ctx, this.petImageIndex, 100);
            }


            if (this.dodged === true) {
                ctx.font = "bold 20px Arial";
                ctx.fillStyle = "#FFF";
                ctx.lineWidth = 1;
                ctx.fillText('dodged', 180, 160);

            }

            for (let i = 0; i < this.enemyDodged.length; i++) {
                if (this.enemyOne == true) {
                    this.EnemydodgeCoordinates[i].x = 820;
                    this.EnemydodgeCoordinates[i].y = 100;
                }
                if (this.enemyDodged[i] === true) {
                    ctx.font = "bold 20px Arial";
                    ctx.fillStyle = "#FFF";
                    ctx.fillText('dodged', this.EnemydodgeCoordinates[i].x, this.EnemydodgeCoordinates[i].y);

                }
            }

            this.player.drawGold(ctx);

            this.bottomBar.drawBottom(ctx, this.hostMessage);

        }

        if (this.playerTitleBar === true) {
            ctx.drawImage(this.imageLoader.images.title_bar, 0, 20, 1000, 64);
            ctx.font = " 30px Arial";
            ctx.fillStyle = "#000";

            ctx.fillText(this.player.jutsu[this.jutsuIndex].name, 500, 60);

        }

    }


    drawAttackHoverInfo(ctx) {
        for (let i = 0; i < this.player.jutsu.length; i++) {
            if (this.displayHoverItem[i] === true) {

                ctx.fillStyle = "#fff";
                ctx.fillRect(jutsuCoordinates[i].x, jutsuCoordinates[i].y + 55, 110, 80);
                ctx.font = "20px Arial bold";
                ctx.fillStyle = "#000";
                ctx.fillText(this.player.jutsu[i].name, jutsuCoordinates[i].x + 10, jutsuCoordinates[i].y + 70);
                ctx.font = "15px Arial";
                ctx.fillStyle = "#0000FF";
                ctx.fillText("Chakra:" + " " + this.player.jutsu[i].chakraLoss, jutsuCoordinates[i].x + 10, jutsuCoordinates[i].y + 90);
                ctx.fillStyle = "#FF0000";
                ctx.fillText("Damage:" + " " + this.player.jutsu[i].power, jutsuCoordinates[i].x + 10, jutsuCoordinates[i].y + 105);
                ctx.fillStyle = "#000";
                ctx.fillText("Accruacy:" + " " + this.player.jutsu[i].accuracy, jutsuCoordinates[i].x + 10, jutsuCoordinates[i].y + 120);

            }
        }
    }


    drawPlayerStatBar(ctx) {
        let statHealthWidth = (this.HealthWidth * 187) / 100;

        if (statHealthWidth < 0) {
            statHealthWidth = 0;
        }

        let chakraWidth = calculateChakraPercentage(this.player);

        let chakraStat = (chakraWidth * 187) / 100;

        ctx.drawImage(this.statBarArray[this.game.ninjaIndex], 0, 0, 300, 70);
        ctx.drawImage(
            this.imageLoader.images.healthBarInner,
            100,
            26,
            statHealthWidth,
            12
        );

        ctx.font = "10px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText(Math.round(this.player.health) + "/" + "100", 170, 36);

        ctx.drawImage(
            this.imageLoader.images.chakra_stat,
            100,
            40,
            chakraStat,
            12
        );

        ctx.fillText(Math.round(this.player.chakra) + "/" + "100", 170, 50);

        ctx.font = "bold 15px Arial";
        ctx.fillStyle = "#fbcf03";
        ctx.fillText("Lv " + this.player.level, 100, 25);
    }

    drawPlayerHealthBar(ctx) {
        this.HealthWidth = calculatHealthPercentage(this.player);

        if (this.HealthWidth < 0) {
            this.HealthWidth = 0;
        }
        ctx.font = "15px Arial bold";
        ctx.fillStyle = "#fff";
        ctx.fillText("You" + " " + "(" + this.player.name + ")", healthBarCoordinates.x + 10, healthBarCoordinates.y);

        ctx.drawImage(
            this.imageLoader.images.healthBarOuter,
            healthBarCoordinates.x,
            healthBarCoordinates.y,
            100 + 6,
            10
        )

        ctx.drawImage(
            this.imageLoader.images.healthBarInner,
            healthBarCoordinates.x + 3,
            healthBarCoordinates.y + 1,
            this.HealthWidth,
            6
        )
    }



    drawActionBar(ctx) {
        ctx.drawImage(this.imageLoader.images.actionBar, 200, 400);

        this.player.drawActionBarNinja(ctx, 0, 50, this.actionBarPlayerCoordinates.x, this.actionBarPlayerCoordinates.y);

        if (!this.selectJutsuenabled) {
            this.actionBarPlayerCoordinates.x += this.player.speed;
        }

        if (this.pet != undefined) {
            this.pet.drawActionBarPet(ctx, 0, 50, this.actionBarPetCoordinates.x, this.actionBarPetCoordinates.y);

            this.actionBarPetCoordinates.x += this.pet.speed;

            if (this.actionBarPetCoordinates.x >= 800) {
                this.actionBarPetCoordinates.x = 800;
                this.player.speed = 0;
                for (let i = 0; i < this.enemyArray.length; i++) {
                    this.enemyArray[i].speed = 0;
                }
                if (this.petAttackTime === true) {
                    this.petAttack();
                }

            }

        }

        for (let i = 0; i < this.enemyArray.length; i++) {
            this.enemyArray[i].drawActionBarNinja(ctx, 0, 50, this.actionBarEnemyCoordinates[i].x, this.actionBarEnemyCoordinates[i].y);
            this.actionBarEnemyCoordinates[i].x += this.enemyArray[i].speed;

            if (this.actionBarEnemyCoordinates[i].x >= 800) {
                this.actionBarEnemyCoordinates[i].x = 800;
                this.player.speed = 0;
                if (this.pet != undefined) {
                    this.pet.speed = 0;

                }
                if (this.enemyArray.length === 1) {
                    if (this.enemyAttackTimeArray[i] === true) {
                        this.enemyAttack(i);
                    }
                } else {
                    for (let j = 0; j < this.enemyArray.length; j++) {
                        if (i != j) {
                            this.enemyArray[j].speed = 0;
                            if (this.enemyAttackTimeArray[i] === true) {
                                this.enemyAttack(i);
                            }
                        }
                    }
                }

            }
        }


        if (this.actionBarPlayerCoordinates.x >= 800 && this.clicked === false) {
            this.hostMessage = "It is your turn now, " + this.player.name + "!";
            this.actionBarPlayerCoordinates.x = 800;
            this.selectJutsuenabled = true;
            this.renderPlayerAttacks = true;
            if (this.pet != undefined) {
                this.pet.speed = 0;
            }
            for (let i = 0; i < this.enemyArray.length; i++) {
                this.enemyArray[i].speed = 0;
            }
        }

    }

    drawEnemyHealthBar(ctx) {
        var Healthwidth = [];

        for (let i = 0; i < this.enemyArray.length; i++) {
            if (this.enemyOne === true) {
                this.enemyHealthBarCoordinates[0].x = 800;
                this.enemyHealthBarCoordinates[0].y = 300;
            }
            Healthwidth[i] = calculatHealthPercentage(this.enemyArray[i]);

            if (Healthwidth[i] < 0) {
                Healthwidth[i] = 0;
            }
            ctx.drawImage(
                this.imageLoader.images.healthBarOuter,
                this.enemyHealthBarCoordinates[i].x,
                this.enemyHealthBarCoordinates[i].y,
                100 + 6,
                10
            );

            ctx.drawImage(
                this.imageLoader.images.healthBarInner,
                this.enemyHealthBarCoordinates[i].x + 3,
                this.enemyHealthBarCoordinates[i].y + 1,
                Healthwidth[i],
                6
            );

            ctx.font = "15px Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText(this.enemyArray[i].name, this.enemyHealthBarCoordinates[i].x + 30,
                this.enemyHealthBarCoordinates[i].y, );

        }

    }

    drawFightBackground(ctx) {
        ctx.drawImage(
            this.imageLoader.images.bg_fight,
            0,
            0,
            1000,
            500
        )
    }

    drawPlayerAttacks(ctx) {
        this.player.speed = this.playerSpeed;

        ctx.drawImage(this.imageLoader.images.run, this.runRect[0].x, this.runRect[0].y, this.runRect[0].width, this.runRect[0].height);

        for (let i = 0; i < this.player.jutsu.length; i++) {
            if (this.player.jutsu[i].chakraLoss > this.player.chakra ||
                this.player.jutsu[i].count != 0
            ) {
                //pass
                this.jutsuOpacity[i] = 0.4;
            } else {
                this.jutsuOpacity[i] = 1;
            }
            ctx.save();
            ctx.globalAlpha = this.jutsuOpacity[i];
            ctx.drawImage(
                this.player.jutsu[i].image,
                jutsuCoordinates[i].x, jutsuCoordinates[i].y, 50, 50
            );
            ctx.restore();

            if (this.player.jutsu[i].count != 0) {
                ctx.font = "15px Arial";
                ctx.fillStyle = "#fff";
                ctx.fillText(this.player.jutsu[i].count, jutsuCoordinates[i].x + 40, jutsuCoordinates[i].y + 45);
            }

        }
        ctx.drawImage(this.imageLoader.images.chakra_charge, this.chakraChargeCoordinates[0].x, this.chakraChargeCoordinates[0].y, this.chakraChargeCoordinates[0].width, this.chakraChargeCoordinates[0].height);

    }

    increasePlayerSpeed(event) {

        let clickCoordinates = getMouseCoordinates(this.canvas, event);
        if (this.renderPlayerAttacks === false) {
            if (isSelected(clickCoordinates.x, clickCoordinates.y, speedRect, speedRect.width, speedRect.height)) {
                this.player.speed += 0.1;
            }
        }

    }


    run(event) {

        let clickCoordinates = getMouseCoordinates(this.canvas, event);
        if (this.renderPlayerAttacks === true) {
            if (isSelected(clickCoordinates.x, clickCoordinates.y, this.runRect[0], this.runRect[0].width, this.runRect[0].height)) {
                this.resetComponents();

                this.setDefeat();
            }

        }
    }

    setDefeat() {
        this.audioLoader.play('defeat');
        if (this.player.health < 10) {
            this.player.health = 10;
        }
        this.player.jutsu = this.originalJutsuArray;
        for (let i = 0; i < this.player.jutsu.length; i++) {
            this.player.jutsu[i].count = 0;
        }

        this.game.gameState = GAME_STATE.GAME_DEFEAT;
    }

    displayDetails(event) {

        if (this.selectJutsuenabled === true && this.clicked === false) {
            displayInfo(this.canvas, event, jutsuCoordinates, this.displayHoverItem);
        }
    }

    selectJutsu(event) {
        if (this.selectJutsuenabled === true) {
            this.hostMessage = "";

            for (let i = 0; i < this.displayHoverItem.length; i++) {
                this.displayHoverItem[i] = false;
            }
            let clickCoordinates = getMouseCoordinates(this.canvas, event);


            for (let i = 0; i < this.player.jutsu.length; i++) {

                if (isSelected(clickCoordinates.x, clickCoordinates.y, jutsuCoordinates[i], 50, 50) && this.clicked === false && this.player.jutsu[i].count === 0) {
                    if (this.player.jutsu[i].chakraLoss <= this.player.chakra) {

                        this.player.jutsu[i].count = 4;

                        for (let j = 0; j < this.player.jutsu.length; j++) {
                            if (i != j) {
                                if (this.player.jutsu[j].count != 0) {
                                    this.player.jutsu[j].count--;
                                }
                            }

                        }

                        this.clicked = true;
                        this.renderPlayerAttacks = false;
                        this.jutsuIndex = i;
                        this.playerImageIndex = this.jutsuIndex + 1;
                        this.playerAttack();
                    }

                } else if (isSelected(clickCoordinates.x, clickCoordinates.y, {
                        x: 800,
                        y: 0
                    }, 63, 54) && this.clicked === false) {
                    this.audioLoader.play('charge');
                    this.clicked = true;
                    this.renderPlayerAttacks = false;

                    this.player.chakra += 40;
                    if (this.player.chakra > 100) {
                        this.player.chakra = 100;

                    }

                    setTimeout(function () {

                        for (let i = 0; i < this.enemyArray.length; i++) {
                            this.enemyArray[i].speed = this.enemySpeedArray[i];
                        }
                        if (this.pet != undefined) {
                            this.pet.speed = this.petSpeed;

                        }
                        this.actionBarPlayerCoordinates.x = 200;

                        this.clicked = false;
                        this.selectJutsuenabled = false;
                    }.bind(this), 500);

                }
            }


        }
    }



    selectEnemy(event) {

        let clickCoordinates = getMouseCoordinates(this.canvas, event);
        for (let i = 0; i < this.enemyCoordinates.length; i++) {
            if (isSelected(clickCoordinates.x, clickCoordinates.y, this.enemyCoordinates[i], 100, 100)) {
                this.selectedEnemy = i;
            }
        }

    }


    playerAttack() {
        this.audioLoader.play('punch');
        this.playerTitleBar = true;

        if (this.enemyOne === true) {
            this.player.positionX = 700;
        } else {
            if (this.enemyArray.length != 1) {
                this.player.positionX = enemyPosition[this.selectedEnemy].x - 160;
                this.player.positionY = enemyPosition[this.selectedEnemy].y;
            } else {


                if (this.flag === true) {
                    this.player.positionX = enemyPosition[1].x - 160;
                    this.player.positionY = enemyPosition[1].y;
                } else {
                    this.player.positionX = enemyPosition[this.selectedEnemy].x - 160;
                    this.player.positionY = enemyPosition[this.selectedEnemy].y;
                }

            }

        }

        this.enemyOpacityArray[this.selectedEnemy] = 0.4;

        let dodge = getRandomArbitrary(0, 1);
        if (dodge < this.player.jutsu[this.jutsuIndex].accuracy) {
            let damage = computeDamage(this.player, this.enemyArray[this.selectedEnemy], this.jutsuIndex);
            this.enemyArray[this.selectedEnemy].health -= damage;
        } else {
            this.enemyDodged[this.selectedEnemy] = true;
            setTimeout(function () {
                this.enemyDodged[this.selectedEnemy] = false;
            }.bind(this), 1000)

        }
        this.enemyImageIndexArray[this.selectedEnemy] = this.enemyArray[this.selectedEnemy].imageArray.length - 1;

        this.player.chakra -= this.player.jutsu[this.jutsuIndex].chakraLoss;

        setTimeout(function () {
            this.player.positionX = 155;
            this.player.positionY = 190;
            this.enemyOpacityArray[this.selectedEnemy] = 1;

            this.playerTitleBar = false;
            this.enemyImageIndexArray[this.selectedEnemy] = 0;
            this.playerImageIndex = 0;
            for (let k = 0; k < this.enemyArray.length; k++) {
                if (this.enemyArray[k].health <= 0) {
                    if (k === 0) {
                        this.flag = true;
                    }
                    this.enemyArray.splice(k, 1);
                    this.enemySpeedArray.splice(k, 1);
                    this.enemyAttackTimeArray.splice(k, 1);
                    this.enemyImageIndexArray.splice(k, 1);
                    this.enemyHealthBarCoordinates.splice(k, 1);
                    this.actionBarEnemyCoordinates.splice(k, 1);
                    this.enemyCoordinates.splice(k, 1);
                    this.enemyDaggerPosition.splice(k, 1);
                    this.enemyDaggerFixedPosition.splice(k, 1);
                    this.EnemydodgeCoordinates.splice(k, 1);
                    if (this.selectedEnemy === 0) {
                        this.selectedEnemy = 1
                    }
                    if (this.selectedEnemy === 1) {
                        this.selectedEnemy = 0;
                    }

                }
            }
            if (this.enemyArray.length === 0) {
                this.setVictory();
            } else {

                for (let i = 0; i < this.enemyArray.length; i++) {
                    this.enemyArray[i].speed = this.enemySpeedArray[i];

                }
                if (this.pet != undefined) {
                    this.pet.speed = this.petSpeed;

                }
                this.actionBarPlayerCoordinates.x = 200;
            }
            this.clicked = false;
            this.selectJutsuenabled = false;
        }.bind(this), 2000);
    }

    setVictory() {
        this.audioLoader.play('victory');
        this.player.gold += 200;
        this.player.jutsu = this.originalJutsuArray;
        this.player.level += 1;
        this.resetComponents();
        if (this.player.health < 10) {
            this.player.health = 10;
        }

        for (let i = 0; i < this.player.jutsu.length; i++) {
            this.player.jutsu[i].count = 0;
        }

        this.game.gameState = GAME_STATE.GAME_VICTORY;
    }

    petAttack() {
        this.audioLoader.play('punch');

        this.enemyOpacityArray[0] = 0.4;
        this.petImageIndex = 1;

        if (this.enemyOne === true) {
            this.pet.positionX = 700;
            this.pet.positionY = 240;
        } else {
            if (this.enemyArray.length != 1) {
                this.pet.positionX = enemyPosition[0].x - 160;
                this.pet.positionY = enemyPosition[0].y + 40;
            } else {

                if (this.flag === true) {
                    this.pet.positionX = enemyPosition[1].x - 160;
                    this.pet.positionY = enemyPosition[1].y+30;
                } else {
                    this.pet.positionX = enemyPosition[0].x - 160;
                    this.pet.positionY = enemyPosition[0].y+30;
                }
            }

        }


        let damage = (this.pet.power / this.enemyArray[0].defense) * this.pet.accuracy;
        this.enemyArray[0].health -= damage;
        this.enemyImageIndexArray[0] = this.enemyArray[0].imageArray.length - 1;
        this.petAttackTime = false;
        setTimeout(function () {
            this.pet.positionX = 130;
            this.pet.positionY = 320;
            this.petImageIndex = 0;
            this.enemyImageIndexArray[0] = 0;
            this.enemyOpacityArray[0] = 1;

            for (let k = 0; k < this.enemyArray.length; k++) {
                if (this.enemyArray[k].health <= 0) {
                    if (k === 0) {
                        this.flag = true;
                    }
                    this.enemyArray.splice(k, 1);
                    this.enemySpeedArray.splice(k, 1);
                    this.enemyAttackTimeArray.splice(k, 1);
                    this.enemyImageIndexArray.splice(k, 1);
                    this.enemyHealthBarCoordinates.splice(k, 1);
                    this.actionBarEnemyCoordinates.splice(k, 1);
                    this.enemyCoordinates.splice(k, 1);
                    this.enemyDaggerPosition.splice(k, 1);

                }
            }
            if (this.enemyArray.length === 0) {
                this.setVictory();

            } else {

                for (let i = 0; i < this.enemyArray.length; i++) {
                    this.enemyArray[i].speed = this.enemySpeedArray[i];
                }
                this.player.speed = this.playerSpeed;

                this.actionBarPetCoordinates.x = 200;
            }
            this.petAttackTime = true;

        }.bind(this), 2000);

    }

    enemyAttack(i) {

        this.audioLoader.play('punch');

        this.playerOpacity = 0.4;
        this.playerImageIndex = this.player.imageArray.length - 1;

        let jutsuIndexEnemy = getRandomInt(0, 2);

        this.enemyArray[i].positionX = -340;
        this.enemyArray[i].positionY = 190;
        this.enemyImageIndexArray[i] = jutsuIndexEnemy + 1;
        this.hostMessage = this.enemyArray[i].name + " used " + this.enemyArray[i].jutsu[jutsuIndexEnemy].name + "!";

        let dodge = getRandomArbitrary(0, 1);

        if (dodge < this.enemyArray[i].jutsu[jutsuIndexEnemy].accuracy) {
            let damage = computeDamage(this.enemyArray[i], this.player, jutsuIndexEnemy);
            this.player.health -= damage;
        } else {
            this.dodged = true;
            setTimeout(function () {
                this.dodged = false;
            }.bind(this), 1000)
        }

        calculatHealthPercentage(this.player);
        this.enemyAttackTimeArray[i] = false;
        setTimeout(function () {
            if (this.enemyOne === true) {
                this.enemyArray[i].positionX = -enemyPosition[1].x;
                this.enemyArray[i].positionY = enemyPosition[1].y;
            } else {

                if (this.enemyArray.length != 1) {
                    this.enemyArray[i].positionX = -enemyPosition[i].x;
                    this.enemyArray[i].positionY = enemyPosition[i].y;
                } else {
                    if (this.flag === true) {
                        this.enemyArray[i].positionX = -enemyPosition[1].x;
                        this.enemyArray[i].positionY = enemyPosition[1].y;
                    } else {
                        this.enemyArray[i].positionX = -enemyPosition[0].x;
                        this.enemyArray[i].positionY = enemyPosition[0].y;
                    }

                }


            }
            this.hostMessage = "";
            this.playerOpacity = 1;
            this.playerImageIndex = 0;
            this.enemyImageIndexArray[i] = 0;
            if (this.player.health <= 0) {

                this.resetComponents();

                this.setDefeat();

            } else {
                this.actionBarEnemyCoordinates[i].x = 200;
                this.player.speed = this.playerSpeed;
                if (this.pet != undefined) {
                    this.pet.speed = this.petSpeed;

                }
                for (let k = 0; k < this.enemyArray.length; k++) {
                    this.enemyArray[k].speed = this.enemySpeedArray[k];
                }
            }
            this.enemyAttackTimeArray[i] = true;
        }.bind(this), 2000);

    }


    displayChargeHover(event) {
        displayInfo(this.canvas, event, this.chakraChargeCoordinates, this.chakraHoverDisplay);
    }

    displayRunHover(event) {
        displayInfo(this.canvas, event, this.runRect, this.runHoverDisplay);
    }


    drawChakraHover(ctx) {
        if (this.chakraHoverDisplay[0] === true) {

            this.chakraChargeCoordinates[0].width = this.chakraChargeCoordinates[0].scaled_width;
            this.chakraChargeCoordinates[0].height = this.chakraChargeCoordinates[0].scaled_height;
        } else {
            this.chakraChargeCoordinates[0].height = this.chakraChargeCoordinates[0].original_height;
            this.chakraChargeCoordinates[0].width = this.chakraChargeCoordinates[0].original_width;
        }
    }

    drawRunHover(ctx) {

        if (this.runHoverDisplay[0] === true) {
            this.runRect[0].width = this.runRect[0].scaled_width;
            this.runRect[0].height = this.runRect[0].scaled_height;
        } else {
            this.runRect[0].height = this.runRect[0].original_height;
            this.runRect[0].width = this.runRect[0].original_width;
        }
    }

    resetComponents() {
        this.player.speed = this.playerSpeed;
        for (let k = 0; k < this.enemyArray.length; k++) {
            this.enemyArray[k].speed = this.enemySpeedArray[k];
        }
        if (this.pet != undefined) {
            this.pet.speed = this.petSpeed;

        }
    }

}
