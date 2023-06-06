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
    var GameScene = (function (_super) {
        __extends(GameScene, _super);
        function GameScene() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameScene.prototype.awake = function () {
            uniLib.Global.isInGame = true;
        };
        //------------------------------------------------------------------------------
        GameScene.prototype.start = function (e) {
            uniLib.UIMgr.instance.hideLoading();
            this.width = uniLib.Global.screenWidth;
            this.height = uniLib.Global.screenHeight;
            var level = this.params;
            var result = this.loadSceneLevel(level);
            if (result) {
                this.gameView = new game.GameView();
                this.uiLayer.addChild(this.gameView);
                this.gameView.initData();
            }
            else {
                egret.setTimeout(function () {
                    GX.Tips.showPopup("场景关卡加载失败", function () {
                        uniLib.SceneManager.instance.changeScene(game.MainScene);
                    });
                }, this, 100);
            }
        };
        //------------------------------------------------------------------------------
        GameScene.prototype.destroy = function () {
        };
        //------------------------------------------------------------------------------
        GameScene.prototype.onEnter = function () {
            uniLib.EventListener.getInstance().addEventListener(game.EventConsts.EVENT_GAME_SUCCESS, this.onEventHandle, this);
            uniLib.EventListener.getInstance().addEventListener(game.EventConsts.EVENT_GAME_OVER, this.onEventHandle, this);
            if (game.GameInfo.instance.sceneLevel >= 3) {
                var index_1 = -1;
                var interstitialProbability = parseInt(uniLib.AdConfig.gameConfig["interstitialProbability"]);
                if (!isNaN(interstitialProbability)) {
                    index_1 = uniLib.MathUtil.randomProbability([interstitialProbability, 100 - interstitialProbability]);
                }
                var result = ui.AdMisTouchManager.instance.startMisTouch(new game.MisTouchGifBox, function () {
                    if (index_1 == 0) {
                        uniLib.AdPlat.instance.showInterstitial();
                    }
                }, this);
                if (!result) {
                    if (index_1 == 0) {
                        uniLib.AdPlat.instance.showInterstitial();
                    }
                }
            }
        };
        //------------------------------------------------------------------------------
        GameScene.prototype.onExit = function () {
            this.unloadSceneLevel();
        };
        //------------------------------------------------------------------------------
        GameScene.prototype.loadSceneLevel = function (level) {
            var config = game.TableData.getSceneLevelConfig(level);
            if (null == config) {
                config = game.TableData.tableSceneLevelConfig[game.TableData.tableSceneLevelConfig.length - 1];
            }
            game.GameInfo.instance.sceneLevel = level;
            game.GameInfo.instance.config = new table.TableSceneLevelConfig();
            game.GameInfo.instance.config.level = config.level;
            game.GameInfo.instance.config.step = config.step;
            game.GameInfo.instance.config.winChips = config.winChips;
            var weight = 100 / config.digits.length;
            game.GameInfo.instance.config.digitalWeights = [weight, weight, weight];
            game.GameInfo.instance.config.digits = [];
            game.GameInfo.instance.config.colorWeights = [];
            game.GameInfo.instance.config.scores = [];
            for (var i = 0; i < config.digits.length; i++) {
                var digit = config.digits[i];
                game.GameInfo.instance.config.digits.push(digit);
            }
            for (var i = 0; i < config.colorWeights.length; i++) {
                var weight_1 = config.colorWeights[i];
                game.GameInfo.instance.config.colorWeights.push(weight_1);
            }
            for (var i = 0; i < config.scores.length; i++) {
                var score = config.scores[i];
                game.GameInfo.instance.config.scores.push(score);
            }
            return true;
        };
        //------------------------------------------------------------------------------
        GameScene.prototype.existSceneLevel = function (level) {
            return game.TableData.getSceneLevelConfig(level) ? true : false;
        };
        //------------------------------------------------------------------------------
        GameScene.prototype.reloadSceneLevel = function () {
            Main.instance.loadGameScene(game.GameInfo.instance.sceneLevel);
        };
        //------------------------------------------------------------------------------
        GameScene.prototype.loadNextSceneLevel = function () {
            var level = game.GameInfo.instance.sceneLevel + 1;
            this.loadSceneLevel(level);
            this.gameView.resetInit();
            if (game.GameInfo.instance.sceneLevel >= 3) {
                var index_2 = -1;
                var interstitialProbability = parseInt(uniLib.AdConfig.gameConfig["interstitialProbability"]);
                if (!isNaN(interstitialProbability)) {
                    index_2 = uniLib.MathUtil.randomProbability([interstitialProbability, 100 - interstitialProbability]);
                }
                var result = ui.AdMisTouchManager.instance.startMisTouch(new game.MisTouchGifBox, function () {
                    if (index_2 == 0) {
                        uniLib.AdPlat.instance.showInterstitial();
                    }
                }, this);
                if (!result) {
                    if (index_2 == 0) {
                        uniLib.AdPlat.instance.showInterstitial();
                    }
                }
            }
        };
        //-----------------------------------------------------------------------------
        GameScene.prototype.unloadSceneLevel = function () {
            uniLib.EventListener.getInstance().removeEventListener(game.EventConsts.EVENT_GAME_SUCCESS, this.onEventHandle, this);
            uniLib.EventListener.getInstance().removeEventListener(game.EventConsts.EVENT_GAME_OVER, this.onEventHandle, this);
            if (this.gameView && this.gameView.parent) {
                this.gameView.parent.removeChild(this.gameView);
            }
            this.gameView = null;
        };
        //-----------------------------------------------------------------------------
        GameScene.prototype.onEventHandle = function (evt) {
            var self = this;
            var data = evt.data;
            if (evt.type == game.EventConsts.EVENT_GAME_SUCCESS) {
                game.GameInfo.instance.clearGameMatchup();
                if (game.GameInfo.instance.maxSceneLevel < game.GameInfo.instance.sceneLevel) {
                    game.GameInfo.instance.maxSceneLevel = game.GameInfo.instance.sceneLevel;
                }
                game.GameInfo.instance.needGuide = false;
                var addChips = game.GameInfo.instance.config.winChips;
                game.GameInfo.instance.winChips += addChips;
                game.GameInfo.save();
                GX.PopUpManager.addPopUp(new game.GameSuccessView(), true, 0.8, GX.PopUpEffect.BOTTOM);
            }
            else if (evt.type == game.EventConsts.EVENT_GAME_OVER) {
                game.GameInfo.instance.clearGameMatchup();
                var sceneLevel = game.GameInfo.instance.sceneLevel;
                var curScore = game.GameInfo.instance.curScore;
                var bestScore = game.GameInfo.instance.maxScore;
                var winChips = game.GameInfo.instance.winChips;
                winChips += game.GameInfo.instance.config.winChips;
                game.GameInfo.instance.curChips = game.GameInfo.instance.curChips + winChips;
                game.GameInfo.instance.winChips = 0;
                game.GameInfo.instance.needGuide = false;
                game.GameInfo.instance.sceneLevel = 0;
                game.GameInfo.instance.maxSceneLevel = 0;
                if (game.GameInfo.instance.maxScore < game.GameInfo.instance.curScore) {
                    game.GameInfo.instance.maxScore = game.GameInfo.instance.curScore;
                }
                game.GameInfo.instance.curScore = 0;
                uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_UPDATE_GAME_INFO);
                game.GameInfo.save();
                GX.PopUpManager.addPopUp(new game.GameFailView(sceneLevel, winChips, curScore, bestScore), true, 0.8, GX.PopUpEffect.BOTTOM);
            }
        };
        return GameScene;
    }(uniLib.Scene));
    game.GameScene = GameScene;
    __reflect(GameScene.prototype, "game.GameScene");
})(game || (game = {}));
//# sourceMappingURL=GameScene.js.map