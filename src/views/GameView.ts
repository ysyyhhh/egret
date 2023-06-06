module game 
{
    //------------------------------------------------------------------------------
    export class Ball
    {
        row:number;
        col:number;
        colorValue:number;
        digitValue:number;
        magicValue:number;
        state:number; // 0:无效状态， 1:正常状态, 2:已选中状态
        display:eui.Component;
        blockImage:eui.Image;
        valueLabel:eui.BitmapLabel;
        localPos:egret.Point; // 本地位置
        worldPos:egret.Point; // 世界位置
        worldBounds:egret.Rectangle; // 世界包围盒
    }

    //------------------------------------------------------------------------------
    export class GameView extends ui.BaseUI
    {
        private menuLayer:eui.Group;

        private contentLayer:eui.Group;
        private shapeLayer:eui.Group;
        private addBtn:eui.Button;
        private reduceBtn:eui.Button;
        private settingBtn:eui.Button;

        private levelLabel:eui.BitmapLabel;
        private scoreLabel:eui.Label;
        private stepLabel:eui.Label;
        private chipsLabel:eui.BitmapLabel;
        private reduceLabel:eui.Label;
        private addLabel:eui.Label;
        private comboScoreLabel:eui.BitmapLabel;
        private comboCountLabel:eui.BitmapLabel;
        private comboImage:eui.Image;

        private reduceTipsLabel:eui.Label;

        private isVideoShowed:boolean = false;
        private showVideoTimeout:number;

        private roundItems:RoundItem[];

        private worldPos:egret.Point;

        private balls:Ball[];
        private selectedBalls:Ball[];
        private selectedBall:Ball;

        private winScore:number = 0;
        private winCombo:number = 0;
        private winColorValue:number = 0;

        private lineShape:egret.Shape;
        private guideLineShape:egret.Shape;

        private track:Track;

        private curStep:number = 0;
        private curGuideStep:number = 0;
        private guideFingerImage:eui.Image;
        private guideTipsLabel:eui.Label;
        private twinkleLayer:eui.Group;
        private guideBall:Ball;
        private guideEffect:eui.Image;

        private freeReduceState:boolean = false;

        private lastOpTime:number = 0;
        private lastTipsTime:number = 0;

        private explodeEffect:egret.MovieClip;
        private bombEffect:egret.MovieClip;

        constructor()
        {
            super();
            this.skinName = new GameViewSkin();
            this.adaptationWidth();
            this.adaptationHeight();
            if(uniLib.Global.isVivogame) window.platform.showBannerAdvertisement();
            this.init();
        }

        addUIListener(): void
        {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            uniLib.EventListener.getInstance().addEventListener(EventConsts.EVENT_UPDATE_GAME_INFO, this.updateGameInfo, this);
            uniLib.EventListener.getInstance().addEventListener(EventConsts.EVENT_ADD_SCORE, this.onAddScore, this);
            uniLib.EventListener.getInstance().addEventListener(EventConsts.EVENT_PROBABILITY_CHANGED, this.onProbabilityChanged, this);
            uniLib.EventListener.getInstance().addEventListener(EventConsts.EVENT_STEP_NOTENOUGH, this.onEventHandle, this);
            this.contentLayer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.updateFrame, this);
        }

        removeUIListener(): void
        {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            uniLib.EventListener.getInstance().removeEventListener(EventConsts.EVENT_UPDATE_GAME_INFO, this.updateGameInfo, this);
            uniLib.EventListener.getInstance().removeEventListener(EventConsts.EVENT_ADD_SCORE, this.onAddScore, this);
            uniLib.EventListener.getInstance().removeEventListener(EventConsts.EVENT_PROBABILITY_CHANGED, this.onProbabilityChanged, this);
            uniLib.EventListener.getInstance().removeEventListener(EventConsts.EVENT_STEP_NOTENOUGH, this.onEventHandle, this);
            this.contentLayer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.removeEventListener(egret.Event.ENTER_FRAME, this.updateFrame, this);
        }

        //------------------------------------------------------------------------------
        public destroy()
        {
            this.stopGuideEffect();
            
            if(this.lineShape)
            {
                this.lineShape.parent.removeChild(this.lineShape);
                this.lineShape = null;
            }
            for(let i = 0; i < this.roundItems.length; i++)
            {
                this.roundItems[i].destroy();
            }

            if(this.track)
            {
                this.track.destroy();
                if(this.track.parent) this.track.parent.removeChild(this.track);
                this.track = null;
            }

            this.roundItems.length = 0;
            this.selectedBalls.length = 0;
            this.selectedBall = null;
            this.worldPos = null;
            super.destroy();
        }

        private curScore:number = 0;
        //------------------------------------------------------------------------------
        get score() : number
        {
            return this.curScore;
        }

        //------------------------------------------------------------------------------
        set score(value:number)
        {
            this.curScore = value;
        }

        //------------------------------------------------------------------------------
        private updateGameInfo()
        {
            this.chipsLabel.text = GameInfo.instance.curChips.toString();
            this.scoreLabel.text = GameInfo.instance.curScore.toString();
            this.stepLabel.text = this.curStep.toString();
        }

        //------------------------------------------------------------------------------
        private onAddScore(evt: egret.Event)
        {
            let self = this;
            let curValue = evt.data.curValue;
            let addValue = evt.data.addValue;
            let targetScore = curValue + addValue;
            this.curScore = curValue;
            egret.Tween.get(this, {loop:false, onChange:this.onScoreChange, onChangeObj:this}).to({score:targetScore}, 500).call(()=>{
                egret.Tween.removeTweens(self);
            }, this);
        }

        //------------------------------------------------------------------------------
        private onScoreChange()
        {
            this.scoreLabel.text = Math.floor(this.curScore).toString();
        }

        //------------------------------------------------------------------------------
        // 颜色分布权重发生改变
        //------------------------------------------------------------------------------
        private onProbabilityChanged(evt: egret.Event)
        {
            let colorValue = evt.data;

            let curRoundItem:RoundItem = null;

            let allocatedItems:RoundItem[] = [];

            for(let i = 0; i < this.roundItems.length; i++)
            {
                let roundItem:RoundItem = this.roundItems[i];

                if(roundItem.colorValue == colorValue)
                {
                    curRoundItem = roundItem;
                }
                else if(roundItem.initWeight == roundItem.curWeight)
                {
                    allocatedItems.push(roundItem);
                }
            }

            if(null == curRoundItem || allocatedItems.length <= 0) return;

            let weightProbability = 0.7;
            let sumWeight = curRoundItem.curWeight * (1 - weightProbability);
            curRoundItem.curWeight = curRoundItem.curWeight * weightProbability;

            let preWeight = sumWeight / allocatedItems.length;

            for(let i = 0; i < allocatedItems.length; i++)
            {
                let item = allocatedItems[i];
                item.curWeight = item.curWeight + preWeight;
                item.initWeight = item.curWeight;
            }

            let testArr:number[] = [];
            let sum:number = 0;
            for(let i = 0; i < this.roundItems.length; i++)
            {
                let roundItem:RoundItem = this.roundItems[i];
                testArr.push(roundItem.curWeight);
                sum += roundItem.curWeight;
                GameInfo.instance.config.colorWeights[i] = roundItem.curWeight;
            }

            console.log(testArr, sum);
            
        }

        //------------------------------------------------------------------------------
        private init()
        {
            if(GameConsts.is_iPhoneX) this.menuLayer.top = 80;
            else this.menuLayer.top = 20;

            this.hideComboInfo();
            this.setFreeReduce(false);
            this.guideTipsLabel.text = "";
            this.guideTipsLabel.visible = false;
            this.twinkleLayer.visible = false;

            this.skin["maskGroup"].visible = false;

            this.lineShape = new egret.Shape();
            this.lineShape.touchEnabled = false;
            this.shapeLayer.addChild(this.lineShape);

            this.roundItems = [];
            this.roundItems.push(this.skin["roundItem1"]);
            this.roundItems.push(this.skin["roundItem2"]);
            this.roundItems.push(this.skin["roundItem3"]);
            this.roundItems.push(this.skin["roundItem4"]);

            

            for(let i = 0; i < this.roundItems.length; i++)
            {
                let item:RoundItem = this.roundItems[i];
                item.init(i+1);
            }

            this.levelLabel.text = GameInfo.instance.sceneLevel.toString();

            this.curStep = GameInfo.instance.config.step;

            this.updateGameInfo();

            this.lastOpTime = (new Date()).valueOf();
            this.lastTipsTime = (new Date()).valueOf();
            
        }

        //------------------------------------------------------------------------------
        public resetInit()
        {
            this.stopGuideEffect();
            for(let i = 0; i < this.roundItems.length; i++)
            {
                let item:RoundItem = this.roundItems[i];
                item.resetInit();
            }
            this.lastOpTime = (new Date()).valueOf();
            this.lastTipsTime = (new Date()).valueOf();
            this.levelLabel.text = GameInfo.instance.sceneLevel.toString();
            this.curStep = GameInfo.instance.config.step;
            this.curGuideStep = 0;
            this.guideTipsLabel.text = "";
            this.guideTipsLabel.visible = false;
            this.twinkleLayer.visible = false;
            this.skin["maskGroup"].visible = false;
            this.updateGameInfo();
        }

        //------------------------------------------------------------------------------
        public initData()
        {
            this.createBalls();
        }

        //------------------------------------------------------------------------------
        private initColorBalls()
        {
            let colorNumbers:number[] = [];
            let colorIndies:number[] = [];
            for(let i = 0; i < GameInfo.instance.config.colorWeights.length; i++)
            {
                let weight = GameInfo.instance.config.colorWeights[i];
                let num = Math.round(weight / 100 * 36);
                colorNumbers.push(num);
                colorIndies.push(i+1);
            }

            uniLib.MathUtil.randArray(colorIndies);

            let colorValues:number[] = [];

            for(let i = 0; i < colorNumbers.length; i++)
            {
                let value = colorIndies[i];
                let n = colorNumbers[i];
                for(let j = 0; j < n; j++)
                {
                    colorValues.push(value);
                }

                uniLib.MathUtil.randArray(colorValues);
            }

            uniLib.MathUtil.randArray(colorValues);

            for(let i = 0; i < colorValues.length; i++)
            {
                let colorValue = colorValues[i];
                let ball:Ball = this.balls[i];
                ball.colorValue = colorValue;
                ball.blockImage.source = "block_" + GameInfo.instance.skinId + "_" + colorValue;
            }

        }

        //------------------------------------------------------------------------------
        private initValueBalls()
        {
            let valueNumbers:number[] = [];
            for(let i = 0; i < GameInfo.instance.config.digitalWeights.length; i++)
            {
                let weight = GameInfo.instance.config.digitalWeights[i];
                let num = Math.round(weight / 100 * 36);
                valueNumbers.push(num);
            }

            let values:number[] = [];

            for(let i = 0; i < valueNumbers.length; i++)
            {
                let value = GameInfo.instance.config.digits[i];
                let n = valueNumbers[i];
                for(let j = 0; j < n; j++)
                {
                    values.push(value);
                }

                uniLib.MathUtil.randArray(values);
            }

            uniLib.MathUtil.randArray(values);

            for(let i = 0; i < values.length; i++)
            {
                let digitValue = values[i];
                let ball:Ball = this.balls[i];
                ball.digitValue = digitValue;
                ball.magicValue = digitValue;
                ball.valueLabel.text = digitValue.toString();
                if (digitValue >= 1000) 
                {
                    ball.valueLabel.scaleY = ball.valueLabel.scaleX = 0.75;
                }
                else 
                {
                    ball.valueLabel.scaleY = ball.valueLabel.scaleX = 1;
                }
            }
        }

        //------------------------------------------------------------------------------
        private initGuideBalls(dataList:MatchupData[])
        {
            for(let i = 0; i < dataList.length; i++)
            {
                let data = dataList[i];
                let ball:Ball = this.balls[i];
                ball.digitValue = data.digitValue;
                ball.magicValue = data.digitValue;
                ball.valueLabel.text = ball.digitValue.toString();
                ball.valueLabel.scaleY = ball.valueLabel.scaleX = 1;
                ball.colorValue = data.colorValue;
                ball.blockImage.source = "block_" + GameInfo.instance.skinId + "_" + ball.colorValue;
            }

            let self = this;
            let timeout = egret.setTimeout(()=>{
                egret.clearTimeout(timeout);
                self.showGuide();
            }, this, 300);
        }

        //------------------------------------------------------------------------------
        private initGameMatchupData(gameMatchup:GameMatchup)
        {
            this.curStep = gameMatchup.step;

            for(let i = 0; i < gameMatchup.scoreMap.length; i++)
            {
                let score:number = gameMatchup.scoreMap[i];
                let item:RoundItem = this.roundItems[i];
                item.score = score;
                item.onScoreChange();
            }

            for(let i = 0; i < gameMatchup.matchup.length; i++)
            {
                let data = gameMatchup.matchup[i];
                let ball:Ball = this.balls[i];
                ball.digitValue = data.digitValue;
                ball.magicValue = data.digitValue;
                ball.valueLabel.text = ball.digitValue.toString();
                ball.valueLabel.scaleY = ball.valueLabel.scaleX = 1;
                ball.colorValue = data.colorValue;
                ball.blockImage.source = "block_" + GameInfo.instance.skinId + "_" + ball.colorValue;
            }

            this.updateGameInfo();
        }

        //------------------------------------------------------------------------------
        private createBalls()
        {
            this.balls = [];
            this.track = null;
            this.selectedBalls = [];
            this.selectedBall = null;
            this.worldPos = null;
            this.winCombo = 0;
            this.winScore = 0;
            this.winColorValue = 0;

            let space = 20;
            let width = 0;
            let height = 0;
            let startX = space * 0.5;
            let startY = space * 0.5;

            for(let row = 0; row < 6; row++)
            {
                startX = space * 0.5;
                for(let col = 0; col < 6; col++)
                {
                    let comp:eui.Component = new eui.Component();
                    comp.skinName = "BallItemSkin";
                    width = comp.width;
                    height = comp.height;
                    comp.anchorOffsetX = width * 0.5;
                    comp.anchorOffsetY = height * 0.5;
                    comp.x = startX + comp.anchorOffsetX;
                    comp.y = startY + comp.anchorOffsetY;
                    comp.touchChildren = false;
                    comp.touchEnabled = false;
                    this.contentLayer.addChild(comp);

                    let ball:Ball = new Ball();
                    ball.row = row;
                    ball.col = col;
                    ball.colorValue = 0;
                    ball.digitValue = 0;
                    ball.magicValue = 0;
                    ball.state = 1;
                    ball.display = comp;
                    ball.blockImage = comp.skin["blockImage"];
                    ball.valueLabel = comp.skin["valueLabel"];
                    ball.localPos = new egret.Point(comp.x, comp.y);
                    this.balls.push(ball);

                    startX = startX + width + space;
                }

                startY = startY + height + space;
            }

            if(GameInfo.instance.needGuide && GameInfo.instance.sceneLevel == 1)
            {
                GameInfo.instance.clearGameMatchup();
                this.curGuideStep = 1;
                this.initGuideBalls(GameConsts.GuideInitDataList);
            }
            else
            {
                if(GameInfo.instance.gameMatchup)
                {
                    this.initGameMatchupData(GameInfo.instance.gameMatchup);
                }
                else
                {
                    this.initColorBalls();
                    this.initValueBalls();
                }
                
            } 
            
        }

        //------------------------------------------------------------------------------
        private getBall(row:number, col:number) : Ball
        {
            let index = row * 6 + col;
            let ball:Ball = this.balls[index];
            return ball;
        }

        //------------------------------------------------------------------------------
        private showGuide()
        {
            if(GameInfo.instance.sceneLevel != 1 || !GameInfo.instance.needGuide) return;

            let guideBalls:Ball[] = [];

            if(this.curGuideStep == 1)
            {
                guideBalls.push(this.getBall(5, 5));
                guideBalls.push(this.getBall(5, 4));
                guideBalls.push(this.getBall(4, 3));

                this.guideTipsLabel.text = "连接3个或更多相同色块可消除并获得分数";
                this.guideTipsLabel.visible = true;
            }
            else if(this.curGuideStep == 2)
            {
                guideBalls.push(this.getBall(1, 2));
                guideBalls.push(this.getBall(1, 3));
                guideBalls.push(this.getBall(2, 4));
                guideBalls.push(this.getBall(3, 4));
                guideBalls.push(this.getBall(4, 3));
                guideBalls.push(this.getBall(4, 2));
                guideBalls.push(this.getBall(4, 1));
                guideBalls.push(this.getBall(5, 0));

                this.guideTipsLabel.text = "消除3个或更多连续相同的数字可实现连击";
                this.guideTipsLabel.visible = true;
            }
            else if(this.curGuideStep == 3)
            {
                this.guideTipsLabel.text = "消除全部颜色目标就能通关";
                this.guideTipsLabel.visible = true;
                this.twinkleLayer.visible = true;
                this.twinkleLayer.alpha = 0;
                egret.Tween.get(this.twinkleLayer, {loop:true}).to({alpha:1},300,egret.Ease.sineIn).to({alpha:0},300,egret.Ease.sineOut);

                // let roundLayer:eui.Group = this.skin["roundLayer"];
                // let maskGroup:eui.Group = this.skin["maskGroup"];
                // let maskRectBottom:eui.Rect = this.skin["maskRectBottom"];
                // let top = roundLayer.y + roundLayer.height + 10;
                // maskRectBottom.top = top;
                // maskGroup.visible = true;
            }
            else if(this.curGuideStep == 4)
            {
                this.guideTipsLabel.text = "通关时会根据剩余步数计算奖励分数";
                this.guideTipsLabel.visible = true;

                // let roundLayer:eui.Group = this.skin["roundLayer"];
                // let maskGroup:eui.Group = this.skin["maskGroup"];
                // let maskRectBottom:eui.Rect = this.skin["maskRectBottom"];
                // let top = roundLayer.y + roundLayer.height + 10;
                // maskRectBottom.top = top;
                // maskGroup.visible = true;
            }
            else if(this.curGuideStep == 5)
            {
                this.guideTipsLabel.text = "步数用完且颜色目标未完成则游戏结束";
                this.guideTipsLabel.visible = true;
                // let roundLayer:eui.Group = this.skin["roundLayer"];
                // let maskGroup:eui.Group = this.skin["maskGroup"];
                // let maskRectBottom:eui.Rect = this.skin["maskRectBottom"];
                // let top = roundLayer.y;
                // maskRectBottom.top = top;
                // maskGroup.visible = true;
            }
            else  if(this.curGuideStep >= 6)
            {
                GameInfo.instance.needGuide = false;
                GameInfo.save();
            }

            if(guideBalls.length > 0)
            {
                if(null == this.guideLineShape)
                {
                    this.guideLineShape = new egret.Shape();
                    this.shapeLayer.addChild(this.guideLineShape);
                }
                this.guideLineShape.graphics.clear();

                let guideBall:Ball = guideBalls[0];

                if(this.guideFingerImage)
                {
                    egret.Tween.removeTweens(this.guideFingerImage);
                }
                else
                {
                    this.guideFingerImage = new eui.Image("finger");
                    this.contentLayer.addChild(this.guideFingerImage);
                    this.guideFingerImage.touchEnabled = false;
                }

                this.guideFingerImage.x = guideBall.localPos.x;
                this.guideFingerImage.y = guideBall.localPos.y;

                let posTween:egret.Tween = egret.Tween.get(this.guideFingerImage, {loop:true});
                let alphaTween:egret.Tween = egret.Tween.get(this.guideFingerImage, {loop:true});

                let sumTime = 0;

                this.guideLineShape.graphics.lineStyle(GameConsts.LineSize, GameConsts.LineColors[guideBall.colorValue-1], 1);
                this.guideLineShape.graphics.moveTo(guideBall.localPos.x, guideBall.localPos.y);
                for(let i = 1; i < guideBalls.length; i++)
                {
                    let ball:Ball = guideBalls[i];
                    this.guideLineShape.graphics.lineTo(ball.localPos.x, ball.localPos.y);
                    posTween.to({x:ball.localPos.x, y:ball.localPos.y}, 500);
                    sumTime += 500;
                }

                alphaTween.to({alpha:1}, sumTime).to({alpha:0}, 100).wait(900);

                posTween.wait(1000);

                this.guideLineShape.graphics.endFill();
            
            }
            
        }

        //------------------------------------------------------------------------------
        private hideGuide()
        {
            if(GameInfo.instance.sceneLevel != 1 || !GameInfo.instance.needGuide) return;
            if(this.guideFingerImage)
            {
                egret.Tween.removeTweens(this.guideFingerImage);
                if(this.guideFingerImage.parent) this.guideFingerImage.parent.removeChild(this.guideFingerImage);
                this.guideFingerImage = null;
            }

            if(this.guideLineShape)
            {
                this.guideLineShape.graphics.clear();
                if(this.guideLineShape.parent) this.guideLineShape.parent.removeChild(this.guideLineShape);
                this.guideLineShape = null;
            }

            this.guideTipsLabel.visible = false;

            if(this.twinkleLayer.visible)
            {
                egret.Tween.removeTweens(this.twinkleLayer);
                this.twinkleLayer.visible = false;
            }

            this.skin["maskGroup"].visible = false;
        }

        //------------------------------------------------------------------------------
        private showComboInfo(score:number, combo:number)
        {
            if(combo > 0)
            {
                this.comboImage.visible = true;
                this.comboCountLabel.text = combo.toString();
                this.comboCountLabel.visible = true;
            }
            else
            {
                this.comboImage.visible = false;
                this.comboCountLabel.visible = false;
            }

            this.comboScoreLabel.text = score.toString();
            this.comboScoreLabel.visible = true;
        }

        //------------------------------------------------------------------------------
        private hideComboInfo()
        {
            this.comboImage.visible = false;
            this.comboScoreLabel.visible = false;
            this.comboCountLabel.visible = false;
        }
        //------------------------------------------------------------------------------
        private updateWorldBounds()
        {
            this.worldPos = new egret.Point();
            this.contentLayer.localToGlobal(this.contentLayer.anchorOffsetX, this.contentLayer.anchorOffsetY, this.worldPos);

            for(let i = 0; i < this.balls.length; i++)
            {
                let ball:Ball = this.balls[i];
                ball.worldPos = new egret.Point();
                let display:egret.DisplayObject = ball.display as egret.DisplayObject;
                display.localToGlobal(display.anchorOffsetX, display.anchorOffsetY, ball.worldPos);
                let x = ball.worldPos.x - display.width * 0.5;
                let y = ball.worldPos.y - display.height * 0.5;
                ball.worldBounds = new egret.Rectangle(x, y, display.width, display.height);
            }
        }

        //------------------------------------------------------------------------------
        private dropBall(col:number)
        {
            let fromBall:Ball = null;
            let targetBall:Ball = null;
            let targetRow:number = -1;
            for(let row = 5; row >= 0; row--)
            {
                let index = row * 6 + col;
                let ball:Ball = this.balls[index];
                if(ball.state == 0)
                {
                    targetBall = ball;
                    targetRow = targetBall.row;
                    break;
                }
            }

            if(targetBall)
            {
                for(let row = targetRow-1; row >= 0; row--)
                {
                    let index = row * 6 + col;
                    let ball:Ball = this.balls[index];
                    if(ball.state == 1)
                    {
                        fromBall = ball;
                        break;
                    }
                }

                if(fromBall)
                {
                    fromBall.state = 0;
                    targetBall.state = 1;
                    targetBall.display = fromBall.display;
                    targetBall.valueLabel = fromBall.valueLabel;
                    targetBall.blockImage = fromBall.blockImage;
                    targetBall.colorValue = fromBall.colorValue;
                    targetBall.digitValue = fromBall.digitValue;
                    targetBall.magicValue = fromBall.magicValue;
                    fromBall.display = null;
                    fromBall.valueLabel = null;
                    fromBall.blockImage = null;

                    egret.Tween.get(targetBall.display).to({y:targetBall.localPos.y}, 200);

                    this.dropBall(col);
                }
            }
        }

        //------------------------------------------------------------------------------
        private dropBalls()
        {
            for(let col = 0; col <= 5; col++)
            {
                this.dropBall(col);
            }

            for(let i = 0; i < this.balls.length; i++)
            {
                let ball:Ball = this.balls[i];
                if(ball.state == 0)
                {
                    let startX = ball.localPos.x;
                    let startY = -this.worldPos.y;

                    let comp:eui.Component = new eui.Component();
                    comp.skinName = "BallItemSkin";
                    comp.anchorOffsetX = comp.width * 0.5;
                    comp.anchorOffsetY = comp.height * 0.5;
                    comp.x = startX;
                    comp.y = startY;
                    comp.touchChildren = false;
                    comp.touchEnabled = false;
                    this.contentLayer.addChild(comp);

                    ball.state = 1;
                    ball.display = comp;
                    ball.blockImage = comp.skin["blockImage"];
                    ball.valueLabel = comp.skin["valueLabel"];

                    let colorIndex = uniLib.MathUtil.randomProbability(GameInfo.instance.config.colorWeights);
                    let digitIndex = uniLib.MathUtil.randomProbability(GameInfo.instance.config.digitalWeights);
                    
                    ball.colorValue = colorIndex + 1;
                    ball.digitValue = GameInfo.instance.config.digits[digitIndex];
                    ball.magicValue = ball.digitValue;
                    ball.valueLabel.text = ball.digitValue.toString();
                    ball.blockImage.source = "block_" + GameInfo.instance.skinId + "_" + ball.colorValue;

                    if(ball.digitValue >= 1000)
                    {
                        ball.valueLabel.scaleY = ball.valueLabel.scaleX = 0.75;
                    }
                    else
                    {
                        ball.valueLabel.scaleY = ball.valueLabel.scaleX = 1;
                    }

                    egret.Tween.get(ball.display).to({y:ball.localPos.y}, 200);
                }
            }

            if(GameInfo.instance.needGuide && GameInfo.instance.sceneLevel == 1)
            {
                if(this.curGuideStep == 1)
                {
                    this.curGuideStep = 2;
                    this.initGuideBalls(GameConsts.GuideDropDataList);
                }
                else if(this.curGuideStep == 2)
                {
                    this.curGuideStep = 3;
                    this.showGuide();
                }
                else if(this.curGuideStep == 3)
                {
                    this.curGuideStep = 4;
                    this.showGuide();
                }
                else if(this.curGuideStep == 4)
                {
                    this.curGuideStep = 5;
                    this.showGuide();
                }
                else if(this.curGuideStep == 5)
                {
                    this.curGuideStep = 6;
                    this.showGuide();
                }
                else if(this.curGuideStep == 6)
                {
                    this.curGuideStep = 7;
                }
            }
        }


        //------------------------------------------------------------------------------
        private pickupBall(stageX:number, stageY:number) : Ball
        {
            for(let i = 0; i < this.balls.length; i++)
            {
                let ball:Ball = this.balls[i];
                if((ball.state == 1 || ball.state == 2) && ball.worldBounds.contains(stageX, stageY))
                {
                    return ball;
                }
            }

            return null;
        }

        //------------------------------------------------------------------------------
        private getComboInfo() : {isSelectCombo:boolean, comboCount:number, scoreSum:number}
        {
            this.winScore = 0;
            this.winCombo = 0;
            this.winColorValue = 0;
            let info:{isSelectCombo:boolean, comboCount:number, scoreSum:number} = {"isSelectCombo":false, "comboCount":0, "scoreSum":0};

            if(this.selectedBalls.length <= 0) return info;

            let count:number = 0;

            if(this.selectedBalls.length >= 3)
            {
                info.isSelectCombo = true;
                let score:number = this.selectedBalls[this.selectedBalls.length - 1].digitValue;
                count = 1;
                for(let i = this.selectedBalls.length - 2; i >= 0; i--)
                {
                    if(score != this.selectedBalls[i].digitValue)
                    {
                        if(count < 3) info.isSelectCombo = false;
                        break;
                    }
                    else
                    {
                        ++count;
                    }
                }
            }

            let scoreSum:number = 0;
            let lastScore:number = 0;
            let combo:number = 0;
            count = 0;

            for(let i = 0; i < this.selectedBalls.length; i++)
            {
                let ball:Ball = this.selectedBalls[i];
                scoreSum += ball.magicValue;

                

                if(i > 0)
                {
                    if(lastScore == this.selectedBalls[i].digitValue)
                    {
                        ++count;
                    }
                    else
                    {
                        if(count >= 3) ++combo;
                        count = 1;
                    }
                }
                else
                {
                    count = 1;
                }

                lastScore = this.selectedBalls[i].digitValue;

            }

            if(count >= 3) ++combo;

            this.winScore = scoreSum * combo;
            this.winCombo = combo;
            this.winColorValue = this.selectedBall.colorValue;

            if(this.winScore <= 0) this.winScore = scoreSum;
            
            info.scoreSum = this.winScore;
            info.comboCount = this.winCombo;

            return info;
        
        }

        //------------------------------------------------------------------------------
        private selecteEffect(x:number, y:number, colorValue:number)
        {
            let texture:egret.Texture = RES.getRes("round_hight_" + colorValue);
            let effectImage:eui.Image = new eui.Image(texture);
            effectImage.width = texture.textureWidth;
            effectImage.height = texture.textureHeight;
            effectImage.anchorOffsetX = effectImage.width * 0.5;
            effectImage.anchorOffsetY = effectImage.height * 0.5;
            effectImage.x = x;
            effectImage.y = y;
            effectImage.touchEnabled = false;
            this.addChild(effectImage);
            effectImage.scaleX = effectImage.scaleY = 0;
            effectImage.alpha = 1;

            egret.Tween.get(effectImage).to({scaleX:1.2, scaleY:1.2}, 100).to({alpha:0}, 300).call((target:eui.Image)=>{
                egret.Tween.removeTweens(target);
                target.parent.removeChild(target);
            }, this, [effectImage]);

            let effectImage1:eui.Image = new eui.Image(texture);
            effectImage1.width = texture.textureWidth;
            effectImage1.height = texture.textureHeight;
            effectImage1.anchorOffsetX = effectImage1.width * 0.5;
            effectImage1.anchorOffsetY = effectImage1.height * 0.5;
            effectImage1.x = x;
            effectImage1.y = y;
            effectImage1.touchEnabled = false;
            this.addChild(effectImage1);
            effectImage1.scaleX = effectImage1.scaleY = 0;
            effectImage1.alpha = 1;

            egret.Tween.get(effectImage1).wait(200).to({scaleX:1.2, scaleY:1.2}, 100).to({alpha:0}, 300).call((target:eui.Image)=>{
                egret.Tween.removeTweens(target);
                target.parent.removeChild(target);
            }, this, [effectImage1]);
        }

        //------------------------------------------------------------------------------
        private addSelectedBall(ball:Ball) : boolean
        {
            if(null == ball) return false;

            if(this.selectedBall)
            {
                if(this.selectedBall.row == ball.row && this.selectedBall.col == ball.col) return false;
                if(this.selectedBall.colorValue != ball.colorValue) return false;
                let diffRow = Math.abs(this.selectedBall.row - ball.row);
                let diffCol = Math.abs(this.selectedBall.col - ball.col);
                if(diffRow > 1 || diffCol > 1) return false;
            }

            let removeBalls:Ball[] = [];
            for(let i = 0; i < this.selectedBalls.length; i++)
            {
                let selectedBall:Ball = this.selectedBalls[i];
                if(selectedBall.row == ball.row && selectedBall.col == ball.col)
                {
                    if(i != this.selectedBalls.length-2) return false;
                    let endIndex = i+1;
                    this.selectedBall = selectedBall;
                    for(let j = endIndex; j < this.selectedBalls.length; j++)
                    {
                        removeBalls.push(this.selectedBalls[j]);
                    }

                    this.selectedBalls = this.selectedBalls.slice(0, endIndex);
                    break;
                }
            }

            if(removeBalls.length > 0)
            {
                for(let i = 0; i < removeBalls.length; i++)
                {
                    let removeBall:Ball = removeBalls[i];
                    removeBall.state = 1;
                    removeBall.magicValue = removeBall.digitValue;
                    removeBall.display.scaleX = 1;
                    removeBall.display.scaleY = 1;
                    removeBall.valueLabel.text = removeBall.digitValue.toString();
                    if(removeBall.digitValue >= 1000)
                    {
                        removeBall.valueLabel.scaleY = removeBall.valueLabel.scaleX = 0.75;
                    }
                    else
                    {
                        removeBall.valueLabel.scaleY = removeBall.valueLabel.scaleX = 1;
                    }
                    // GX.setNomarl(removeBall.display);
                    removeBall.blockImage.source = "block_" + GameInfo.instance.skinId + "_" + removeBall.colorValue;
                }
                window.platform.customInterface("vibrateShort");
            }
            else
            {
                ball.state = 2;
                ball.magicValue = ball.digitValue;
                this.selectedBalls.push(ball);
                this.selectedBall = ball;
                // GX.setLight(ball.display);
                ball.blockImage.source = "sel_block_" + GameInfo.instance.skinId + "_" + ball.colorValue;
                window.platform.customInterface("vibrateShort");
            }

            this.selecteEffect(this.selectedBall.worldPos.x, this.selectedBall.worldPos.y, this.selectedBall.colorValue);

            for(let i = 0; i < this.selectedBalls.length; i++)
            {
                let ball:Ball = this.selectedBalls[i];
                ball.display.scaleX = 1;
                ball.display.scaleY = 1;
                ball.magicValue = ball.digitValue;
                ball.valueLabel.text = ball.digitValue.toString();
                if (ball.digitValue >= 1000) 
                {
                    ball.valueLabel.scaleY = ball.valueLabel.scaleX = 0.75;
                }
                else 
                {
                    ball.valueLabel.scaleY = ball.valueLabel.scaleX = 1;
                }
            }

            let seriesBalls:Ball[] = [];
            let seriesValue:number = 0;
            let seriesCount:number = 0;

            for(let i = 0; i < this.selectedBalls.length; i++)
            {
                let ball:Ball = this.selectedBalls[i];
                if(ball.digitValue != seriesValue)
                {
                    if(seriesCount >= 3)
                    {
                        for(let k = 0; k < seriesBalls.length; k++)
                        {
                            let seriesBall:Ball = seriesBalls[k];
                            seriesBall.display.scaleX = 1.2;
                            seriesBall.display.scaleY = 1.2;
                            seriesBall.magicValue = seriesBall.digitValue * 10;
                            seriesBall.valueLabel.text = seriesBall.magicValue.toString();
                            if (seriesBall.magicValue >= 1000) 
                            {
                                seriesBall.valueLabel.scaleY = seriesBall.valueLabel.scaleX = 0.75;
                            }
                            else 
                            {
                                seriesBall.valueLabel.scaleY = seriesBall.valueLabel.scaleX = 1;
                            }
                        }
                    }

                    seriesBalls.length = 0;
                    seriesValue = ball.digitValue;
                    seriesCount = 1;
                    seriesBalls.push(ball);
                }
                else
                {
                    ++seriesCount;
                    seriesBalls.push(ball);
                }
            }

            if (seriesCount >= 3) 
            {
                for (let k = 0; k < seriesBalls.length; k++) 
                {
                    let seriesBall: Ball = seriesBalls[k];
                    seriesBall.display.scaleX = 1.2;
                    seriesBall.display.scaleY = 1.2;
                    seriesBall.magicValue = seriesBall.digitValue * 10;
                    seriesBall.valueLabel.text = seriesBall.magicValue.toString();
                    if (seriesBall.magicValue >= 1000) 
                    {
                        seriesBall.valueLabel.scaleY = seriesBall.valueLabel.scaleX = 0.75;
                    }
                    else 
                    {
                        seriesBall.valueLabel.scaleY = seriesBall.valueLabel.scaleX = 1;
                    }
                }
            }

            seriesBalls.length = 0;
            seriesValue = 0;
            seriesCount = 0;

            let info:{isSelectCombo:boolean, comboCount:number, scoreSum:number} = this.getComboInfo();

            if (info.isSelectCombo) {
                uniLib.SoundMgr.instance.playSound("combo_sound_mp3", true);
            }
            else {
                let si = this.selectedBalls.length % 8 - 1;
                if(si < 0) si = 0;
                uniLib.SoundMgr.instance.playSound("magicClick" + si + "_mp3", true);
            }

            this.showComboInfo(info.scoreSum, info.comboCount);

            return true;
        }

        //------------------------------------------------------------------------------
        // 消除
        //------------------------------------------------------------------------------
        private clearBallCount = 0;
        private clearup()
        {
            if(null == this.selectedBall) return;

            let targetX = this.selectedBall.display.x;
            let targetY = this.selectedBall.display.y;
            this.clearBallCount = 0;
            let canClearup = true;
            if(this.selectedBalls.length >= 3)
            {
                --this.curStep;
                if(this.curStep < 0) 
                {
                    canClearup = false;
                    this.curStep = 0;
                    uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_STEP_NOTENOUGH);
                }
                this.stepLabel.text = this.curStep.toString();
            }
            if(this.selectedBalls.length >= 3 && canClearup)
            {
                for(let i = 0; i < this.selectedBalls.length; i++)
                {
                    let ball:Ball = this.selectedBalls[i];
                    ball.display.parent.removeChild(ball.display);
                    this.contentLayer.addChild(ball.display);

                    ball.blockImage = null;
                    ball.valueLabel = null;
                    ball.state = 0;
                    ball.colorValue = 0;
                    ball.digitValue = 0;
                    ball.magicValue = 0;

                    ++this.clearBallCount;

                    egret.Tween.get(ball.display).to({x:targetX, y:targetY}, 200).call(this.clearupCompleted, this, [ball]);
                }

                this.playClearupEffects(this.selectedBall.worldPos.x, this.selectedBall.worldPos.y);

                this.hideGuide();
            }
            else
            {
                for(let i = 0; i < this.selectedBalls.length; i++)
                {
                    let ball:Ball = this.selectedBalls[i];
                    ball.display.scaleX = 1;
                    ball.display.scaleY = 1;
                    ball.state = 1;
                    ball.magicValue = ball.digitValue;
                    ball.valueLabel.text = ball.digitValue.toString();
                    if (ball.digitValue >= 1000) 
                    {
                        ball.valueLabel.scaleY = ball.valueLabel.scaleX = 0.75;
                    }
                    else 
                    {
                        ball.valueLabel.scaleY = ball.valueLabel.scaleX = 1;
                    }
                    // GX.setNomarl(ball.display);
                    ball.blockImage.source = "block_" + GameInfo.instance.skinId + "_" + ball.colorValue;
                }

                this.selectedBalls.length = 0;
                this.selectedBall = null;
                this.hideComboInfo();
            }
            
            this.lineShape.graphics.clear();
        }

        //------------------------------------------------------------------------------
        private clearupCompleted(ball:Ball)
        {
            egret.Tween.removeTweens(ball);
            ball.display.parent.removeChild(ball.display);
            ball.display = null;

            --this.clearBallCount;
            if(this.clearBallCount <= 0 && this.selectedBall)
            {
                this.selectedBalls.length = 0;
                this.selectedBall = null;

                let self = this;
                let timeout = egret.setTimeout(() => {
                    egret.clearTimeout(timeout);
                    self.dropBalls();
                }, this, 200);

                this.playTracks();
            }
        }

        //------------------------------------------------------------------------------
        // 播放消除特效
        //------------------------------------------------------------------------------
        private playClearupEffects(x:number, y:number)
        {
            let roundItem:RoundItem = this.roundItems[this.winColorValue-1];
            this.track = new Track(roundItem, this.winScore, x, y);
            this.track.touchEnabled = false;
            this.addChild(this.track);
            uniLib.SoundMgr.instance.playSound("track_sound_mp3", true);

            let action = "explode_effect_" + this.winColorValue;
            let jsonStr = action + "_json";
            let pngStr = action + "_png";

            if(this.explodeEffect)
            {
                this.explodeEffect.removeEventListener(egret.Event.COMPLETE, this.explodeEffectCompleted, this);
                if(this.explodeEffect.parent) this.explodeEffect.parent.removeChild(this.explodeEffect);
                this.explodeEffect = null;
            }

            this.explodeEffect = uniLib.Utils.creatMovieClip(jsonStr, pngStr, action, -1);
            this.explodeEffect.addEventListener(egret.Event.COMPLETE, this.explodeEffectCompleted, this);
            this.addChild(this.explodeEffect);
            this.explodeEffect.x = x;
            this.explodeEffect.y = y;
            this.explodeEffect.gotoAndPlay(0, 1);
            
        }
        //------------------------------------------------------------------------------
        private explodeEffectCompleted()
        {
            if(this.explodeEffect)
            {
                this.explodeEffect.removeEventListener(egret.Event.COMPLETE, this.explodeEffectCompleted, this);
                if(this.explodeEffect.parent) this.explodeEffect.parent.removeChild(this.explodeEffect);
                this.explodeEffect = null;
            }
        }

        //------------------------------------------------------------------------------
        // 开始飞行轨迹效果
        //------------------------------------------------------------------------------
        private playTracks()
        {
            if(this.track) this.track.startTrack(this.playTracksCompleted, this);
        }

        //------------------------------------------------------------------------------
        private playTracksCompleted(track:Track, score:number)
        {
            let self = this;

            uniLib.SoundMgr.instance.playSound("hit_sound_mp3", true);

            if(this.bombEffect)
            {
                this.bombEffect.removeEventListener(egret.Event.COMPLETE, this.bombEffectCompleted, this);
                if(this.bombEffect.parent) this.bombEffect.parent.removeChild(this.bombEffect);
                this.bombEffect = null;
            }

            let resultPoint:egret.Point = new egret.Point();
            track.target.localToGlobal(track.target.width*0.5, track.target.height*0.5, resultPoint);

            let action = "explode_effect_" + this.winColorValue;
            let jsonStr = action + "_json";
            let pngStr = action + "_png";

            this.bombEffect = uniLib.Utils.creatMovieClip(jsonStr, pngStr, action, -1);
            this.bombEffect.addEventListener(egret.Event.COMPLETE, this.bombEffectCompleted, this);
            this.addChild(this.bombEffect);
            this.bombEffect.x = resultPoint.x;
            this.bombEffect.y = resultPoint.y;
            this.bombEffect.gotoAndPlay(0, 1);

            track.target.deductScore(score, true);

            this.hideComboInfo();

            let delayTrack:Track = this.track;

            this.track = null;

            let timeout = egret.setTimeout(()=>{
                egret.clearTimeout(timeout);
                if(delayTrack)
                {
                    delayTrack.destroy();
                    delayTrack = null;
                }
                self.checkWin();
            }, this, 700, [delayTrack]);
        }

        //------------------------------------------------------------------------------
        private bombEffectCompleted()
        {
            if(this.bombEffect)
            {
                this.bombEffect.removeEventListener(egret.Event.COMPLETE, this.bombEffectCompleted, this);
                if(this.bombEffect.parent) this.bombEffect.parent.removeChild(this.bombEffect);
                this.bombEffect = null;
            }
        }

        //------------------------------------------------------------------------------
        private checkWin()
        {
            let isWin = true;
            for(let i = 0; i < this.roundItems.length; i++)
            {
                let item:RoundItem = this.roundItems[i];
                if(item.score > 0)
                {
                    isWin = false;
                }
            }

            if(isWin)
            {
                GameInfo.instance.curScore = GameInfo.instance.curScore + (this.curStep * 100);
                this.curStep = 0;
                this.updateGameInfo();
                uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_GAME_SUCCESS);
            }
            else
            {
                GameInfo.instance.saveGameMatchup(this.curStep, this.balls, this.roundItems);

                if(this.curStep == 0)
                {
                    uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_STEP_NOTENOUGH);
                }
            }

            let userScore = GameInfo.instance.maxScore;

            if (GameInfo.instance.maxScore < GameInfo.instance.curScore) 
            {
                userScore = GameInfo.instance.curScore;
            }

            let userData = new Array();
            userData.push({ key: "score", value: userScore.toString() });
            window.platform.customInterface("friendrankUpdateData", userData);
        }

        //------------------------------------------------------------------------------
        private updateFrame()
        {
            if(GameInfo.instance.needGuide && this.curGuideStep <= 2) return;

            let curTime = (new Date()).valueOf();

            if(curTime - this.lastOpTime > 3500 && null == this.selectedBall && null == this.guideBall && null == this.guideEffect)
            {
                this.lastOpTime = curTime;
                let balls:Ball[] = this.autoFindPaths();
                if(balls && balls.length >= 3)
                {
                    this.guideBall = balls[0];
                    this.playGuideEffect();
                }
            }

            if(curTime - this.lastTipsTime > 8000)
            {
                this.lastTipsTime = curTime;
                this.showTipsAction();
            }
        }

        //------------------------------------------------------------------------------
        private playGuideEffect()
        {
            let colorValue = this.guideBall.colorValue;
            let texture:egret.Texture = RES.getRes("round_hight_" + colorValue);
            this.guideEffect = new eui.Image(texture);
            this.shapeLayer.addChild(this.guideEffect);

            this.guideEffect.touchEnabled = false;
            
            this.guideEffect.anchorOffsetX = texture.textureWidth * 0.5;
            this.guideEffect.anchorOffsetY = texture.textureHeight * 0.5;
            this.guideEffect.x = this.guideBall.localPos.x;
            this.guideEffect.y = this.guideBall.localPos.y;

            this.guideEffect.scaleX = this.guideEffect.scaleY = 0.5;
            this.guideEffect.alpha = 1;

            egret.Tween.get(this.guideEffect).to({scaleX:1.6, scaleY:1.6}, 700);
            egret.Tween.get(this.guideEffect).wait(500).to({alpha:0},200).call(this.playGuideEffect, this);
        }

        //------------------------------------------------------------------------------
        private stopGuideEffect()
        {
            if(this.guideEffect)
            {
                egret.Tween.removeTweens(this.guideEffect);
                this.guideEffect.parent.removeChild(this.guideEffect);
                this.guideEffect = null;
            }

            this.guideBall = null;
        }

        //------------------------------------------------------------------------------
        private showTipsAction()
        {
            egret.Tween.removeTweens(this.addBtn);
            egret.Tween.removeTweens(this.reduceBtn);
            this.addBtn.scaleX = this.addBtn.scaleY = 1;
            this.reduceBtn.scaleX = this.reduceBtn.scaleY = 1;
            egret.Tween.get(this.addBtn, {loop:true}).to({scaleX:1.2, scaleY:1.2}, 200, egret.Ease.sineIn).to({scaleX:1, scaleY:1}, 250, egret.Ease.sineOut);
            egret.Tween.get(this.reduceBtn, {loop:true}).to({scaleX:1.2, scaleY:1.2}, 200, egret.Ease.sineIn).to({scaleX:1, scaleY:1}, 250, egret.Ease.sineOut);
        }

        private hideTipsAction()
        {
            egret.Tween.removeTweens(this.addBtn);
            egret.Tween.removeTweens(this.reduceBtn);
            this.addBtn.scaleX = this.addBtn.scaleY = 1;
            this.reduceBtn.scaleX = this.reduceBtn.scaleY = 1;
        }

        //------------------------------------------------------------------------------
        private onTouchBegin(e: egret.TouchEvent)
        {
            this.lastOpTime = (new Date()).valueOf();
            this.lastTipsTime = (new Date()).valueOf();

            this.hideTipsAction();

            this.stopGuideEffect();

            if(this.curStep <= 0) return;

            if(this.track) return;

            if(null == this.worldPos)
            {
                this.updateWorldBounds();
            }

            let touchX = e.stageX;
            let touchY = e.stageY;

            let ball:Ball = this.pickupBall(touchX, touchY);

            if(ball && this.freeReduceState)
            {
                let self = this;

                this.winColorValue = ball.colorValue;
                this.winCombo = 1;
                this.winScore = ball.magicValue;

                ball.blockImage = null;
                ball.valueLabel = null;
                ball.state = 0;
                ball.colorValue = 0;
                ball.digitValue = 0;
                ball.magicValue = 0;
                ball.display.parent.removeChild(ball.display);
                ball.display = null;

                this.playClearupEffects(ball.worldPos.x, ball.worldPos.y);

                let timeout = egret.setTimeout(() => {
                    egret.clearTimeout(timeout);
                    self.dropBalls();
                }, this, 200);

                this.playTracks();

                this.setFreeReduce(false);

                return;
            }

            let result = this.addSelectedBall(ball);

            if(result)
            {
                egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
                egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            }

        }

        //------------------------------------------------------------------------------
        private onTouchMove(e: egret.TouchEvent) 
        {
            this.lastOpTime = (new Date()).valueOf();
            this.lastTipsTime = (new Date()).valueOf();

            let touchX = e.stageX;
            let touchY = e.stageY;

            let ball:Ball = this.pickupBall(touchX, touchY);

            this.addSelectedBall(ball);

            this.drawSelectedBallLines(touchX, touchY);
        }

        //------------------------------------------------------------------------------
        private onTouchEnd(e: egret.TouchEvent) 
        {
            this.lastOpTime = (new Date()).valueOf();
            this.lastTipsTime = (new Date()).valueOf();
            this.hideTipsAction();
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);

            let touchX = e.stageX;
            let touchY = e.stageY;

            let ball:Ball = this.pickupBall(touchX, touchY);

            this.addSelectedBall(ball);

            this.drawSelectedBallLines(touchX, touchY);

            if(GameInfo.instance.needGuide)
            {
                let cancel:boolean = false;
                console.log("guideStep", this.curGuideStep);
                if(this.curGuideStep == 1 && this.selectedBalls.length >= 3)
                {
                    let guideBall:Ball = this.getBall(5, 5);
                    if(this.selectedBalls[0].row != guideBall.row || this.selectedBalls[0].col != guideBall.col)
                    {
                        cancel = true;
                    }
                }
                else if(this.curGuideStep == 2 && this.selectedBalls.length >= 3)
                {
                    let guideBall:Ball = this.getBall(1, 2);
                    if(this.selectedBalls[0].row != guideBall.row || this.selectedBalls[0].col != guideBall.col)
                    {
                        cancel = true;
                    }
                }

                if(cancel)
                {
                    for(let i = 0; i < this.selectedBalls.length; i++)
                    {
                        let ball:Ball = this.selectedBalls[i];
                        ball.display.scaleX = 1;
                        ball.display.scaleY = 1;
                        ball.state = 1;
                        ball.magicValue = ball.digitValue;
                        ball.valueLabel.text = ball.digitValue.toString();
                        if (ball.digitValue >= 1000) 
                        {
                            ball.valueLabel.scaleY = ball.valueLabel.scaleX = 0.75;
                        }
                        else 
                        {
                            ball.valueLabel.scaleY = ball.valueLabel.scaleX = 1;
                        }
                        ball.blockImage.source = "block_" + GameInfo.instance.skinId + "_" + ball.colorValue;
                    }

                    this.selectedBalls.length = 0;
                    this.selectedBall = null;
                    this.hideComboInfo();
                    this.lineShape.graphics.clear();
                    GX.Tips.showTips("请根据引导操作!");
                    return;
                }
                
            }

            this.clearup();
        }

        //------------------------------------------------------------------------------
        private drawSelectedBallLines(touchX:number, touchY:number)
        {
            this.lineShape.graphics.clear();
            if(null == this.selectedBall) return;
            let color = GameConsts.LineColors[this.selectedBall.colorValue-1];
            this.lineShape.graphics.lineStyle(GameConsts.LineSize, color, 1);
            if(this.selectedBalls.length > 0)
            {
                let ball:Ball = this.selectedBalls[0];
                this.lineShape.graphics.moveTo(ball.display.x, ball.display.y);
            }

            for(let i = 1; i < this.selectedBalls.length; i++)
            {
                let ball:Ball = this.selectedBalls[i];
                this.lineShape.graphics.lineTo(ball.display.x, ball.display.y);
            }

            let localX = touchX - this.worldPos.x;
            let localY = touchY - this.worldPos.y;

            this.lineShape.graphics.lineTo(localX, localY);

            this.lineShape.graphics.endFill();
        }

        //------------------------------------------------------------------------------
        // public drawDebug()
        // {
        //     for(let i = 0; i < this.balls.length; i++)
        //     {
        //         let ball:Ball = this.balls[i];
        //         if(ball.state == 0)
        //         {
        //             let bounds:egret.Rectangle = this.balls[i].worldBounds;

        //             let shape:egret.Shape = new egret.Shape();
        //             shape.touchEnabled = false;
        //             shape.graphics.beginFill(0, 0.5);
        //             shape.graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
        //             shape.graphics.endFill();
        //             egret.MainContext.instance.stage.addChild(shape);
        //         }
                
        //     }
        // }

        //------------------------------------------------------------------------------
        private findPaths(row:number, col:number, newBalls:Ball[]) : boolean
        {
            let inRow = row;
            let inCol = col;

            if(inCol > 5 || inRow > 5) return false;

            let index = inRow * 6 + inCol;
            if(index >= this.balls.length) return false;

            let ball:Ball = this.balls[index];

            if(newBalls.length > 0)
            {
                let lastBall:Ball = newBalls[newBalls.length-1];
                if(lastBall.colorValue == ball.colorValue)
                {
                    newBalls.push(ball);
                }
                else
                {
                    return false;
                }
            }
            else
            {
                newBalls.push(ball);
            }

            if(newBalls.length >= 3) return true;

            let result = this.findPaths(inRow, inCol+1, newBalls);
            if(!result)
            {
                result = this.findPaths(inRow+1, inCol+1, newBalls);
                if(!result)
                {
                    result = this.findPaths(inRow+1, inCol, newBalls);
                    if(!result)
                    {
                        result = this.findPaths(inRow+1, inCol-1, newBalls);
                    }
                }
            }

            return true;

        }

        //------------------------------------------------------------------------------
        private autoFindPaths() : Ball[]
        {
            for(let row = 0; row < 4; row++)
            {
                for(let col = 0; col < 6; col++)
                {
                    let newBalls:Ball[] = [];
                    this.findPaths(row, col, newBalls);

                    if(newBalls.length >= 3)
                    {
                        return newBalls;
                    }

                }
            }

            return null;
        }

        //------------------------------------------------------------------------------
        private onClickTap(e: egret.TouchEvent)
        {
            this.lastOpTime = (new Date()).valueOf();
            this.lastTipsTime = (new Date()).valueOf();
            this.hideTipsAction();

            let self = this;
            if(e.target == this.addBtn)
            {
                let addStep = TableData.tableGameConfig.chipsRewardStep[0];
                let needChips = TableData.tableGameConfig.chipsRewardStep[1];
                if(GameInfo.instance.curChips >= needChips)
                {
                    uniLib.AdPlat.instance.showBanner();
                    if(uniLib.Global.isVivogame) window.platform.showBannerAdvertisement();
                    if(uniLib.Global.isVivogame) window.platform.showNativeAdvertisement();
                    GX.Tips.showPopup("是否确定花费" + needChips + "金币增加" + addStep + "步", ()=>{
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                        GameInfo.instance.curChips -= needChips;
                        GameInfo.save();
                        self.curStep += addStep;
                        uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_GAME_INFO);
                    }, ()=>{
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                    }, this, true);
                }
                else
                {
                    uniLib.AdPlat.instance.showBanner();
                    if(uniLib.Global.isVivogame) window.platform.showBannerAdvertisement();
                    if(uniLib.Global.isVivogame) window.platform.showNativeAdvertisement();
                    GX.Tips.showPopup("金币不足，是否观看视频增加" + addStep + "步", ()=>{
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                        if (!this.isVideoShowed) {
                            this.isVideoShowed = true;
                            uniLib.SoundMgr.instance.pauseBgMusic();
                            if(uniLib.Global.isVivogame) window.platform.showVideoAdvertisement(null, this.onVideoAdCallback, this);
                            else uniLib.AdPlat.instance.showRewardedVideo(this.onVideoAdCallback, this);
                            this.showVideoTimeout = egret.setTimeout(() => {
                                self.isVideoShowed = false;
                                if (self.showVideoTimeout) {
                                    egret.clearTimeout(self.showVideoTimeout);
                                    self.showVideoTimeout = null;
                                }
                            }, this, 3000);
                        }
                    }, ()=>{
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                    }, this, true);
                }
                
            }
            else if(e.target == this.reduceBtn)
            {
                let needChips = TableData.tableGameConfig.chipsReduceReward;
                if(GameInfo.instance.curChips >= needChips)
                {
                    uniLib.AdPlat.instance.showBanner();
                    if(uniLib.Global.isVivogame) window.platform.showBannerAdvertisement();
                    if(uniLib.Global.isVivogame) window.platform.showNativeAdvertisement();
                    GX.Tips.showPopup("是否确定花费" + needChips + "金币任意消除一个色块", ()=>{
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                        GameInfo.instance.curChips -= needChips;
                        GameInfo.save();
                        this.setFreeReduce(true);
                        uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_GAME_INFO);
                    }, ()=>{
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                    }, this, true);
                }
                else
                {
                    uniLib.AdPlat.instance.showBanner();
                    if(uniLib.Global.isVivogame) window.platform.showBannerAdvertisement();
                    if(uniLib.Global.isVivogame) window.platform.showNativeAdvertisement();
                    GX.Tips.showPopup("金币不足，是否观看视频任意消除一次", ()=>{
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                        if (!this.isVideoShowed) {
                            this.isVideoShowed = true;
                            uniLib.SoundMgr.instance.pauseBgMusic();
                            if(uniLib.Global.isVivogame) window.platform.showVideoAdvertisement(null, this.onVideoAdCallbackForReduce, this);
                            else uniLib.AdPlat.instance.showRewardedVideo(this.onVideoAdCallbackForReduce, this);
                            this.showVideoTimeout = egret.setTimeout(() => {
                                self.isVideoShowed = false;
                                if (self.showVideoTimeout) {
                                    egret.clearTimeout(self.showVideoTimeout);
                                    self.showVideoTimeout = null;
                                }
                            }, this, 3000);
                        }
                    }, ()=>{ 
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                     }, this, true);
                }
            }
            else if(e.target == this.settingBtn)
            {
                GX.PopUpManager.addPopUp(new SettingView(), true, 0.8);

                // console.log("autoFindPaths", this.autoFindPaths());

            }
            else if(e.target == this.skin["maskGroup"])
            {
                this.hideGuide();
                this.curGuideStep++;
            }
        }

        //------------------------------------------------------------------------------
        private onVideoAdCallback(status:number)
        {
            this.lastTipsTime = (new Date()).valueOf();
            this.hideTipsAction();

            uniLib.SoundMgr.instance.resumeBgMusic();
            if(this.showVideoTimeout)
            {
                egret.clearTimeout(this.showVideoTimeout);
                this.showVideoTimeout = null;
            }
            this.isVideoShowed = false;
            if(status == 1)
            {
                let addStep = TableData.tableGameConfig.chipsRewardStep[0];
                this.curStep += addStep;
                uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_GAME_INFO);
            }
            else if(status == 0)
            {
                // 视频未看完
                GX.Tips.showTips("完整观看完视频才能增加步数");
            }
            else
            {
                GX.Tips.showTips("获取视频广告失败:" + status);
            }
        }

        //------------------------------------------------------------------------------
        private onVideoAdCallbackForNotenough(status:number)
        {
            this.lastTipsTime = (new Date()).valueOf();
            this.hideTipsAction();

            uniLib.SoundMgr.instance.resumeBgMusic();
            if(this.showVideoTimeout)
            {
                egret.clearTimeout(this.showVideoTimeout);
                this.showVideoTimeout = null;
            }
            let self = this;
            this.isVideoShowed = false;
            if(status == 1)
            {
                let addStep = TableData.tableGameConfig.videoRewardStep;
                this.curStep += addStep;
                uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_GAME_INFO);
            }
            else if(status == 0)
            {
                // 视频未看完
                // GX.Tips.showTips("完整观看完视频才能增加步数");

                uniLib.AdPlat.instance.showBanner();
                GX.Tips.showPopup("完整观看完视频才能增加步数, 是否继续观看视频", ()=>{
                    uniLib.AdPlat.instance.hideBanner();
                    if (!self.isVideoShowed) {
                        self.isVideoShowed = true;
                        uniLib.SoundMgr.instance.pauseBgMusic();
                        if(uniLib.Global.isVivogame) window.platform.showVideoAdvertisement(null, this.onVideoAdCallbackForNotenough, this);
                        else uniLib.AdPlat.instance.showRewardedVideo(self.onVideoAdCallbackForNotenough, self);
                        self.showVideoTimeout = egret.setTimeout(() => {
                            self.isVideoShowed = false;
                            if (self.showVideoTimeout) {
                                egret.clearTimeout(self.showVideoTimeout);
                                self.showVideoTimeout = null;
                            }
                        }, self, 3000);
                    }

                    // let addStep = TableData.tableGameConfig.videoRewardStep;
                    // self.curStep += addStep;
                    // uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_GAME_INFO);
                }, ()=>{
                    uniLib.AdPlat.instance.hideBanner();
                    uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_GAME_OVER);
                }, this, true);
            }
            else
            {
                GX.Tips.showTips("获取视频广告失败:" + status);
                uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_GAME_OVER);
            }
        }

        //------------------------------------------------------------------------------
        private onVideoAdCallbackForReduce(status:number)
        {
            this.lastTipsTime = (new Date()).valueOf();
            this.hideTipsAction();

            uniLib.SoundMgr.instance.resumeBgMusic();
            if(this.showVideoTimeout)
            {
                egret.clearTimeout(this.showVideoTimeout);
                this.showVideoTimeout = null;
            }
            this.isVideoShowed = false;
            if(status == 1)
            {
                this.setFreeReduce(true);
            }
            else if(status == 0)
            {
                // 视频未看完
                GX.Tips.showTips("视频未看完");
            }
            else
            {
                GX.Tips.showTips("获取视频广告失败:" + status);
            }
        }

        //------------------------------------------------------------------------------
        private setFreeReduce(state:boolean)
        {
            this.freeReduceState = state;
            this.reduceTipsLabel.visible = state;
        }

        //-----------------------------------------------------------------------------
        private onEventHandle(evt: egret.Event): void 
        {
            let self = this;
            let data = evt.data;

            if(evt.type == EventConsts.EVENT_STEP_NOTENOUGH)
            {
                uniLib.AdPlat.instance.showBanner();
                let addStep = TableData.tableGameConfig.videoRewardStep;
                GX.Tips.showPopup("步数不足, 是否确定观看视频增加" + addStep + "步", ()=>{
                    uniLib.AdPlat.instance.hideBanner();
                    if (!this.isVideoShowed) {
                        this.isVideoShowed = true;
                        uniLib.SoundMgr.instance.pauseBgMusic();
                        if(uniLib.Global.isVivogame) window.platform.showVideoAdvertisement(null, this.onVideoAdCallbackForNotenough, this);
                        else uniLib.AdPlat.instance.showRewardedVideo(this.onVideoAdCallbackForNotenough, this);
                        this.showVideoTimeout = egret.setTimeout(() => {
                            self.isVideoShowed = false;
                            if (self.showVideoTimeout) {
                                egret.clearTimeout(self.showVideoTimeout);
                                self.showVideoTimeout = null;
                            }
                        }, this, 3000);
                    }
                }, ()=>{
                    uniLib.AdPlat.instance.hideBanner();
                    uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_GAME_OVER);
                }, this, true);

            }
        }

    }
}