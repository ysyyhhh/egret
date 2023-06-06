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
    var RoundItem = (function (_super) {
        __extends(RoundItem, _super);
        function RoundItem() {
            return _super.call(this) || this;
        }
        Object.defineProperty(RoundItem.prototype, "score", {
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
        RoundItem.prototype.destroy = function () {
            this.roundImage.mask = null;
            if (this.maskShape) {
                this.maskShape.parent.removeChild(this.maskShape);
                this.maskShape = null;
            }
        };
        //------------------------------------------------------------------------------
        RoundItem.prototype.init = function (colorValue) {
            this.initWeight = game.GameInfo.instance.config.colorWeights[colorValue - 1];
            this.curWeight = this.initWeight;
            var fonts = ["roundnumber_red_fnt", "roundnumber_orange_fnt", "roundnumber_blue_fnt", "roundnumber_green_fnt"];
            this.colorValue = colorValue;
            this.grayImage.source = "round_bg_" + colorValue;
            this.valueLabel.font = fonts[colorValue - 1];
            this.maxScore = game.GameInfo.instance.config.scores[colorValue - 1];
            this.curScore = this.maxScore;
            this.roundImage.source = "round_" + colorValue;
            this.valueLabel.text = this.curScore.toString();
            if (this.curScore >= 1000) {
                this.valueLabel.scaleY = this.valueLabel.scaleX = 0.75;
            }
            else {
                this.valueLabel.scaleY = this.valueLabel.scaleX = 1;
            }
            this.maskShape = new egret.Shape();
            this.maskShape.width = 105;
            this.maskShape.height = 105;
            this.maskShape.anchorOffsetX = this.maskShape.width * 0.5;
            this.maskShape.anchorOffsetY = this.maskShape.height * 0.5;
            this.maskShape.x = this.maskShape.anchorOffsetX;
            this.maskShape.y = this.maskShape.anchorOffsetY;
            this.maskShape.rotation = 180;
            this.renderGroup.addChild(this.maskShape);
            this.roundImage.mask = this.maskShape;
            this.updateShape();
        };
        //------------------------------------------------------------------------------
        RoundItem.prototype.resetInit = function () {
            this.initWeight = game.GameInfo.instance.config.colorWeights[this.colorValue - 1];
            this.curWeight = this.initWeight;
            this.maxScore = game.GameInfo.instance.config.scores[this.colorValue - 1];
            this.curScore = this.maxScore;
            this.valueLabel.text = this.curScore.toString();
            if (this.curScore >= 1000) {
                this.valueLabel.scaleY = this.valueLabel.scaleX = 0.75;
            }
            else {
                this.valueLabel.scaleY = this.valueLabel.scaleX = 1;
            }
            this.updateShape();
        };
        //------------------------------------------------------------------------------
        RoundItem.prototype.deductScore = function (value, isAnimation) {
            var self = this;
            var curValue = game.GameInfo.instance.curScore;
            game.GameInfo.instance.curScore += value;
            uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_ADD_SCORE, false, { curValue: curValue, addValue: value });
            // uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_GAME_INFO);
            egret.Tween.removeTweens(this);
            var needAdjustProbability = false;
            if (this.curScore > 0) {
                if (this.curScore - value <= 0) {
                    needAdjustProbability = true;
                }
            }
            if (isAnimation) {
                var targetScore = this.curScore - value;
                if (targetScore < 0)
                    targetScore = 0;
                egret.Tween.get(this, { loop: false, onChange: this.onScoreChange, onChangeObj: this }).to({ score: targetScore }, 500).call(function () {
                    egret.Tween.removeTweens(self);
                }, this);
            }
            else {
                this.curScore -= value;
                if (this.curScore < 0)
                    this.curScore = 0;
                this.valueLabel.text = this.curScore.toString();
                if (this.curScore >= 1000) {
                    this.valueLabel.scaleY = this.valueLabel.scaleX = 0.75;
                }
                else {
                    this.valueLabel.scaleY = this.valueLabel.scaleX = 1;
                }
                this.updateShape();
            }
            // 调整
            if (needAdjustProbability) {
                uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_PROBABILITY_CHANGED, false, this.colorValue);
            }
        };
        //------------------------------------------------------------------------------
        RoundItem.prototype.onScoreChange = function () {
            this.valueLabel.text = Math.floor(this.curScore).toString();
            if (this.curScore >= 1000) {
                this.valueLabel.scaleY = this.valueLabel.scaleX = 0.75;
            }
            else {
                this.valueLabel.scaleY = this.valueLabel.scaleX = 1;
            }
            this.updateShape();
        };
        //------------------------------------------------------------------------------
        RoundItem.prototype.updateShape = function () {
            var startAngle = (1 - (this.curScore / this.maxScore)) * 360;
            var endAngle = 360;
            var startRadian = startAngle * Math.PI / 180;
            var endRadian = endAngle * Math.PI / 180;
            this.drawFan(startRadian, endRadian, 0);
        };
        //------------------------------------------------------------------------------
        RoundItem.prototype.drawFan = function (startAngle, endAngle, color) {
            var radius = this.renderGroup.width * 0.5;
            var unitDrawAngle = 0.12;
            var g = this.maskShape.graphics;
            var tx;
            var ty;
            g.clear();
            g.beginFill(color);
            var times = Math.ceil((endAngle - startAngle) / unitDrawAngle);
            var tempAngle = startAngle;
            g.moveTo(radius, radius);
            tx = radius * (1 + Math.cos(startAngle));
            ty = radius * (1 - Math.sin(startAngle));
            g.lineTo(ty, tx);
            while (times > 0) {
                if (times != 1) {
                    tx = radius * (1 + Math.cos(tempAngle + unitDrawAngle));
                    ty = radius * (1 - Math.sin(tempAngle + unitDrawAngle));
                }
                else {
                    tx = radius * (1 + Math.cos(endAngle));
                    ty = radius * (1 - Math.sin(endAngle));
                }
                g.lineTo(ty, tx);
                tempAngle += unitDrawAngle;
                times--;
            }
            g.lineTo(radius, radius);
            g.endFill();
        };
        return RoundItem;
    }(eui.Component));
    game.RoundItem = RoundItem;
    __reflect(RoundItem.prototype, "game.RoundItem");
})(game || (game = {}));
//# sourceMappingURL=RoundItem.js.map