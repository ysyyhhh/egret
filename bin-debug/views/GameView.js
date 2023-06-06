var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var game;
(function (game) {
    //------------------------------------------------------------------------------
    var Ball = (function () {
        function Ball() {
        }
        return Ball;
    }());
    game.Ball = Ball;
    __reflect(Ball.prototype, "game.Ball");
    //------------------------------------------------------------------------------
    var GameView = (function (_super) {
        __extends(GameView, _super);
        function GameView() {
            var _this = _super.call(this) || this;
            _this.isVideoShowed = false;
            _this.winScore = 0;
            _this.winCombo = 0;
            _this.winColorValue = 0;
            _this.curStep = 0;
            _this.curGuideStep = 0;
            _this.freeReduceState = false;
            _this.lastOpTime = 0;
            _this.lastTipsTime = 0;
            _this.curScore = 0;
            //------------------------------------------------------------------------------
            // 消除
            //------------------------------------------------------------------------------
            _this.clearBallCount = 0;
            _this.skinName = new GameViewSkin();
            _this.adaptationWidth();
            _this.adaptationHeight();
            if (uniLib.Global.isVivogame)
                window.platform.showBannerAdvertisement();
            _this.init();
            return _this;
        }
        GameView.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            uniLib.EventListener.getInstance().addEventListener(game.EventConsts.EVENT_UPDATE_GAME_INFO, this.updateGameInfo, this);
            uniLib.EventListener.getInstance().addEventListener(game.EventConsts.EVENT_ADD_SCORE, this.onAddScore, this);
            uniLib.EventListener.getInstance().addEventListener(game.EventConsts.EVENT_PROBABILITY_CHANGED, this.onProbabilityChanged, this);
            uniLib.EventListener.getInstance().addEventListener(game.EventConsts.EVENT_STEP_NOTENOUGH, this.onEventHandle, this);
            this.contentLayer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.updateFrame, this);
        };
        GameView.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            uniLib.EventListener.getInstance().removeEventListener(game.EventConsts.EVENT_UPDATE_GAME_INFO, this.updateGameInfo, this);
            uniLib.EventListener.getInstance().removeEventListener(game.EventConsts.EVENT_ADD_SCORE, this.onAddScore, this);
            uniLib.EventListener.getInstance().removeEventListener(game.EventConsts.EVENT_PROBABILITY_CHANGED, this.onProbabilityChanged, this);
            uniLib.EventListener.getInstance().removeEventListener(game.EventConsts.EVENT_STEP_NOTENOUGH, this.onEventHandle, this);
            this.contentLayer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.removeEventListener(egret.Event.ENTER_FRAME, this.updateFrame, this);
        };
        //------------------------------------------------------------------------------
        GameView.prototype.destroy = function () {
            this.stopGuideEffect();
            if (this.lineShape) {
                this.lineShape.parent.removeChild(this.lineShape);
                this.lineShape = null;
            }
            for (var i = 0; i < this.roundItems.length; i++) {
                this.roundItems[i].destroy();
            }
            if (this.track) {
                this.track.destroy();
                if (this.track.parent)
                    this.track.parent.removeChild(this.track);
                this.track = null;
            }
            this.roundItems.length = 0;
            this.selectedBalls.length = 0;
            this.selectedBall = null;
            this.worldPos = null;
            _super.prototype.destroy.call(this);
        };
        Object.defineProperty(GameView.prototype, "score", {
            //------------------------------------------------------------------------------
            get: function () {
                return this.curScore;
            },
            //------------------------------------------------------------------------------
            set: function (value) {
                this.curScore = value;
            },
            enumerable: true,
            configurable: true
        });
        //------------------------------------------------------------------------------
        GameView.prototype.updateGameInfo = function () {
            this.chipsLabel.text = game.GameInfo.instance.curChips.toString();
            this.scoreLabel.text = game.GameInfo.instance.curScore.toString();
            this.stepLabel.text = this.curStep.toString();
        };
        //------------------------------------------------------------------------------
        GameView.prototype.onAddScore = function (evt) {
            var self = this;
            var curValue = evt.data.curValue;
            var addValue = evt.data.addValue;
            var targetScore = curValue + addValue;
            this.curScore = curValue;
            egret.Tween.get(this, { loop: false, onChange: this.onScoreChange, onChangeObj: this }).to({ score: targetScore }, 500).call(function () {
                egret.Tween.removeTweens(self);
            }, this);
        };
        //------------------------------------------------------------------------------
        GameView.prototype.onScoreChange = function () {
            this.scoreLabel.text = Math.floor(this.curScore).toString();
        };
        //------------------------------------------------------------------------------
        // 颜色分布权重发生改变
        //------------------------------------------------------------------------------
        GameView.prototype.onProbabilityChanged = function (evt) {
            var colorValue = evt.data;
            var curRoundItem = null;
            var allocatedItems = [];
            for (var i = 0; i < this.roundItems.length; i++) {
                var roundItem = this.roundItems[i];
                if (roundItem.colorValue == colorValue) {
                    curRoundItem = roundItem;
                }
                else if (roundItem.initWeight == roundItem.curWeight) {
                    allocatedItems.push(roundItem);
                }
            }
            if (null == curRoundItem || allocatedItems.length <= 0)
                return;
            var weightProbability = 0.7;
            var sumWeight = curRoundItem.curWeight * (1 - weightProbability);
            curRoundItem.curWeight = curRoundItem.curWeight * weightProbability;
            var preWeight = sumWeight / allocatedItems.length;
            for (var i = 0; i < allocatedItems.length; i++) {
                var item = allocatedItems[i];
                item.curWeight = item.curWeight + preWeight;
                item.initWeight = item.curWeight;
            }
            var testArr = [];
            var sum = 0;
            for (var i = 0; i < this.roundItems.length; i++) {
                var roundItem = this.roundItems[i];
                testArr.push(roundItem.curWeight);
                sum += roundItem.curWeight;
                game.GameInfo.instance.config.colorWeights[i] = roundItem.curWeight;
            }
            console.log(testArr, sum);
        };
        //------------------------------------------------------------------------------
        GameView.prototype.init = function () {
            if (game.GameConsts.is_iPhoneX)
                this.menuLayer.top = 80;
            else
                this.menuLayer.top = 20;
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
            for (var i = 0; i < this.roundItems.length; i++) {
                var item = this.roundItems[i];
                item.init(i + 1);
            }
            this.levelLabel.text = game.GameInfo.instance.sceneLevel.toString();
            this.curStep = game.GameInfo.instance.config.step;
            this.updateGameInfo();
            this.lastOpTime = (new Date()).valueOf();
            this.lastTipsTime = (new Date()).valueOf();
        };
        //------------------------------------------------------------------------------
        GameView.prototype.resetInit = function () {
            this.stopGuideEffect();
            for (var i = 0; i < this.roundItems.length; i++) {
                var item = this.roundItems[i];
                item.resetInit();
            }
            this.lastOpTime = (new Date()).valueOf();
            this.lastTipsTime = (new Date()).valueOf();
            this.levelLabel.text = game.GameInfo.instance.sceneLevel.toString();
            this.curStep = game.GameInfo.instance.config.step;
            this.curGuideStep = 0;
            this.guideTipsLabel.text = "";
            this.guideTipsLabel.visible = false;
            this.twinkleLayer.visible = false;
            this.skin["maskGroup"].visible = false;
            this.updateGameInfo();
        };
        //------------------------------------------------------------------------------
        GameView.prototype.initData = function () {
            this.createBalls();
        };
        //------------------------------------------------------------------------------
        GameView.prototype.initColorBalls = function () {
            var colorNumbers = [];
            var colorIndies = [];
            for (var i = 0; i < game.GameInfo.instance.config.colorWeights.length; i++) {
                var weight = game.GameInfo.instance.config.colorWeights[i];
                var num = Math.round(weight / 100 * 36);
                colorNumbers.push(num);
                colorIndies.push(i + 1);
            }
            uniLib.MathUtil.randArray(colorIndies);
            var colorValues = [];
            for (var i = 0; i < colorNumbers.length; i++) {
                var value = colorIndies[i];
                var n = colorNumbers[i];
                for (var j = 0; j < n; j++) {
                    colorValues.push(value);
                }
                uniLib.MathUtil.randArray(colorValues);
            }
            uniLib.MathUtil.randArray(colorValues);
            for (var i = 0; i < colorValues.length; i++) {
                var colorValue = colorValues[i];
                var ball = this.balls[i];
                ball.colorValue = colorValue;
                ball.blockImage.source = "block_" + game.GameInfo.instance.skinId + "_" + colorValue;
            }
        };
        //------------------------------------------------------------------------------
        GameView.prototype.initValueBalls = function () {
            var valueNumbers = [];
            for (var i = 0; i < game.GameInfo.instance.config.digitalWeights.length; i++) {
                var weight = game.GameInfo.instance.config.digitalWeights[i];
                var num = Math.round(weight / 100 * 36);
                valueNumbers.push(num);
            }
            var values = [];
            for (var i = 0; i < valueNumbers.length; i++) {
                var value = game.GameInfo.instance.config.digits[i];
                var n = valueNumbers[i];
                for (var j = 0; j < n; j++) {
                    values.push(value);
                }
                uniLib.MathUtil.randArray(values);
            }
            uniLib.MathUtil.randArray(values);
            for (var i = 0; i < values.length; i++) {
                var digitValue = values[i];
                var ball = this.balls[i];
                ball.digitValue = digitValue;
                ball.magicValue = digitValue;
                ball.valueLabel.text = digitValue.toString();
                if (digitValue >= 1000) {
                    ball.valueLabel.scaleY = ball.valueLabel.scaleX = 0.75;
                }
                else {
                    ball.valueLabel.scaleY = ball.valueLabel.scaleX = 1;
                }
            }
        };
        //------------------------------------------------------------------------------
        GameView.prototype.initGuideBalls = function (dataList) {
            for (var i = 0; i < dataList.length; i++) {
                var data = dataList[i];
                var ball = this.balls[i];
                ball.digitValue = data.digitValue;
                ball.magicValue = data.digitValue;
                ball.valueLabel.text = ball.digitValue.toString();
                ball.valueLabel.scaleY = ball.valueLabel.scaleX = 1;
                ball.colorValue = data.colorValue;
                ball.blockImage.source = "block_" + game.GameInfo.instance.skinId + "_" + ball.colorValue;
            }
            var self = this;
            var timeout = egret.setTimeout(function () {
                egret.clearTimeout(timeout);
                self.showGuide();
            }, this, 300);
        };
        //------------------------------------------------------------------------------
        GameView.prototype.initGameMatchupData = function (gameMatchup) {
            this.curStep = gameMatchup.step;
            for (var i = 0; i < gameMatchup.scoreMap.length; i++) {
                var score = gameMatchup.scoreMap[i];
                var item = this.roundItems[i];
                item.score = score;
                item.onScoreChange();
            }
            for (var i = 0; i < gameMatchup.matchup.length; i++) {
                var data = gameMatchup.matchup[i];
                var ball = this.balls[i];
                ball.digitValue = data.digitValue;
                ball.magicValue = data.digitValue;
                ball.valueLabel.text = ball.digitValue.toString();
                ball.valueLabel.scaleY = ball.valueLabel.scaleX = 1;
                ball.colorValue = data.colorValue;
                ball.blockImage.source = "block_" + game.GameInfo.instance.skinId + "_" + ball.colorValue;
            }
            this.updateGameInfo();
        };
        //------------------------------------------------------------------------------
        GameView.prototype.createBalls = function () {
            this.balls = [];
            this.track = null;
            this.selectedBalls = [];
            this.selectedBall = null;
            this.worldPos = null;
            this.winCombo = 0;
            this.winScore = 0;
            this.winColorValue = 0;
            var space = 20;
            var width = 0;
            var height = 0;
            var startX = space * 0.5;
            var startY = space * 0.5;
            for (var row = 0; row < 6; row++) {
                startX = space * 0.5;
                for (var col = 0; col < 6; col++) {
                    var comp = new eui.Component();
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
                    var ball = new Ball();
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
            if (game.GameInfo.instance.needGuide && game.GameInfo.instance.sceneLevel == 1) {
                game.GameInfo.instance.clearGameMatchup();
                this.curGuideStep = 1;
                this.initGuideBalls(game.GameConsts.GuideInitDataList);
            }
            else {
                if (game.GameInfo.instance.gameMatchup) {
                    this.initGameMatchupData(game.GameInfo.instance.gameMatchup);
                }
                else {
                    this.initColorBalls();
                    this.initValueBalls();
                }
            }
        };
        //------------------------------------------------------------------------------
        GameView.prototype.getBall = function (row, col) {
            var index = row * 6 + col;
            var ball = this.balls[index];
            return ball;
        };
        //------------------------------------------------------------------------------
        GameView.prototype.showGuide = function () {
            if (game.GameInfo.instance.sceneLevel != 1 || !game.GameInfo.instance.needGuide)
                return;
            var guideBalls = [];
            if (this.curGuideStep == 1) {
                guideBalls.push(this.getBall(5, 5));
                guideBalls.push(this.getBall(5, 4));
                guideBalls.push(this.getBall(4, 3));
                this.guideTipsLabel.text = "连接3个或更多相同色块可消除并获得分数";
                this.guideTipsLabel.visible = true;
            }
            else if (this.curGuideStep == 2) {
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
            else if (this.curGuideStep == 3) {
                this.guideTipsLabel.text = "消除全部颜色目标就能通关";
                this.guideTipsLabel.visible = true;
                this.twinkleLayer.visible = true;
                this.twinkleLayer.alpha = 0;
                egret.Tween.get(this.twinkleLayer, { loop: true }).to({ alpha: 1 }, 300, egret.Ease.sineIn).to({ alpha: 0 }, 300, egret.Ease.sineOut);
                // let roundLayer:eui.Group = this.skin["roundLayer"];
                // let maskGroup:eui.Group = this.skin["maskGroup"];
                // let maskRectBottom:eui.Rect = this.skin["maskRectBottom"];
                // let top = roundLayer.y + roundLayer.height + 10;
                // maskRectBottom.top = top;
                // maskGroup.visible = true;
            }
            else if (this.curGuideStep == 4) {
                this.guideTipsLabel.text = "通关时会根据剩余步数计算奖励分数";
                this.guideTipsLabel.visible = true;
                // let roundLayer:eui.Group = this.skin["roundLayer"];
                // let maskGroup:eui.Group = this.skin["maskGroup"];
                // let maskRectBottom:eui.Rect = this.skin["maskRectBottom"];
                // let top = roundLayer.y + roundLayer.height + 10;
                // maskRectBottom.top = top;
                // maskGroup.visible = true;
            }
            else if (this.curGuideStep == 5) {
                this.guideTipsLabel.text = "步数用完且颜色目标未完成则游戏结束";
                this.guideTipsLabel.visible = true;
                // let roundLayer:eui.Group = this.skin["roundLayer"];
                // let maskGroup:eui.Group = this.skin["maskGroup"];
                // let maskRectBottom:eui.Rect = this.skin["maskRectBottom"];
                // let top = roundLayer.y;
                // maskRectBottom.top = top;
                // maskGroup.visible = true;
            }
            else if (this.curGuideStep >= 6) {
                game.GameInfo.instance.needGuide = false;
                game.GameInfo.save();
            }
            if (guideBalls.length > 0) {
                if (null == this.guideLineShape) {
                    this.guideLineShape = new egret.Shape();
                    this.shapeLayer.addChild(this.guideLineShape);
                }
                this.guideLineShape.graphics.clear();
                var guideBall = guideBalls[0];
                if (this.guideFingerImage) {
                    egret.Tween.removeTweens(this.guideFingerImage);
                }
                else {
                    this.guideFingerImage = new eui.Image("finger");
                    this.contentLayer.addChild(this.guideFingerImage);
                    this.guideFingerImage.touchEnabled = false;
                }
                this.guideFingerImage.x = guideBall.localPos.x;
                this.guideFingerImage.y = guideBall.localPos.y;
                var posTween = egret.Tween.get(this.guideFingerImage, { loop: true });
                var alphaTween = egret.Tween.get(this.guideFingerImage, { loop: true });
                var sumTime = 0;
                this.guideLineShape.graphics.lineStyle(game.GameConsts.LineSize, game.GameConsts.LineColors[guideBall.colorValue - 1], 1);
                this.guideLineShape.graphics.moveTo(guideBall.localPos.x, guideBall.localPos.y);
                for (var i = 1; i < guideBalls.length; i++) {
                    var ball = guideBalls[i];
                    this.guideLineShape.graphics.lineTo(ball.localPos.x, ball.localPos.y);
                    posTween.to({ x: ball.localPos.x, y: ball.localPos.y }, 500);
                    sumTime += 500;
                }
                alphaTween.to({ alpha: 1 }, sumTime).to({ alpha: 0 }, 100).wait(900);
                posTween.wait(1000);
                this.guideLineShape.graphics.endFill();
            }
        };
        //------------------------------------------------------------------------------
        GameView.prototype.hideGuide = function () {
            if (game.GameInfo.instance.sceneLevel != 1 || !game.GameInfo.instance.needGuide)
                return;
            if (this.guideFingerImage) {
                egret.Tween.removeTweens(this.guideFingerImage);
                if (this.guideFingerImage.parent)
                    this.guideFingerImage.parent.removeChild(this.guideFingerImage);
                this.guideFingerImage = null;
            }
            if (this.guideLineShape) {
                this.guideLineShape.graphics.clear();
                if (this.guideLineShape.parent)
                    this.guideLineShape.parent.removeChild(this.guideLineShape);
                this.guideLineShape = null;
            }
            this.guideTipsLabel.visible = false;
            if (this.twinkleLayer.visible) {
                egret.Tween.removeTweens(this.twinkleLayer);
                this.twinkleLayer.visible = false;
            }
            this.skin["maskGroup"].visible = false;
        };
        //------------------------------------------------------------------------------
        GameView.prototype.showComboInfo = function (score, combo) {
            if (combo > 0) {
                this.comboImage.visible = true;
                this.comboCountLabel.text = combo.toString();
                this.comboCountLabel.visible = true;
            }
            else {
                this.comboImage.visible = false;
                this.comboCountLabel.visible = false;
            }
            this.comboScoreLabel.text = score.toString();
            this.comboScoreLabel.visible = true;
        };
        //------------------------------------------------------------------------------
        GameView.prototype.hideComboInfo = function () {
            this.comboImage.visible = false;
            this.comboScoreLabel.visible = false;
            this.comboCountLabel.visible = false;
        };
        //------------------------------------------------------------------------------
        GameView.prototype.updateWorldBounds = function () {
            this.worldPos = new egret.Point();
            this.contentLayer.localToGlobal(this.contentLayer.anchorOffsetX, this.contentLayer.anchorOffsetY, this.worldPos);
            for (var i = 0; i < this.balls.length; i++) {
                var ball = this.balls[i];
                ball.worldPos = new egret.Point();
                var display = ball.display;
                display.localToGlobal(display.anchorOffsetX, display.anchorOffsetY, ball.worldPos);
                var x = ball.worldPos.x - display.width * 0.5;
                var y = ball.worldPos.y - display.height * 0.5;
                ball.worldBounds = new egret.Rectangle(x, y, display.width, display.height);
            }
        };
        //------------------------------------------------------------------------------
        GameView.prototype.dropBall = function (col) {
            var fromBall = null;
            var targetBall = null;
            var targetRow = -1;
            for (var row = 5; row >= 0; row--) {
                var index = row * 6 + col;
                var ball = this.balls[index];
                if (ball.state == 0) {
                    targetBall = ball;
                    targetRow = targetBall.row;
                    break;
                }
            }
            if (targetBall) {
                for (var row = targetRow - 1; row >= 0; row--) {
                    var index = row * 6 + col;
                    var ball = this.balls[index];
                    if (ball.state == 1) {
                        fromBall = ball;
                        break;
                    }
                }
                if (fromBall) {
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
                    egret.Tween.get(targetBall.display).to({ y: targetBall.localPos.y }, 200);
                    this.dropBall(col);
                }
            }
        };
        //------------------------------------------------------------------------------
        GameView.prototype.dropBalls = function () {
            for (var col = 0; col <= 5; col++) {
                this.dropBall(col);
            }
            for (var i = 0; i < this.balls.length; i++) {
                var ball = this.balls[i];
                if (ball.state == 0) {
                    var startX = ball.localPos.x;
                    var startY = -this.worldPos.y;
                    var comp = new eui.Component();
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
                    var colorIndex = uniLib.MathUtil.randomProbability(game.GameInfo.instance.config.colorWeights);
                    var digitIndex = uniLib.MathUtil.randomProbability(game.GameInfo.instance.config.digitalWeights);
                    ball.colorValue = colorIndex + 1;
                    ball.digitValue = game.GameInfo.instance.config.digits[digitIndex];
                    ball.magicValue = ball.digitValue;
                    ball.valueLabel.text = ball.digitValue.toString();
                    ball.blockImage.source = "block_" + game.GameInfo.instance.skinId + "_" + ball.colorValue;
                    if (ball.digitValue >= 1000) {
                        ball.valueLabel.scaleY = ball.valueLabel.scaleX = 0.75;
                    }
                    else {
                        ball.valueLabel.scaleY = ball.valueLabel.scaleX = 1;
                    }
                    egret.Tween.get(ball.display).to({ y: ball.localPos.y }, 200);
                }
            }
            if (game.GameInfo.instance.needGuide && game.GameInfo.instance.sceneLevel == 1) {
                if (this.curGuideStep == 1) {
                    this.curGuideStep = 2;
                    this.initGuideBalls(game.GameConsts.GuideDropDataList);
                }
                else if (this.curGuideStep == 2) {
                    this.curGuideStep = 3;
                    this.showGuide();
                }
                else if (this.curGuideStep == 3) {
                    this.curGuideStep = 4;
                    this.showGuide();
                }
                else if (this.curGuideStep == 4) {
                    this.curGuideStep = 5;
                    this.showGuide();
                }
                else if (this.curGuideStep == 5) {
                    this.curGuideStep = 6;
                    this.showGuide();
                }
                else if (this.curGuideStep == 6) {
                    this.curGuideStep = 7;
                }
            }
        };
        //------------------------------------------------------------------------------
        GameView.prototype.pickupBall = function (stageX, stageY) {
            for (var i = 0; i < this.balls.length; i++) {
                var ball = this.balls[i];
                if ((ball.state == 1 || ball.state == 2) && ball.worldBounds.contains(stageX, stageY)) {
                    return ball;
                }
            }
            return null;
        };
        //------------------------------------------------------------------------------
        GameView.prototype.getComboInfo = function () {
            this.winScore = 0;
            this.winCombo = 0;
            this.winColorValue = 0;
            var info = { "isSelectCombo": false, "comboCount": 0, "scoreSum": 0 };
            if (this.selectedBalls.length <= 0)
                return info;
            var count = 0;
            if (this.selectedBalls.length >= 3) {
                info.isSelectCombo = true;
                var score = this.selectedBalls[this.selectedBalls.length - 1].digitValue;
                count = 1;
                for (var i = this.selectedBalls.length - 2; i >= 0; i--) {
                    if (score != this.selectedBalls[i].digitValue) {
                        if (count < 3)
                            info.isSelectCombo = false;
                        break;
                    }
                    else {
                        ++count;
                    }
                }
            }
            var scoreSum = 0;
            var lastScore = 0;
            var combo = 0;
            count = 0;
            for (var i = 0; i < this.selectedBalls.length; i++) {
                var ball = this.selectedBalls[i];
                scoreSum += ball.magicValue;
                if (i > 0) {
                    if (lastScore == this.selectedBalls[i].digitValue) {
                        ++count;
                    }
                    else {
                        if (count >= 3)
                            ++combo;
                        count = 1;
                    }
                }
                else {
                    count = 1;
                }
                lastScore = this.selectedBalls[i].digitValue;
            }
            if (count >= 3)
                ++combo;
            this.winScore = scoreSum * combo;
            this.winCombo = combo;
            this.winColorValue = this.selectedBall.colorValue;
            if (this.winScore <= 0)
                this.winScore = scoreSum;
            info.scoreSum = this.winScore;
            info.comboCount = this.winCombo;
            return info;
        };
        //------------------------------------------------------------------------------
        GameView.prototype.selecteEffect = function (x, y, colorValue) {
            var texture = RES.getRes("round_hight_" + colorValue);
            var effectImage = new eui.Image(texture);
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
            egret.Tween.get(effectImage).to({ scaleX: 1.2, scaleY: 1.2 }, 100).to({ alpha: 0 }, 300).call(function (target) {
                egret.Tween.removeTweens(target);
                target.parent.removeChild(target);
            }, this, [effectImage]);
            var effectImage1 = new eui.Image(texture);
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
            egret.Tween.get(effectImage1).wait(200).to({ scaleX: 1.2, scaleY: 1.2 }, 100).to({ alpha: 0 }, 300).call(function (target) {
                egret.Tween.removeTweens(target);
                target.parent.removeChild(target);
            }, this, [effectImage1]);
        };
        //------------------------------------------------------------------------------
        GameView.prototype.addSelectedBall = function (ball) {
            if (null == ball)
                return false;
            if (this.selectedBall) {
                if (this.selectedBall.row == ball.row && this.selectedBall.col == ball.col)
                    return false;
                if (this.selectedBall.colorValue != ball.colorValue)
                    return false;
                var diffRow = Math.abs(this.selectedBall.row - ball.row);
                var diffCol = Math.abs(this.selectedBall.col - ball.col);
                if (diffRow > 1 || diffCol > 1)
                    return false;
            }
            var removeBalls = [];
            for (var i = 0; i < this.selectedBalls.length; i++) {
                var selectedBall = this.selectedBalls[i];
                if (selectedBall.row == ball.row && selectedBall.col == ball.col) {
                    if (i != this.selectedBalls.length - 2)
                        return false;
                    var endIndex = i + 1;
                    this.selectedBall = selectedBall;
                    for (var j = endIndex; j < this.selectedBalls.length; j++) {
                        removeBalls.push(this.selectedBalls[j]);
                    }
                    this.selectedBalls = this.selectedBalls.slice(0, endIndex);
                    break;
                }
            }
            if (removeBalls.length > 0) {
                for (var i = 0; i < removeBalls.length; i++) {
                    var removeBall = removeBalls[i];
                    removeBall.state = 1;
                    removeBall.magicValue = removeBall.digitValue;
                    removeBall.display.scaleX = 1;
                    removeBall.display.scaleY = 1;
                    removeBall.valueLabel.text = removeBall.digitValue.toString();
                    if (removeBall.digitValue >= 1000) {
                        removeBall.valueLabel.scaleY = removeBall.valueLabel.scaleX = 0.75;
                    }
                    else {
                        removeBall.valueLabel.scaleY = removeBall.valueLabel.scaleX = 1;
                    }
                    // GX.setNomarl(removeBall.display);
                    removeBall.blockImage.source = "block_" + game.GameInfo.instance.skinId + "_" + removeBall.colorValue;
                }
                window.platform.customInterface("vibrateShort");
            }
            else {
                ball.state = 2;
                ball.magicValue = ball.digitValue;
                this.selectedBalls.push(ball);
                this.selectedBall = ball;
                // GX.setLight(ball.display);
                ball.blockImage.source = "sel_block_" + game.GameInfo.instance.skinId + "_" + ball.colorValue;
                window.platform.customInterface("vibrateShort");
            }
            this.selecteEffect(this.selectedBall.worldPos.x, this.selectedBall.worldPos.y, this.selectedBall.colorValue);
            for (var i = 0; i < this.selectedBalls.length; i++) {
                var ball_1 = this.selectedBalls[i];
                ball_1.display.scaleX = 1;
                ball_1.display.scaleY = 1;
                ball_1.magicValue = ball_1.digitValue;
                ball_1.valueLabel.text = ball_1.digitValue.toString();
                if (ball_1.digitValue >= 1000) {
                    ball_1.valueLabel.scaleY = ball_1.valueLabel.scaleX = 0.75;
                }
                else {
                    ball_1.valueLabel.scaleY = ball_1.valueLabel.scaleX = 1;
                }
            }
            var seriesBalls = [];
            var seriesValue = 0;
            var seriesCount = 0;
            for (var i = 0; i < this.selectedBalls.length; i++) {
                var ball_2 = this.selectedBalls[i];
                if (ball_2.digitValue != seriesValue) {
                    if (seriesCount >= 3) {
                        for (var k = 0; k < seriesBalls.length; k++) {
                            var seriesBall = seriesBalls[k];
                            seriesBall.display.scaleX = 1.2;
                            seriesBall.display.scaleY = 1.2;
                            seriesBall.magicValue = seriesBall.digitValue * 10;
                            seriesBall.valueLabel.text = seriesBall.magicValue.toString();
                            if (seriesBall.magicValue >= 1000) {
                                seriesBall.valueLabel.scaleY = seriesBall.valueLabel.scaleX = 0.75;
                            }
                            else {
                                seriesBall.valueLabel.scaleY = seriesBall.valueLabel.scaleX = 1;
                            }
                        }
                    }
                    seriesBalls.length = 0;
                    seriesValue = ball_2.digitValue;
                    seriesCount = 1;
                    seriesBalls.push(ball_2);
                }
                else {
                    ++seriesCount;
                    seriesBalls.push(ball_2);
                }
            }
            if (seriesCount >= 3) {
                for (var k = 0; k < seriesBalls.length; k++) {
                    var seriesBall = seriesBalls[k];
                    seriesBall.display.scaleX = 1.2;
                    seriesBall.display.scaleY = 1.2;
                    seriesBall.magicValue = seriesBall.digitValue * 10;
                    seriesBall.valueLabel.text = seriesBall.magicValue.toString();
                    if (seriesBall.magicValue >= 1000) {
                        seriesBall.valueLabel.scaleY = seriesBall.valueLabel.scaleX = 0.75;
                    }
                    else {
                        seriesBall.valueLabel.scaleY = seriesBall.valueLabel.scaleX = 1;
                    }
                }
            }
            seriesBalls.length = 0;
            seriesValue = 0;
            seriesCount = 0;
            var info = this.getComboInfo();
            if (info.isSelectCombo) {
                uniLib.SoundMgr.instance.playSound("combo_sound_mp3", true);
            }
            else {
                var si = this.selectedBalls.length % 8 - 1;
                if (si < 0)
                    si = 0;
                uniLib.SoundMgr.instance.playSound("magicClick" + si + "_mp3", true);
            }
            this.showComboInfo(info.scoreSum, info.comboCount);
            return true;
        };
        GameView.prototype.clearup = function () {
            if (null == this.selectedBall)
                return;
            var targetX = this.selectedBall.display.x;
            var targetY = this.selectedBall.display.y;
            this.clearBallCount = 0;
            var canClearup = true;
            if (this.selectedBalls.length >= 3) {
                --this.curStep;
                if (this.curStep < 0) {
                    canClearup = false;
                    this.curStep = 0;
                    uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_STEP_NOTENOUGH);
                }
                this.stepLabel.text = this.curStep.toString();
            }
            if (this.selectedBalls.length >= 3 && canClearup) {
                for (var i = 0; i < this.selectedBalls.length; i++) {
                    var ball = this.selectedBalls[i];
                    ball.display.parent.removeChild(ball.display);
                    this.contentLayer.addChild(ball.display);
                    ball.blockImage = null;
                    ball.valueLabel = null;
                    ball.state = 0;
                    ball.colorValue = 0;
                    ball.digitValue = 0;
                    ball.magicValue = 0;
                    ++this.clearBallCount;
                    egret.Tween.get(ball.display).to({ x: targetX, y: targetY }, 200).call(this.clearupCompleted, this, [ball]);
                }
                this.playClearupEffects(this.selectedBall.worldPos.x, this.selectedBall.worldPos.y);
                this.hideGuide();
            }
            else {
                for (var i = 0; i < this.selectedBalls.length; i++) {
                    var ball = this.selectedBalls[i];
                    ball.display.scaleX = 1;
                    ball.display.scaleY = 1;
                    ball.state = 1;
                    ball.magicValue = ball.digitValue;
                    ball.valueLabel.text = ball.digitValue.toString();
                    if (ball.digitValue >= 1000) {
                        ball.valueLabel.scaleY = ball.valueLabel.scaleX = 0.75;
                    }
                    else {
                        ball.valueLabel.scaleY = ball.valueLabel.scaleX = 1;
                    }
                    // GX.setNomarl(ball.display);
                    ball.blockImage.source = "block_" + game.GameInfo.instance.skinId + "_" + ball.colorValue;
                }
                this.selectedBalls.length = 0;
                this.selectedBall = null;
                this.hideComboInfo();
            }
            this.lineShape.graphics.clear();
        };
        //------------------------------------------------------------------------------
        GameView.prototype.clearupCompleted = function (ball) {
            egret.Tween.removeTweens(ball);
            ball.display.parent.removeChild(ball.display);
            ball.display = null;
            --this.clearBallCount;
            if (this.clearBallCount <= 0 && this.selectedBall) {
                this.selectedBalls.length = 0;
                this.selectedBall = null;
                var self_1 = this;
                var timeout_1 = egret.setTimeout(function () {
                    egret.clearTimeout(timeout_1);
                    self_1.dropBalls();
                }, this, 200);
                this.playTracks();
            }
        };
        //------------------------------------------------------------------------------
        // 播放消除特效
        //------------------------------------------------------------------------------
        GameView.prototype.playClearupEffects = function (x, y) {
            var roundItem = this.roundItems[this.winColorValue - 1];
            this.track = new game.Track(roundItem, this.winScore, x, y);
            this.track.touchEnabled = false;
            this.addChild(this.track);
            uniLib.SoundMgr.instance.playSound("track_sound_mp3", true);
            var action = "explode_effect_" + this.winColorValue;
            var jsonStr = action + "_json";
            var pngStr = action + "_png";
            if (this.explodeEffect) {
                this.explodeEffect.removeEventListener(egret.Event.COMPLETE, this.explodeEffectCompleted, this);
                if (this.explodeEffect.parent)
                    this.explodeEffect.parent.removeChild(this.explodeEffect);
                this.explodeEffect = null;
            }
            this.explodeEffect = uniLib.Utils.creatMovieClip(jsonStr, pngStr, action, -1);
            this.explodeEffect.addEventListener(egret.Event.COMPLETE, this.explodeEffectCompleted, this);
            this.addChild(this.explodeEffect);
            this.explodeEffect.x = x;
            this.explodeEffect.y = y;
            this.explodeEffect.gotoAndPlay(0, 1);
        };
        //------------------------------------------------------------------------------
        GameView.prototype.explodeEffectCompleted = function () {
            if (this.explodeEffect) {
                this.explodeEffect.removeEventListener(egret.Event.COMPLETE, this.explodeEffectCompleted, this);
                if (this.explodeEffect.parent)
                    this.explodeEffect.parent.removeChild(this.explodeEffect);
                this.explodeEffect = null;
            }
        };
        //------------------------------------------------------------------------------
        // 开始飞行轨迹效果
        //------------------------------------------------------------------------------
        GameView.prototype.playTracks = function () {
            if (this.track)
                this.track.startTrack(this.playTracksCompleted, this);
        };
        //------------------------------------------------------------------------------
        GameView.prototype.playTracksCompleted = function (track, score) {
            var self = this;
            uniLib.SoundMgr.instance.playSound("hit_sound_mp3", true);
            if (this.bombEffect) {
                this.bombEffect.removeEventListener(egret.Event.COMPLETE, this.bombEffectCompleted, this);
                if (this.bombEffect.parent)
                    this.bombEffect.parent.removeChild(this.bombEffect);
                this.bombEffect = null;
            }
            var resultPoint = new egret.Point();
            track.target.localToGlobal(track.target.width * 0.5, track.target.height * 0.5, resultPoint);
            var action = "explode_effect_" + this.winColorValue;
            var jsonStr = action + "_json";
            var pngStr = action + "_png";
            this.bombEffect = uniLib.Utils.creatMovieClip(jsonStr, pngStr, action, -1);
            this.bombEffect.addEventListener(egret.Event.COMPLETE, this.bombEffectCompleted, this);
            this.addChild(this.bombEffect);
            this.bombEffect.x = resultPoint.x;
            this.bombEffect.y = resultPoint.y;
            this.bombEffect.gotoAndPlay(0, 1);
            track.target.deductScore(score, true);
            this.hideComboInfo();
            var delayTrack = this.track;
            this.track = null;
            var timeout = egret.setTimeout(function () {
                egret.clearTimeout(timeout);
                if (delayTrack) {
                    delayTrack.destroy();
                    delayTrack = null;
                }
                self.checkWin();
            }, this, 700, [delayTrack]);
        };
        //------------------------------------------------------------------------------
        GameView.prototype.bombEffectCompleted = function () {
            if (this.bombEffect) {
                this.bombEffect.removeEventListener(egret.Event.COMPLETE, this.bombEffectCompleted, this);
                if (this.bombEffect.parent)
                    this.bombEffect.parent.removeChild(this.bombEffect);
                this.bombEffect = null;
            }
        };
        //------------------------------------------------------------------------------
        GameView.prototype.checkWin = function () {
            var isWin = true;
            for (var i = 0; i < this.roundItems.length; i++) {
                var item = this.roundItems[i];
                if (item.score > 0) {
                    isWin = false;
                }
            }
            if (isWin) {
                game.GameInfo.instance.curScore = game.GameInfo.instance.curScore + (this.curStep * 100);
                this.curStep = 0;
                this.updateGameInfo();
                uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_GAME_SUCCESS);
            }
            else {
                game.GameInfo.instance.saveGameMatchup(this.curStep, this.balls, this.roundItems);
                if (this.curStep == 0) {
                    uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_STEP_NOTENOUGH);
                }
            }
            var userScore = game.GameInfo.instance.maxScore;
            if (game.GameInfo.instance.maxScore < game.GameInfo.instance.curScore) {
                userScore = game.GameInfo.instance.curScore;
            }
            var userData = new Array();
            userData.push({ key: "score", value: userScore.toString() });
            window.platform.customInterface("friendrankUpdateData", userData);
        };
        //------------------------------------------------------------------------------
        GameView.prototype.updateFrame = function () {
            if (game.GameInfo.instance.needGuide && this.curGuideStep <= 2)
                return;
            var curTime = (new Date()).valueOf();
            if (curTime - this.lastOpTime > 3500 && null == this.selectedBall && null == this.guideBall && null == this.guideEffect) {
                this.lastOpTime = curTime;
                var balls = this.autoFindPaths();
                if (balls && balls.length >= 3) {
                    this.guideBall = balls[0];
                    this.playGuideEffect();
                }
            }
            if (curTime - this.lastTipsTime > 8000) {
                this.lastTipsTime = curTime;
                this.showTipsAction();
            }
        };
        //------------------------------------------------------------------------------
        GameView.prototype.playGuideEffect = function () {
            var colorValue = this.guideBall.colorValue;
            var texture = RES.getRes("round_hight_" + colorValue);
            this.guideEffect = new eui.Image(texture);
            this.shapeLayer.addChild(this.guideEffect);
            this.guideEffect.touchEnabled = false;
            this.guideEffect.anchorOffsetX = texture.textureWidth * 0.5;
            this.guideEffect.anchorOffsetY = texture.textureHeight * 0.5;
            this.guideEffect.x = this.guideBall.localPos.x;
            this.guideEffect.y = this.guideBall.localPos.y;
            this.guideEffect.scaleX = this.guideEffect.scaleY = 0.5;
            this.guideEffect.alpha = 1;
            egret.Tween.get(this.guideEffect).to({ scaleX: 1.6, scaleY: 1.6 }, 700);
            egret.Tween.get(this.guideEffect).wait(500).to({ alpha: 0 }, 200).call(this.playGuideEffect, this);
        };
        //------------------------------------------------------------------------------
        GameView.prototype.stopGuideEffect = function () {
            if (this.guideEffect) {
                egret.Tween.removeTweens(this.guideEffect);
                this.guideEffect.parent.removeChild(this.guideEffect);
                this.guideEffect = null;
            }
            this.guideBall = null;
        };
        //------------------------------------------------------------------------------
        GameView.prototype.showTipsAction = function () {
            egret.Tween.removeTweens(this.addBtn);
            egret.Tween.removeTweens(this.reduceBtn);
            this.addBtn.scaleX = this.addBtn.scaleY = 1;
            this.reduceBtn.scaleX = this.reduceBtn.scaleY = 1;
            egret.Tween.get(this.addBtn, { loop: true }).to({ scaleX: 1.2, scaleY: 1.2 }, 200, egret.Ease.sineIn).to({ scaleX: 1, scaleY: 1 }, 250, egret.Ease.sineOut);
            egret.Tween.get(this.reduceBtn, { loop: true }).to({ scaleX: 1.2, scaleY: 1.2 }, 200, egret.Ease.sineIn).to({ scaleX: 1, scaleY: 1 }, 250, egret.Ease.sineOut);
        };
        GameView.prototype.hideTipsAction = function () {
            egret.Tween.removeTweens(this.addBtn);
            egret.Tween.removeTweens(this.reduceBtn);
            this.addBtn.scaleX = this.addBtn.scaleY = 1;
            this.reduceBtn.scaleX = this.reduceBtn.scaleY = 1;
        };
        //------------------------------------------------------------------------------
        GameView.prototype.onTouchBegin = function (e) {
            this.lastOpTime = (new Date()).valueOf();
            this.lastTipsTime = (new Date()).valueOf();
            this.hideTipsAction();
            this.stopGuideEffect();
            if (this.curStep <= 0)
                return;
            if (this.track)
                return;
            if (null == this.worldPos) {
                this.updateWorldBounds();
            }
            var touchX = e.stageX;
            var touchY = e.stageY;
            var ball = this.pickupBall(touchX, touchY);
            if (ball && this.freeReduceState) {
                var self_2 = this;
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
                var timeout_2 = egret.setTimeout(function () {
                    egret.clearTimeout(timeout_2);
                    self_2.dropBalls();
                }, this, 200);
                this.playTracks();
                this.setFreeReduce(false);
                return;
            }
            var result = this.addSelectedBall(ball);
            if (result) {
                egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
                egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            }
        };
        //------------------------------------------------------------------------------
        GameView.prototype.onTouchMove = function (e) {
            this.lastOpTime = (new Date()).valueOf();
            this.lastTipsTime = (new Date()).valueOf();
            var touchX = e.stageX;
            var touchY = e.stageY;
            var ball = this.pickupBall(touchX, touchY);
            this.addSelectedBall(ball);
            this.drawSelectedBallLines(touchX, touchY);
        };
        //------------------------------------------------------------------------------
        GameView.prototype.onTouchEnd = function (e) {
            this.lastOpTime = (new Date()).valueOf();
            this.lastTipsTime = (new Date()).valueOf();
            this.hideTipsAction();
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            var touchX = e.stageX;
            var touchY = e.stageY;
            var ball = this.pickupBall(touchX, touchY);
            this.addSelectedBall(ball);
            this.drawSelectedBallLines(touchX, touchY);
            if (game.GameInfo.instance.needGuide) {
                var cancel = false;
                console.log("guideStep", this.curGuideStep);
                if (this.curGuideStep == 1 && this.selectedBalls.length >= 3) {
                    var guideBall = this.getBall(5, 5);
                    if (this.selectedBalls[0].row != guideBall.row || this.selectedBalls[0].col != guideBall.col) {
                        cancel = true;
                    }
                }
                else if (this.curGuideStep == 2 && this.selectedBalls.length >= 3) {
                    var guideBall = this.getBall(1, 2);
                    if (this.selectedBalls[0].row != guideBall.row || this.selectedBalls[0].col != guideBall.col) {
                        cancel = true;
                    }
                }
                if (cancel) {
                    for (var i = 0; i < this.selectedBalls.length; i++) {
                        var ball_3 = this.selectedBalls[i];
                        ball_3.display.scaleX = 1;
                        ball_3.display.scaleY = 1;
                        ball_3.state = 1;
                        ball_3.magicValue = ball_3.digitValue;
                        ball_3.valueLabel.text = ball_3.digitValue.toString();
                        if (ball_3.digitValue >= 1000) {
                            ball_3.valueLabel.scaleY = ball_3.valueLabel.scaleX = 0.75;
                        }
                        else {
                            ball_3.valueLabel.scaleY = ball_3.valueLabel.scaleX = 1;
                        }
                        ball_3.blockImage.source = "block_" + game.GameInfo.instance.skinId + "_" + ball_3.colorValue;
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
        };
        //------------------------------------------------------------------------------
        GameView.prototype.drawSelectedBallLines = function (touchX, touchY) {
            this.lineShape.graphics.clear();
            if (null == this.selectedBall)
                return;
            var color = game.GameConsts.LineColors[this.selectedBall.colorValue - 1];
            this.lineShape.graphics.lineStyle(game.GameConsts.LineSize, color, 1);
            if (this.selectedBalls.length > 0) {
                var ball = this.selectedBalls[0];
                this.lineShape.graphics.moveTo(ball.display.x, ball.display.y);
            }
            for (var i = 1; i < this.selectedBalls.length; i++) {
                var ball = this.selectedBalls[i];
                this.lineShape.graphics.lineTo(ball.display.x, ball.display.y);
            }
            var localX = touchX - this.worldPos.x;
            var localY = touchY - this.worldPos.y;
            this.lineShape.graphics.lineTo(localX, localY);
            this.lineShape.graphics.endFill();
        };
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
        GameView.prototype.findPaths = function (row, col, newBalls) {
            var inRow = row;
            var inCol = col;
            if (inCol > 5 || inRow > 5)
                return false;
            var index = inRow * 6 + inCol;
            if (index >= this.balls.length)
                return false;
            var ball = this.balls[index];
            if (newBalls.length > 0) {
                var lastBall = newBalls[newBalls.length - 1];
                if (lastBall.colorValue == ball.colorValue) {
                    newBalls.push(ball);
                }
                else {
                    return false;
                }
            }
            else {
                newBalls.push(ball);
            }
            if (newBalls.length >= 3)
                return true;
            var result = this.findPaths(inRow, inCol + 1, newBalls);
            if (!result) {
                result = this.findPaths(inRow + 1, inCol + 1, newBalls);
                if (!result) {
                    result = this.findPaths(inRow + 1, inCol, newBalls);
                    if (!result) {
                        result = this.findPaths(inRow + 1, inCol - 1, newBalls);
                    }
                }
            }
            return true;
        };
        //------------------------------------------------------------------------------
        GameView.prototype.autoFindPaths = function () {
            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 6; col++) {
                    var newBalls = [];
                    this.findPaths(row, col, newBalls);
                    if (newBalls.length >= 3) {
                        return newBalls;
                    }
                }
            }
            return null;
        };
        //------------------------------------------------------------------------------
        GameView.prototype.onClickTap = function (e) {
            var _this = this;
            this.lastOpTime = (new Date()).valueOf();
            this.lastTipsTime = (new Date()).valueOf();
            this.hideTipsAction();
            var self = this;
            if (e.target == this.addBtn) {
                var addStep_1 = game.TableData.tableGameConfig.chipsRewardStep[0];
                var needChips_1 = game.TableData.tableGameConfig.chipsRewardStep[1];
                if (game.GameInfo.instance.curChips >= needChips_1) {
                    uniLib.AdPlat.instance.showBanner();
                    if (uniLib.Global.isVivogame)
                        window.platform.showBannerAdvertisement();
                    if (uniLib.Global.isVivogame)
                        window.platform.showNativeAdvertisement();
                    GX.Tips.showPopup("是否确定花费" + needChips_1 + "金币增加" + addStep_1 + "步", function () {
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                        game.GameInfo.instance.curChips -= needChips_1;
                        game.GameInfo.save();
                        self.curStep += addStep_1;
                        uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_UPDATE_GAME_INFO);
                    }, function () {
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                    }, this, true);
                }
                else {
                    uniLib.AdPlat.instance.showBanner();
                    if (uniLib.Global.isVivogame)
                        window.platform.showBannerAdvertisement();
                    if (uniLib.Global.isVivogame)
                        window.platform.showNativeAdvertisement();
                    GX.Tips.showPopup("金币不足，是否观看视频增加" + addStep_1 + "步", function () {
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                        if (!_this.isVideoShowed) {
                            _this.isVideoShowed = true;
                            uniLib.SoundMgr.instance.pauseBgMusic();
                            if (uniLib.Global.isVivogame)
                                window.platform.showVideoAdvertisement(null, _this.onVideoAdCallback, _this);
                            else
                                uniLib.AdPlat.instance.showRewardedVideo(_this.onVideoAdCallback, _this);
                            _this.showVideoTimeout = egret.setTimeout(function () {
                                self.isVideoShowed = false;
                                if (self.showVideoTimeout) {
                                    egret.clearTimeout(self.showVideoTimeout);
                                    self.showVideoTimeout = null;
                                }
                            }, _this, 3000);
                        }
                    }, function () {
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                    }, this, true);
                }
            }
            else if (e.target == this.reduceBtn) {
                var needChips_2 = game.TableData.tableGameConfig.chipsReduceReward;
                if (game.GameInfo.instance.curChips >= needChips_2) {
                    uniLib.AdPlat.instance.showBanner();
                    if (uniLib.Global.isVivogame)
                        window.platform.showBannerAdvertisement();
                    if (uniLib.Global.isVivogame)
                        window.platform.showNativeAdvertisement();
                    GX.Tips.showPopup("是否确定花费" + needChips_2 + "金币任意消除一个色块", function () {
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                        game.GameInfo.instance.curChips -= needChips_2;
                        game.GameInfo.save();
                        _this.setFreeReduce(true);
                        uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_UPDATE_GAME_INFO);
                    }, function () {
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                    }, this, true);
                }
                else {
                    uniLib.AdPlat.instance.showBanner();
                    if (uniLib.Global.isVivogame)
                        window.platform.showBannerAdvertisement();
                    if (uniLib.Global.isVivogame)
                        window.platform.showNativeAdvertisement();
                    GX.Tips.showPopup("金币不足，是否观看视频任意消除一次", function () {
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                        if (!_this.isVideoShowed) {
                            _this.isVideoShowed = true;
                            uniLib.SoundMgr.instance.pauseBgMusic();
                            if (uniLib.Global.isVivogame)
                                window.platform.showVideoAdvertisement(null, _this.onVideoAdCallbackForReduce, _this);
                            else
                                uniLib.AdPlat.instance.showRewardedVideo(_this.onVideoAdCallbackForReduce, _this);
                            _this.showVideoTimeout = egret.setTimeout(function () {
                                self.isVideoShowed = false;
                                if (self.showVideoTimeout) {
                                    egret.clearTimeout(self.showVideoTimeout);
                                    self.showVideoTimeout = null;
                                }
                            }, _this, 3000);
                        }
                    }, function () {
                        uniLib.AdPlat.instance.hideBanner();
                        // if(uniLib.Global.isVivogame) window.platform.hideBannerAdvertisement();
                    }, this, true);
                }
            }
            else if (e.target == this.settingBtn) {
                GX.PopUpManager.addPopUp(new game.SettingView(), true, 0.8);
                // console.log("autoFindPaths", this.autoFindPaths());
            }
            else if (e.target == this.skin["maskGroup"]) {
                this.hideGuide();
                this.curGuideStep++;
            }
        };
        //------------------------------------------------------------------------------
        GameView.prototype.onVideoAdCallback = function (status) {
            this.lastTipsTime = (new Date()).valueOf();
            this.hideTipsAction();
            uniLib.SoundMgr.instance.resumeBgMusic();
            if (this.showVideoTimeout) {
                egret.clearTimeout(this.showVideoTimeout);
                this.showVideoTimeout = null;
            }
            this.isVideoShowed = false;
            if (status == 1) {
                var addStep = game.TableData.tableGameConfig.chipsRewardStep[0];
                this.curStep += addStep;
                uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_UPDATE_GAME_INFO);
            }
            else if (status == 0) {
                // 视频未看完
                GX.Tips.showTips("完整观看完视频才能增加步数");
            }
            else {
                GX.Tips.showTips("获取视频广告失败:" + status);
            }
        };
        //------------------------------------------------------------------------------
        GameView.prototype.onVideoAdCallbackForNotenough = function (status) {
            var _this = this;
            this.lastTipsTime = (new Date()).valueOf();
            this.hideTipsAction();
            uniLib.SoundMgr.instance.resumeBgMusic();
            if (this.showVideoTimeout) {
                egret.clearTimeout(this.showVideoTimeout);
                this.showVideoTimeout = null;
            }
            var self = this;
            this.isVideoShowed = false;
            if (status == 1) {
                var addStep = game.TableData.tableGameConfig.videoRewardStep;
                this.curStep += addStep;
                uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_UPDATE_GAME_INFO);
            }
            else if (status == 0) {
                // 视频未看完
                // GX.Tips.showTips("完整观看完视频才能增加步数");
                uniLib.AdPlat.instance.showBanner();
                GX.Tips.showPopup("完整观看完视频才能增加步数, 是否继续观看视频", function () {
                    uniLib.AdPlat.instance.hideBanner();
                    if (!self.isVideoShowed) {
                        self.isVideoShowed = true;
                        uniLib.SoundMgr.instance.pauseBgMusic();
                        if (uniLib.Global.isVivogame)
                            window.platform.showVideoAdvertisement(null, _this.onVideoAdCallbackForNotenough, _this);
                        else
                            uniLib.AdPlat.instance.showRewardedVideo(self.onVideoAdCallbackForNotenough, self);
                        self.showVideoTimeout = egret.setTimeout(function () {
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
                }, function () {
                    uniLib.AdPlat.instance.hideBanner();
                    uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_GAME_OVER);
                }, this, true);
            }
            else {
                GX.Tips.showTips("获取视频广告失败:" + status);
                uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_GAME_OVER);
            }
        };
        //------------------------------------------------------------------------------
        GameView.prototype.onVideoAdCallbackForReduce = function (status) {
            this.lastTipsTime = (new Date()).valueOf();
            this.hideTipsAction();
            uniLib.SoundMgr.instance.resumeBgMusic();
            if (this.showVideoTimeout) {
                egret.clearTimeout(this.showVideoTimeout);
                this.showVideoTimeout = null;
            }
            this.isVideoShowed = false;
            if (status == 1) {
                this.setFreeReduce(true);
            }
            else if (status == 0) {
                // 视频未看完
                GX.Tips.showTips("视频未看完");
            }
            else {
                GX.Tips.showTips("获取视频广告失败:" + status);
            }
        };
        //------------------------------------------------------------------------------
        GameView.prototype.setFreeReduce = function (state) {
            this.freeReduceState = state;
            this.reduceTipsLabel.visible = state;
        };
        //-----------------------------------------------------------------------------
        GameView.prototype.onEventHandle = function (evt) {
            var _this = this;
            var self = this;
            var data = evt.data;
            if (evt.type == game.EventConsts.EVENT_STEP_NOTENOUGH) {
                uniLib.AdPlat.instance.showBanner();
                var addStep = game.TableData.tableGameConfig.videoRewardStep;
                GX.Tips.showPopup("步数不足, 是否确定观看视频增加" + addStep + "步", function () {
                    uniLib.AdPlat.instance.hideBanner();
                    if (!_this.isVideoShowed) {
                        _this.isVideoShowed = true;
                        uniLib.SoundMgr.instance.pauseBgMusic();
                        if (uniLib.Global.isVivogame)
                            window.platform.showVideoAdvertisement(null, _this.onVideoAdCallbackForNotenough, _this);
                        else
                            uniLib.AdPlat.instance.showRewardedVideo(_this.onVideoAdCallbackForNotenough, _this);
                        _this.showVideoTimeout = egret.setTimeout(function () {
                            self.isVideoShowed = false;
                            if (self.showVideoTimeout) {
                                egret.clearTimeout(self.showVideoTimeout);
                                self.showVideoTimeout = null;
                            }
                        }, _this, 3000);
                    }
                }, function () {
                    uniLib.AdPlat.instance.hideBanner();
                    uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_GAME_OVER);
                }, this, true);
            }
        };
        return GameView;
    }(ui.BaseUI));
    game.GameView = GameView;
    __reflect(GameView.prototype, "game.GameView");
})(game || (game = {}));
//# sourceMappingURL=GameView.js.map