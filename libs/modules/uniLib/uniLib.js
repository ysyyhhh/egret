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
var uniLib;
(function (uniLib) {
    var MvcSender = (function () {
        function MvcSender() {
        }
        MvcSender.prototype.sendNotification = function (cmd, vo, type) {
            if (type) {
                uniLib.EventListener.getInstance().dispatchEventWith(type, false, vo);
            }
            else {
                uniLib.EventListener.getInstance().dispatchEventWith(cmd, false, vo);
            }
        };
        MvcSender.prototype.onRemove = function () {
        };
        return MvcSender;
    }());
    uniLib.MvcSender = MvcSender;
    __reflect(MvcSender.prototype, "uniLib.MvcSender");
})(uniLib || (uniLib = {}));
var ui;
(function (ui) {
    /**
     * ui界面的父类 继承子eui.Component
     */
    var BaseUI = (function (_super) {
        __extends(BaseUI, _super);
        function BaseUI() {
            var _this = _super.call(this) || this;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemoveFromStage, _this);
            return _this;
        }
        BaseUI.prototype.onAddToStage = function () {
            if (this.addUIListener)
                this.addUIListener();
        };
        BaseUI.prototype.onRemoveFromStage = function () {
            this.destroy();
        };
        /**
         * 销毁 子类重写次方法时需要调用次方法，以销毁父类事件
         */
        BaseUI.prototype.destroy = function () {
            if (this.removeUIListener)
                this.removeUIListener();
            this.removeActionListener();
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
        };
        /**
         * 监听数据更新事件 需手动调用
         */
        BaseUI.prototype.addActionListener = function () {
        };
        /**
         * 移除数据更新事件 切换场景是自动卸载
         */
        BaseUI.prototype.removeActionListener = function () {
        };
        /**
        * 面板宽度适配至舞台宽度
        */
        BaseUI.prototype.adaptationWidth = function () {
            this.width = egret.MainContext.instance.stage.stageWidth;
        };
        /**
        * 面板高度适配至舞台高度
        */
        BaseUI.prototype.adaptationHeight = function () {
            this.height = egret.MainContext.instance.stage.stageHeight;
        };
        return BaseUI;
    }(eui.Component));
    ui.BaseUI = BaseUI;
    __reflect(BaseUI.prototype, "ui.BaseUI", ["ui.UIClickInterface", "ui.ActionInterface"]);
})(ui || (ui = {}));
var uniLib;
(function (uniLib) {
    var Command = (function (_super) {
        __extends(Command, _super);
        function Command() {
            return _super.call(this) || this;
        }
        Command.prototype.init = function () {
        };
        Command.prototype.destory = function () {
        };
        return Command;
    }(uniLib.MvcSender));
    uniLib.Command = Command;
    __reflect(Command.prototype, "uniLib.Command");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var Proxy = (function (_super) {
        __extends(Proxy, _super);
        function Proxy(name) {
            var _this = _super.call(this) || this;
            _this._name = name;
            return _this;
        }
        Object.defineProperty(Proxy.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Proxy.prototype.onRemove = function () {
        };
        return Proxy;
    }(uniLib.MvcSender));
    uniLib.Proxy = Proxy;
    __reflect(Proxy.prototype, "uniLib.Proxy");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    /**
     * 游戏数据
     */
    var GameData = (function () {
        function GameData() {
        }
        Object.defineProperty(GameData, "instance", {
            get: function () {
                if (!this._instance) {
                    this._instance = new GameData();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        return GameData;
    }());
    uniLib.GameData = GameData;
    __reflect(GameData.prototype, "uniLib.GameData");
})(uniLib || (uniLib = {}));
var ui;
(function (ui) {
    var AdFullScreenScrollView = (function (_super) {
        __extends(AdFullScreenScrollView, _super);
        function AdFullScreenScrollView(callback, thisObj, params, isSupper, isNewMode, autoNavigateToMiniprogram) {
            var _this = _super.call(this) || this;
            _this.scrollDir = 1; // 滚动方向
            _this.isStartMisTouching = false;
            _this.isNewMode = false;
            _this.autoNavigateToMiniprogram = false;
            if (isSupper)
                _this.skinName = "AdFullScreenSupperScrollViewSkin";
            else
                _this.skinName = "AdFullScreenScrollViewSkin";
            _this.adaptationWidth();
            _this.adaptationHeight();
            _this.callback = callback;
            _this.thisObj = thisObj;
            _this.cbParams = params;
            _this.isNewMode = isNewMode ? true : false;
            _this.autoNavigateToMiniprogram = false;
            if (uniLib.AdConfig.gameConfig["clickMislead"]) {
                _this.autoNavigateToMiniprogram = autoNavigateToMiniprogram ? true : false;
            }
            _this.init();
            return _this;
        }
        AdFullScreenScrollView.prototype.destroy = function () {
            this.isStartMisTouching = false;
            ui.AdMisTouchManager.instance.stopMisTouchPos(this.continueBtn);
            egret.Tween.removeTweens(this.continueBtn);
            if (this.returnBtn)
                egret.Tween.removeTweens(this.returnBtn);
            if (this.updateAnimTimeHandler) {
                egret.clearInterval(this.updateAnimTimeHandler);
                this.updateAnimTimeHandler = null;
            }
            if (this.movieClip) {
                egret.Tween.removeTweens(this.movieClip);
                this.movieClip.stop();
                if (this.movieClip.parent) {
                    this.movieClip.parent.removeChild(this.movieClip);
                }
                this.movieClip = null;
            }
            if (this.circle) {
                egret.Tween.removeTweens(this.circle);
                if (this.circle.parent) {
                    this.circle.parent.removeChild(this.circle);
                }
                this.circle = null;
            }
            if (this.markIcon) {
                egret.Tween.removeTweens(this.markIcon);
                if (this.markIcon.parent) {
                    this.markIcon.parent.removeChild(this.markIcon);
                }
                this.markIcon = null;
            }
            if (null != this.topAdScrollView) {
                this.topAdScrollView.unload();
            }
            if (this.itemRenderList && this.itemRenderList.length > 0) {
                for (var i = 0; i < this.itemRenderList.length; i++) {
                    var itemRender = this.itemRenderList[i];
                    itemRender.destroy();
                    if (itemRender.parent)
                        itemRender.parent.removeChild(itemRender);
                }
            }
            this.itemRenderList = [];
            _super.prototype.destroy.call(this);
        };
        AdFullScreenScrollView.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.onUpdateFrame, this);
        };
        AdFullScreenScrollView.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onUpdateFrame, this);
        };
        AdFullScreenScrollView.prototype.init = function () {
            this.continueBtn.visible = false;
            if (this.returnBtn)
                this.returnBtn.visible = false;
            this.timeDown = 3;
            if (this.timerLayer)
                this.timerLayer.visible = true;
            if (this.timeLabel)
                this.timeLabel.text = this.timeDown.toString();
            this.timerHandler = null;
            this.onLoad();
            var self = this;
            if (this.autoNavigateToMiniprogram) {
                var timeout_1 = egret.setTimeout(function () {
                    egret.clearTimeout(timeout_1);
                    self.randomNavigateToMiniProgram();
                }, this, 200);
            }
            else {
                this.startDownTime();
            }
        };
        //-----------------------------------------------------------------------------
        AdFullScreenScrollView.prototype.onLoad = function () {
            var adDataList = uniLib.AdConfig.itemDataList;
            if (null == adDataList) {
                return;
            }
            // adDataList = uniLib.MathUtil.randArray(adDataList);
            var needTitle = true;
            var stroke = 0;
            this.itemRenderList = new Array();
            for (var i = 0; i < adDataList.length; i++) {
                var data = adDataList[i];
                var itemRender = null;
                if (this.isNewMode) {
                    var nameIndex = (i % 6) + 1;
                    var bgImage = "ad-itembar" + nameIndex;
                    itemRender = new ui.AdItemDataRender(data, "AdNewFullScreenItemSkin", false, needTitle, stroke, false, bgImage);
                }
                else {
                    itemRender = new ui.AdItemDataRender(data, "AdFullScreenItemSkin", true, needTitle, stroke, false);
                }
                this.adGroup.addChild(itemRender);
                this.itemRenderList.push(itemRender);
            }
            if (this.itemRenderList.length % 2 != 0) {
                var data = adDataList[0];
                var itemRender = null;
                if (this.isNewMode) {
                    var nameIndex = 1;
                    var bgImage = "ad-itembar" + nameIndex;
                    itemRender = new ui.AdItemDataRender(data, "AdNewFullScreenItemSkin", false, needTitle, stroke, false, bgImage);
                }
                else {
                    itemRender = new ui.AdItemDataRender(data, "AdFullScreenItemSkin", true, needTitle, stroke, false);
                }
                this.adGroup.addChild(itemRender);
                this.itemRenderList.push(itemRender);
            }
            if (this.topAdScrollView) {
                this.topAdScrollView.load(1, true, 0, "AdItemSkin", false);
            }
            this.onUpdateFingerAnim();
            this.updateAnimTimeHandler = egret.setInterval(this.onUpdateFingerAnim, this, 3000);
        };
        AdFullScreenScrollView.prototype.onUpdateFingerAnim = function () {
            if (this.itemRenderList.length < 0)
                return;
            if (this.movieClip) {
                egret.Tween.removeTweens(this.movieClip);
                this.movieClip.stop();
                if (this.movieClip.parent) {
                    this.movieClip.parent.removeChild(this.movieClip);
                }
                this.movieClip = null;
            }
            if (this.circle) {
                egret.Tween.removeTweens(this.circle);
                if (this.circle.parent) {
                    this.circle.parent.removeChild(this.circle);
                }
                this.circle = null;
            }
            if (this.markIcon) {
                egret.Tween.removeTweens(this.markIcon);
                if (this.markIcon.parent) {
                    this.markIcon.parent.removeChild(this.markIcon);
                }
                this.markIcon = null;
            }
            if (!uniLib.AdConfig.gameConfig["clickMislead"])
                return;
            var minValue = 0;
            var maxValue = this.itemRenderList.length - 1;
            var index = uniLib.MathUtil.RandomNumBoth(0, maxValue);
            var itemRender = this.itemRenderList[index];
            this.circle = new eui.Image("ad-guide-circle");
            this.circle.touchEnabled = false;
            itemRender.addChild(this.circle);
            this.circle.x = itemRender.width * 0.5;
            this.circle.y = itemRender.height * 0.5;
            this.circle.anchorOffsetX = 39.5;
            this.circle.anchorOffsetY = 39.5;
            this.movieClip = uniLib.Utils.creatMovieClip("finger_effect_json", "finger_effect_png", "finger", -1);
            this.movieClip.x = itemRender.width * 0.5;
            this.movieClip.y = itemRender.height * 0.5;
            this.movieClip.touchEnabled = false;
            itemRender.addChild(this.movieClip);
            this.movieClip.gotoAndPlay(0, -1);
            this.circle.scaleX = this.circle.scaleY = 1;
            // egret.Tween.get(this.circle, {loop:true}).to({scaleX:1, scaleY:1}, 100).to({scaleX:0.5, scaleY:0.5}, 100);
            egret.Tween.get(this.circle, { loop: true }).to({ scaleX: 1, scaleY: 1 }, 300).to({ scaleX: 0.5, scaleY: 0.5 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
            index = this.itemRenderList.length - index;
            if (index >= this.itemRenderList.length) {
                index = this.itemRenderList.length - 1;
            }
            if (index < 0)
                index = 0;
            itemRender = this.itemRenderList[index];
            this.markIcon = new eui.Image("ad-icon-mark");
            this.markIcon.touchEnabled = false;
            itemRender.addChild(this.markIcon);
            this.markIcon.right = 0;
            this.markIcon.alpha = 1;
            // egret.Tween.get(this.markIcon, {loop:true}).to({alpha:0}, 50).wait(100).to({alpha:1}, 50).wait(100);
        };
        //-----------------------------------------------------------------------------
        AdFullScreenScrollView.prototype.onUpdateFrame = function () {
            if (this.adScroller.viewport.contentWidth <= 0 || this.adScroller.viewport.contentHeight <= 0)
                return;
            var length = 0;
            if (uniLib.Global.designWidth > uniLib.Global.designHeight) {
                length = this.adScroller.viewport.contentWidth - this.adScroller.viewport.width;
            }
            else {
                length = this.adScroller.viewport.contentHeight - this.adScroller.viewport.height;
            }
            if (length <= 0)
                return;
            var velocity = 1;
            if (uniLib.Global.designWidth > uniLib.Global.designHeight) {
                if (this.scrollDir > 0) {
                    this.adScroller.viewport.scrollH += velocity;
                    if (this.adScroller.viewport.scrollH >= length) {
                        this.adScroller.viewport.scrollH = length;
                        this.scrollDir = -1;
                    }
                }
                else {
                    this.adScroller.viewport.scrollH -= velocity;
                    if (this.adScroller.viewport.scrollH <= 0) {
                        this.adScroller.viewport.scrollH = 0;
                        this.scrollDir = 1;
                    }
                }
            }
            else {
                if (this.scrollDir > 0) {
                    this.adScroller.viewport.scrollV += velocity;
                    if (this.adScroller.viewport.scrollV >= length) {
                        this.adScroller.viewport.scrollV = length;
                        this.scrollDir = -1;
                    }
                }
                else {
                    this.adScroller.viewport.scrollV -= velocity;
                    if (this.adScroller.viewport.scrollV <= 0) {
                        this.adScroller.viewport.scrollV = 0;
                        this.scrollDir = 1;
                    }
                }
            }
        };
        AdFullScreenScrollView.prototype.startDownTime = function () {
            var self = this;
            if (this.timeLabel) {
                this.timerHandler = egret.setInterval(this.onUpdateTime, this, 1000);
            }
            else {
                // let timeout = egret.setTimeout(()=>{
                //     egret.clearTimeout(timeout);
                //     self.endDownTime();
                // }, this, uniLib.MathUtil.RandomNumBoth(1, 1000));
                this.endDownTime();
            }
        };
        AdFullScreenScrollView.prototype.endDownTime = function () {
            uniLib.AdPlat.instance.hideBanner();
            if (this.timerLayer)
                this.timerLayer.visible = false;
            this.continueBtn.visible = true;
            this.continueBtn.alpha = 1;
            // this.continueBtn.alpha = 0;
            // if (this.returnBtn) {
            //     this.returnBtn.visible = true;
            //     this.returnBtn.alpha = 0;
            //     egret.Tween.removeTweens(this.returnBtn);
            //     egret.Tween.get(this.returnBtn).to({ alpha: 1 }, 200);
            // }
            // egret.Tween.removeTweens(this.continueBtn);
            // egret.Tween.get(this.continueBtn).to({ alpha: 1 }, 200);
            if (this.timerHandler) {
                egret.clearInterval(this.timerHandler);
                this.timerHandler = null;
            }
            this.startMisTouchPos();
        };
        AdFullScreenScrollView.prototype.onUpdateTime = function () {
            --this.timeDown;
            if (this.timeDown < 0)
                this.timeDown = 0;
            if (this.timeLabel)
                this.timeLabel.text = this.timeDown.toString();
            if (this.timeDown == 0) {
                this.endDownTime();
            }
        };
        AdFullScreenScrollView.prototype.onReturn = function () {
            uniLib.AdPlat.instance.hideBanner();
            if (this.callback) {
                this.callback.call(this.thisObj, this.cbParams);
            }
            this.callback = null;
            this.thisObj = null;
            this.cbParams = null;
            egret.Tween.removeTweens(this.continueBtn);
            GX.PopUpManager.removePopUp(this);
            window.platform.customInterface("showGameClubButton");
            uniLib.EventListener.getInstance().dispatchEventWith("CLOSED_FULLSCREEN_AD_VIEW", false, null);
        };
        AdFullScreenScrollView.prototype.randomNavigateToMiniProgram = function () {
            if (uniLib.AdConfig.itemDataList.length <= 0)
                return;
            var minIndex = 0;
            var maxIndex = uniLib.AdConfig.itemDataList.length;
            var curIndex = uniLib.MathUtil.random(minIndex, maxIndex);
            if (curIndex < 0)
                curIndex = 0;
            else if (curIndex >= uniLib.AdConfig.itemDataList.length)
                curIndex = uniLib.AdConfig.itemDataList.length - 1;
            var adData = uniLib.AdConfig.itemDataList[curIndex];
            var self = this;
            window.platform.customInterface("navigateToMiniProgram", adData, function (result, userData) {
                if (result == true) {
                    uniLib.Global.reportAldEvent("导出小游戏" + userData.title);
                    uniLib.Global.reportUmaEvent("导出小游戏" + userData.title);
                }
                self.startDownTime();
            }, this);
        };
        AdFullScreenScrollView.prototype.onNavigateToMiniProgramCallback = function (result, userData) {
            if (result == true) {
                uniLib.Global.reportAldEvent("导出小游戏" + userData.title);
                uniLib.Global.reportUmaEvent("导出小游戏" + userData.title);
            }
            this.onReturn();
        };
        AdFullScreenScrollView.prototype.onClickTap = function (e) {
            if (e.target == this.continueBtn) {
                if (this.isStartMisTouching)
                    return;
                if (this.autoNavigateToMiniprogram) {
                    this.onReturn();
                }
                else {
                    var index = 0;
                    if (uniLib.AdConfig.gameConfig["clickMislead"]) {
                        index = uniLib.MathUtil.randomProbability([50, 50]);
                    }
                    if (index == 0) {
                        this.onReturn();
                    }
                    else {
                        var minIndex = 0;
                        var maxIndex = uniLib.AdConfig.itemDataList.length;
                        var curIndex = uniLib.MathUtil.random(minIndex, maxIndex);
                        if (curIndex < 0)
                            curIndex = 0;
                        else if (curIndex >= uniLib.AdConfig.itemDataList.length)
                            curIndex = uniLib.AdConfig.itemDataList.length - 1;
                        var adData = uniLib.AdConfig.itemDataList[curIndex];
                        window.platform.customInterface("navigateToMiniProgram", adData, this.onNavigateToMiniProgramCallback, this);
                    }
                }
            }
            else if (this.returnBtn && e.target == this.returnBtn) {
                this.onReturn();
            }
        };
        AdFullScreenScrollView.prototype.startMisTouchPos = function () {
            this.isStartMisTouching = false;
            this.continueBtn.y = uniLib.Global.screenHeight - 150;
            if (ui.AdMisTouchManager.instance.startMisTouchPos(this.continueBtn, this.onStopMisTouchPos, this)) {
                this.continueBtn.visible = true;
                this.continueBtn.alpha = 1;
                this.isStartMisTouching = true;
            }
            else {
                this.continueBtn.visible = true;
                this.continueBtn.alpha = 0;
                egret.Tween.get(this.continueBtn).wait(800).to({ alpha: 1 }, 500);
            }
        };
        AdFullScreenScrollView.prototype.onStopMisTouchPos = function (result) {
            var self = this;
            if (result) {
                var targetY = uniLib.Global.screenHeight * 0.5;
                if (uniLib.Global.designWidth < uniLib.Global.designHeight)
                    targetY = uniLib.Global.screenHeight - 400;
                egret.Tween.get(this.continueBtn).wait(1200).to({ y: targetY }, 25).call(function () {
                    self.isStartMisTouching = false;
                    // uniLib.AdPlat.instance.hideBanner();
                }, this);
            }
        };
        return AdFullScreenScrollView;
    }(ui.BaseUI));
    ui.AdFullScreenScrollView = AdFullScreenScrollView;
    __reflect(AdFullScreenScrollView.prototype, "ui.AdFullScreenScrollView");
})(ui || (ui = {}));
var uniLib;
(function (uniLib) {
    //----------------------------------------------------------------------
    // 宝箱数据
    //----------------------------------------------------------------------
    var AdGameBoxData = (function () {
        function AdGameBoxData() {
        }
        return AdGameBoxData;
    }());
    uniLib.AdGameBoxData = AdGameBoxData;
    __reflect(AdGameBoxData.prototype, "uniLib.AdGameBoxData");
    //----------------------------------------------------------------------
    // 试玩游戏数据
    //----------------------------------------------------------------------
    var AdGameBoxItemData = (function () {
        function AdGameBoxItemData() {
        }
        return AdGameBoxItemData;
    }());
    uniLib.AdGameBoxItemData = AdGameBoxItemData;
    __reflect(AdGameBoxItemData.prototype, "uniLib.AdGameBoxItemData");
    var AdGameBoxConfig = (function () {
        function AdGameBoxConfig() {
        }
        return AdGameBoxConfig;
    }());
    uniLib.AdGameBoxConfig = AdGameBoxConfig;
    __reflect(AdGameBoxConfig.prototype, "uniLib.AdGameBoxConfig");
    //----------------------------------------------------------------------
    var AdGameBox = (function (_super) {
        __extends(AdGameBox, _super);
        function AdGameBox(tryPlayReward, tryPlayTime, boxData) {
            var _this = _super.call(this) || this;
            _this.skinName = "AdGameBoxSkin";
            _this.adaptationWidth();
            _this.adaptationHeight();
            _this.tryPlayGameTime = tryPlayTime;
            _this.userTryPlayGameReward = tryPlayReward;
            _this.userBoxData = [];
            for (var i = 0; i < boxData.length; i++) {
                _this.userBoxData.push({ reward: boxData[i].reward, tryTimes: boxData[i].tryTimes });
            }
            _this.tryPlayGameItemRenderer = null;
            _this.startGameTimestamp = null;
            _this.tryPlayTimeDescLabel.text = "";
            _this.totalDescLabel.text = "";
            _this.load();
            return _this;
        }
        //----------------------------------------------------------------------
        AdGameBox.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        //----------------------------------------------------------------------
        AdGameBox.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        //----------------------------------------------------------------------
        AdGameBox.prototype.destroy = function () {
            this.unload();
            _super.prototype.destroy.call(this);
        };
        //----------------------------------------------------------------------
        AdGameBox.prototype.load = function () {
            this.itemRenderList = [];
            this.loadConfig();
            for (var i = 0; i < this.gameList.length; i++) {
                var data = this.gameList[i];
                if (!data.isPlayed) {
                    var itemRender = new uniLib.AdGameBoxItemRenderer(this, data);
                    this.adGroup.addChild(itemRender);
                    this.itemRenderList.push(itemRender);
                }
            }
            for (var i = 0; i < this.gameList.length; i++) {
                var data = this.gameList[i];
                if (data.isPlayed) {
                    var itemRender = new uniLib.AdGameBoxItemRenderer(this, data);
                    this.adGroup.addChild(itemRender);
                    this.itemRenderList.push(itemRender);
                }
            }
            this.thumb.mask = this.maskRect;
            this.maskRect.width = 0;
            this.refreshBoxData();
        };
        //----------------------------------------------------------------------
        AdGameBox.prototype.unload = function () {
            for (var i = 0; i < this.itemRenderList.length; i++) {
                var itemRender = this.itemRenderList[i];
                itemRender.destroy();
                if (itemRender.parent)
                    itemRender.parent.removeChild(itemRender);
            }
            this.adGroup.removeChildren();
            this.itemRenderList.length = 0;
        };
        //----------------------------------------------------------------------
        AdGameBox.prototype.loadConfig = function () {
            var isResetData = true;
            var createTimestamp = parseInt(uniLib.Utils.getLocalStorage(uniLib.Global.initOpt.gameName + "_AdGameBox_createTimestamp", "0"));
            var lastTimestamp = createTimestamp;
            var curTimestamp = (new Date()).valueOf();
            var lastStrTime = GX.timestampToString(lastTimestamp);
            var curStrTime = GX.timestampToString(curTimestamp);
            var lastTimeValues = lastStrTime.split(" ");
            var curTimeValues = curStrTime.split(" ");
            lastTimeValues = lastTimeValues[0].split("-");
            curTimeValues = curTimeValues[0].split("-");
            if (parseInt(curTimeValues[0]) - parseInt(lastTimeValues[0]) == 0 && parseInt(curTimeValues[1]) - parseInt(lastTimeValues[1]) == 0 && parseInt(curTimeValues[2]) - parseInt(lastTimeValues[2]) == 0) {
                isResetData = false;
            }
            this.config = new AdGameBoxConfig();
            this.gameList = [];
            var gameBoxData = [];
            this.config.createTimestamp = curTimestamp;
            this.config.tryTimesTotal = 0;
            var adDataList = uniLib.AdConfig.itemDataList;
            for (var i = 0; i < adDataList.length; i++) {
                var adItemData = adDataList[i];
                if (adItemData.tryPlayEnable) {
                    var gameItemData = new AdGameBoxItemData();
                    gameItemData.id = i + 1;
                    gameItemData.appid = adItemData.appid;
                    gameItemData.img = adItemData.img;
                    gameItemData.path = adItemData.path;
                    gameItemData.title = adItemData.title;
                    gameItemData.isPlayed = false;
                    this.gameList.push(gameItemData);
                }
            }
            for (var i = 0; i < this.userBoxData.length; i++) {
                var userData = this.userBoxData[i];
                var boxData = new AdGameBoxData;
                boxData.reward = userData.reward;
                boxData.tryTimes = userData.tryTimes;
                boxData.received = false;
                gameBoxData.push(boxData);
            }
            if (!isResetData) {
                this.config.createTimestamp = createTimestamp;
                this.config.tryTimesTotal = parseInt(uniLib.Utils.getLocalStorage(uniLib.Global.initOpt.gameName + "_AdGameBox_tryTimesTotal", "0"));
                var strJson = uniLib.Utils.getLocalStorage(uniLib.Global.initOpt.gameName + "_AdGameBox_playedGameList", "");
                var playedGameList = [];
                if (strJson.length > 0) {
                    playedGameList = JSON.parse(strJson);
                }
                for (var i = 0; i < this.gameList.length; i++) {
                    var game = this.gameList[i];
                    for (var j = 0; j < playedGameList.length; j++) {
                        var playedGame = playedGameList[j];
                        if (playedGame.appid == game.appid && playedGame.id == game.id) {
                            game.isPlayed = true;
                            break;
                        }
                    }
                }
                strJson = uniLib.Utils.getLocalStorage(uniLib.Global.initOpt.gameName + "_AdGameBox_gameBoxList", "");
                var gameBoxs = [];
                if (strJson.length > 0) {
                    gameBoxs = JSON.parse(strJson);
                    for (var i = 0; i < gameBoxData.length; i++) {
                        gameBoxData[i].received = gameBoxs[i].received;
                    }
                }
            }
            this.config.boxData = gameBoxData;
            this.saveConfig();
        };
        //----------------------------------------------------------------------
        AdGameBox.prototype.saveConfig = function () {
            uniLib.Utils.setLocalStorage(uniLib.Global.initOpt.gameName + "_AdGameBox_createTimestamp", this.config.createTimestamp.toString());
            uniLib.Utils.setLocalStorage(uniLib.Global.initOpt.gameName + "_AdGameBox_tryTimesTotal", this.config.tryTimesTotal.toString());
            var gameBoxs = [];
            var playedGameList = [];
            for (var i = 0; i < this.config.boxData.length; i++) {
                var boxData = this.config.boxData[i];
                gameBoxs.push({ received: boxData.received });
            }
            for (var i = 0; i < this.gameList.length; i++) {
                var game = this.gameList[i];
                if (game.isPlayed) {
                    playedGameList.push({ id: game.id, appid: game.appid });
                }
            }
            uniLib.Utils.setLocalStorage(uniLib.Global.initOpt.gameName + "_AdGameBox_gameBoxList", JSON.stringify(gameBoxs));
            uniLib.Utils.setLocalStorage(uniLib.Global.initOpt.gameName + "_AdGameBox_playedGameList", JSON.stringify(playedGameList));
        };
        //----------------------------------------------------------------------
        AdGameBox.prototype.onClickTap = function (e) {
            if (e.target == this.closeBtn || e.target == this.skin["touchLayer"]) {
                uniLib.AdPlat.instance.hideAdGameBox();
            }
            else if (e.target == this.skin["gameBoxBtn1"]) {
                var button = this.skin["gameBoxBtn1"];
                this.config.boxData[0].received = true;
                this.showBoxReward(this.config.boxData[0].reward);
                button.enabled = false;
                button.touchEnabled = false;
                egret.Tween.removeTweens(button);
                button.scaleX = button.scaleY = 1;
                var staticSkinName = "finishLabel1";
                var staticLabel = this.skin[staticSkinName];
                staticLabel.visible = true;
                var valueSkinName = "rewardLabel1";
                var rewardLable = this.skin[valueSkinName];
                rewardLable.visible = false;
                this.saveConfig();
            }
            else if (e.target == this.skin["gameBoxBtn2"]) {
                var button = this.skin["gameBoxBtn2"];
                this.config.boxData[1].received = true;
                this.showBoxReward(this.config.boxData[1].reward);
                button.enabled = false;
                button.touchEnabled = false;
                egret.Tween.removeTweens(button);
                button.scaleX = button.scaleY = 1;
                var staticSkinName = "finishLabel2";
                var staticLabel = this.skin[staticSkinName];
                staticLabel.visible = true;
                var valueSkinName = "rewardLabel2";
                var rewardLable = this.skin[valueSkinName];
                rewardLable.visible = false;
                this.saveConfig();
            }
            else if (e.target == this.skin["gameBoxBtn3"]) {
                var button = this.skin["gameBoxBtn3"];
                this.config.boxData[2].received = true;
                this.showBoxReward(this.config.boxData[2].reward);
                button.enabled = false;
                button.touchEnabled = false;
                egret.Tween.removeTweens(button);
                button.scaleX = button.scaleY = 1;
                var staticSkinName = "finishLabel3";
                var staticLabel = this.skin[staticSkinName];
                staticLabel.visible = true;
                var valueSkinName = "rewardLabel3";
                var rewardLable = this.skin[valueSkinName];
                rewardLable.visible = false;
                this.saveConfig();
            }
            else if (e.target == this.skin["gameBoxBtn4"]) {
                var button = this.skin["gameBoxBtn4"];
                this.config.boxData[3].received = true;
                this.showBoxReward(this.config.boxData[3].reward);
                button.enabled = false;
                button.touchEnabled = false;
                egret.Tween.removeTweens(button);
                button.scaleX = button.scaleY = 1;
                var staticSkinName = "finishLabel4";
                var staticLabel = this.skin[staticSkinName];
                staticLabel.visible = true;
                var valueSkinName = "rewardLabel4";
                var rewardLable = this.skin[valueSkinName];
                rewardLable.visible = false;
                this.saveConfig();
            }
            else if (e.target == this.skin["gameBoxBtn5"]) {
                var button = this.skin["gameBoxBtn5"];
                this.config.boxData[4].received = true;
                this.showBoxReward(this.config.boxData[4].reward);
                button.enabled = false;
                button.touchEnabled = false;
                egret.Tween.removeTweens(button);
                button.scaleX = button.scaleY = 1;
                var staticSkinName = "finishLabel5";
                var staticLabel = this.skin[staticSkinName];
                staticLabel.visible = true;
                var valueSkinName = "rewardLabel5";
                var rewardLable = this.skin[valueSkinName];
                rewardLable.visible = false;
                this.saveConfig();
            }
        };
        //----------------------------------------------------------------------
        // 开始试玩游戏通告
        //----------------------------------------------------------------------
        AdGameBox.prototype.notityStartTryPlayGame = function (renderer) {
            console.log("notityStartTryPlayGame - 开始试玩游戏通告");
            this.startGameTimestamp = (new Date()).valueOf();
            this.tryPlayGameItemRenderer = renderer;
        };
        //----------------------------------------------------------------------
        // 从试玩游戏中退回来
        //----------------------------------------------------------------------
        AdGameBox.prototype.notityExitTryPlayGame = function () {
            if (null == this.startGameTimestamp || null == this.tryPlayGameItemRenderer)
                return;
            console.log("notityExitTryPlayGame 从试玩游戏中退回来");
            var curTimestamp = (new Date()).valueOf();
            if (curTimestamp - this.startGameTimestamp < this.tryPlayGameTime)
                return;
            for (var i = 0; i < this.itemRenderList.length; i++) {
                var itemRender = this.itemRenderList[i];
                if (itemRender == this.tryPlayGameItemRenderer) {
                    var adData = this.tryPlayGameItemRenderer.adData;
                    this.config.tryTimesTotal++;
                    var isPlayed = adData.isPlayed;
                    adData.isPlayed = true;
                    this.tryPlayGameItemRenderer.updateData(adData);
                    this.saveConfig();
                    this.refreshBoxData();
                    if (!isPlayed) {
                        if (itemRender.parent)
                            itemRender.parent.removeChild(itemRender);
                        this.adGroup.addChild(itemRender);
                        this.showTryPlayReward(this.userTryPlayGameReward);
                    }
                    break;
                }
            }
            this.startGameTimestamp = null;
            this.tryPlayGameItemRenderer = null;
        };
        // //----------------------------------------------------------------------
        // // 点试玩游戏响应超时通告
        // //----------------------------------------------------------------------
        // notityStopTryPlayGame(renderer:AdGameBoxItemRenderer)
        // {
        //     if(renderer == this.tryPlayGameItemRenderer)
        //     {
        //         console.log("notityStopTryPlayGame - 点试玩游戏响应超时通告");
        //         this.startGameTimestamp = null;
        //         this.tryPlayGameItemRenderer = null;
        //     }
        // }
        //----------------------------------------------------------------------
        AdGameBox.prototype.refreshBoxData = function () {
            var maxTryTimes = 0;
            for (var i = 0; i < this.config.boxData.length; i++) {
                var data = this.config.boxData[i];
                var buttonSkinName = "gameBoxBtn" + (i + 1).toString();
                var valueSkinName = "rewardLabel" + (i + 1).toString();
                var staticSkinName = "finishLabel" + (i + 1).toString();
                var button = this.skin[buttonSkinName];
                var rewardLable = this.skin[valueSkinName];
                var staticLabel = this.skin[staticSkinName];
                rewardLable.text = data.tryTimes.toString();
                if (data.received) {
                    button.enabled = false;
                    rewardLable.visible = false;
                    staticLabel.visible = true;
                }
                else {
                    button.enabled = true;
                    rewardLable.visible = true;
                    staticLabel.visible = false;
                }
                if (data.tryTimes > maxTryTimes) {
                    maxTryTimes = data.tryTimes;
                }
            }
            for (var i = this.config.boxData.length; i < 5; i++) {
                var groupName = "boxGroup" + (i + 1).toString();
                var group = this.skin[groupName];
                if (group && group.parent)
                    group.parent.removeChild(group);
            }
            this.maskRect.width = this.progressBarGroup.width * (this.config.tryTimesTotal / maxTryTimes);
            for (var i = 0; i < this.config.boxData.length; i++) {
                var data = this.config.boxData[i];
                var buttonSkinName = "gameBoxBtn" + (i + 1).toString();
                var button = this.skin[buttonSkinName];
                egret.Tween.removeTweens(button);
                button.touchEnabled = false;
                if (!data.received && data.tryTimes <= this.config.tryTimesTotal) {
                    button.touchEnabled = true;
                    button.scaleX = button.scaleY = 1;
                    egret.Tween.get(button, { loop: true }).to({ scaleX: 1.2, scaleY: 1.2 }, 200, egret.Ease.sineIn).to({ scaleX: 1, scaleY: 1 }, 250, egret.Ease.sineOut);
                }
            }
            this.totalDescLabel.text = "累计试玩可得宝箱奖励（" + this.config.tryTimesTotal + "次）";
        };
        return AdGameBox;
    }(ui.BaseUI));
    uniLib.AdGameBox = AdGameBox;
    __reflect(AdGameBox.prototype, "uniLib.AdGameBox");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    //----------------------------------------------------------------------
    var AdGameBoxItemRenderer = (function (_super) {
        __extends(AdGameBoxItemRenderer, _super);
        function AdGameBoxItemRenderer(gameBox, data) {
            var _this = _super.call(this) || this;
            _this.skinName = "AdGameBoxItemSkin";
            _this.adGameBox = gameBox;
            _this.data = data;
            _this.navigateTimeout = null;
            var tryPlayGameTime = Math.floor(gameBox["tryPlayGameTime"] / 1000);
            _this.descTimeLabel.text = "试玩" + tryPlayGameTime.toString() + "秒";
            _this.rewardValueLabel.text = "x" + gameBox["userTryPlayGameReward"].toString();
            _this.rewardDescLabel.text = "试玩" + tryPlayGameTime.toString() + "秒";
            _this.load();
            return _this;
        }
        //----------------------------------------------------------------------
        AdGameBoxItemRenderer.prototype.destroy = function () {
            this.tryPlayBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTryPlayGame, this);
        };
        Object.defineProperty(AdGameBoxItemRenderer.prototype, "adData", {
            //----------------------------------------------------------------------
            get: function () {
                return this.data;
            },
            enumerable: true,
            configurable: true
        });
        //----------------------------------------------------------------------
        AdGameBoxItemRenderer.prototype.updateData = function (data) {
            if (null != data)
                this.data = data;
            if (this.data.isPlayed) {
                this.redPointRect.visible = false;
                this.staticGroup.visible = false;
                this.dynamicGroup.visible = true;
            }
            else {
                this.redPointRect.visible = true;
                this.staticGroup.visible = true;
                this.dynamicGroup.visible = false;
            }
        };
        //----------------------------------------------------------------------
        AdGameBoxItemRenderer.prototype.load = function () {
            if (this.data.img && this.data.img.length > 0) {
                uniLib.ResLoadMgr.instance.loadRemoteImage(this.data.img, this.onLoaded, this);
            }
        };
        //----------------------------------------------------------------------
        AdGameBoxItemRenderer.prototype.onLoaded = function (url, texture) {
            var adData = this.data;
            if (null == texture) {
                console.log("请求图片失败", url);
            }
            this.adImage.texture = texture;
            if (this.adLabel) {
                if (adData.title && adData.title.length > 0) {
                    this.adLabel.text = adData.title;
                }
                else {
                    this.adLabel.text = "";
                }
            }
            this.updateData();
            this.tryPlayBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTryPlayGame, this);
        };
        //----------------------------------------------------------------------
        AdGameBoxItemRenderer.prototype.onTryPlayGame = function () {
            if (this.navigateTimeout)
                return;
            this.navigateTimeout = egret.setTimeout(this.onNavigateTimeout, this, 3000);
            this.navigateToMiniProgram();
        };
        //----------------------------------------------------------------------
        AdGameBoxItemRenderer.prototype.onNavigateTimeout = function () {
            if (this.navigateTimeout) {
                egret.clearTimeout(this.navigateTimeout);
                this.navigateTimeout = null;
            }
        };
        //------------------------------------------------------------------------------
        AdGameBoxItemRenderer.prototype.navigateToMiniProgram = function () {
            window.platform.customInterface("navigateToMiniProgram", this.data, this.onNavigateToMiniProgramCallback, this);
        };
        AdGameBoxItemRenderer.prototype.onNavigateToMiniProgramCallback = function (result, userData) {
            if (this.navigateTimeout) {
                egret.clearTimeout(this.navigateTimeout);
                this.navigateTimeout = null;
            }
            if (result == true) {
                uniLib.Global.reportAldEvent("试玩小游戏" + userData.title);
                uniLib.Global.reportUmaEvent("试玩小游戏" + userData.title);
                this.adGameBox.notityStartTryPlayGame(this);
            }
        };
        return AdGameBoxItemRenderer;
    }(eui.Component));
    uniLib.AdGameBoxItemRenderer = AdGameBoxItemRenderer;
    __reflect(AdGameBoxItemRenderer.prototype, "uniLib.AdGameBoxItemRenderer");
})(uniLib || (uniLib = {}));
var ui;
(function (ui) {
    var AdGameFinishScrollView = (function (_super) {
        __extends(AdGameFinishScrollView, _super);
        function AdGameFinishScrollView(callback, thisObj, params) {
            var _this = _super.call(this) || this;
            _this.scrollDir = 1; // 滚动方向
            _this.isStartMisTouching = false;
            _this.skinName = "AdGameFinishScrollViewSkin";
            _this.adaptationWidth();
            _this.adaptationHeight();
            _this.callback = callback;
            _this.thisObj = thisObj;
            _this.cbParams = params;
            _this.init();
            return _this;
        }
        AdGameFinishScrollView.prototype.destroy = function () {
            this.isStartMisTouching = false;
            ui.AdMisTouchManager.instance.stopMisTouchPos(this.continueBtn);
            egret.Tween.removeTweens(this.continueBtn);
            if (this.movieClip) {
                egret.Tween.removeTweens(this.movieClip);
                this.movieClip.stop();
                if (this.movieClip.parent) {
                    this.movieClip.parent.removeChild(this.movieClip);
                }
                this.movieClip = null;
            }
            if (this.circle) {
                egret.Tween.removeTweens(this.circle);
                if (this.circle.parent) {
                    this.circle.parent.removeChild(this.circle);
                }
                this.circle = null;
            }
            if (this.markIcon) {
                egret.Tween.removeTweens(this.markIcon);
                if (this.markIcon.parent) {
                    this.markIcon.parent.removeChild(this.markIcon);
                }
                this.markIcon = null;
            }
            if (this.timerHandler) {
                egret.clearInterval(this.timerHandler);
                this.timerHandler = null;
            }
            if (this.itemRenderList && this.itemRenderList.length > 0) {
                for (var i = 0; i < this.itemRenderList.length; i++) {
                    var itemRender = this.itemRenderList[i];
                    itemRender.destroy();
                    if (itemRender.parent)
                        itemRender.parent.removeChild(itemRender);
                }
            }
            this.itemRenderList = [];
            _super.prototype.destroy.call(this);
        };
        AdGameFinishScrollView.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            // this.addEventListener(egret.Event.ENTER_FRAME, this.onUpdateFrame, this);
        };
        AdGameFinishScrollView.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            // this.removeEventListener(egret.Event.ENTER_FRAME, this.onUpdateFrame, this);
        };
        AdGameFinishScrollView.prototype.init = function () {
            this.continueBtn.visible = true;
            this.onUpdateTime();
            this.startMisTouchPos();
            // let self = this;
            // egret.Tween.get(this.continueBtn).to({alpha:1}, 500).call(this.startMisTouchPos, this);
            // let timeout = egret.setTimeout(()=>{
            //     egret.clearTimeout(timeout);
            //     self.continueBtn.visible = true;
            //     egret.Tween.get(self.continueBtn).to({alpha:1}, 500);
            //     self.startMisTouchPos();
            // }, this, 1000);
        };
        //-----------------------------------------------------------------------------
        AdGameFinishScrollView.prototype.onLoad = function () {
            var adDataList = uniLib.AdConfig.itemDataList;
            if (null == adDataList) {
                return;
            }
            if (this.itemRenderList && this.itemRenderList.length > 0) {
                for (var i = 0; i < this.itemRenderList.length; i++) {
                    var itemRender = this.itemRenderList[i];
                    itemRender.destroy();
                    if (itemRender.parent)
                        itemRender.parent.removeChild(itemRender);
                }
                this.itemRenderList = [];
            }
            // adDataList = uniLib.MathUtil.randArray(adDataList);
            this.itemRenderList = new Array();
            this.adGroup.removeChildren();
            for (var i = 0; i < 6; i++) {
                if (i >= adDataList.length)
                    break;
                var nameIndex = (i % 6) + 1;
                var bgImage = "ad-itembar" + nameIndex;
                var data = adDataList[i];
                var itemRender = new ui.AdGameItemDataRender(data, "AdGameItemSkin", bgImage);
                this.adGroup.addChild(itemRender);
                this.itemRenderList.push(itemRender);
            }
            if (this.itemRenderList.length % 2 != 0) {
                var nameIndex = 1;
                var bgImage = "ad-itembar" + nameIndex;
                var data = adDataList[0];
                var itemRender = new ui.AdGameItemDataRender(data, "AdGameItemSkin", bgImage);
                this.adGroup.addChild(itemRender);
                this.itemRenderList.push(itemRender);
            }
            if (null == this.timerHandler) {
                this.timerHandler = egret.setInterval(this.onUpdateTime, this, 3000);
            }
        };
        AdGameFinishScrollView.prototype.onUpdateTime = function () {
            this.onLoad();
            if (this.movieClip) {
                egret.Tween.removeTweens(this.movieClip);
                this.movieClip.stop();
                if (this.movieClip.parent) {
                    this.movieClip.parent.removeChild(this.movieClip);
                }
                this.movieClip = null;
            }
            if (this.circle) {
                egret.Tween.removeTweens(this.circle);
                if (this.circle.parent) {
                    this.circle.parent.removeChild(this.circle);
                }
                this.circle = null;
            }
            if (this.markIcon) {
                egret.Tween.removeTweens(this.markIcon);
                if (this.markIcon.parent) {
                    this.markIcon.parent.removeChild(this.markIcon);
                }
                this.markIcon = null;
            }
            if (this.itemRenderList.length < 0)
                return;
            if (!uniLib.AdConfig.gameConfig["clickMislead"])
                return;
            var index = uniLib.MathUtil.RandomNumBoth(0, 6);
            if (index >= this.itemRenderList.length) {
                index = this.itemRenderList.length - 1;
            }
            if (index < 0)
                index = 0;
            var itemRender = this.itemRenderList[index];
            this.circle = new eui.Image("ad-guide-circle");
            this.circle.touchEnabled = false;
            itemRender.addChild(this.circle);
            this.circle.x = itemRender.width * 0.5;
            this.circle.y = itemRender.height * 0.5;
            this.circle.anchorOffsetX = 39.5;
            this.circle.anchorOffsetY = 39.5;
            this.movieClip = uniLib.Utils.creatMovieClip("finger_effect_json", "finger_effect_png", "finger", -1);
            this.movieClip.x = itemRender.width * 0.5;
            this.movieClip.y = itemRender.height * 0.5;
            this.movieClip.touchEnabled = false;
            itemRender.addChild(this.movieClip);
            this.movieClip.gotoAndPlay(0, -1);
            this.circle.scaleX = this.circle.scaleY = 1;
            egret.Tween.get(this.circle, { loop: true }).to({ scaleX: 1, scaleY: 1 }, 300).to({ scaleX: 0.5, scaleY: 0.5 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
            index = 6 - index;
            if (index >= this.itemRenderList.length) {
                index = this.itemRenderList.length - 1;
            }
            if (index < 0)
                index = 0;
            itemRender = this.itemRenderList[index];
            this.markIcon = new eui.Image("ad-icon-mark");
            this.markIcon.touchEnabled = false;
            itemRender.addChild(this.markIcon);
            this.markIcon.right = 0;
            this.markIcon.alpha = 1;
            // egret.Tween.get(this.markIcon, {loop:true}).to({alpha:0}, 50).wait(100).to({alpha:1}, 50).wait(100);
        };
        //-----------------------------------------------------------------------------
        AdGameFinishScrollView.prototype.onUpdateFrame = function () {
            if (this.adScroller.viewport.contentWidth <= 0 || this.adScroller.viewport.contentHeight <= 0)
                return;
            var length = 0;
            if (uniLib.Global.designWidth > uniLib.Global.designHeight) {
                length = this.adScroller.viewport.contentWidth - this.adScroller.viewport.width;
            }
            else {
                length = this.adScroller.viewport.contentHeight - this.adScroller.viewport.height;
            }
            if (length <= 0)
                return;
            var velocity = 1;
            if (uniLib.Global.designWidth > uniLib.Global.designHeight) {
                if (this.scrollDir > 0) {
                    this.adScroller.viewport.scrollH += velocity;
                    if (this.adScroller.viewport.scrollH >= length) {
                        this.adScroller.viewport.scrollH = length;
                        this.scrollDir = -1;
                    }
                }
                else {
                    this.adScroller.viewport.scrollH -= velocity;
                    if (this.adScroller.viewport.scrollH <= 0) {
                        this.adScroller.viewport.scrollH = 0;
                        this.scrollDir = 1;
                    }
                }
            }
            else {
                if (this.scrollDir > 0) {
                    this.adScroller.viewport.scrollV += velocity;
                    if (this.adScroller.viewport.scrollV >= length) {
                        this.adScroller.viewport.scrollV = length;
                        this.scrollDir = -1;
                    }
                }
                else {
                    this.adScroller.viewport.scrollV -= velocity;
                    if (this.adScroller.viewport.scrollV <= 0) {
                        this.adScroller.viewport.scrollV = 0;
                        this.scrollDir = 1;
                    }
                }
            }
        };
        AdGameFinishScrollView.prototype.onClose = function () {
            uniLib.AdPlat.instance.hideBanner();
            if (this.callback) {
                this.callback.call(this.thisObj, this.cbParams);
            }
            this.callback = null;
            this.thisObj = null;
            this.cbParams = null;
            egret.Tween.removeTweens(this.continueBtn);
            GX.PopUpManager.removePopUp(this);
            window.platform.customInterface("showGameClubButton");
            uniLib.EventListener.getInstance().dispatchEventWith("CLOSED_FULLSCREEN_AD_VIEW", false, null);
        };
        AdGameFinishScrollView.prototype.randomNavigateToMiniProgram = function () {
            if (uniLib.AdConfig.itemDataList.length <= 0)
                return;
            var minIndex = 0;
            var maxIndex = uniLib.AdConfig.itemDataList.length;
            var curIndex = uniLib.MathUtil.random(minIndex, maxIndex);
            if (curIndex < 0)
                curIndex = 0;
            else if (curIndex >= uniLib.AdConfig.itemDataList.length)
                curIndex = uniLib.AdConfig.itemDataList.length - 1;
            var adData = uniLib.AdConfig.itemDataList[curIndex];
            window.platform.customInterface("navigateToMiniProgram", adData, function (result, userData) {
                if (result == true) {
                    uniLib.Global.reportAldEvent("导出小游戏" + userData.title);
                    uniLib.Global.reportUmaEvent("导出小游戏" + userData.title);
                }
            }, this);
        };
        AdGameFinishScrollView.prototype.onNavigateToMiniProgramCallback = function (result, userData) {
            if (result == true) {
                uniLib.Global.reportAldEvent("导出小游戏" + userData.title);
                uniLib.Global.reportUmaEvent("导出小游戏" + userData.title);
            }
        };
        AdGameFinishScrollView.prototype.onClickTap = function (e) {
            if (e.target == this.continueBtn) {
                if (this.isStartMisTouching)
                    return;
                this.onClose();
            }
        };
        AdGameFinishScrollView.prototype.startMisTouchPos = function () {
            this.isStartMisTouching = false;
            this.continueBtn.y = uniLib.Global.screenHeight - 150;
            if (ui.AdMisTouchManager.instance.startMisTouchPos(this.continueBtn, this.onStopMisTouchPos, this)) {
                this.continueBtn.visible = true;
                this.continueBtn.alpha = 1;
                this.isStartMisTouching = true;
            }
            else {
                this.continueBtn.visible = true;
                this.continueBtn.alpha = 0;
                egret.Tween.get(this.continueBtn).wait(800).to({ alpha: 1 }, 500);
            }
        };
        AdGameFinishScrollView.prototype.onStopMisTouchPos = function (result) {
            var self = this;
            if (result) {
                var targetY = uniLib.Global.screenHeight * 0.5;
                if (uniLib.Global.designWidth < uniLib.Global.designHeight)
                    targetY = uniLib.Global.screenHeight - 400;
                egret.Tween.get(this.continueBtn).wait(1200).to({ y: targetY }, 25).call(function () {
                    self.isStartMisTouching = false;
                    // uniLib.AdPlat.instance.hideBanner();
                }, this);
            }
        };
        return AdGameFinishScrollView;
    }(ui.BaseUI));
    ui.AdGameFinishScrollView = AdGameFinishScrollView;
    __reflect(AdGameFinishScrollView.prototype, "ui.AdGameFinishScrollView");
})(ui || (ui = {}));
var ui;
(function (ui) {
    var AdGameItemDataRender = (function (_super) {
        __extends(AdGameItemDataRender, _super);
        function AdGameItemDataRender(data, skinName, bgImage) {
            var _this = _super.call(this) || this;
            _this.isTouchBegin = false;
            _this.isTouchCancel = false;
            _this.skinName = skinName;
            _this.data = data;
            if (_this.adbg && bgImage && bgImage.length > 0) {
                _this.adbg.source = bgImage;
            }
            _this.load();
            return _this;
        }
        AdGameItemDataRender.prototype.destroy = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
        };
        AdGameItemDataRender.prototype.load = function () {
            if (this.data.img && this.data.img.length > 0) {
                uniLib.ResLoadMgr.instance.loadRemoteImage(this.data.img, this.onLoaded, this);
            }
        };
        AdGameItemDataRender.prototype.onLoaded = function (url, texture) {
            var adData = this.data;
            if (null == texture) {
                console.log("请求图片失败", url);
            }
            this.adImage.texture = texture;
            if (this.adLabel) {
                if (adData.title && adData.title.length > 0) {
                    this.adLabel.text = adData.title;
                }
                else {
                    this.adLabel.text = "";
                }
            }
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
        };
        //------------------------------------------------------------------------------
        AdGameItemDataRender.prototype.onTouchBegin = function (e) {
            this.isTouchBegin = true;
            this.isTouchCancel = false;
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        };
        //------------------------------------------------------------------------------
        AdGameItemDataRender.prototype.onTouchEnd = function (e) {
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            if (this.isTouchBegin && this.isTouchCancel) {
                window.platform.customInterface("navigateToMiniProgram", this.data, this.onNavigateToMiniProgramCallback, this);
            }
            this.isTouchBegin = false;
            this.isTouchCancel = false;
        };
        //------------------------------------------------------------------------------
        AdGameItemDataRender.prototype.onTouchCancel = function (e) {
            if (!this.isTouchBegin)
                return;
            this.isTouchCancel = true;
        };
        //------------------------------------------------------------------------------
        AdGameItemDataRender.prototype.onClickTap = function (e) {
            this.navigateToMiniProgram();
        };
        //------------------------------------------------------------------------------
        AdGameItemDataRender.prototype.navigateToMiniProgram = function () {
            window.platform.customInterface("navigateToMiniProgram", this.data, this.onNavigateToMiniProgramCallback, this);
        };
        AdGameItemDataRender.prototype.onNavigateToMiniProgramCallback = function (result, userData) {
            if (result == true) {
                uniLib.Global.reportAldEvent("导出小游戏" + userData.title);
                uniLib.Global.reportUmaEvent("导出小游戏" + userData.title);
            }
        };
        return AdGameItemDataRender;
    }(eui.Component));
    ui.AdGameItemDataRender = AdGameItemDataRender;
    __reflect(AdGameItemDataRender.prototype, "ui.AdGameItemDataRender");
})(ui || (ui = {}));
var ui;
(function (ui) {
    var AdGridAdRender = (function () {
        function AdGridAdRender(root, animType, processNavigate, isNewMode) {
            this.processNavigateCallback = false;
            this.ignoreFingerAnim = true;
            this.isNewMode = false;
            if (null == animType)
                animType = 0;
            this.animType = animType;
            if (null == processNavigate)
                processNavigate = false;
            if (uniLib.AdConfig.gameConfig["clickMislead"]) {
                this.processNavigateCallback = processNavigate ? true : false;
            }
            this.isNewMode = isNewMode ? true : false;
            this.init(root);
        }
        AdGridAdRender.prototype.destroy = function () {
            if (this.movieClip) {
                egret.Tween.removeTweens(this.movieClip);
                this.movieClip.stop();
                if (this.movieClip.parent) {
                    this.movieClip.parent.removeChild(this.movieClip);
                }
                this.movieClip = null;
            }
            if (this.circle) {
                egret.Tween.removeTweens(this.circle);
                if (this.circle.parent) {
                    this.circle.parent.removeChild(this.circle);
                }
                this.circle = null;
            }
            if (null != this.adTimer) {
                egret.clearInterval(this.adTimer);
                this.adTimer = null;
            }
            if (this.elements && this.elements.length > 0) {
                for (var i = 0; i < this.elements.length; i++) {
                    var button = this.elements[i];
                    button.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
                    egret.Tween.removeTweens(button);
                }
                this.elements = [];
            }
            this.elements = null;
        };
        AdGridAdRender.prototype.init = function (root) {
            this.elements = new Array();
            for (var i = 1; i <= 10; i++) {
                var name_1 = "adBtn" + i;
                var button = root.skin[name_1];
                if (null == button)
                    break;
                this.elements.push(button);
                button.visible = false;
                button.enabled = false;
                var adLabel = button.skin["adLabel"];
                if (adLabel) {
                    adLabel.stroke = 2;
                    adLabel.textColor = 0xFFFFFF;
                }
                button.x = button.x / uniLib.Global.designWidth * uniLib.Global.screenWidth;
                button.y = button.y / uniLib.Global.designHeight * uniLib.Global.screenHeight;
            }
        };
        AdGridAdRender.prototype.getRandomAdData = function () {
            if (null == uniLib.AdConfig.itemDataList || uniLib.AdConfig.itemDataList.length <= 0)
                return null;
            var nonRepetitiveItemData = [];
            for (var i = 0; i < uniLib.AdConfig.itemDataList.length; i++) {
                var item = uniLib.AdConfig.itemDataList[i];
                var hasSameData = false;
                for (var j = 0; j < nonRepetitiveItemData.length; j++) {
                    if (nonRepetitiveItemData[j].appid == item.appid) {
                        hasSameData = true;
                        break;
                    }
                }
                if (!hasSameData) {
                    if (null == item.priority || item.priority != 1) {
                        nonRepetitiveItemData.push(item);
                    }
                }
            }
            if (null == nonRepetitiveItemData || nonRepetitiveItemData.length <= 0)
                return null;
            if (AdGridAdRender.ADGRID_CUR_INDEX < 0) {
                var minIndex = 0;
                var maxIndex = nonRepetitiveItemData.length;
                AdGridAdRender.ADGRID_CUR_INDEX = uniLib.MathUtil.RandomNumBoth(minIndex, maxIndex - 1);
            }
            else {
                ++AdGridAdRender.ADGRID_CUR_INDEX;
            }
            if (AdGridAdRender.ADGRID_CUR_INDEX < 0)
                AdGridAdRender.ADGRID_CUR_INDEX = 0;
            else if (AdGridAdRender.ADGRID_CUR_INDEX >= nonRepetitiveItemData.length)
                AdGridAdRender.ADGRID_CUR_INDEX = 0;
            var adData = nonRepetitiveItemData[AdGridAdRender.ADGRID_CUR_INDEX];
            return adData;
        };
        AdGridAdRender.prototype.findButtonAdByUrl = function (url) {
            if (null == this.elements)
                return null;
            var buttons = [];
            for (var i = 0; i < this.elements.length; i++) {
                var button = this.elements[i];
                if (button["adurl"] && button["adurl"] == url) {
                    buttons.push(button);
                }
            }
            return buttons;
        };
        AdGridAdRender.prototype.loadButtonAd = function (button) {
            var adData = this.getRandomAdData();
            if (null == adData) {
                button.visible = false;
                button.enabled = false;
                return;
            }
            button["adData"] = adData;
            button["adurl"] = adData.img;
            if (button.skin["adLabel"]) {
                button.skin["adLabel"].text = adData.title;
            }
            uniLib.ResLoadMgr.instance.loadRemoteImage(adData.img, this.onLoaded, this);
        };
        AdGridAdRender.prototype.load = function (ignoreFingerAnim) {
            if (null == this.elements || this.elements.length <= 0)
                return;
            this.ignoreFingerAnim = ignoreFingerAnim ? true : false;
            var _loop_1 = function (i) {
                var button = this_1.elements[i];
                var waitTime = uniLib.MathUtil.random(50, 1000);
                var animType = this_1.animType; // 动作类型， 0: 缩放+旋转, 1:只缩放， 2：只旋转 -1:静态的
                egret.setTimeout(function (targets) {
                    var target = targets[0];
                    var initScaleX = target.scaleX;
                    var initScaleY = target.scaleY;
                    var t = uniLib.MathUtil.random(600, 800);
                    // let t = uniLib.MathUtil.random(400, 500);
                    if (animType == 1) {
                        egret.Tween.get(target, { loop: true }).to({ scaleX: initScaleX - 0.2, scaleY: initScaleY - 0.2 }, t).to({ scaleX: initScaleX, scaleY: initScaleY }, t);
                    }
                    else if (animType == 2) {
                        egret.Tween.get(target, { loop: true }).to({ rotation: 40 }, t).to({ rotation: -40 }, t).to({ rotation: 0 }, t * 0.5);
                    }
                    else if (animType == 0) {
                        egret.Tween.get(target, { loop: true }).to({ scaleX: initScaleX - 0.2, scaleY: initScaleY - 0.2 }, t).to({ scaleX: initScaleX, scaleY: initScaleY }, t).to({ rotation: 40 }, t).to({ rotation: -40 }, t).to({ rotation: 0 }, t * 0.5);
                    }
                }, this_1, waitTime, [button]);
                button.addEventListener(egret.TouchEvent.TOUCH_TAP, this_1.onClickTap, this_1);
                this_1.loadButtonAd(button);
            };
            var this_1 = this;
            for (var i = 0; i < this.elements.length; i++) {
                _loop_1(i);
            }
            this.adTimer = egret.setInterval(this.updateAdButton, this, 3000);
            if (this.ignoreFingerAnim)
                return;
            if (!uniLib.AdConfig.gameConfig["clickMislead"])
                return;
            var minValue = 0;
            var maxValue = this.elements.length - 1;
            var index = uniLib.MathUtil.RandomNumBoth(0, maxValue);
            var itemButton = this.elements[index];
            this.circle = new eui.Image("ad-guide-circle");
            this.circle.touchEnabled = false;
            itemButton.addChild(this.circle);
            this.circle.x = itemButton.width * 0.5;
            this.circle.y = itemButton.height * 0.5;
            this.circle.anchorOffsetX = 39.5;
            this.circle.anchorOffsetY = 39.5;
            this.movieClip = uniLib.Utils.creatMovieClip("finger_effect_json", "finger_effect_png", "finger", -1);
            this.movieClip.x = itemButton.width * 0.5;
            this.movieClip.y = itemButton.height * 0.5;
            this.movieClip.touchEnabled = false;
            itemButton.addChild(this.movieClip);
            this.movieClip.gotoAndPlay(0, -1);
            this.circle.scaleX = this.circle.scaleY = 1;
            egret.Tween.get(this.circle, { loop: true }).to({ scaleX: 1, scaleY: 1 }, 300).to({ scaleX: 0.5, scaleY: 0.5 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
        };
        AdGridAdRender.prototype.onLoaded = function (url, texture) {
            var buttons = this.findButtonAdByUrl(url);
            if (null == buttons) {
                return;
            }
            for (var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                button.visible = true;
                button.enabled = true;
                var adData = button["adData"];
                button.skin["adImage"].texture = texture;
                if (button.skin["adLabel"])
                    button.skin["adLabel"].text = adData.title;
            }
        };
        AdGridAdRender.prototype.updateAdButton = function () {
            if (this.movieClip) {
                egret.Tween.removeTweens(this.movieClip);
                this.movieClip.stop();
                if (this.movieClip.parent) {
                    this.movieClip.parent.removeChild(this.movieClip);
                }
                this.movieClip = null;
            }
            if (this.circle) {
                egret.Tween.removeTweens(this.circle);
                if (this.circle.parent) {
                    this.circle.parent.removeChild(this.circle);
                }
                this.circle = null;
            }
            if (this.elements.length <= 0)
                return;
            AdGridAdRender.ADGRID_CUR_INDEX = uniLib.MathUtil.RandomNumBoth(0, this.elements.length - 1);
            for (var i = 0; i < this.elements.length; i++) {
                var button = this.elements[i];
                this.loadButtonAd(button);
            }
            if (this.ignoreFingerAnim)
                return;
            if (!uniLib.AdConfig.gameConfig["clickMislead"])
                return;
            var minValue = 0;
            var maxValue = this.elements.length - 1;
            var index = uniLib.MathUtil.RandomNumBoth(0, maxValue);
            var itemButton = this.elements[index];
            this.circle = new eui.Image("ad-guide-circle");
            this.circle.touchEnabled = false;
            itemButton.addChild(this.circle);
            this.circle.x = itemButton.width * 0.5;
            this.circle.y = itemButton.height * 0.5;
            this.circle.anchorOffsetX = 39.5;
            this.circle.anchorOffsetY = 39.5;
            this.movieClip = uniLib.Utils.creatMovieClip("finger_effect_json", "finger_effect_png", "finger", -1);
            this.movieClip.x = itemButton.width * 0.5;
            this.movieClip.y = itemButton.height * 0.5;
            this.movieClip.touchEnabled = false;
            itemButton.addChild(this.movieClip);
            this.movieClip.gotoAndPlay(0, -1);
            this.circle.scaleX = this.circle.scaleY = 1;
            egret.Tween.get(this.circle, { loop: true }).to({ scaleX: 1, scaleY: 1 }, 100).to({ scaleX: 0.5, scaleY: 0.5 }, 100);
        };
        AdGridAdRender.prototype.onClickTap = function (e) {
            var button = e.target;
            if (null == button)
                return;
            var adData = button["adData"];
            if (null != adData) {
                window.platform.customInterface("navigateToMiniProgram", adData, this.onNavigateToMiniProgramCallback, this);
            }
        };
        AdGridAdRender.prototype.randomNavigateToMiniProgram = function () {
            if (uniLib.AdConfig.itemDataList.length <= 0)
                return;
            var minIndex = 0;
            var maxIndex = uniLib.AdConfig.itemDataList.length;
            var curIndex = uniLib.MathUtil.random(minIndex, maxIndex);
            if (curIndex < 0)
                curIndex = 0;
            else if (curIndex >= uniLib.AdConfig.itemDataList.length)
                curIndex = uniLib.AdConfig.itemDataList.length - 1;
            var adData = uniLib.AdConfig.itemDataList[curIndex];
            window.platform.customInterface("navigateToMiniProgram", adData, this.onNavigateToMiniProgramCallback, this);
        };
        AdGridAdRender.prototype.onNavigateToMiniProgramCallback = function (result, userData) {
            if (result == true) {
                uniLib.Global.reportAldEvent("导出小游戏" + userData.title);
                uniLib.Global.reportUmaEvent("导出小游戏" + userData.title);
            }
            else if (this.processNavigateCallback) {
                uniLib.AdPlat.instance.showFullScreenAd(null, null, null, null, null, this.isNewMode);
            }
        };
        AdGridAdRender.ADGRID_CUR_INDEX = -1;
        return AdGridAdRender;
    }());
    ui.AdGridAdRender = AdGridAdRender;
    __reflect(AdGridAdRender.prototype, "ui.AdGridAdRender");
})(ui || (ui = {}));
var uniLib;
(function (uniLib) {
    var AdInterstitial = (function () {
        function AdInterstitial(unitId) {
            this.adUnitId = unitId;
            this.interstitial = null;
            this.state = 0;
            this.isShow = false;
            this.showTimestamp = 0;
            this.load();
        }
        Object.defineProperty(AdInterstitial.prototype, "id", {
            //----------------------------------------------------------------------
            get: function () {
                return this.adUnitId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AdInterstitial.prototype, "isLoaded", {
            //----------------------------------------------------------------------
            get: function () {
                return this.state == 3 ? true : false;
            },
            enumerable: true,
            configurable: true
        });
        //----------------------------------------------------------------------
        AdInterstitial.prototype.createInterstitialAd = function () {
            var interstitialAd = null;
            if (window[uniLib.Global.platformName] && window[uniLib.Global.platformName].createInterstitialAd) {
                interstitialAd = window[uniLib.Global.platformName].createInterstitialAd({ adUnitId: this.adUnitId });
            }
            return interstitialAd;
        };
        //----------------------------------------------------------------------
        AdInterstitial.prototype.load = function () {
            this.destroy();
            this.state = 1;
            if (null == this.interstitial) {
                this.interstitial = this.createInterstitialAd();
                this.interstitial.onLoad(this.onInterstitialLoad.bind(this));
                this.interstitial.onError(this.onInterstitialError.bind(this));
                this.interstitial.onClose(this.onInterstitialClose.bind(this));
                if (uniLib.Global.isTTGame) {
                    this.interstitial.load();
                }
            }
            else {
                this.interstitial.load();
            }
        };
        //----------------------------------------------------------------------
        AdInterstitial.prototype.onInterstitialLoad = function () {
            console.log("------onInterstitialLoad 广告加载成功------", this.adUnitId);
            this.state = 3;
            if (this.isShow) {
                this.show(true, this.showCallback, this.showCallbackTarget);
            }
        };
        //----------------------------------------------------------------------
        AdInterstitial.prototype.onInterstitialError = function (err) {
            console.warn('onInterstitialError:', err);
            this.state = 2;
            this.isShow = false;
            if (this.showCallback)
                this.showCallback.call(this.showCallbackTarget, false);
        };
        //----------------------------------------------------------------------
        AdInterstitial.prototype.onInterstitialClose = function (res) {
            this.isShow = false;
            if (this.closeCallback)
                this.closeCallback.call(this.showCallbackTarget);
            this.closeCallback = null;
            this.showCallbackTarget = null;
            this.load();
        };
        //----------------------------------------------------------------------
        AdInterstitial.prototype.show = function (force, callback, closeCallback, thisObj) {
            this.showCallback = callback;
            this.closeCallback = closeCallback;
            this.showCallbackTarget = thisObj;
            if (this.state == 2 || this.state == 0) {
                if (this.showCallback)
                    this.showCallback.call(this.showCallbackTarget, false);
                this.load();
                return;
            }
            this.isShow = true;
            var self = this;
            if (this.state == 3) {
                console.warn("显示插屏广告...");
                this.interstitial.show().then(function (info) {
                    console.log("interstitial show ok", info);
                    if (callback)
                        callback.call(thisObj, true);
                }).catch(function (err) {
                    console.error("interstitial show error.........", err);
                    if (callback)
                        callback.call(thisObj, false);
                });
                this.showTimestamp = Date.now();
            }
        };
        //----------------------------------------------------------------------
        AdInterstitial.prototype.destroy = function () {
            if (null == this.interstitial)
                return;
            console.log("destroy AdInterstitial");
            this.interstitial.offLoad(this.onInterstitialLoad);
            this.interstitial.offError(this.onInterstitialError);
            this.interstitial.offClose(this.onInterstitialClose);
            this.state = 0;
            this.interstitial.destroy();
            this.interstitial = null;
        };
        return AdInterstitial;
    }());
    uniLib.AdInterstitial = AdInterstitial;
    __reflect(AdInterstitial.prototype, "uniLib.AdInterstitial");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    // 使用 https://api.liteplay.com.cn/admin/wx_config/getLocation
    // {"code":0,"msg":"操作成功","data":{"ip":"113.89.236.184","country":"中国","province":"广东","city":"深圳市","county":"宝安区","isp":"电信","area":"中国广东深圳市宝安区电信"}}
    var AdIPData = (function () {
        function AdIPData() {
        }
        return AdIPData;
    }());
    uniLib.AdIPData = AdIPData;
    __reflect(AdIPData.prototype, "uniLib.AdIPData");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var AdItemData = (function () {
        function AdItemData() {
        }
        return AdItemData;
    }());
    uniLib.AdItemData = AdItemData;
    __reflect(AdItemData.prototype, "uniLib.AdItemData");
})(uniLib || (uniLib = {}));
var ui;
(function (ui) {
    var AdItemDataRender = (function (_super) {
        __extends(AdItemDataRender, _super);
        function AdItemDataRender(data, skinName, showBg, showTitle, stroke, processNavigate, titleImage) {
            var _this = _super.call(this) || this;
            _this.processNavigateCallback = false;
            _this.isTouchBegin = false;
            _this.isTouchCancel = false;
            _this.isNewMode = false;
            _this.skinName = skinName;
            _this.data = data;
            if (_this.adbg) {
                if (showBg) {
                    _this.adbg.visible = true;
                }
                else {
                    _this.adbg.visible = false;
                }
            }
            if (_this.adLabel) {
                if (showTitle) {
                    _this.adLabel.visible = true;
                }
                else {
                    _this.adLabel.visible = false;
                }
                _this.adLabel.stroke = stroke;
            }
            if (_this.newTitle && titleImage && titleImage.length > 0) {
                _this.newTitle.source = titleImage;
            }
            if (uniLib.AdConfig.gameConfig["clickMislead"]) {
                _this.processNavigateCallback = processNavigate ? true : false;
            }
            _this.load();
            return _this;
        }
        AdItemDataRender.prototype.destroy = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            if (uniLib.AdConfig.gameConfig["clickMislead"]) {
                this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
                this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
            }
        };
        AdItemDataRender.prototype.setNewMode = function (isNewMode) {
            this.isNewMode = isNewMode ? true : false;
        };
        AdItemDataRender.prototype.load = function () {
            if (this.data.img && this.data.img.length > 0) {
                uniLib.ResLoadMgr.instance.loadRemoteImage(this.data.img, this.onLoaded, this);
            }
        };
        AdItemDataRender.prototype.onLoaded = function (url, texture) {
            var adData = this.data;
            if (null == texture) {
                console.log("请求图片失败", url);
            }
            this.adImage.texture = texture;
            if (this.adLabel) {
                if (adData.title && adData.title.length > 0) {
                    this.adLabel.text = adData.title;
                }
                else {
                    this.adLabel.text = "";
                }
            }
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            if (uniLib.AdConfig.gameConfig["clickMislead"]) {
                this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
                this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
            }
        };
        //------------------------------------------------------------------------------
        AdItemDataRender.prototype.onTouchBegin = function (e) {
            this.isTouchBegin = true;
            this.isTouchCancel = false;
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        };
        //------------------------------------------------------------------------------
        AdItemDataRender.prototype.onTouchEnd = function (e) {
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            if (this.isTouchBegin && this.isTouchCancel) {
                window.platform.customInterface("navigateToMiniProgram", this.data, this.onNavigateToMiniProgramCallback, this);
            }
            this.isTouchBegin = false;
            this.isTouchCancel = false;
        };
        //------------------------------------------------------------------------------
        AdItemDataRender.prototype.onTouchCancel = function (e) {
            if (!this.isTouchBegin)
                return;
            this.isTouchCancel = true;
        };
        AdItemDataRender.prototype.onClickTap = function (e) {
            this.navigateToMiniProgram();
        };
        //------------------------------------------------------------------------------
        AdItemDataRender.prototype.navigateToMiniProgram = function () {
            window.platform.customInterface("navigateToMiniProgram", this.data, this.onNavigateToMiniProgramCallback, this);
        };
        AdItemDataRender.prototype.onNavigateToMiniProgramCallback = function (result, userData) {
            if (result == true) {
                uniLib.Global.reportAldEvent("导出小游戏" + userData.title);
                uniLib.Global.reportUmaEvent("导出小游戏" + userData.title);
            }
            else if (this.processNavigateCallback) {
                uniLib.AdPlat.instance.showFullScreenAd(null, null, null, null, null, this.isNewMode);
            }
        };
        return AdItemDataRender;
    }(eui.Component));
    ui.AdItemDataRender = AdItemDataRender;
    __reflect(AdItemDataRender.prototype, "ui.AdItemDataRender");
})(ui || (ui = {}));
var ui;
(function (ui) {
    // 狂点误触基UI类
    var AdMisTouchGifBox = (function (_super) {
        __extends(AdMisTouchGifBox, _super);
        function AdMisTouchGifBox(mistouchAppBox) {
            var _this = _super.call(this) || this;
            _this.curValue = 0;
            _this.isShowedBanner = false;
            _this.isOpenedBanner = false;
            _this.openedBannerTimes = 0;
            _this.randValue = 0;
            _this.isMistouchAppBox = false;
            _this.isFinished = false;
            _this.isMistouchAppBox = mistouchAppBox ? true : false;
            _this.curValue = 0;
            _this.openedBannerTimes = 0;
            _this.isFinished = false;
            _this.randValue = 30; //uniLib.MathUtil.RandomNumBoth(30, 50);
            _this.updateIntervalTimer = egret.setInterval(_this.onUpdate, _this, 60);
            return _this;
        }
        AdMisTouchGifBox.prototype.setFinishedCallback = function (callback, thisObj, params) {
            this.finishedCallback = callback;
            this.finishedCallbackTarget = thisObj;
            this.finishedCallbackParmas = params;
        };
        AdMisTouchGifBox.prototype.finished = function () {
            if (this.closeTimeout) {
                egret.clearTimeout(this.closeTimeout);
                this.closeTimeout = null;
            }
            if (this.isFinished)
                return;
            this.isFinished = true;
            if (this.updateIntervalTimer) {
                egret.clearInterval(this.updateIntervalTimer);
                this.updateIntervalTimer = null;
            }
            if (this.openBannerCallbackTimer) {
                egret.clearTimeout(this.openBannerCallbackTimer);
                this.openBannerCallbackTimer = null;
            }
            this.reward(this.isOpenedBanner);
            if (this.finishedCallback) {
                this.finishedCallback.call(this.finishedCallbackTarget, this.finishedCallbackParmas);
            }
            this.finishedCallback = null;
            this.finishedCallbackTarget = null;
            this.finishedCallbackParmas = null;
            GX.PopUpManager.removePopUp(this);
        };
        AdMisTouchGifBox.prototype.onUpdate = function () {
            if (this.isOpenedBanner) {
                this.finished();
                return;
            }
            var self = this;
            if (this.curValue <= 30)
                this.curValue -= 1;
            else if (this.curValue >= 65)
                this.curValue -= 3;
            else
                this.curValue -= 2;
            if (this.curValue < 0)
                this.curValue = 0;
            if (this.curValue >= 100) {
                this.curValue = 90;
            }
            this.setProgress(this.curValue, 100);
            if (this.curValue > 0) {
                if (null == this.closeTimeout) {
                    this.closeTimeout = egret.setTimeout(this.finished, this, 20000);
                }
            }
            if (this.curValue >= 100) {
                this.finished();
                return;
            }
            if (!this.isShowedBanner) {
                if (this.curValue >= uniLib.MathUtil.RandomNumBoth(20, 50)) {
                    this.openMistouchBanner();
                }
                // if(this.openedBannerTimes == 0)
                // {
                //     if(this.curValue >= uniLib.MathUtil.RandomNumBoth(12, 30))
                //     {
                //         this.openMistouchBanner();
                //     }
                // }
                // else if(this.openedBannerTimes == 1)
                // {
                //     if(this.curValue >= uniLib.MathUtil.RandomNumBoth(35, 50))
                //     {
                //         this.openMistouchBanner();
                //     }
                // }
                // else if(this.openedBannerTimes == 2)
                // {
                //     if(this.curValue >= uniLib.MathUtil.RandomNumBoth(45, 60))
                //     {
                //         this.openMistouchBanner();
                //     }
                // }
                // else
                // {
                //     if(this.curValue >= 65)
                //     {
                //         this.openMistouchBanner();
                //     }
                // }
            }
        };
        AdMisTouchGifBox.prototype.openMistouchBanner = function () {
            var self = this;
            this.isShowedBanner = true;
            ++this.openedBannerTimes;
            if (this.isMistouchAppBox) {
                uniLib.Global.reportAldEvent("狂点出现盒子广告");
                window.platform.showAppBoxAdvertisement(true, function (res) {
                    console.log("盒子广告返回", res);
                    self.isOpenedBanner = true;
                }, this);
            }
            else {
                uniLib.Global.reportAldEvent("狂点出现Banner " + this.openedBannerTimes + "次");
                uniLib.Global.reportUmaEvent("狂点出现Banner " + this.openedBannerTimes + "次");
                uniLib.AdPlat.instance.showAutoBanner(this.onOpenBannerCallback, this);
            }
            if (this.openBannerCallbackTimer) {
                egret.clearTimeout(this.openBannerCallbackTimer);
                this.openBannerCallbackTimer = null;
            }
            this.openBannerCallbackTimer = egret.setTimeout(this.onOpenBannerTimeOutCallback, this, 2000);
        };
        AdMisTouchGifBox.prototype.onOpenBannerCallback = function (isOpen) {
            if (this.openBannerCallbackTimer) {
                egret.clearTimeout(this.openBannerCallbackTimer);
                this.openBannerCallbackTimer = null;
            }
            if (isOpen) {
                uniLib.Global.reportAldEvent("第" + this.openedBannerTimes + "次狂点点击了Banner");
                uniLib.Global.reportUmaEvent("第" + this.openedBannerTimes + "次狂点点击了Banner");
                this.isOpenedBanner = true;
                this.finished();
            }
            else if (uniLib.Global.isQQGame) {
                this.isOpenedBanner = true;
                this.finished();
            }
        };
        AdMisTouchGifBox.prototype.onOpenBannerTimeOutCallback = function (isOpen) {
            if (this.openBannerCallbackTimer) {
                egret.clearTimeout(this.openBannerCallbackTimer);
                this.openBannerCallbackTimer = null;
            }
            this.isShowedBanner = false;
            if (uniLib.Global.isWxgame) {
                if (this.openedBannerTimes >= 3) {
                    this.finished();
                }
            }
            else {
                this.finished();
            }
        };
        return AdMisTouchGifBox;
    }(ui.BaseUI));
    ui.AdMisTouchGifBox = AdMisTouchGifBox;
    __reflect(AdMisTouchGifBox.prototype, "ui.AdMisTouchGifBox");
})(ui || (ui = {}));
var ui;
(function (ui) {
    /**
     * 广告误触管理器
     */
    var AdMisTouchManager = (function () {
        //-------------------------------------------------------------------
        function AdMisTouchManager() {
            this.misTouchNum = 0; // 误点次数间隔
            this.misTouchPosNum = 0; // 位移次数间隔
            this.curMisTouchNum = 0;
            this.curMisTouchPosNum = 0;
        }
        Object.defineProperty(AdMisTouchManager, "instance", {
            get: function () {
                if (null == AdMisTouchManager._instance) {
                    AdMisTouchManager._instance = new AdMisTouchManager();
                }
                return AdMisTouchManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        //-------------------------------------------------------------------
        AdMisTouchManager.prototype.startMisTouch = function (misTouchGifBox, callback, thisObj, params) {
            if (null == uniLib.AdPlat.instance.availableBanner() && !uniLib.Global.isH5)
                return false;
            if (this.misTouchNum <= 0)
                return false;
            this.curMisTouchNum++;
            if (this.curMisTouchNum < this.misTouchNum) {
                return false;
            }
            this.curMisTouchNum = 0;
            uniLib.AdPlat.instance.hideBanner();
            misTouchGifBox.setFinishedCallback(callback, thisObj, params);
            GX.PopUpManager.addPopUp(misTouchGifBox, true, 0.8, GX.PopUpEffect.CENTER);
            uniLib.Global.reportAldEvent("唤起狂点界面");
            uniLib.Global.reportUmaEvent("唤起狂点界面");
            return true;
        };
        //-------------------------------------------------------------------
        AdMisTouchManager.prototype.startMisTouchPos = function (target, callback, thisObj) {
            if (null == uniLib.AdPlat.instance.availableBanner() && !uniLib.Global.isH5)
                return false;
            if (null != this.touchTarget)
                return false;
            if (this.misTouchPosNum <= 0)
                return false;
            ++this.curMisTouchPosNum;
            if (this.curMisTouchPosNum < this.misTouchPosNum) {
                if (callback) {
                    callback.call(thisObj, false);
                }
                return false;
            }
            this.touchTarget = target;
            this.touchTargetCallback = callback;
            this.touchTargetObj = thisObj;
            this.curMisTouchPosNum = 0;
            uniLib.AdPlat.instance.hideBanner();
            this.misTouchTimer = egret.setTimeout(this.onMisTouchTimeoutEvent, this, 1200);
            return true;
        };
        //-------------------------------------------------------------------
        AdMisTouchManager.prototype.stopMisTouchPos = function (target) {
            if (target != this.touchTarget)
                return;
            if (this.misTouchTimer) {
                egret.clearTimeout(this.misTouchTimer);
                this.misTouchTimer = null;
            }
            if (this.touchTargetCallback) {
                this.touchTargetCallback.call(this.touchTargetObj, false);
            }
            this.touchTarget = null;
            this.touchTargetCallback = null;
            this.touchTargetObj = null;
        };
        //-------------------------------------------------------------------
        AdMisTouchManager.prototype.onMisTouchTimeoutEvent = function () {
            if (this.misTouchTimer) {
                egret.clearTimeout(this.misTouchTimer);
                this.misTouchTimer = null;
            }
            uniLib.AdPlat.instance.showBanner();
            if (this.touchTargetCallback) {
                this.touchTargetCallback.call(this.touchTargetObj, true);
            }
            this.touchTarget = null;
            this.touchTargetCallback = null;
            this.touchTargetObj = null;
        };
        AdMisTouchManager._instance = null;
        return AdMisTouchManager;
    }());
    ui.AdMisTouchManager = AdMisTouchManager;
    __reflect(AdMisTouchManager.prototype, "ui.AdMisTouchManager");
})(ui || (ui = {}));
var uniLib;
(function (uniLib) {
    var AdPlat = (function () {
        function AdPlat() {
            this.isInit = false;
            this.showBannerTimeout = null;
            this.curBannerIndex = 0;
            this.autoBannerCallback = null;
            this.autoBannerCallbackTarget = null;
            this.autoBannerTimeout = null;
            this.wx_isShared = false;
            this.wx_sharedCloseTime = 0;
            this.shareInfoArr = [];
            this.banners = [];
            this.bannerWidth = 0;
            this.recordState = 0; // 1: 正在录屏， 2：暂时录屏
            this.recordDuration = 0; // 录屏时长
            this.startRecordTimestamp = 0;
        }
        Object.defineProperty(AdPlat, "instance", {
            get: function () {
                if (null == AdPlat._instance)
                    AdPlat._instance = new AdPlat();
                return AdPlat._instance;
            },
            enumerable: true,
            configurable: true
        });
        AdPlat.prototype.getSystemInfoSync = function () {
            var sysinfo = null;
            if (window[uniLib.Global.platformName] && window[uniLib.Global.platformName].getSystemInfoSync) {
                sysinfo = window[uniLib.Global.platformName].getSystemInfoSync();
            }
            console.log("systemInfo", sysinfo);
            return sysinfo;
        };
        /**
         * 注册平台各种回调
         */
        AdPlat.prototype.regisiterCallback = function () {
            if (null == window[uniLib.Global.platformName])
                return;
            if (window[uniLib.Global.platformName].onShow) {
                window[uniLib.Global.platformName].onShow(function (res) {
                    uniLib.AdPlat.instance.onShowCallback(res);
                });
            }
            if (window[uniLib.Global.platformName].onHide) {
                window[uniLib.Global.platformName].onHide(function (res) {
                    uniLib.AdPlat.instance.onHideCallback(res);
                });
            }
        };
        /**
         * 游戏回到前台的事件
         */
        AdPlat.prototype.onShowCallback = function (res) {
            console.log("onShowCallback", res);
            var curTime = new Date().getTime();
            if (this.wx_isShared) {
                if (curTime - this.wx_sharedCloseTime >= 4000) {
                    console.log("分享成功");
                    this.wx_sharedCloseTime = curTime;
                    if (this.shareCallback)
                        this.shareCallback.call(this.shareCallbackTarget, true);
                }
                else {
                    console.log("分享失败");
                    if (this.shareCallback)
                        this.shareCallback.call(this.shareCallbackTarget, false);
                }
                this.wx_isShared = false;
            }
            if (this.tryGameBox) {
                this.tryGameBox.notityExitTryPlayGame();
            }
        };
        /**
         * 游戏隐藏到后台的事件
         */
        AdPlat.prototype.onHideCallback = function (res) {
            console.log("onHideCallback", res);
            var isOpend = res && ((res.targetAction == 8 || res.targetAction == 9 || res.targetAction == 10) && res.targetPagePath.length > 50);
            if (isOpend && this.autoBannerCallback) {
                this.autoBannerCallback.call(this.autoBannerCallbackTarget, isOpend);
            }
            this.autoBannerCallback = null;
            this.autoBannerCallbackTarget = null;
        };
        /**
         * 初始化
         */
        AdPlat.prototype.init = function () {
            this.isInit = true;
            uniLib.AdConfig.gameConfig = {};
            // if(uniLib.Global.isVivogame) 
            // {
            //     console.warn("AdPlat.init Not for Vivogame");
            //     return;
            // }
            this.systemInfo = this.getSystemInfoSync();
            this.initShare();
            this.initRecord();
            this.regisiterCallback();
            if (window[uniLib.Global.platformName] && window[uniLib.Global.platformName].setKeepScreenOn) {
                window[uniLib.Global.platformName].setKeepScreenOn({ keepScreenOn: true });
            }
            var localStorageName = null;
            if (uniLib.Global.initOpt.gameName && uniLib.Global.initOpt.gameName.length > 0) {
                localStorageName = "OPENID_" + uniLib.Global.initOpt.gameName;
            }
            var openId = uniLib.Utils.getLocalStorage(localStorageName, "");
            if (openId && openId.length > 0) {
                window.platform.init(null, null);
                uniLib.Global.reportAldOpenId(openId);
                if (uniLib.Global.initOpt.gameName && uniLib.Global.initOpt.gameName.length > 0) {
                    uniLib.AdPlat.instance.initConfig(this.initConfigComplete, this);
                }
                else {
                    uniLib.EventListener.getInstance().dispatchEventWith(uniLib.FacadeConsts.ADPLAT_INIT_COMPLETED);
                }
            }
            else {
                window.platform.init(function (msg) {
                    if (null != msg && msg.openid && msg.openid.length > 0) {
                        uniLib.Global.reportAldOpenId(msg.openid);
                    }
                    if (uniLib.Global.initOpt.gameName && uniLib.Global.initOpt.gameName.length > 0) {
                        uniLib.AdPlat.instance.initConfig(uniLib.AdPlat.instance.initConfigComplete, uniLib.AdPlat.instance);
                    }
                    else {
                        uniLib.EventListener.getInstance().dispatchEventWith(uniLib.FacadeConsts.ADPLAT_INIT_COMPLETED);
                    }
                }, this);
            }
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.initShare = function () {
            if (null == window[uniLib.Global.platformName])
                return;
            if (window[uniLib.Global.platformName].showShareMenu) {
                window[uniLib.Global.platformName].showShareMenu({
                    withShareTicket: true,
                    menus: ['shareAppMessage', 'shareTimeline'],
                    success: null,
                    fail: null,
                    complete: null
                });
            }
            if (window[uniLib.Global.platformName].onShareAppMessage) {
                window[uniLib.Global.platformName].onShareAppMessage(function () {
                    return uniLib.AdPlat.instance.buildShareInfo();
                });
            }
            if (window[uniLib.Global.platformName].onShareTimeline) {
                window[uniLib.Global.platformName].onShareTimeline(function () {
                    return uniLib.AdPlat.instance.buildShareInfo();
                });
            }
        };
        //----------------------------------------------------------------------
        // 初始化录屏
        //----------------------------------------------------------------------
        AdPlat.prototype.initRecord = function () {
            if (this.recorderManager)
                return;
            if (window[uniLib.Global.platformName] && window[uniLib.Global.platformName].getGameRecorderManager) {
                this.recorderManager = window[uniLib.Global.platformName].getGameRecorderManager();
            }
            else {
                this.recorderManager = null;
            }
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.getRecordDuration = function () {
            return this.recordDuration;
        };
        //----------------------------------------------------------------------
        // 开始录屏
        // duration 录屏时长
        //----------------------------------------------------------------------
        AdPlat.prototype.startRecord = function (duration) {
            var _this = this;
            console.log("startRecord - 开始录屏", this.recordState);
            if (duration === void 0) {
                duration = 300;
            }
            if (null == this.recorderManager) {
                this.initRecord();
                if (null == this.recorderManager) {
                    return;
                }
            }
            if (this.recordState != 0)
                return;
            this.recordState = 1;
            if (duration > 300)
                duration = 300;
            this.recordVideoPath = null;
            this.startRecordTimestamp = 0;
            this.recordDuration = 0;
            this.recorderManager.onStart(function (res) {
                console.log("record onStart", res);
                uniLib.AdPlat.instance.startRecordTimestamp = (new Date()).valueOf();
            });
            this.recorderManager.onStop(function (res) {
                console.log("record onStop", res, res.videoPath);
                uniLib.AdPlat.instance.recordState = 0;
                uniLib.AdPlat.instance.recordVideoPath = res.videoPath;
                var curTimestamp = (new Date()).valueOf();
                uniLib.AdPlat.instance.recordDuration = curTimestamp - _this.startRecordTimestamp;
            });
            this.recorderManager.onError(function (res) {
                console.log("record onError", res);
                uniLib.AdPlat.instance.recordState = 0;
                uniLib.AdPlat.instance.recordDuration = 0;
            });
            this.recorderManager.start({ duration: duration });
        };
        //----------------------------------------------------------------------
        // 停止录屏
        // callback 如果不是抖音回调参数=false
        //----------------------------------------------------------------------
        AdPlat.prototype.stopRecord = function () {
            console.log("stopRecord - 手工停止录屏", this.recordState);
            if (null == this.recorderManager) {
                return;
            }
            if (this.recordState == 0)
                return;
            this.recordState = 0;
            this.recorderManager.stop();
        };
        //----------------------------------------------------------------------
        // 暂停录屏
        //----------------------------------------------------------------------
        AdPlat.prototype.pauseRecord = function () {
            console.log("pauseRecord - 暂停录屏", this.recordState);
            if (null == this.recorderManager) {
                return;
            }
            if (this.recordState == 1) {
                this.recordState = 2;
                this.recorderManager.pause();
            }
        };
        //----------------------------------------------------------------------
        // 继续录屏
        //----------------------------------------------------------------------
        AdPlat.prototype.resumeRecord = function () {
            console.log("resumeRecord - 继续录屏", this.recordState);
            if (null == this.recorderManager) {
                return;
            }
            if (this.recordState == 2) {
                this.recorderManager.resume();
            }
        };
        //----------------------------------------------------------------------
        /**
         * 分享
         * @param query 分享参数 { channel:moosnow.SHARE_CHANNEL.LINK }
         * SHARE_CHANNEL.LINK, SHARE_CHANNEL.ARTICLE, SHARE_CHANNEL.TOKEN, SHARE_CHANNEL.VIDEO 可选 仅字节跳动有效
         * @param callback 分享成功回调参数 = true, 分享失败回调参数 = false,
         * @param shortCall 时间过短时回调 ,err 是具体错误信息，目前只在头条分享录屏时用到
         */
        //----------------------------------------------------------------------
        AdPlat.prototype.share = function (query, callback, shortCall, thisObj) {
            if (null == window[uniLib.Global.platformName])
                return;
            if (null == window[uniLib.Global.platformName].shareAppMessage)
                return;
            this.shareCallback = callback;
            this.shareShortCallback = shortCall;
            this.shareCallbackTarget = thisObj;
            var shareInfo = this.buildShareInfo(query);
            console.log('分享数据：', shareInfo);
            if (null == shareInfo)
                return;
            if (uniLib.Global.isWxgame) {
                this.wx_isShared = true;
                this.wx_sharedCloseTime = new Date().getTime();
            }
            window[uniLib.Global.platformName].shareAppMessage(shareInfo);
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.buildShareInfo = function (query) {
            if (query === void 0) {
                query = null;
            }
            ;
            var self = this;
            var title = "";
            var imageUrl = "";
            if (this.shareInfoArr && this.shareInfoArr.length > 0) {
                var item = this.shareInfoArr[uniLib.MathUtil.RandomNumBoth(0, this.shareInfoArr.length - 1)];
                title = item.title;
                imageUrl = "https://7061-paoku-p3ru7-1302658586.tcb.qcloud.la/shareicon/" + item.img;
                if (uniLib.Global.isH5)
                    imageUrl = "http://zerosgame.com/mingame_resource/shareicon/" + item.img;
            }
            if (uniLib.Global.isWxgame) {
                return { title: title, imageUrl: imageUrl, query: query };
            }
            else if (uniLib.Global.isTTGame) {
                var videoPath = this.recordVideoPath;
                var channel = "";
                if (query && ["article", "video", "token"].indexOf(query.channel) != -1) {
                    channel = query.channel;
                }
                var args = [];
                for (var k in query)
                    args.push(k + "=" + query[k]);
                return {
                    channel: channel,
                    title: title,
                    imageUrl: imageUrl,
                    query: args.join("&"),
                    extra: {
                        videoPath: videoPath,
                        videoTopics: [title],
                        withVideoId: true,
                    },
                    success: function (res) {
                        console.log('share video success :', res);
                        self.shareVideoId = res.videoId;
                        if (self.shareCallback)
                            self.shareCallback.call(self.shareCallbackTarget, true);
                    },
                    fail: function (e) {
                        console.log('share video fail ', e);
                        console.log('index of : ', e.errMsg.indexOf('short'));
                        if (e && e.errMsg && e.errMsg.indexOf('short') != -1 && self.shareShortCallback) {
                            console.log('时间太短 执行回调', e);
                            self.shareShortCallback.call(self.shareCallbackTarget, e);
                            return;
                        }
                        if (self.shareCallback)
                            self.shareCallback.call(self.shareCallbackTarget, false);
                    }
                };
            }
            return null;
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.createRewardedVideo = function (adUnitId) {
            this.video = new uniLib.AdRewardedVideo(adUnitId);
            return this.video;
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.showRewardedVideo = function (callback, thisObj) {
            if (this.video)
                this.video.show(callback, thisObj);
            else if (callback) {
                if (uniLib.Global.isTTGame)
                    callback.call(thisObj, 2);
                else
                    callback.call(thisObj, 1);
            }
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.createInterstitial = function (adUnitId) {
            this.interstitial = new uniLib.AdInterstitial(adUnitId);
            return this.interstitial;
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.showInterstitial = function (callback, closeCallback, thisObj) {
            if (this.interstitial)
                this.interstitial.show(false, callback, closeCallback, thisObj);
            else {
                if (uniLib.AdConfig.gameConfig && uniLib.AdConfig.gameConfig["adInterstitialId"]) {
                    var unitId = uniLib.AdConfig.gameConfig["adInterstitialId"];
                    this.interstitial = this.createInterstitial(unitId);
                    this.interstitial.show(false, callback, closeCallback, thisObj);
                }
                else {
                    if (callback)
                        callback.call(thisObj, false);
                    else if (closeCallback)
                        closeCallback.call(thisObj);
                }
            }
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.setBannerMaxShowTimes = function (maxTimes) {
            for (var i = 0; i < this.banners.length; i++) {
                this.banners[i].setShowTime(maxTimes);
            }
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.setBannerWidth = function (width) {
            this.bannerWidth = width;
        };
        //----------------------------------------------------------------------
        // 获得一个可用的 banner
        //----------------------------------------------------------------------
        AdPlat.prototype.availableBanner = function () {
            for (var i = 0; i < this.banners.length; i++) {
                var banner = this.banners[i];
                if (banner.isLoaded) {
                    return banner;
                }
            }
            return null;
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.createBanner = function (adUnitId) {
            for (var i = 0; i < this.banners.length; i++) {
                if (this.banners[i].id == adUnitId)
                    return null;
            }
            var banner = new uniLib.AdBanner(adUnitId, this.bannerWidth);
            this.banners.push(banner);
            return banner;
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.destroyBanners = function () {
            for (var i = 0; i < this.banners.length; i++) {
                var banner = this.banners[i];
                banner.destroy();
            }
            this.banners.length = 0;
        };
        //----------------------------------------------------------------------
        // banner 是否轮播
        //----------------------------------------------------------------------
        AdPlat.prototype.showBanner = function (isCarousel) {
            if (this.banners.length <= 0)
                return;
            if (isCarousel) {
                if (null == this.showBannerTimeout) {
                    this.showBannerTimeout = egret.setInterval(this.changeShowBanner, this, 6000);
                }
                this.changeShowBanner();
            }
            else {
                if (this.showBannerTimeout) {
                    egret.clearInterval(this.showBannerTimeout);
                    this.showBannerTimeout = null;
                }
                this.changeShowBanner();
            }
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.hideBanner = function () {
            console.log("hideBanner");
            if (this.showBannerTimeout) {
                egret.clearInterval(this.showBannerTimeout);
                this.showBannerTimeout = null;
            }
            for (var i = 0; i < this.banners.length; i++) {
                var banner = this.banners[i];
                banner.hide();
            }
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.changeShowBanner = function () {
            for (var i = 0; i < this.banners.length; i++) {
                var banner = this.banners[i];
                banner.hide();
            }
            if (this.curBannerIndex >= this.banners.length) {
                this.curBannerIndex = 0;
            }
            this.banners[this.curBannerIndex].show();
            ++this.curBannerIndex;
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.showAutoBanner = function (callback, thisObj) {
            console.log("showAutoBanner");
            if (this.banners.length <= 0)
                return;
            if (ui.AdMisTouchManager.instance.misTouchNum <= 0)
                return;
            this.autoBannerCallback = callback;
            this.autoBannerCallbackTarget = thisObj;
            var showTime = parseInt(uniLib.AdConfig.gameConfig["autoBannerShowTime"]);
            if (isNaN(showTime) || showTime <= 0) {
                showTime = 2000;
            }
            this.autoBannerTimeout = egret.setTimeout(this.hideAutoBanner, this, showTime);
            var showBanner = null;
            for (var i = 0; i < this.banners.length; i++) {
                var banner = this.banners[i];
                if (banner.isLoaded) {
                    showBanner = banner;
                    break;
                }
            }
            if (null == showBanner) {
                showBanner = this.banners[0];
            }
            showBanner.show();
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.hideAutoBanner = function () {
            if (this.autoBannerTimeout) {
                this.autoBannerCallback = null;
                this.autoBannerCallbackTarget = null;
                egret.clearTimeout(this.autoBannerTimeout);
                this.autoBannerTimeout = null;
            }
            this.hideBanner();
        };
        //----------------------------------------------------------------------
        // 显示试玩游戏界面
        //----------------------------------------------------------------------
        AdPlat.prototype.showAdGameBox = function (gameBox) {
            if (!uniLib.AdConfig.gameConfig["tryPlayEnable"])
                return false;
            if (this.tryGameBox)
                return false;
            this.tryGameBox = gameBox;
            GX.PopUpManager.addPopUp(this.tryGameBox, true, 0.8, GX.PopUpEffect.CENTER);
            return true;
        };
        //----------------------------------------------------------------------
        AdPlat.prototype.hideAdGameBox = function () {
            if (this.tryGameBox) {
                GX.PopUpManager.removePopUp(this.tryGameBox);
                this.tryGameBox = null;
            }
        };
        AdPlat.prototype.showClickMisleadAd = function (callback, thisObj, params, effectType, navigateToMiniprogram) {
            if (effectType === void 0) { effectType = GX.PopUpEffect.NOMAL; }
            window.platform.customInterface("hideGameClubButton");
            if (uniLib.AdConfig.itemDataList && uniLib.AdConfig.itemDataList.length > 0) {
                uniLib.AdPlat.instance.hideBanner();
                var view = new ui.AdClickMisleadView(callback, thisObj, params, navigateToMiniprogram);
                GX.PopUpManager.addPopUp(view, true, null, effectType, null, null, GX.GameLayerManager.loadLayer);
            }
            else {
                window.platform.customInterface("showGameClubButton");
                if (callback)
                    callback.call(thisObj);
            }
        };
        AdPlat.prototype.showGameFinishAd = function (callback, thisObj, params, effectType) {
            if (effectType === void 0) { effectType = GX.PopUpEffect.NOMAL; }
            window.platform.customInterface("hideGameClubButton");
            if (uniLib.AdConfig.itemDataList && uniLib.AdConfig.itemDataList.length > 0) {
                uniLib.AdPlat.instance.hideBanner();
                var view = new ui.AdGameFinishScrollView(callback, thisObj, params);
                GX.PopUpManager.addPopUp(view, true, null, effectType, null, null, GX.GameLayerManager.loadLayer);
            }
            else {
                window.platform.customInterface("showGameClubButton");
                if (callback)
                    callback.call(thisObj);
            }
        };
        AdPlat.prototype.showFullScreenAd = function (callback, thisObj, params, isSupper, effectType, isNewMode, navigateToMiniprogram) {
            if (effectType === void 0) { effectType = GX.PopUpEffect.NOMAL; }
            window.platform.customInterface("hideGameClubButton");
            if (uniLib.AdConfig.itemDataList && uniLib.AdConfig.itemDataList.length > 0) {
                uniLib.AdPlat.instance.hideBanner();
                var view = new ui.AdFullScreenScrollView(callback, thisObj, params, isSupper, isNewMode, navigateToMiniprogram);
                GX.PopUpManager.addPopUp(view, true, null, effectType, null, null, GX.GameLayerManager.loadLayer);
            }
            else {
                window.platform.customInterface("showGameClubButton");
                if (callback)
                    callback.call(thisObj);
            }
        };
        AdPlat.prototype.testIpRegion = function (disabledRegion) {
            console.log("testIpRegion", disabledRegion);
            if (null == disabledRegion || disabledRegion.length <= 0)
                return true;
            if (null == this.ipData)
                return false;
            for (var i = 0; i < disabledRegion.length; i++) {
                var name_2 = disabledRegion[i];
                var index = this.ipData.area.search(name_2);
                if (index != -1) {
                    // 找到，说明是屏蔽区
                    return false;
                }
            }
            return true;
        };
        AdPlat.prototype.isWhitelist = function (whitelist) {
            if (null == uniLib.Global.wxOpenId || null == whitelist)
                return false;
            for (var i = 0; i < whitelist.length; i++) {
                var openid = whitelist[i];
                if (openid && openid.length > 0 && openid == uniLib.Global.wxOpenId) {
                    return true;
                }
            }
            return false;
        };
        AdPlat.prototype.initConfig = function (callBack, thisObj) {
            var _this = this;
            var self = this;
            this.requestIP(function (info) {
                console.log("ipinfo", info);
                if (info) {
                    self.ipData = info;
                    self.requestGameConfig(function (response) {
                        if (response) {
                            uniLib.AdConfig.gameConfig = response;
                            console.log("gameConfig", response);
                            var result = self.testIpRegion(response.disabledRegion);
                            if (!result) {
                                if (!_this.isWhitelist(response.whitelist)) {
                                    console.log("disabled:" + self.ipData.area);
                                    if (callBack)
                                        callBack.call(thisObj);
                                    return;
                                }
                            }
                            console.log("pass:" + self.ipData.area);
                            ui.AdMisTouchManager.instance.misTouchNum = parseInt(response.mistouchNum);
                            ui.AdMisTouchManager.instance.misTouchPosNum = parseInt(response.mistouchPosNum);
                            uniLib.AdConfig.autoBannerShowTime = parseInt(response.autoBannerShowTime);
                            uniLib.AdConfig.autoBannerLimit = parseInt(response.autoBannerLimit);
                            uniLib.AdConfig.checkBoxMistouch = parseInt(response.checkBoxMistouch) == 0 ? false : true;
                            uniLib.AdConfig.firstEnterMisTouch = parseInt(response.firstEnterMisTouch) == 0 ? false : true;
                            uniLib.AdConfig.checkBoxProbabilitys = [];
                            if (null != response.checkBoxProbabilitys && response.checkBoxProbabilitys.length > 0) {
                                for (var i = 0; i < response.checkBoxProbabilitys.length; i++) {
                                    var probability = parseInt(response.checkBoxProbabilitys[i]);
                                    uniLib.AdConfig.checkBoxProbabilitys.push(probability);
                                }
                            }
                        }
                        if (callBack)
                            callBack.call(thisObj);
                    }, self);
                }
                else {
                    if (callBack)
                        callBack.call(thisObj);
                }
            }, this);
        };
        AdPlat.prototype.initConfigComplete = function () {
            if (null == uniLib.AdConfig.gameConfig || null == uniLib.AdConfig.gameConfig["adPlatform"]) {
                var timeout_2 = egret.setTimeout(function () {
                    console.log("重新initConfig");
                    egret.clearTimeout(timeout_2);
                    uniLib.AdPlat.instance.initConfig(uniLib.AdPlat.instance.initConfigComplete, uniLib.AdPlat.instance);
                }, this, 500);
                return;
            }
            var self = this;
            this.shareInfoArr = uniLib.AdConfig.gameConfig["shareInfo"];
            if (uniLib.AdConfig.gameConfig && uniLib.AdConfig.gameConfig["adBbannerId"]) {
                var bannUnitIds = uniLib.AdConfig.gameConfig["adBbannerId"];
                for (var i = 0; i < bannUnitIds.length; i++) {
                    var unitId = bannUnitIds[i];
                    if (unitId.length > 0) {
                        this.createBanner(unitId);
                    }
                }
            }
            if (uniLib.AdConfig.gameConfig && uniLib.AdConfig.gameConfig["adVideoId"]) {
                var unitId = uniLib.AdConfig.gameConfig["adVideoId"];
                this.createRewardedVideo(unitId);
            }
            if (uniLib.AdConfig.gameConfig && uniLib.AdConfig.gameConfig["adInterstitialId"]) {
                var unitId = uniLib.AdConfig.gameConfig["adInterstitialId"];
                this.createInterstitial(unitId);
            }
            uniLib.AdConfig.itemDataList = [];
            if (null == uniLib.AdConfig.gameConfig["tryPlayEnable"])
                uniLib.AdConfig.gameConfig["tryPlayEnable"] = false;
            if (uniLib.Global.isH5 || uniLib.Global.isWxgame) {
                this.requestGameExportData(this.requestGameExportDataComplete, this);
            }
            else {
                uniLib.AdConfig.gameConfig["tryPlayEnable"] = false;
                uniLib.EventListener.getInstance().dispatchEventWith(uniLib.FacadeConsts.ADPLAT_INIT_COMPLETED);
            }
        };
        AdPlat.prototype.requestIP = function (callBack, thisObj) {
            if (null == uniLib.Global.locationUrl || uniLib.Global.locationUrl.length <= 0) {
                callBack.call(thisObj, null);
                return;
            }
            var url = uniLib.Global.locationUrl;
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.GET);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send();
            request.addEventListener(egret.Event.COMPLETE, function (event) {
                var request = event.currentTarget;
                var response = JSON.parse(request.response);
                if (response.code == 0) {
                    callBack.call(thisObj, response.data);
                }
                else {
                    callBack.call(thisObj, null);
                }
            }, this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (event) {
                callBack.call(thisObj, null);
            }, this);
        };
        AdPlat.prototype.requestGameConfig = function (callBack, thisObj) {
            if (null == uniLib.Global.configUrl || uniLib.Global.configUrl.length <= 0) {
                callBack.call(thisObj, null);
                return;
            }
            var curTimestamp = (new Date()).valueOf();
            var url = uniLib.Global.configUrl + "?t=" + curTimestamp;
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.GET);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send();
            request.addEventListener(egret.Event.COMPLETE, function (event) {
                var request = event.currentTarget;
                var response = JSON.parse(request.response);
                var config = null;
                if (response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        var data = response[i];
                        if (data["adPlatform"]) {
                            if (uniLib.Global.isH5 && data["adPlatform"] == "web") {
                                config = data;
                                break;
                            }
                            else if (uniLib.Global.isWxgame && data["adPlatform"] == "wx") {
                                config = data;
                                break;
                            }
                            else if (uniLib.Global.isTTGame && data["adPlatform"] == "byte") {
                                config = data;
                                break;
                            }
                            else if (uniLib.Global.isQQGame && data["adPlatform"] == "qq") {
                                config = data;
                                break;
                            }
                            else if (uniLib.Global.isFastGame && data["adPlatform"] == "hw") {
                                config = data;
                                break;
                            }
                            else if (uniLib.Global.isVivogame && data["adPlatform"] == "vivo") {
                                config = data;
                                break;
                            }
                            else if (uniLib.Global.isOppogame && data["adPlatform"] == "oppo") {
                                config = data;
                                break;
                            }
                        }
                    }
                    if (null == config) {
                        config = response[0];
                    }
                }
                callBack.call(thisObj, config);
            }, this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (event) {
                callBack.call(thisObj, null);
            }, this);
        };
        AdPlat.prototype.requestGameExportData = function (callBack, thisObj) {
            if (null == uniLib.Global.exportUrl || uniLib.Global.exportUrl.length <= 0) {
                uniLib.AdConfig.gameConfig["tryPlayEnable"] = false;
                uniLib.EventListener.getInstance().dispatchEventWith(uniLib.FacadeConsts.ADPLAT_INIT_COMPLETED);
                return;
            }
            var curTimestamp = (new Date()).valueOf();
            var url = uniLib.Global.exportUrl + "?t=" + curTimestamp;
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.GET);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send();
            request.addEventListener(egret.Event.COMPLETE, function (event) {
                var request = event.currentTarget;
                var response = JSON.parse(request.response);
                if (uniLib.Global.isH5) {
                    for (var i = 0; i < response.length; i++) {
                        if (uniLib.Config.debug)
                            response[i]["img"] = "http://192.168.101.100/download/icons/icon1.png";
                        else {
                            var worlds = response[i]["img"].split("/");
                            var name_3 = worlds[worlds.length - 1];
                            response[i]["img"] = "http://zerosgame.com/mingame_resource/gameicon/" + name_3;
                        }
                    }
                }
                callBack.call(thisObj, response);
            }, this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (event) {
                callBack.call(thisObj, null);
            }, this);
        };
        AdPlat.prototype.requestGameExportDataComplete = function (data) {
            console.log("requestGameExportData", data);
            if (null == data) {
                var timeout_3 = egret.setTimeout(function () {
                    console.log("重新requestGameExportData");
                    egret.clearTimeout(timeout_3);
                    uniLib.AdPlat.instance.requestGameExportData(uniLib.AdPlat.instance.requestGameExportDataComplete, uniLib.AdPlat.instance);
                }, this, 500);
                return;
            }
            if (data && data.length > 0) {
                var tryPlayEnable = false;
                for (var i = 0; i < data.length; i++) {
                    var itemData = data[i];
                    if (itemData.tryPlayEnable && itemData.priority > 0)
                        tryPlayEnable = true;
                    if (null == itemData.priority || itemData.priority != 0) {
                        uniLib.AdConfig.itemDataList.push(itemData);
                    }
                }
                if (null != uniLib.AdConfig.gameConfig["tryPlayEnable"] && uniLib.AdConfig.gameConfig["tryPlayEnable"] == true) {
                    uniLib.AdConfig.gameConfig["tryPlayEnable"] = tryPlayEnable;
                }
            }
            else {
                uniLib.AdConfig.gameConfig["tryPlayEnable"] = false;
            }
            uniLib.EventListener.getInstance().dispatchEventWith(uniLib.FacadeConsts.ADPLAT_INIT_COMPLETED);
        };
        return AdPlat;
    }());
    uniLib.AdPlat = AdPlat;
    __reflect(AdPlat.prototype, "uniLib.AdPlat");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var AdRewardedVideo = (function () {
        function AdRewardedVideo(unitId) {
            this.adUnitId = unitId;
            this.videoAd = null;
            this.callback = null;
            this.callbackTarget = null;
            this.load();
        }
        Object.defineProperty(AdRewardedVideo.prototype, "id", {
            //----------------------------------------------------------------------
            get: function () {
                return this.adUnitId;
            },
            enumerable: true,
            configurable: true
        });
        //----------------------------------------------------------------------
        AdRewardedVideo.prototype.createRewardedVideoAd = function () {
            var videoAd = null;
            if (window[uniLib.Global.platformName] && window[uniLib.Global.platformName].createRewardedVideoAd) {
                videoAd = window[uniLib.Global.platformName].createRewardedVideoAd({ adUnitId: this.adUnitId });
            }
            return videoAd;
        };
        //----------------------------------------------------------------------
        AdRewardedVideo.prototype.load = function () {
            if (null == this.videoAd) {
                this.videoAd = this.createRewardedVideoAd();
                this.videoAd.onLoad(this.onVideoLoad.bind(this));
                this.videoAd.onError(this.onVideoError.bind(this));
                this.videoAd.onClose(this.onVideoClose.bind(this));
            }
        };
        //----------------------------------------------------------------------
        AdRewardedVideo.prototype.onVideoLoad = function () {
            console.log("------onVideoLoad 广告加载成功------", this.adUnitId);
        };
        //----------------------------------------------------------------------
        AdRewardedVideo.prototype.onVideoError = function (err) {
            console.warn('onVideoError:', err);
            if (this.callback)
                this.callback.call(this.callbackTarget, -1);
            this.callback = null;
            this.callbackTarget = null;
        };
        //----------------------------------------------------------------------
        AdRewardedVideo.prototype.onVideoClose = function (res) {
            var returnCode = 0;
            if (res && res.isEnded || res === undefined) {
                returnCode = 1;
            }
            if (this.callback)
                this.callback.call(this.callbackTarget, returnCode);
            this.callback = null;
            this.callbackTarget = null;
        };
        //----------------------------------------------------------------------
        AdRewardedVideo.prototype.show = function (callback, thisObj) {
            if (null == this.videoAd) {
                if (callback)
                    callback.call(thisObj, -1);
                return;
            }
            this.callback = callback;
            this.callbackTarget = thisObj;
            console.warn("显示激励视频广告...");
            this.videoAd.show().then(function (info) {
                console.log("rewardedVideo show ok", info);
            }).catch(function (err) {
                console.error("rewardedVideo show error.........", err);
                if (callback)
                    callback.call(thisObj, -1);
            });
        };
        //----------------------------------------------------------------------
        AdRewardedVideo.prototype.destroy = function () {
            console.log("AdRewardedVideo destroy");
            if (null == this.videoAd)
                return;
            this.videoAd.offLoad(this.onVideoLoad);
            this.videoAd.offError(this.onVideoError);
            this.videoAd.offClose(this.onVideoClose);
            this.videoAd.destroy();
            this.videoAd = null;
        };
        return AdRewardedVideo;
    }());
    uniLib.AdRewardedVideo = AdRewardedVideo;
    __reflect(AdRewardedVideo.prototype, "uniLib.AdRewardedVideo");
})(uniLib || (uniLib = {}));
var ui;
(function (ui) {
    var AdScrollView = (function (_super) {
        __extends(AdScrollView, _super);
        function AdScrollView() {
            var _this = _super.call(this) || this;
            // 0:垂直滚动
            // 1:水平滚动
            _this.rollDirection = 0;
            _this.scrollDir = 1; // 滚动方向
            _this.openUpdate = true;
            _this._isLoaded = false;
            _this._isLoaded = false;
            return _this;
        }
        Object.defineProperty(AdScrollView.prototype, "isLoaded", {
            get: function () {
                return this._isLoaded;
            },
            enumerable: true,
            configurable: true
        });
        AdScrollView.prototype.randomNavigateToMiniProgram = function () {
            if (this.itemRenderList.length <= 0)
                return;
            var minIndex = 0;
            var maxIndex = this.itemRenderList.length;
            var curIndex = uniLib.MathUtil.random(minIndex, maxIndex);
            if (curIndex < 0)
                curIndex = 0;
            else if (curIndex >= this.itemRenderList.length)
                curIndex = this.itemRenderList.length - 1;
            var itemRender = this.itemRenderList[curIndex];
            itemRender.navigateToMiniProgram();
        };
        //-----------------------------------------------------------------------------
        AdScrollView.prototype.load = function (dir, needTitle, stroke, itemRenderSkin, processNavigate, isNewMode) {
            if (this._isLoaded)
                return;
            var adDataList = uniLib.AdConfig.itemDataList;
            if (null == adDataList) {
                adDataList = [];
            }
            // adDataList = uniLib.MathUtil.randArray(adDataList);
            if (adDataList.length <= 0) {
                this.visible = false;
                if (this.parent) {
                    this.parent.visible = false;
                }
                return;
            }
            if (null == needTitle)
                needTitle = true;
            if (null == stroke)
                stroke = 0;
            if (null == dir)
                dir = 0;
            this.rollDirection = dir;
            this.itemRenderList = new Array();
            if (null == itemRenderSkin || itemRenderSkin.length <= 0) {
                itemRenderSkin = "AdItemSkin";
            }
            for (var i = 0; i < adDataList.length; i++) {
                var nameIndex = (i % 6) + 1;
                var titleImage = "ad-itembar" + nameIndex;
                var data = adDataList[i];
                var itemRender = new ui.AdItemDataRender(data, itemRenderSkin, true, needTitle, stroke, processNavigate, titleImage);
                this.adGroup.addChild(itemRender);
                this.itemRenderList.push(itemRender);
                itemRender.setNewMode(isNewMode);
            }
            if (this.itemRenderList.length % 3 != 0) {
                var data = adDataList[0];
                var itemRender = new ui.AdItemDataRender(data, itemRenderSkin, true, needTitle, stroke, processNavigate);
                this.adGroup.addChild(itemRender);
                this.itemRenderList.push(itemRender);
                itemRender.setNewMode(isNewMode);
                if (this.itemRenderList.length % 3 != 0) {
                    var data_1 = adDataList[1];
                    var itemRender_1 = new ui.AdItemDataRender(data_1, itemRenderSkin, true, needTitle, stroke, processNavigate);
                    this.adGroup.addChild(itemRender_1);
                    this.itemRenderList.push(itemRender_1);
                    itemRender_1.setNewMode(isNewMode);
                }
            }
            this.addEventListener(egret.Event.ENTER_FRAME, this.onUpdateFrame, this);
            this.timerHandler = egret.setInterval(this.onUpdateTime, this, 2000);
            this._isLoaded = true;
        };
        //-----------------------------------------------------------------------------
        AdScrollView.prototype.unload = function () {
            if (this.movieClip) {
                egret.Tween.removeTweens(this.movieClip);
                this.movieClip.stop();
                if (this.movieClip.parent) {
                    this.movieClip.parent.removeChild(this.movieClip);
                }
                this.movieClip = null;
            }
            if (this.circle) {
                egret.Tween.removeTweens(this.circle);
                if (this.circle.parent) {
                    this.circle.parent.removeChild(this.circle);
                }
                this.circle = null;
            }
            if (this.timerHandler) {
                egret.clearInterval(this.timerHandler);
                this.timerHandler = null;
            }
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onUpdateFrame, this);
            if (null == this.itemRenderList)
                return;
            for (var i = 0; i < this.itemRenderList.length; i++) {
                var itemRender = this.itemRenderList[i];
                itemRender.destroy();
                if (itemRender.parent) {
                    itemRender.parent.removeChild(itemRender);
                }
            }
            this.itemRenderList = [];
            this._isLoaded = false;
        };
        //-----------------------------------------------------------------------------
        AdScrollView.prototype.onUpdateTime = function () {
            if (this.movieClip) {
                egret.Tween.removeTweens(this.movieClip);
                this.movieClip.stop();
                if (this.movieClip.parent) {
                    this.movieClip.parent.removeChild(this.movieClip);
                }
                this.movieClip = null;
            }
            if (this.circle) {
                egret.Tween.removeTweens(this.circle);
                if (this.circle.parent) {
                    this.circle.parent.removeChild(this.circle);
                }
                this.circle = null;
            }
            if (this.itemRenderList.length < 0)
                return;
            if (!uniLib.AdConfig.gameConfig["clickMislead"])
                return;
            var minValue = 0;
            var maxValue = this.itemRenderList.length - 1;
            var index = uniLib.MathUtil.RandomNumBoth(0, maxValue);
            var itemRender = this.itemRenderList[index];
            this.circle = new eui.Image("ad-guide-circle");
            this.circle.touchEnabled = false;
            itemRender.addChild(this.circle);
            this.circle.x = itemRender.width * 0.5;
            this.circle.y = itemRender.height * 0.5;
            this.circle.anchorOffsetX = 39.5;
            this.circle.anchorOffsetY = 39.5;
            this.movieClip = uniLib.Utils.creatMovieClip("finger_effect_json", "finger_effect_png", "finger", -1);
            this.movieClip.x = itemRender.width * 0.5;
            this.movieClip.y = itemRender.height * 0.5;
            this.movieClip.touchEnabled = false;
            itemRender.addChild(this.movieClip);
            this.movieClip.gotoAndPlay(0, -1);
            this.circle.scaleX = this.circle.scaleY = 1;
            egret.Tween.get(this.circle, { loop: true }).to({ scaleX: 1, scaleY: 1 }, 300).to({ scaleX: 0.5, scaleY: 0.5 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
        };
        //-----------------------------------------------------------------------------
        AdScrollView.prototype.onUpdateFrame = function () {
            if (!this.openUpdate)
                return;
            if (this.adScroller.viewport.contentWidth <= 0 || this.adScroller.viewport.contentHeight <= 0)
                return;
            var length = 0;
            var velocity = 1;
            if (this.rollDirection == 1) {
                length = this.adScroller.viewport.contentWidth - this.adScroller.viewport.width;
                if (length <= 0)
                    return;
                if (this.scrollDir > 0) {
                    this.adScroller.viewport.scrollH += velocity;
                    if (this.adScroller.viewport.scrollH >= length) {
                        this.adScroller.viewport.scrollH = length;
                        this.scrollDir = -1;
                    }
                }
                else {
                    this.adScroller.viewport.scrollH -= velocity;
                    if (this.adScroller.viewport.scrollH <= 0) {
                        this.adScroller.viewport.scrollH = 0;
                        this.scrollDir = 1;
                    }
                }
            }
            else {
                length = this.adScroller.viewport.contentHeight - this.adScroller.viewport.height;
                if (length <= 0)
                    return;
                if (this.scrollDir > 0) {
                    this.adScroller.viewport.scrollV += velocity;
                    if (this.adScroller.viewport.scrollV >= length) {
                        this.adScroller.viewport.scrollV = length;
                        this.scrollDir = -1;
                    }
                }
                else {
                    this.adScroller.viewport.scrollV -= velocity;
                    if (this.adScroller.viewport.scrollV <= 0) {
                        this.adScroller.viewport.scrollV = 0;
                        this.scrollDir = 1;
                    }
                }
            }
        };
        return AdScrollView;
    }(eui.Component));
    ui.AdScrollView = AdScrollView;
    __reflect(AdScrollView.prototype, "ui.AdScrollView");
})(ui || (ui = {}));
var Cmd;
(function (Cmd) {
    /**
     * 平台枚举
     */
    var PlatType;
    (function (PlatType) {
        /**
         * 本平台
         */
        PlatType[PlatType["PlatType_Normal"] = 0] = "PlatType_Normal";
        /**
         * 微信
         */
        PlatType[PlatType["PlatType_WeChat"] = 1] = "PlatType_WeChat";
    })(PlatType = Cmd.PlatType || (Cmd.PlatType = {}));
    /**
     * HTTP请求错误返回定义
     */
    var HttpReturnCode;
    (function (HttpReturnCode) {
        /**
         * 无错误
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_Null"] = 0] = "HttpReturnCode_Null";
        /**
         * 通用错误
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_NormalErr"] = 1] = "HttpReturnCode_NormalErr";
        /**
         * 数据库出错
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_DbError"] = 2] = "HttpReturnCode_DbError";
        /**
         * 需要绑定账号
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_NeedBind"] = 3] = "HttpReturnCode_NeedBind";
        /**
         * 脚本错误
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_ScriptError"] = 4] = "HttpReturnCode_ScriptError";
        /**
         * 已经注册过了
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_IsRegisteredError"] = 5] = "HttpReturnCode_IsRegisteredError";
        /**
         * 当前账号未注册
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_NoRegisteredError"] = 6] = "HttpReturnCode_NoRegisteredError";
        /**
         * 签名检查错误，需要重新登录
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_SignError"] = 7] = "HttpReturnCode_SignError";
        /**
         * 服务器未开
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_ServerShutDown"] = 8] = "HttpReturnCode_ServerShutDown";
        /**
         * Json语法格式错误
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_JsonSyntaxError"] = 9] = "HttpReturnCode_JsonSyntaxError";
        /**
         * Json消息格式错误
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_JsonMessageError"] = 10] = "HttpReturnCode_JsonMessageError";
        /**
         * tokenvalue为空
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_TokenValueError"] = 11] = "HttpReturnCode_TokenValueError";
        /**
         * uid与登录uid不同
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_WaiGuaUidError"] = 12] = "HttpReturnCode_WaiGuaUidError";
        /**
         * 没有可用网关
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_NoGatewayDown"] = 13] = "HttpReturnCode_NoGatewayDown";
        /**
         * 没有可用Sdk服务器
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_NoSdkServer"] = 14] = "HttpReturnCode_NoSdkServer";
        /**
         * 签名错误
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_SdkCheckSignErr"] = 15] = "HttpReturnCode_SdkCheckSignErr";
        /**
         * 第三方服务器验证错误
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_Sdk3PartyServerErr"] = 16] = "HttpReturnCode_Sdk3PartyServerErr";
        /**
         * 网关错误
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_GatewayErr"] = 17] = "HttpReturnCode_GatewayErr";
        /**
         * 响应超时,目前设置为20秒
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_Timeout"] = 18] = "HttpReturnCode_Timeout";
        /**
         * 账号正在使用中
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_AccountUsing"] = 19] = "HttpReturnCode_AccountUsing";
        /**
         * 线上时，platid＝0被限制
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_OnlinePlatidErr"] = 20] = "HttpReturnCode_OnlinePlatidErr";
        /**
         * 绑定账号失败
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_BindAccountErr"] = 21] = "HttpReturnCode_BindAccountErr";
        /**
         * 没有可用的区服
         */
        HttpReturnCode[HttpReturnCode["HttpReturnCode_NoZoneDown"] = 22] = "HttpReturnCode_NoZoneDown";
    })(HttpReturnCode = Cmd.HttpReturnCode || (Cmd.HttpReturnCode = {}));
    /**
     * 平台用户信息
     */
    var PlatInfo = (function () {
        function PlatInfo() {
        }
        PlatInfo.prototype.GetType = function () { return "Cmd.PlatInfo"; };
        return PlatInfo;
    }());
    Cmd.PlatInfo = PlatInfo;
    __reflect(PlatInfo.prototype, "Cmd.PlatInfo");
    /**
     * 平台登录【不需要签名】
     */
    var PlatTokenLogin = (function () {
        function PlatTokenLogin() {
        }
        PlatTokenLogin.prototype.GetType = function () { return "Cmd.PlatTokenLogin"; };
        return PlatTokenLogin;
    }());
    Cmd.PlatTokenLogin = PlatTokenLogin;
    __reflect(PlatTokenLogin.prototype, "Cmd.PlatTokenLogin");
    var PlatTokenLoginReturn = (function () {
        function PlatTokenLoginReturn() {
        }
        PlatTokenLoginReturn.prototype.GetType = function () { return "Cmd.PlatTokenLoginReturn"; };
        return PlatTokenLoginReturn;
    }());
    Cmd.PlatTokenLoginReturn = PlatTokenLoginReturn;
    __reflect(PlatTokenLoginReturn.prototype, "Cmd.PlatTokenLoginReturn");
    /**
     * 选区【必须签名】
     */
    var RequestSelectZone = (function () {
        function RequestSelectZone() {
        }
        RequestSelectZone.prototype.GetType = function () { return "Cmd.RequestSelectZone"; };
        return RequestSelectZone;
    }());
    Cmd.RequestSelectZone = RequestSelectZone;
    __reflect(RequestSelectZone.prototype, "Cmd.RequestSelectZone");
    var RequestSelectZoneReturn = (function () {
        function RequestSelectZoneReturn() {
        }
        RequestSelectZoneReturn.prototype.GetType = function () { return "Cmd.RequestSelectZoneReturn"; };
        return RequestSelectZoneReturn;
    }());
    __reflect(RequestSelectZoneReturn.prototype, "RequestSelectZoneReturn");
    var HttpPackage = (function () {
        function HttpPackage() {
        }
        HttpPackage.prototype.GetType = function () { return "Cmd.HttpPackage"; };
        return HttpPackage;
    }());
    Cmd.HttpPackage = HttpPackage;
    __reflect(HttpPackage.prototype, "Cmd.HttpPackage");
    var HttpPackageReturn = (function () {
        function HttpPackageReturn() {
        }
        HttpPackageReturn.prototype.GetType = function () { return "Cmd.HttpPackageReturn"; };
        return HttpPackageReturn;
    }());
    Cmd.HttpPackageReturn = HttpPackageReturn;
    __reflect(HttpPackageReturn.prototype, "Cmd.HttpPackageReturn");
    /**
     * 基础数据
     */
    var UserBaseInfo = (function () {
        function UserBaseInfo() {
        }
        UserBaseInfo.prototype.GetType = function () { return 'Cmd.UserBaseInfo'; };
        return UserBaseInfo;
    }());
    Cmd.UserBaseInfo = UserBaseInfo;
    __reflect(UserBaseInfo.prototype, "Cmd.UserBaseInfo");
    var SysMessageCmd_S = (function () {
        function SysMessageCmd_S() {
        }
        SysMessageCmd_S.prototype.GetType = function () { return 'Cmd.SysMessageCmd_S'; };
        return SysMessageCmd_S;
    }());
    Cmd.SysMessageCmd_S = SysMessageCmd_S;
    __reflect(SysMessageCmd_S.prototype, "Cmd.SysMessageCmd_S");
    var UserInfoSynCmd_S = (function () {
        function UserInfoSynCmd_S() {
        }
        UserInfoSynCmd_S.prototype.GetType = function () { return 'Cmd.UserInfoSynCmd_S'; };
        return UserInfoSynCmd_S;
    }());
    Cmd.UserInfoSynCmd_S = UserInfoSynCmd_S;
    __reflect(UserInfoSynCmd_S.prototype, "Cmd.UserInfoSynCmd_S");
})(Cmd || (Cmd = {}));
var ui;
(function (ui) {
    /**
     * ui交互模式选择
     */
    var UIInteractive;
    (function (UIInteractive) {
        /**
        *   按钮点击后高亮反馈
         */
        UIInteractive.Bright = "bright";
        /**
        *   按钮点击后缩放反馈
         */
        UIInteractive.Scale = "scale";
    })(UIInteractive = ui.UIInteractive || (ui.UIInteractive = {}));
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button() {
            var _this = _super.call(this) || this;
            ui.PanelManage.addPanel(_this);
            return _this;
        }
        Button.prototype.destroy = function () {
            this.interactive_destroy();
        };
        Object.defineProperty(Button.prototype, "interactive", {
            /**
             * ui交互模式选择 game.UIInteractive
             */
            set: function (type) {
                this.$interactive = type;
                if (type == UIInteractive.Bright) {
                }
                else if (type == UIInteractive.Scale) {
                    if (this.stage) {
                        if (this.anchorOffsetX == 0) {
                            this.anchorOffsetX = this.width / 2;
                            this.x += this.width / 2;
                        }
                        if (this.anchorOffsetY == 0) {
                            this.anchorOffsetY = this.height / 2;
                            this.y += this.height / 2;
                        }
                    }
                }
                this.customUIInteractive();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "enabled", {
            get: function () {
                return this.$Component[3 /* enabled */];
            },
            /**
            * 组件是否可以接受用户交互。
            * 将 enabled 属性设置为 false 后，
            * 组件会自动禁用触摸事件(将 touchEnabled 和 touchChildren 同时设置为 false)，
            * 部分组件可能还会将皮肤的视图状态设置为"disabled",使其所有子项的颜色变暗。
            *
            * @default true
            *
            * @version Egret 2.4
            * @version eui 1.0
            * @platform Web,Native
            * @language zh_CN
            */
            set: function (value) {
                value = !!value;
                this.$setEnabled(value);
                if (value == false)
                    this.interactive_changeStatus(new egret.TouchEvent("enabled"));
                else
                    this.interactive_changeStatus(new egret.TouchEvent("disable"));
            },
            enumerable: true,
            configurable: true
        });
        return Button;
    }(eui.Button));
    ui.Button = Button;
    __reflect(Button.prototype, "ui.Button");
})(ui || (ui = {}));
if (!eui.Component.prototype.customUIInteractive) {
    eui.Component.prototype.customUIInteractive = function () {
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.interactive_onAddToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.interactive_onRemoveFromStage, this);
    };
}
if (!eui.Component.prototype.interactive_onAddToStage) {
    eui.Component.prototype.interactive_onAddToStage = function () {
        this.interactive_addUIListener();
        if (this.$interactive == ui.UIInteractive.Scale) {
            if (this.anchorOffsetX == 0) {
                this.anchorOffsetX = this.width / 2;
                this.x += this.width / 2;
            }
            if (this.anchorOffsetY == 0) {
                this.anchorOffsetY = this.height / 2;
                this.y += this.height / 2;
            }
        }
    };
}
if (!eui.Component.prototype.interactive_onRemoveFromStage) {
    eui.Component.prototype.interactive_onRemoveFromStage = function () {
        this.interactive_removeUIListener();
    };
}
if (!eui.Component.prototype.interactive_destroy) {
    eui.Component.prototype.interactive_destroy = function () {
        this.interactive_removeUIListener();
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.interactive_onAddToStage, this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.interactive_onRemoveFromStage, this);
    };
}
if (!eui.Component.prototype.interactive_addUIListener) {
    eui.Component.prototype.interactive_addUIListener = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.interactive_changeStatus, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.interactive_changeStatus, this);
        this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.interactive_changeStatus, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.interactive_changeStatus, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.interactive_changeStatus, this);
    };
}
if (!eui.Component.prototype.interactive_removeUIListener) {
    eui.Component.prototype.interactive_removeUIListener = function () {
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.interactive_changeStatus, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.interactive_changeStatus, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.interactive_changeStatus, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.interactive_changeStatus, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.interactive_changeStatus, this);
    };
}
if (!eui.Component.prototype.interactive_changeStatus) {
    eui.Component.prototype.interactive_changeStatus = function (e) {
        var type = e.type;
        if (type == "enabled") {
            this["filters"] = [];
            var matrix_1 = [0.3086, 0.6094, 0.0820, 0, 0,
                0.3086, 0.6094, 0.0820, 0, 0,
                0.3086, 0.6094, 0.0820, 0, 0,
                0, 0, 0, 1, 0]; // alpha
            this["filters"] = [new egret.ColorMatrixFilter(matrix_1)];
            return;
        }
        if (type == "disable") {
            this["filters"] = [];
            return;
        }
        if (this.$interactive == ui.UIInteractive.Scale) {
            switch (type) {
                case egret.TouchEvent.TOUCH_END:
                case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:
                case egret.TouchEvent.TOUCH_TAP:
                case egret.TouchEvent.TOUCH_CANCEL:
                    this.scaleX = 1;
                    this.scaleY = 1;
                    break;
                case egret.TouchEvent.TOUCH_BEGIN:
                    var soundName = uniLib.Config.InteractiveSoundName;
                    if (this["InteractiveSoundName"])
                        soundName = this["InteractiveSoundName"];
                    if (soundName && soundName != "") {
                        uniLib.SoundMgr.instance.playSound(soundName);
                    }
                    this.scaleX = 1.2;
                    this.scaleY = 1.2;
                    break;
            }
            return;
        }
        var matrix;
        var stateFilter;
        switch (type) {
            case egret.TouchEvent.TOUCH_END:
            case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:
            case egret.TouchEvent.TOUCH_TAP:
            case egret.TouchEvent.TOUCH_CANCEL:
                stateFilter = null;
                break;
            case egret.TouchEvent.TOUCH_BEGIN:
                matrix =
                    [1, 0, 0, 0, 0xff * 0.2,
                        0, 1, 0, 0, 0xe0 * 0.2,
                        0, 0, 1, 0, 0x8d * 0.2,
                        0, 0, 0, 1, 0]; // alpha
                stateFilter = new egret.ColorMatrixFilter(matrix);
                var soundName = uniLib.Config.InteractiveSoundName;
                if (this["InteractiveSoundName"])
                    soundName = this["InteractiveSoundName"];
                if (soundName && soundName != "") {
                    uniLib.SoundMgr.instance.playSound(soundName);
                }
                break;
        }
        if (null == stateFilter) {
            this["filters"] = [];
        }
        else {
            this["filters"] = [stateFilter];
        }
    };
}
var ui;
(function (ui) {
    var ItemRenderer = (function (_super) {
        __extends(ItemRenderer, _super);
        function ItemRenderer() {
            var _this = _super.call(this) || this;
            ui.PanelManage.addPanel(_this);
            return _this;
        }
        ItemRenderer.prototype.destroy = function () {
            this.interactive_destroy();
        };
        Object.defineProperty(ItemRenderer.prototype, "interactive", {
            /**
             * ui交互模式选择 game.UIInteractive
             */
            set: function (type) {
                this.$interactive = type;
                if (type == ui.UIInteractive.Bright) {
                }
                else if (type == ui.UIInteractive.Scale) {
                    if (this.stage) {
                        if (this.anchorOffsetX == 0) {
                            this.anchorOffsetX = this.width / 2;
                            this.x += this.width / 2;
                        }
                        if (this.anchorOffsetY == 0) {
                            this.anchorOffsetY = this.height / 2;
                            this.y += this.height / 2;
                        }
                    }
                }
                this.customUIInteractive();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemRenderer.prototype, "enabled", {
            get: function () {
                return this.$Component[3 /* enabled */];
            },
            /**
            * 组件是否可以接受用户交互。
            * 将 enabled 属性设置为 false 后，
            * 组件会自动禁用触摸事件(将 touchEnabled 和 touchChildren 同时设置为 false)，
            * 部分组件可能还会将皮肤的视图状态设置为"disabled",使其所有子项的颜色变暗。
            *
            * @default true
            *
            * @version Egret 2.4
            * @version eui 1.0
            * @platform Web,Native
            * @language zh_CN
            */
            set: function (value) {
                value = !!value;
                this.$setEnabled(value);
                if (value == false)
                    this.interactive_changeStatus(new egret.TouchEvent("enabled"));
                else
                    this.interactive_changeStatus(new egret.TouchEvent("disable"));
            },
            enumerable: true,
            configurable: true
        });
        return ItemRenderer;
    }(eui.ItemRenderer));
    ui.ItemRenderer = ItemRenderer;
    __reflect(ItemRenderer.prototype, "ui.ItemRenderer");
})(ui || (ui = {}));
var ui;
(function (ui) {
    var PanelManage = (function () {
        function PanelManage() {
        }
        PanelManage.addPanel = function (panel) {
            this.panelList.push(panel);
        };
        PanelManage.destroyPanel = function () {
            this.panelList = this.panelList != null && this.panelList instanceof Array ? this.panelList : [];
            for (var _i = 0, _a = this.panelList; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item != null) {
                    item.destroy();
                }
            }
            this.panelList = [];
        };
        PanelManage.panelList = [];
        return PanelManage;
    }());
    ui.PanelManage = PanelManage;
    __reflect(PanelManage.prototype, "ui.PanelManage");
})(ui || (ui = {}));
var GX;
(function (GX) {
    /**
     * 时间戳格式
     */
    var TimeFormat;
    (function (TimeFormat) {
        /**
         * Y-M-D H:M:S
         */
        TimeFormat[TimeFormat["ALL"] = 1] = "ALL";
        /**
         * H:M
         */
        TimeFormat[TimeFormat["HM"] = 2] = "HM";
        /**
         * H:M:S
         */
        TimeFormat[TimeFormat["HMS"] = 3] = "HMS";
        /**
         * M:S
         */
        TimeFormat[TimeFormat["MS"] = 4] = "MS";
    })(TimeFormat = GX.TimeFormat || (GX.TimeFormat = {}));
    /**
     * 资源风格
     */
    var RESStyle;
    (function (RESStyle) {
        /**
         * 矩形
         */
        RESStyle[RESStyle["Rect"] = 1] = "Rect";
        /**
         * 圆形
         */
        RESStyle[RESStyle["Circular"] = 2] = "Circular";
        /**
         * 圆角矩形
         */
        RESStyle[RESStyle["RoundRect"] = 3] = "RoundRect";
    })(RESStyle = GX.RESStyle || (GX.RESStyle = {}));
    /**
     * 字符串不是`undefined`、`null`或`""`
     */
    function stringIsNullOrEmpty(value) {
        return typeof (value) !== "string" || value.length == 0;
    }
    GX.stringIsNullOrEmpty = stringIsNullOrEmpty;
    /**
     * @ref http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/8809472#8809472
     */
    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    GX.generateUUID = generateUUID;
    function MD5(message) {
        // 如果编译报错找不到名称"md5"，请确认应用层egretProperties.json文件中添加了以下模块：
        // {
        //     "name": "md5",
        //     "path": "../../egret-game-library/md5/libsrc"
        // }
        var hash = new md5();
        return hash.hex_md5(message);
    }
    GX.MD5 = MD5;
    /**
     * @ref http://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
     */
    function unixTimestamp() {
        if (!Date.now) {
            Date.now = function () { return new Date().getTime(); };
        }
        return Date.now() / 1000 | 0;
    }
    GX.unixTimestamp = unixTimestamp;
    /**
     * 得到扩展名，带“.”
     * @param path
     */
    function getExtension(path) {
        var index = path.lastIndexOf(".");
        if (index == -1)
            return "";
        return path.substring(index);
    }
    GX.getExtension = getExtension;
    /**
     * 得到路径，不带末尾“/”
     * @param path
     */
    function getDirectoryName(path) {
        var index = path.lastIndexOf("/");
        if (index == -1)
            return "";
        return path.substring(0, index);
    }
    GX.getDirectoryName = getDirectoryName;
    /**
     * 得到文件名，带扩展名
     * @param path
     */
    function getFileName(path) {
        var index = path.lastIndexOf("/");
        if (index == -1)
            return path;
        return path.substring(index + 1);
    }
    GX.getFileName = getFileName;
    /**
     * 得到不带扩展名的文件名
     * @param path
     */
    function getFileNameWithoutExtension(path) {
        var name = getFileName(path);
        var index = name.lastIndexOf(".");
        if (index == -1)
            return name;
        return name.substring(0, index);
    }
    GX.getFileNameWithoutExtension = getFileNameWithoutExtension;
    /**
     * 是否是全路径
     * @param path
     */
    function isPathRooted(path) {
        return path.startsWith("http://") || path.startsWith("https://");
    }
    GX.isPathRooted = isPathRooted;
    /**
     * 时间戳转换为字符串
     * format 参数可设置为
     */
    function timestampToString(time, format) {
        if (format === void 0) { format = TimeFormat.ALL; }
        if (time == null)
            return "";
        time = time.toString().length == 10 ? time * 1000 : time;
        var now = new Date(time);
        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString().padLeft(2, '0');
        var date = now.getDate().toString().padLeft(2, '0');
        var hour = now.getHours().toString().padLeft(2, '0');
        var minute = now.getMinutes().toString().padLeft(2, '0');
        var second = now.getSeconds().toString().padLeft(2, '0');
        if (format == TimeFormat.HM) {
            return hour + ":" + minute;
        }
        else if (format == TimeFormat.HMS) {
            return hour + ":" + minute + ":" + second;
        }
        else {
            return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        }
    }
    GX.timestampToString = timestampToString;
    /**
     * 【金额表示方法】：
     *1 - 10万（不含10万），不用单位
     *10万 - 1000万（不含1000万），用K
     *1000万及以上，用M
     *数字加千分号，保留2位小数
     *@param isFontRes 是否为美术字 默认false
     *@param precise 是否返回精确数据  默认false  若为true 原始数据返回
     *@param iscomma 返回字符串是否带逗号分隔  默认true
     */
    function GoldFormat(value, isFontRes, precise, iscomma) {
        if (isFontRes === void 0) { isFontRes = false; }
        if (precise === void 0) { precise = false; }
        if (iscomma === void 0) { iscomma = false; }
        if (value == null)
            return;
        if (value < 0)
            return;
        value = Math.floor(value);
        if (precise) {
            return iscomma ? toEnInLocaleString(value + "") : (value + "");
        }
        var suffix = "";
        var returnvalue = 0;
        var precisedigits = 0;
        value = Math.floor(value * 100) / 100;
        if (value < 10000) {
            suffix = "";
            returnvalue = value;
            precisedigits = 0;
        }
        else if (value < 100000000) {
            suffix = isFontRes ? "W" : "万";
            var point = value / 10000;
            returnvalue = point;
            var remainder = value % 10000;
            precisedigits = remainder == 0 ? 0 : 2;
        }
        else {
            suffix = isFontRes ? "Y" : "亿";
            var point = value / 100000000;
            returnvalue = point;
            var remainder = value % 100000000;
            precisedigits = remainder == 0 ? 0 : 2;
        }
        var str = precisedigits == 0 ? (returnvalue + "") : GX.numToFixed(returnvalue, precisedigits);
        str = iscomma ? toEnInLocaleString(str) : str;
        str += suffix;
        return str;
    }
    GX.GoldFormat = GoldFormat;
    /**
     * 千位/拉克（十万）/克若尔（千万）分隔
     */
    function toEnInLocaleString(n) {
        var b = parseInt(n).toString();
        var point = (n + "").split(".")[1];
        var len = b.length;
        if (len <= 3) {
            return b + (Number(point) > 0 ? ("." + point) : "");
        }
        var r = len % 3;
        return (r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",")) + (Number(point) > 0 ? ("." + point) : "");
    }
    GX.toEnInLocaleString = toEnInLocaleString;
    /**
     * value转化为num位小数的字符串
     */
    function numToFixed(value, num) {
        if (num === void 0) { num = 2; }
        var scaleValue = Math.pow(10, num);
        value = value * scaleValue;
        value += 0.00001;
        value = Math.floor(value);
        var intValue = Math.floor(value / scaleValue);
        var dotValue = value % scaleValue;
        var dotVal = dotValue + "";
        var dotLen = dotVal.length;
        for (var i = dotLen; i < num; i++) {
            dotVal = "0" + dotVal;
        }
        if (dotVal.length == 0) {
            return intValue + "";
        }
        else {
            return intValue + "." + dotVal;
        }
    }
    GX.numToFixed = numToFixed;
    /**
     * 获取俩点的弧度
     */
    function getRadianByPoint(p1, p2) {
        var px = p1.x;
        var py = p1.y;
        var mx = p2.x;
        var my = p2.y;
        var x = Math.abs(px - mx);
        var y = Math.abs(py - my);
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = y / z;
        var radina = Math.acos(cos);
        var radian = Math.floor(180 / (Math.PI / radina));
        if (mx > px && my > py) {
            radian = 180 - radian;
        }
        if (mx == px && my > py) {
            radian = 180;
        }
        if (mx > px && my == py) {
            radian = 90;
        }
        if (mx < px && my > py) {
            radian = 180 + radian;
        }
        if (mx < px && my == py) {
            radian = 270;
        }
        if (mx < px && my < py) {
            radian = 360 - radian;
        }
        return radian;
    }
    GX.getRadianByPoint = getRadianByPoint;
    /**
     *获取俩点的距离
     */
    function getDistanceByPoint(p1, p2) {
        var x = p1.x - p2.x;
        var y = p1.y - p2.y;
        return Math.sqrt(x * x + y * y);
    }
    GX.getDistanceByPoint = getDistanceByPoint;
    /**
     * 通过角度获得弧度
     */
    function getRadian(angle) {
        return angle * Math.PI / 180;
    }
    GX.getRadian = getRadian;
    /**
     * 通过弧度获得角度
     */
    function getAngle(radian) {
        return radian * 180 / Math.PI;
    }
    GX.getAngle = getAngle;
    /**
    *获取弧度所在的象限
     */
    function getQuadrantByRadian(radian) {
        if (radian > 270)
            return 4;
        else if (radian > 180)
            return 3;
        else if (radian > 90)
            return 2;
        return 1;
    }
    GX.getQuadrantByRadian = getQuadrantByRadian;
    /**
     * 返回点和弧度生成的直线指向舞台边界反射后的点和弧度
     */
    function getBorderPoint(point, angle) {
        var quadrant = GX.getQuadrantByRadian(angle);
        var maxEndX = quadrant == 1 || quadrant == 2 ? uniLib.Global.screenWidth : 0;
        var maxEndY = quadrant == 2 || quadrant == 3 ? uniLib.Global.screenHeight : 0;
        var radian = GX.getRadian(angle);
        var maxDistX = Math.abs(maxEndX - point.x);
        var offsetY = Math.abs(maxDistX / Math.sin(radian) * Math.cos(radian));
        var maxDistY = Math.abs(maxEndY - point.y);
        var offsetX = Math.abs(maxDistY / Math.cos(radian) * Math.sin(radian));
        if (offsetY < maxDistY) {
            var endY = quadrant == 1 || quadrant == 4 ? point.y - offsetY : point.y + offsetY;
            var endAngle = void 0;
            if (quadrant == 1)
                endAngle = 360 - angle;
            else if (quadrant == 2)
                endAngle = 360 - angle;
            else if (quadrant == 3)
                endAngle = 360 - angle;
            else if (quadrant == 4)
                endAngle = 360 - angle;
            return { x: maxEndX, y: endY, angle: endAngle };
        }
        else if (offsetX < maxDistX) {
            var endX = quadrant == 1 || quadrant == 2 ? point.x + offsetX : point.x - offsetX;
            var endAngle = void 0;
            if (quadrant == 1)
                endAngle = 180 - angle;
            else if (quadrant == 2)
                endAngle = 180 - angle;
            else if (quadrant == 3)
                endAngle = 360 - (angle - 180);
            else if (quadrant == 4)
                endAngle = 360 - angle + 180;
            return { x: endX, y: maxEndY, angle: endAngle };
        }
    }
    GX.getBorderPoint = getBorderPoint;
    /**
    *是否为json字符串
     */
    function isJsonString(str) {
        try {
            if (typeof JSON.parse(str) == "object") {
                return true;
            }
        }
        catch (e) {
        }
        return false;
    }
    GX.isJsonString = isJsonString;
    /**
    * 金币字符串格式化
    */
    function GoldStringReplace(s) {
        if (s == null)
            return;
        s = s.replace(/{(\d+)}/g, function (match, number) {
            return GX.GoldFormat(number);
        });
        return s;
    }
    GX.GoldStringReplace = GoldStringReplace;
    /**
     * 是否是数字
     */
    function isNumber(data) {
        var str = (data + "").trim();
        var myReg = /^[0-9]*$/;
        if (myReg.test(str)) {
            return true;
        }
        else {
            return false;
        }
    }
    GX.isNumber = isNumber;
    /**
    * 置灰
    */
    function setGray(target) {
        var matrix = [0.3086, 0.6094, 0.0820, 0, 0,
            0.3086, 0.6094, 0.0820, 0, 0,
            0.3086, 0.6094, 0.0820, 0, 0,
            0, 0, 0, 1, 0];
        var stateFilter = new egret.ColorMatrixFilter(matrix);
        target["filters"] = [stateFilter];
    }
    GX.setGray = setGray;
    /**
     * 恢复正常
     */
    function setNomarl(target) {
        if (target) {
            target["filters"] = [];
        }
    }
    GX.setNomarl = setNomarl;
    /**
     * 高亮
     */
    function setLight(target) {
        var matrix = [1, 0, 0, 0, 0xff * 0.2,
            0, 1, 0, 0, 0xe0 * 0.2,
            0, 0, 1, 0, 0x8d * 0.2,
            0, 0, 0, 1, 0]; // alpha
        var stateFilter = new egret.ColorMatrixFilter(matrix);
        target["filters"] = [stateFilter];
    }
    GX.setLight = setLight;
    /**
     * 变红色
     */
    function setRed(target) {
        var matrix = [1, 0.964, 0.999, 0.96, 0xff * 0.2,
            0, 1, 0, 0, 0,
            0, 1, 1, 0, 0,
            0, 0, 0, 1, 0]; // alpha
        var stateFilter = new egret.ColorMatrixFilter(matrix);
        target["filters"] = [stateFilter];
    }
    GX.setRed = setRed;
    /**
     * 变白色
     */
    function setWhite(target) {
        var matrix = [1, 0, 0, 0, 0xff * 0.8,
            0, 1, 0, 0, 0xff * 0.8,
            0, 0, 1, 0, 0xff * 0.8,
            0, 0, 0, 1, 0]; // alpha
        var stateFilter = new egret.ColorMatrixFilter(matrix);
        target["filters"] = [stateFilter];
    }
    GX.setWhite = setWhite;
    /**
         * 金额转中文
         */
    function amountToChinese(n) {
        var fraction = ['角', '分'];
        var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        var unit = [['', '万', '亿'], ['', '拾', '佰', '仟']];
        var head = n < 0 ? '欠' : '';
        n = Math.abs(n);
        var s = '';
        for (var i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '';
        n = Math.floor(n);
        for (var i = 0; i < unit[0].length && n > 0; i++) {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    }
    GX.amountToChinese = amountToChinese;
})(GX || (GX = {}));
if (!Math.randomFloat) {
    Math.randomFloat = function (min, max) {
        if (max > min) {
            var temp = max;
            max = min;
            min = temp;
        }
        return min + Math.random() * (max - min);
    };
}
if (!Math.randomInteger) {
    Math.randomInteger = function (min, max) {
        if (max > min) {
            var temp = max;
            max = min;
            min = temp;
        }
        min = Math.round(min);
        max = Math.round(max);
        // The Math.random() method returns a random number from 0 (inclusive) up to but not including 1 (exclusive).
        return min + Math.floor(Math.random() * (max - min + 1));
    };
}
if (!Math.clamp) {
    Math.clamp = function (value, min, max) {
        if (value == null)
            return min;
        if (value < min)
            return min;
        else if (value > max)
            return max;
        else
            return value;
    };
}
Math.randomInteger = function (min, max) {
    var choices = max - min + 1;
    return Math.floor(Math.random() * choices + min);
};
Math.randomIntegers = function (min, max, selectnum) {
    if ((max - min + 1) < selectnum)
        return;
    var choices = max - min + 1;
    var nums = new Array();
    for (var i = 0; i < selectnum; i++) {
        var equal = false;
        var random = Math.floor(Math.random() * choices + min);
        for (var _i = 0, nums_1 = nums; _i < nums_1.length; _i++) {
            var item = nums_1[_i];
            if (item == random) {
                equal = true;
                i--;
                break;
            }
        }
        if (!equal)
            nums.push(random);
    }
    return nums;
};
Math.boolFromPercentage = function (num) {
    if (Math.random() < num) {
        return true;
    }
    else {
        return false;
    }
};
Number.prototype.percentage = function () {
    return (this != null ? this : 0) / 100;
};
var GX;
(function (GX) {
    /**
     * 线性同余随机数生成器，因为js提供的api不支持种子，所以为了匹配Unity，另写一套
     */
    var Random = (function () {
        /**
         * 创建一个随机数生成器
         */
        function Random(seed) {
            this.seed = seed;
            if (!this.seed && this.seed != 0) {
                this.seed = new Date().getTime();
            }
        }
        Object.defineProperty(Random.prototype, "value", {
            /**
             * 返回一个随机数，在0.0～1.0之间
             */
            get: function () {
                return this.range(0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Random.prototype, "insideUnitCircle", {
            /**
             * 返回半径为1的圆内的一个随机点
             */
            get: function () {
                var randomAngle = this.range(0, 360);
                var randomDis = this.range(0, 1);
                var randomX = randomDis * Math.cos(randomAngle * Math.PI / 180);
                var randomY = randomDis * Math.sin(randomAngle * Math.PI / 180);
                return new egret.Point(randomX, randomY);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Random.prototype, "onUnitCircle", {
            /**
             * 返回半径为1的圆边的一个随机点
             */
            get: function () {
                var randomAngle = this.range(0, 360);
                var randomX = Math.cos(randomAngle * Math.PI / 180);
                var randomY = Math.sin(randomAngle * Math.PI / 180);
                return new egret.Point(randomX, randomY);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 返回一个在min和max之间的随机浮点数
         */
        Random.prototype.range = function (min, max) {
            if (!this.seed && this.seed != 0) {
                this.seed = new Date().getTime();
            }
            max = max || 1;
            min = min || 0;
            this.seed = (this.seed * 9301 + 49297) % 233280;
            var rnd = this.seed / 233280.0;
            return min + rnd * (max - min);
        };
        Object.defineProperty(Random, "value", {
            /**
             * 返回一个随机数，在0.0～1.0之间
             */
            get: function () {
                return this.range(0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Random, "insideUnitCircle", {
            /**
             * 返回半径为1的圆内的一个随机点
             */
            get: function () {
                var randomAngle = this.range(0, 360);
                var randomDis = this.range(0, 1);
                var randomX = randomDis * Math.cos(randomAngle * Math.PI / 180);
                var randomY = randomDis * Math.sin(randomAngle * Math.PI / 180);
                return new egret.Point(randomX, randomY);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Random, "onUnitCircle", {
            /**
             * 返回半径为1的圆边的一个随机点
             */
            get: function () {
                var randomAngle = this.range(0, 360);
                var randomX = Math.cos(randomAngle * Math.PI / 180);
                var randomY = Math.sin(randomAngle * Math.PI / 180);
                return new egret.Point(randomX, randomY);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 返回一个在min和max之间的随机浮点数
         */
        Random.range = function (min, max) {
            if (!this.seed && this.seed != 0) {
                this.seed = new Date().getTime();
            }
            max = max || 1;
            min = min || 0;
            this.seed = (this.seed * 9301 + 49297) % 233280;
            var rnd = this.seed / 233280.0;
            return min + rnd * (max - min);
        };
        return Random;
    }());
    GX.Random = Random;
    __reflect(Random.prototype, "GX.Random");
})(GX || (GX = {}));
if (!String.prototype.format) {
    String.prototype.format = function () {
        var replacements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            replacements[_i] = arguments[_i];
        }
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined'
                ? args[number]
                : match;
        });
    };
}
if (!String.prototype.padLeft) {
    String.prototype.padLeft = function (totalWidth, paddingChar) {
        if (typeof paddingChar !== "string" || paddingChar.length != 1) {
            paddingChar = " ";
        }
        var pad = "";
        while (pad.length + this.length < totalWidth) {
            pad += paddingChar;
        }
        return pad + this;
    };
}
if (!String.prototype.padRight) {
    String.prototype.padRight = function (totalWidth, paddingChar) {
        if (typeof paddingChar !== "string" || paddingChar.length != 1) {
            paddingChar = " ";
        }
        var pad = "";
        while (pad.length + this.length < totalWidth) {
            pad += paddingChar;
        }
        return this + pad;
    };
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
        if (this == null || str == null)
            return false;
        if (str.length == 0)
            return true;
        if (this.length < str.length)
            return false;
        for (var i = 0; i < str.length; i++) {
            if (this[i] != str[i])
                return false;
        }
        return true;
    };
}
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (str) {
        if (this == null || str == null)
            return false;
        if (str.length == 0)
            return true;
        if (this.length < str.length)
            return false;
        for (var i = 0; i < str.length; i++) {
            if (this[this.length - 1 - i] != str[str.length - 1 - i])
                return false;
        }
        return true;
    };
}
if (!String.prototype.trimEnd) {
    String.prototype.trimEnd = function () {
        return uniLib.Utils.rtrim(this);
    };
}
if (!String.prototype.trimStart) {
    String.prototype.trimStart = function () {
        return uniLib.Utils.ltrim(this);
    };
}
String.prototype.padLeft = function (totalWidth, paddingChar) {
    if (paddingChar != null) {
        return this.PadHelper(totalWidth, paddingChar, false);
    }
    else {
        return this.PadHelper(totalWidth, ' ', false);
    }
};
String.prototype.PadHelper = function (totalWidth, paddingChar, isRightPadded) {
    if (this.length < totalWidth) {
        var paddingString = new String();
        for (var i = 1; i <= (totalWidth - this.length); i++) {
            paddingString += paddingChar;
        }
        if (isRightPadded) {
            return (this + paddingString);
        }
        else {
            return (paddingString + this);
        }
    }
    else {
        return this;
    }
};
var GX;
(function (GX) {
    /**
     * 游戏容器类
    *
    */
    var GameLayerManager = (function () {
        function GameLayerManager() {
        }
        GameLayerManager.removeUI = function (ui) {
            if (!ui || !ui.parent)
                return;
            ui.parent.removeChild(ui);
            GX.PopUpManager.UIStatckPop(ui);
        };
        Object.defineProperty(GameLayerManager, "sceneLayer", {
            get: function () {
                return this.m_sceneLayer;
            },
            set: function (ui) {
                this.m_sceneLayer = ui;
                this.m_sceneLayer.name = "sceneLayer";
            },
            enumerable: true,
            configurable: true
        });
        GameLayerManager.addUIToScene = function (ui) {
            if (!this.m_sceneLayer)
                return;
            this.m_sceneLayer.addChild(ui);
        };
        Object.defineProperty(GameLayerManager, "mainLayer", {
            get: function () {
                return this.m_mainLayer;
            },
            set: function (ui) {
                this.m_mainLayer = ui;
                this.m_mainLayer.name = "mainLayer";
            },
            enumerable: true,
            configurable: true
        });
        GameLayerManager.addUIToMain = function (ui) {
            if (!this.m_mainLayer)
                return;
            this.m_mainLayer.addChild(ui);
            GX.PopUpManager.pushToUIStack(ui);
        };
        Object.defineProperty(GameLayerManager, "effectLayer", {
            get: function () {
                return this.m_effectLayer;
            },
            set: function (ui) {
                this.m_effectLayer = ui;
                this.m_effectLayer.name = "effectLayer";
            },
            enumerable: true,
            configurable: true
        });
        GameLayerManager.addUIToEffect = function (ui) {
            if (!this.m_effectLayer)
                return;
            this.m_effectLayer.addChild(ui);
            GX.PopUpManager.pushToUIStack(ui);
        };
        Object.defineProperty(GameLayerManager, "popLayer", {
            get: function () {
                return this.m_popLayer;
            },
            set: function (ui) {
                this.m_popLayer = ui;
                if (ui) {
                    this.m_popLayer.name = "popLayer";
                }
            },
            enumerable: true,
            configurable: true
        });
        GameLayerManager.addUIToPop = function (ui) {
            if (!this.m_popLayer)
                return;
            this.m_popLayer.addChild(ui);
            GX.PopUpManager.pushToUIStack(ui);
        };
        Object.defineProperty(GameLayerManager, "maskLayer", {
            get: function () {
                return this.m_maskLayer;
            },
            set: function (ui) {
                this.m_maskLayer = ui;
                this.m_maskLayer.name = "maskLayer";
            },
            enumerable: true,
            configurable: true
        });
        GameLayerManager.addUIToMask = function (ui) {
            if (!this.m_maskLayer)
                return;
            this.m_maskLayer.addChild(ui);
            GX.PopUpManager.pushToUIStack(ui);
        };
        Object.defineProperty(GameLayerManager, "loadLayer", {
            get: function () {
                return this.m_loadLayer;
            },
            set: function (ui) {
                this.m_loadLayer = ui;
                this.m_loadLayer.name = "loadLayer";
            },
            enumerable: true,
            configurable: true
        });
        GameLayerManager.addUIToLoad = function (ui) {
            if (!this.m_loadLayer)
                return;
            this.m_loadLayer.addChild(ui);
            GX.PopUpManager.pushToUIStack(ui);
        };
        /**
         * 加载遮罩层 场景切换的时候加载资源UI
         */
        GameLayerManager.m_loadLayer = new egret.DisplayObjectContainer();
        return GameLayerManager;
    }());
    GX.GameLayerManager = GameLayerManager;
    __reflect(GameLayerManager.prototype, "GX.GameLayerManager");
})(GX || (GX = {}));
var GX;
(function (GX) {
    /**
    * 弹出效果
    */
    var PopUpEffect;
    (function (PopUpEffect) {
        /**
        * 没有动画
        */
        PopUpEffect[PopUpEffect["NOMAL"] = 0] = "NOMAL";
        /**
        * 从中间轻微弹出
        */
        PopUpEffect[PopUpEffect["CENTER"] = 1] = "CENTER";
        /**
        * 从中间猛烈弹出
        */
        PopUpEffect[PopUpEffect["CENTER_S"] = 2] = "CENTER_S";
        /**
        * 从左向右
        */
        PopUpEffect[PopUpEffect["LEFT"] = 3] = "LEFT";
        /**
        * 从右向左
        */
        PopUpEffect[PopUpEffect["RIGHT"] = 4] = "RIGHT";
        /**
        * 从上到下
        */
        PopUpEffect[PopUpEffect["TOP"] = 5] = "TOP";
        /**
        * 从下到上
        */
        PopUpEffect[PopUpEffect["BOTTOM"] = 6] = "BOTTOM";
    })(PopUpEffect = GX.PopUpEffect || (GX.PopUpEffect = {}));
    /**
     * 类型推断
     */
    function _typeof(objClass) {
        if (objClass && objClass.constructor) {
            var strFun = objClass.constructor.toString();
            var className = strFun.substr(0, strFun.indexOf('('));
            className = className.replace('function', '');
            return className.replace(/(^s*)|(s*$)/ig, '');
        }
        return typeof (objClass);
    }
    GX._typeof = _typeof;
    /**
    * 面板弹出管理类
    */
    var PopUpManager;
    (function (PopUpManager) {
        /**
         * 背景对象
         */
        var DarkPop = (function () {
            function DarkPop() {
            }
            return DarkPop;
        }());
        PopUpManager.DarkPop = DarkPop;
        __reflect(DarkPop.prototype, "GX.PopUpManager.DarkPop");
        PopUpManager.DarkPops = [];
        /**
         * 弹出面板栈
         */
        PopUpManager.PanelStack = [];
        function pushToUIStack(panel, effect) {
            if (effect === void 0) { effect = PopUpEffect.NOMAL; }
            if (panel == null)
                return;
            PopUpManager.PanelStack.push({ panel: panel, effect: effect });
        }
        PopUpManager.pushToUIStack = pushToUIStack;
        function UIStatckPop(panel) {
            if (panel == null)
                return;
            for (var i = 0; i < PopUpManager.PanelStack.length; i++) {
                var delPanel = PopUpManager.PanelStack[i];
                if (delPanel.panel == panel) {
                    PopUpManager.PanelStack.splice(i, 1);
                    break;
                }
            }
        }
        PopUpManager.UIStatckPop = UIStatckPop;
        /**
        * 添加面板方法
        * @param panel       		面板
        * @param dark        		背景是否变黑
        * @param effectType			0：没有动画 1:从中间轻微弹出 2：从中间猛烈弹出  3：从左向右 4：从右向左 5、从上到下 6、从下到上
        * @param backFun			回调函数 用于动画的完成的后续操作
        * @param darkAlpha			背景变黑的透明的
        */
        function addPopUp(panel, dark, darkAlpha, effectType, backFun, duration, parent) {
            if (dark === void 0) { dark = true; }
            if (effectType === void 0) { effectType = PopUpEffect.NOMAL; }
            var rootLayer = parent ? parent : GX.GameLayerManager.popLayer;
            if (rootLayer && rootLayer.contains(panel))
                return;
            var popUpWidth = panel.width;
            var popUpHeight = panel.height;
            var scaleX = panel.scaleX == 0 ? 1 : panel.scaleX;
            var scaleY = panel.scaleY == 0 ? 1 : panel.scaleY;
            panel.x = 0;
            panel.y = 0;
            panel.alpha = 1;
            if (dark) {
                var darkPop = null;
                for (var i = 0; i < PopUpManager.DarkPops.length; i++) {
                    var dark_1 = PopUpManager.DarkPops[i];
                    if (dark_1.relyPanel == panel) {
                        darkPop = dark_1;
                        break;
                    }
                }
                if (darkPop == null) {
                    darkPop = new DarkPop();
                    darkPop.relyPanel = panel;
                    var darkSprite = new egret.Sprite();
                    darkSprite.graphics.clear();
                    darkSprite.graphics.beginFill(0x000000, darkAlpha == null ? 0.3 : darkAlpha);
                    darkSprite.graphics.drawRect(0, 0, uniLib.Global.screenWidth, uniLib.Global.screenHeight);
                    darkSprite.graphics.endFill();
                    darkSprite.width = uniLib.Global.screenWidth;
                    darkSprite.height = uniLib.Global.screenHeight;
                    darkPop.darkSprite = darkSprite;
                    PopUpManager.DarkPops.push(darkPop);
                }
                if (!rootLayer.contains(darkPop.darkSprite)) {
                    rootLayer.addChild(darkPop.darkSprite);
                }
                darkPop.darkSprite.touchEnabled = true;
                egret.Tween.get(darkPop.darkSprite).to({ alpha: 1 }, 150);
                darkPop.darkSprite.visible = true;
            }
            rootLayer.addChild(panel);
            panel.x = uniLib.Global.screenWidth / 2 - popUpWidth / 2;
            panel.y = uniLib.Global.screenHeight / 2 - popUpHeight / 2;
            //以下是弹窗动画
            var leftX = uniLib.Global.screenWidth / 2 - popUpWidth / 2;
            var upY = uniLib.Global.screenHeight / 2 - popUpHeight / 2;
            egret.Tween.removeTweens(panel);
            if (duration == null) {
                duration = 300;
            }
            switch (effectType) {
                case 0:
                    break;
                case 1:
                    panel.alpha = 0;
                    panel.scaleX = 0.5;
                    panel.scaleY = 0.5;
                    panel.x = panel.x + popUpWidth / 4;
                    panel.y = panel.y + popUpHeight / 4;
                    if (backFun)
                        egret.Tween.get(panel).to({ alpha: 1, scaleX: scaleX, scaleY: scaleY, x: panel.x - popUpWidth / 4, y: panel.y - popUpHeight / 4 }, duration, egret.Ease.backOut).call(backFun);
                    else
                        egret.Tween.get(panel).to({ alpha: 1, scaleX: scaleX, scaleY: scaleY, x: panel.x - popUpWidth / 4, y: panel.y - popUpHeight / 4 }, duration, egret.Ease.backOut);
                    break;
                case 2:
                    panel.alpha = 0;
                    panel.scaleX = 0.5;
                    panel.scaleY = 0.5;
                    panel.x = panel.x + popUpWidth / 4;
                    panel.y = panel.y + popUpHeight / 4;
                    if (backFun)
                        egret.Tween.get(panel).to({ alpha: 1, scaleX: scaleX, scaleY: scaleY, x: panel.x - popUpWidth / 4, y: panel.y - popUpHeight / 4 }, 600, egret.Ease.elasticOut).call(backFun);
                    else
                        egret.Tween.get(panel).to({ alpha: 1, scaleX: scaleX, scaleY: scaleY, x: panel.x - popUpWidth / 4, y: panel.y - popUpHeight / 4 }, 600, egret.Ease.elasticOut);
                    break;
                case 3:
                    panel.x = -popUpWidth;
                    if (backFun)
                        egret.Tween.get(panel).to({ x: 0 }, duration, egret.Ease.cubicOut).call(backFun);
                    else
                        egret.Tween.get(panel).to({ x: 0 }, duration, egret.Ease.cubicOut);
                    break;
                case 4:
                    panel.x = popUpWidth;
                    if (backFun)
                        egret.Tween.get(panel).to({ x: 0 }, duration, egret.Ease.cubicOut).call(backFun);
                    else
                        egret.Tween.get(panel).to({ x: 0 }, duration, egret.Ease.cubicOut);
                    break;
                case 5:
                    panel.y = -popUpHeight;
                    if (backFun)
                        egret.Tween.get(panel).to({ y: 0 }, duration, egret.Ease.cubicOut).call(backFun);
                    else
                        egret.Tween.get(panel).to({ y: 0 }, duration, egret.Ease.cubicOut);
                    break;
                case 6:
                    panel.y = popUpHeight;
                    if (backFun)
                        egret.Tween.get(panel).to({ y: 0 }, duration, egret.Ease.cubicOut).call(backFun);
                    else
                        egret.Tween.get(panel).to({ y: 0 }, duration, egret.Ease.cubicOut);
                    break;
                default:
                    break;
            }
            PopUpManager.pushToUIStack(panel, effectType);
        }
        PopUpManager.addPopUp = addPopUp;
        /**
        * 移除面板方法
        * @param panel       		面板
        * @param effectType			0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
        * @param backFun			回调函数 用于动画的完成的后续操作
        */
        function removePopUp(panel, effectType, backFun, duration) {
            if (effectType === void 0) { effectType = PopUpEffect.NOMAL; }
            var onComplete = function () {
                var darkPop = null;
                var delIndex = -1;
                for (var i = 0; i < PopUpManager.DarkPops.length; i++) {
                    var dark = PopUpManager.DarkPops[i];
                    if (dark.relyPanel == panel) {
                        darkPop = dark;
                        delIndex = i;
                        break;
                    }
                }
                if (darkPop == null)
                    return;
                if (darkPop.darkSprite && darkPop.darkSprite.parent) {
                    darkPop.darkSprite.parent.removeChild(darkPop.darkSprite);
                }
                if (delIndex >= 0) {
                    PopUpManager.DarkPops.splice(delIndex, 1);
                }
            };
            onComplete();
            egret.Tween.removeTweens(panel); //移除动画先
            if (duration == null) {
                duration = 300;
            }
            switch (effectType) {
                case 0:
                    break;
                case 1:
                    if (backFun)
                        egret.Tween.get(panel).to({ alpha: 0, scaleX: 0, scaleY: 0, x: panel.x + panel.width / 2, y: panel.y + panel.height / 2 }, duration).call(backFun);
                    else
                        egret.Tween.get(panel).to({ alpha: 0, scaleX: 0, scaleY: 0, x: panel.x + panel.width / 2, y: panel.y + panel.height / 2 }, duration);
                    break;
                case 2:
                    break;
                case 3:
                    if (backFun)
                        egret.Tween.get(panel).to({ x: panel.width }, duration, egret.Ease.cubicOut).call(backFun);
                    else
                        egret.Tween.get(panel).to({ x: panel.width }, duration, egret.Ease.cubicOut);
                    break;
                case 4:
                    if (backFun)
                        egret.Tween.get(panel).to({ x: -panel.width }, duration, egret.Ease.cubicOut).call(backFun);
                    else
                        egret.Tween.get(panel).to({ x: -panel.width }, duration, egret.Ease.cubicOut);
                    break;
                case 5:
                    if (backFun)
                        egret.Tween.get(panel).to({ y: panel.height }, duration, egret.Ease.cubicOut).call(backFun);
                    else
                        egret.Tween.get(panel).to({ y: panel.height }, duration, egret.Ease.cubicOut);
                    break;
                case 6:
                    if (backFun)
                        egret.Tween.get(panel).to({ y: -panel.height }, duration, egret.Ease.cubicOut).call(backFun);
                    else
                        egret.Tween.get(panel).to({ y: -panel.height }, duration, egret.Ease.cubicOut);
                    break;
                default:
                    break;
            }
            if (effectType == 0) {
                duration = 0;
            }
            if (duration > 0) {
                egret.setTimeout(function () {
                    if (panel.parent) {
                        panel.parent.removeChild(panel);
                    }
                }, this, duration);
            }
            else {
                if (panel.parent) {
                    panel.parent.removeChild(panel);
                }
            }
            PopUpManager.UIStatckPop(panel);
        }
        PopUpManager.removePopUp = removePopUp;
        function clearPopUps() {
            for (var i = 0; i < PopUpManager.DarkPops.length; i++) {
                var darkPop = PopUpManager.DarkPops[i];
                if (darkPop.darkSprite && darkPop.darkSprite.parent) {
                    darkPop.darkSprite.parent.removeChild(darkPop.darkSprite);
                }
            }
            PopUpManager.DarkPops = [];
            for (var i = 0; i < PopUpManager.PanelStack.length; i++) {
                var panel = PopUpManager.PanelStack[i].panel;
                if (panel && panel.parent) {
                    panel.parent.removeChild(panel);
                }
            }
            PopUpManager.PanelStack = [];
        }
        PopUpManager.clearPopUps = clearPopUps;
        function visiblePopUps(visible) {
            for (var i = 0; i < PopUpManager.DarkPops.length; i++) {
                var darkPop = PopUpManager.DarkPops[i];
                darkPop.darkSprite.visible = visible;
            }
            for (var i = 0; i < PopUpManager.PanelStack.length; i++) {
                var panel = PopUpManager.PanelStack[i].panel;
                panel.visible = visible;
            }
        }
        PopUpManager.visiblePopUps = visiblePopUps;
    })(PopUpManager = GX.PopUpManager || (GX.PopUpManager = {}));
})(GX || (GX = {}));
var GX;
(function (GX) {
    /**
     * 提示框UI
     */
    var Tips;
    (function (Tips) {
        Tips.TipsOffsetHeight = 60;
        function tipsY() {
            return uniLib.Global.screenHeight / 2 + Tips.TipsOffsetHeight;
        }
        /**
         * 弹窗形式的提示
         * 自定义弹出界面PopupClass   构造方法参数许一致
         * return 返回弹窗对象
         */
        function showPopup(msg, confirmFunc, cancelFunc, thisObject, cancelVisible, title, confirmLabel, cancelLabel, popUpEffect, dark, darkAlpha, parent) {
            if (null == Tips.PopupClass) {
                return;
            }
            var tips = new Tips.PopupClass(msg, confirmFunc, cancelFunc, thisObject, cancelVisible, title, confirmLabel, cancelLabel);
            tips.x = (uniLib.Global.screenWidth - tips.width) / 2;
            tips.y = (uniLib.Global.screenHeight - tips.height) / 2;
            GX.PopUpManager.addPopUp(tips, dark, darkAlpha, popUpEffect, null, null, parent);
            return tips;
        }
        Tips.showPopup = showPopup;
        /**
         * 单个提示
         */
        // let tips: any;
        var tipsList = [];
        /**
         * 消息提示 显示在屏幕中央，没有操作，显示3秒后移除
         * source:指定的图片，如果此值有效，则忽略 msg, 直接使用 source 指定的图片
         */
        function showTips(msg, source, container) {
            if (Tips.TipsClass == null)
                return null;
            var tipsLastY = tipsY();
            var tips = new Tips.TipsClass(msg, source);
            tips.anchorOffsetX = tips.width / 2;
            tips.anchorOffsetY = tips.height / 2;
            tips.x = uniLib.Global.screenWidth / 2;
            tips.y = tipsLastY;
            tipsList.push(tips);
            if (null == container)
                container = GX.Tips.getContainer();
            egret.Tween.get(tips).to({ scaleX: 0, scaleY: 0 }).wait(100).call(function () {
                container.addChild(tips);
            }).to({ scaleX: 1, scaleY: 1, y: tips.y - 100 }, 100).to({ alpha: 0.5, y: tips.y - 300 }, 2000).call(function () {
                if (tips.parent) {
                    tips.parent.removeChild(tips);
                }
                for (var i = 0; i < tipsList.length; i++) {
                    if (tipsList[i] == tips) {
                        tipsList.splice(i, 1);
                        break;
                    }
                }
            });
            return tips;
        }
        Tips.showTips = showTips;
        function getContainer() {
            if (GX.GameLayerManager.popLayer) {
                return GX.GameLayerManager.popLayer;
            }
            return uniLib.SceneManager.instance.currentScene;
        }
        Tips.getContainer = getContainer;
    })(Tips = GX.Tips || (GX.Tips = {}));
})(GX || (GX = {}));
var uniLib;
(function (uniLib) {
    var FacadeConsts = (function () {
        function FacadeConsts() {
        }
        FacadeConsts.ADPLAT_INIT_COMPLETED = "ADPLAT_INIT_COMPLETED";
        FacadeConsts.STARTUP = "STARTUP";
        FacadeConsts.SEND_DATA = "SEND_DATA";
        FacadeConsts.DESTORY = "DESTORY";
        FacadeConsts.SYSTEM_MESSAGE = "SYSTEM_MESSAGE";
        FacadeConsts.JOIN_GAME = "JOIN_GAME";
        FacadeConsts.USER_INFO = "USER_INFO";
        FacadeConsts.FARM_INFO = "FARM_INFO";
        FacadeConsts.BUY_CROP = "BUY_CROP";
        FacadeConsts.RECOVERY_CROP = "RECOVERY_CROP";
        FacadeConsts.CROP_TIME_OUTCOME = "CROP_TIME_OUTCOME";
        FacadeConsts.FRUIT_TIME_OUTCOME = "FRUIT_TIME_OUTCOME";
        FacadeConsts.SYNTHESIS_CROP = "SYNTHESIS_CROP";
        FacadeConsts.PICK_FRUIT = "PICK_FRUIT";
        FacadeConsts.PICK_ALL_FRUIT = "PICK_ALL_FRUIT";
        FacadeConsts.CROP_INTERCHANGE = "CROP_INTERCHANGE";
        FacadeConsts.APPLY_ADD_FRIEND = "APPLY_ADD_FRIEND";
        FacadeConsts.FRIEND_LIST = "FRIEND_LIST";
        FacadeConsts.PLAYER_LIST = "PLAYER_LIST";
        FacadeConsts.FRIEND_ASK_LIST = "FRIEND_ASK_LIST";
        FacadeConsts.ENTER_FARM = "ENTER_FARM";
        FacadeConsts.LEAVE_FARM = "LEAVE_FARM";
        return FacadeConsts;
    }());
    uniLib.FacadeConsts = FacadeConsts;
    __reflect(FacadeConsts.prototype, "uniLib.FacadeConsts");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var Config = (function () {
        function Config() {
        }
        Object.defineProperty(Config, "debug", {
            get: function () {
                return uniLib.BrowersUtils.GetRequest("debug") == "true";
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 交互音效
         */
        Config.InteractiveSoundName = null;
        return Config;
    }());
    uniLib.Config = Config;
    __reflect(Config.prototype, "uniLib.Config");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    /**
     * 初始化
     */
    var InitOptions = (function () {
        function InitOptions() {
            this.debug = false;
            this.standAlone = true;
            this.designWidth = 720;
            this.designHeight = 1280;
            this.scaleMode = egret.StageScaleMode.SHOW_ALL;
            this.logLevel = uniLib.LOGLEVEL.OFF;
            /**
             * 消息发出超时时间
             */
            this.msgTimeOutSec = 0;
            this.wssMode = false;
        }
        return InitOptions;
    }());
    uniLib.InitOptions = InitOptions;
    __reflect(InitOptions.prototype, "uniLib.InitOptions");
    /**
     * 初始化
     */
    function init(param) {
        uniLib.Global.platformName = "none";
        if (uniLib.Global.isWxgame) {
            uniLib.Global.platformName = "wx";
        }
        else if (uniLib.Global.isTTGame) {
            uniLib.Global.platformName = "tt";
        }
        else if (uniLib.Global.isOppogame) {
            uniLib.Global.platformName = "qg";
        }
        else if (uniLib.Global.isQQGame) {
            uniLib.Global.platformName = "qq";
        }
        else if (uniLib.Global.isVivogame) {
            uniLib.Global.platformName = "qg";
        }
        else if (uniLib.Global.isFastGame) {
            uniLib.Global.platformName = "hbs";
        }
        if (null == window.platform) {
            if (uniLib.Global.isH5) {
                window.platform = new uniLib.WebPlatform();
            }
            else if (uniLib.Global.isNative) {
                window.platform = new uniLib.NativePlatform();
            }
            else {
                window.platform = new uniLib.WebPlatform();
            }
        }
        uniLib.Global.initOpt = param;
        if (null != param.standAlone)
            uniLib.Global.standAlone = param.standAlone;
        if (param.designWidth)
            uniLib.Global.designWidth = param.designWidth;
        if (param.designHeight)
            uniLib.Global.designHeight = param.designHeight;
        if (param.msgTimeOutSec)
            uniLib.Global.msgTimeOutSec = param.msgTimeOutSec;
        uniLib.Console.init(param.debug, param.logLevel);
        uniLib.ScreenUtils.init(param.scaleMode);
        if (param.gameName && param.gameName.length > 0) {
            var configUrl = null;
            var exportAdUrl = null;
            if (uniLib.Global.isH5) {
                if (uniLib.Config.debug) {
                    configUrl = "http://192.168.101.100/download/" + param.gameName + "_config.json";
                    exportAdUrl = "http://192.168.101.100/download/" + param.gameName + ".json";
                }
                else {
                    configUrl = "http://zerosgame.com/mingame_resource/table/" + param.gameName + "_config.json";
                    exportAdUrl = "http://zerosgame.com/mingame_resource/table/" + param.gameName + ".json";
                }
            }
            else {
                configUrl = "https://7061-paoku-p3ru7-1302658586.tcb.qcloud.la/" + param.gameName + "_config.json";
                exportAdUrl = "https://7061-paoku-p3ru7-1302658586.tcb.qcloud.la/" + param.gameName + ".json";
            }
            uniLib.Global.configUrl = configUrl;
            uniLib.Global.exportUrl = exportAdUrl;
        }
    }
    uniLib.init = init;
    uniLib.getDefinitionByNameCache = {};
    function getDefinitionByName(name) {
        if (!name)
            return null;
        var definition = uniLib.getDefinitionByNameCache[name];
        if (definition) {
            return definition;
        }
        var paths = name.split(".");
        var length = paths.length;
        definition = window;
        for (var i = 0; i < length; i++) {
            var path = paths[i];
            definition = definition[path];
            if (!definition) {
                return null;
            }
        }
        uniLib.getDefinitionByNameCache[name] = definition;
        return definition;
    }
    uniLib.getDefinitionByName = getDefinitionByName;
    function hasDefinition(name) {
        var definition = uniLib.getDefinitionByName(name);
        return definition ? true : false;
    }
    uniLib.hasDefinition = hasDefinition;
    function delDefinitionByName(name) {
        if (!name)
            return null;
        var regstr = "^" + name + ".";
        if (name.indexOf(".") == -1) {
            for (var i in uniLib.getDefinitionByNameCache) {
                if (i.match(regstr)) {
                    uniLib.getDefinitionByNameCache[i] = null;
                    delete uniLib.getDefinitionByNameCache[i];
                }
            }
        }
        else {
            uniLib.getDefinitionByNameCache[name] = null;
            delete uniLib.getDefinitionByNameCache[name];
        }
    }
    uniLib.delDefinitionByName = delDefinitionByName;
    function checkServerReturnCodeError(recv) {
        if (recv == null)
            return true;
        if (uniLib.Utils.stringIsNullOrEmpty(recv.errno))
            return false;
        if (recv.errno == "0")
            return false;
        return true;
    }
    uniLib.checkServerReturnCodeError = checkServerReturnCodeError;
    function doServerReturnCodeError(recv) {
        if (recv == null)
            return true;
        if (!recv.errno) {
            recv.errno = "0";
        }
        var errno = Number(recv["errno"]);
        if (errno == Cmd.HttpReturnCode.HttpReturnCode_ServerShutDown) {
            GX.Tips.showPopup("服务器未开，停机状态", function () {
            }, null, null, null, "温馨提示", null, null, GX.PopUpEffect.CENTER, true, null, egret.MainContext.instance.stage);
        }
        else if (errno == Cmd.HttpReturnCode.HttpReturnCode_NoZoneDown) {
            GX.Tips.showPopup("没有可用的区服务器，或区服未开", function () {
            }, null, null, null, "温馨提示", null, null, GX.PopUpEffect.CENTER, true, null, egret.MainContext.instance.stage);
        }
        else if (errno == Cmd.HttpReturnCode.HttpReturnCode_GatewayErr) {
            GX.Tips.showPopup("区服务器网关错误", function () {
            }, null, null, null, "温馨提示", null, null, GX.PopUpEffect.CENTER, true, null, egret.MainContext.instance.stage);
        }
        else if (errno == Cmd.HttpReturnCode.HttpReturnCode_NoGatewayDown) {
            GX.Tips.showPopup("没有可用的区服网关", function () {
            }, null, null, null, "温馨提示", null, null, GX.PopUpEffect.CENTER, true, null, egret.MainContext.instance.stage);
        }
        else if (errno == Cmd.HttpReturnCode.HttpReturnCode_NormalErr) {
            GX.Tips.showPopup("网络错误", function () {
            }, null, null, null, "温馨提示", null, null, GX.PopUpEffect.CENTER, true, null, egret.MainContext.instance.stage);
        }
    }
    uniLib.doServerReturnCodeError = doServerReturnCodeError;
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var Global = (function () {
        function Global() {
        }
        Global.initGameConfig = function () {
            var config = RES.getRes("gameConfig_json");
            uniLib.Global.gameConfig = config;
            // if(null == uniLib.Global.reportUrl)
            // {
            //     uniLib.Global.reportUrl = "https://game.zaiwuchuan.com/StatisticPlatServer/index.php?m=api&c=api&a=reportBehaviour";
            // }
        };
        /**
         * 游戏进入后台
         */
        Global.pause = function () {
        };
        /**
         * 游戏进入前台
         */
        Global.resume = function () {
        };
        /**
         * 上报微信 openid 到阿拉丁
         */
        Global.reportAldOpenId = function (openid) {
            if (openid && openid.length && openid.length > 0) {
                uniLib.Global.wxOpenId = openid;
                window.platform.customInterface("aldSendOpenid", { openid: openid });
            }
        };
        /**
         * 上报阿拉丁事件数据
         */
        Global.reportAldEvent = function (eventName, eventParams) {
            if (null == eventParams)
                eventParams = {};
            var userData = {
                name: eventName,
                params: eventParams
            };
            window.platform.customInterface("aldSendEvent", userData);
        };
        /**
         * 上报阿拉丁游戏关卡开始
         */
        Global.reportAldStageStart = function (stageId, stageName) {
            if (null == stageName)
                stageName = "第" + stageId.toString() + "关";
            var aldInfo = {
                stageId: stageId.toString(),
                stageName: stageName
            };
            window.platform.customInterface("aldStageStart", aldInfo);
        };
        /**
         * 上报阿拉丁游戏关卡成功
         */
        Global.reportAldStageEnd = function (stageId, stageName) {
            if (null == stageName)
                stageName = "第" + stageId.toString() + "关";
            var aldInfo = {
                stageId: stageId.toString(),
                stageName: stageName,
                event: "complete"
            };
            window.platform.customInterface("aldStageEnd", aldInfo);
        };
        /**
         * 上报阿拉丁游戏关卡失败
         */
        Global.reportAldStageFail = function (stageId, stageName) {
            if (null == stageName)
                stageName = "第" + stageId.toString() + "关";
            var aldInfo = {
                stageId: stageId.toString(),
                stageName: stageName,
                event: "fail"
            };
            window.platform.customInterface("aldStageEnd", aldInfo);
        };
        /**
         * 上报阿拉丁游戏关卡进行中奖励行为
         */
        Global.reportAldStageAward = function (stageId, stageName, itemName) {
            if (null == stageName)
                stageName = "第" + stageId.toString() + "关";
            if (null == itemName)
                itemName = "奖励行为";
            var aldInfo = {
                stageId: stageId.toString(),
                stageName: stageName,
                event: "award",
                params: {
                    itemName: itemName
                }
            };
            window.platform.customInterface("aldStageRunning", aldInfo);
        };
        /**
         * 上报阿拉丁游戏关卡进行中使用道具行为
         */
        Global.reportAldStageTools = function (stageId, stageName, itemName, itemCount) {
            if (null == stageName)
                stageName = "第" + stageId.toString() + "关";
            if (null == itemName)
                itemName = "使用道具";
            if (null == itemCount)
                itemCount = 1;
            var aldInfo = {
                stageId: stageId.toString(),
                stageName: stageName,
                event: "tools",
                params: {
                    itemName: itemName,
                    itemCount: itemCount
                }
            };
            window.platform.customInterface("aldStageRunning", aldInfo);
        };
        /**
         * 上报友盟自定义事件数据
         */
        Global.reportUmaEvent = function (eventName) {
            var userData = {
                name: "navigateToMiniProgram",
                params: eventName
            };
            window.platform.customInterface("umaSendEvent", userData);
        };
        Object.defineProperty(Global, "isDebug", {
            get: function () {
                return (uniLib.BrowersUtils.GetRequest("debug") == "true") ? true : Global.initOpt.debug;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "isH5", {
            get: function () {
                return egret.Capabilities.runtimeType == egret.RuntimeType.WEB;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "isNative", {
            get: function () {
                return egret.Capabilities.runtimeType == egret.RuntimeType.RUNTIME2 || egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "isWxgame", {
            get: function () {
                return egret.Capabilities.runtimeType == egret.RuntimeType.WXGAME;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "isQQGame", {
            get: function () {
                return egret.Capabilities.runtimeType == egret.RuntimeType.QQGAME;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "isVivogame", {
            get: function () {
                return egret.Capabilities.runtimeType == egret.RuntimeType.VIVOGAME;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "isOppogame", {
            get: function () {
                return egret.Capabilities.runtimeType == egret.RuntimeType.OPPOGAME;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "isTTGame", {
            get: function () {
                return egret.Capabilities.runtimeType == egret.RuntimeType.TTGAME;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "isFastGame", {
            get: function () {
                return egret.Capabilities.runtimeType == egret.RuntimeType.FASTGAME;
            },
            enumerable: true,
            configurable: true
        });
        Global.isInGame = false;
        Global.standAlone = false;
        Global.msgTimeOutSec = 0;
        Global.locationUrl = "https://api.liteplay.com.cn/admin/wx_config/getLocation";
        return Global;
    }());
    uniLib.Global = Global;
    __reflect(Global.prototype, "uniLib.Global");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var EventListener = (function (_super) {
        __extends(EventListener, _super);
        function EventListener() {
            return _super.call(this) || this;
        }
        EventListener.getInstance = function () {
            if (!this._instance) {
                this._instance = new EventListener;
            }
            return this._instance;
        };
        return EventListener;
    }(egret.EventDispatcher));
    uniLib.EventListener = EventListener;
    __reflect(EventListener.prototype, "uniLib.EventListener");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var AdBanner = (function () {
        function AdBanner(unitId, bannerwidth) {
            this.showTime = 0; // 显示时长
            this.maxShowTime = 10;
            this.bannerWidth = null;
            this.adUnitId = unitId;
            this.banner = null;
            this.bannerLoading = null;
            this.isShow = false;
            this.createTimestamp = 0;
            this.bannerWidth = bannerwidth > 0 ? bannerwidth : null;
            this.load();
        }
        Object.defineProperty(AdBanner.prototype, "id", {
            //----------------------------------------------------------------------
            get: function () {
                return this.adUnitId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AdBanner.prototype, "isLoaded", {
            //----------------------------------------------------------------------
            get: function () {
                return this.banner ? true : false;
            },
            enumerable: true,
            configurable: true
        });
        //----------------------------------------------------------------------
        AdBanner.prototype.setShowTime = function (time) {
            this.maxShowTime = time;
        };
        //----------------------------------------------------------------------
        AdBanner.prototype.createBannerAd = function () {
            var bannerAd = null;
            var width = 300;
            if (uniLib.Global.designWidth < uniLib.Global.designHeight) {
                width = uniLib.AdPlat.instance.systemInfo.windowWidth;
            }
            if (this.bannerWidth && this.bannerWidth > 0) {
                width = this.bannerWidth;
            }
            var left = (uniLib.AdPlat.instance.systemInfo.windowWidth - width) * 0.5;
            var top = 0;
            if (window[uniLib.Global.platformName] && window[uniLib.Global.platformName].createBannerAd) {
                bannerAd = window[uniLib.Global.platformName].createBannerAd({ adUnitId: this.adUnitId, adIntervals: 30, style: { left: left, top: top, width: width } });
            }
            return bannerAd;
        };
        //----------------------------------------------------------------------
        AdBanner.prototype.load = function () {
            if (this.bannerLoading)
                return;
            var curTimestamp = Date.now();
            if (curTimestamp - this.createTimestamp < 10000) {
                console.warn("时间不足，未能重新加载 banner...", this.adUnitId, curTimestamp - this.createTimestamp);
                return;
            }
            this.bannerLoading = this.createBannerAd();
            if (null == this.bannerLoading) {
                console.error("创建 Banner 失败", this.adUnitId);
                return;
            }
            console.log("banner loading....", this.adUnitId);
            this.showTime = 0;
            this.createTimestamp = Date.now();
            this.bannerLoading.onLoad(this.onBannerLoad.bind(this));
            this.bannerLoading.onResize(this.onBannerResize.bind(this));
            this.bannerLoading.onError(this.onBannerError.bind(this));
        };
        //----------------------------------------------------------------------
        AdBanner.prototype.onBannerLoad = function () {
            console.log("------onBannerLoad 广告加载成功------", this.adUnitId);
            this.destroy();
            this.banner = this.bannerLoading;
            this.bannerLoading = null;
            if (this.isShow) {
                this.show(true);
            }
        };
        //----------------------------------------------------------------------
        AdBanner.prototype.onBannerResize = function (size) {
            var top = uniLib.AdPlat.instance.systemInfo.windowHeight - size.height;
            var left = (uniLib.AdPlat.instance.systemInfo.windowWidth - size.width) * 0.5;
            console.log("----onBannerResize top:" + top + ",left:" + left + ",size", size);
            if (this.bannerLoading && this.bannerLoading.style) {
                this.bannerLoading.style.left = left;
                this.bannerLoading.style.top = top;
            }
            else if (this.banner && this.banner.style) {
                this.banner.style.left = left;
                this.banner.style.top = top;
            }
        };
        //----------------------------------------------------------------------
        AdBanner.prototype.onBannerError = function (err) {
            console.warn('banner___error:', err.errCode, ' msg ', err.errMsg, this.adUnitId);
            if (this.bannerLoading) {
                this.bannerLoading.offLoad(this.onBannerLoad);
                this.bannerLoading.offResize(this.onBannerResize);
                this.bannerLoading.offError(this.onBannerError);
                this.bannerLoading.destroy();
                this.bannerLoading = null;
            }
        };
        //----------------------------------------------------------------------
        AdBanner.prototype.show = function (force) {
            console.log("showBanner", this.isShow);
            this.isShow = true;
            if (null == this.banner && null == this.bannerLoading) {
                this.load();
                return;
            }
            if (this.banner) {
                this.banner.show();
            }
        };
        //----------------------------------------------------------------------
        AdBanner.prototype.hide = function () {
            if (null == this.banner) {
                this.isShow = false;
                return;
            }
            this.banner.hide();
            if (this.isShow) {
                this.showTime++;
                if (this.showTime > this.maxShowTime) {
                    this.isShow = false;
                    this.load();
                    return;
                }
            }
            this.isShow = false;
        };
        //----------------------------------------------------------------------
        AdBanner.prototype.destroy = function () {
            if (null == this.banner)
                return;
            this.banner.offLoad(this.onBannerLoad);
            this.banner.offResize(this.onBannerResize);
            this.banner.offError(this.onBannerError);
            this.banner.destroy();
            this.banner = null;
        };
        return AdBanner;
    }());
    uniLib.AdBanner = AdBanner;
    __reflect(AdBanner.prototype, "uniLib.AdBanner");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    /**
     * 数据请求操作
     */
    var DataRequestCommand = (function (_super) {
        __extends(DataRequestCommand, _super);
        function DataRequestCommand() {
            return _super.call(this) || this;
        }
        DataRequestCommand.prototype.init = function () {
            uniLib.EventListener.getInstance().addEventListener(DataRequestCommand.GAME_DATA, this.onEventHandle, this);
            uniLib.EventListener.getInstance().addEventListener(DataRequestCommand.CONNECT_GAME_SERVER, this.onEventHandle, this);
            uniLib.EventListener.getInstance().addEventListener(DataRequestCommand.LOGIN_OUT, this.onEventHandle, this);
        };
        DataRequestCommand.prototype.onEventHandle = function (evt) {
            var socketProxy = uniLib.ServerProxy.getInstance();
            switch (evt.type) {
                case DataRequestCommand.GAME_DATA:
                    socketProxy.sendData(evt.data);
                    break;
                case DataRequestCommand.CONNECT_GAME_SERVER:
                    socketProxy.initServer();
                    break;
                case DataRequestCommand.LOGIN_OUT:
                    socketProxy.loginOut(evt.data);
                    break;
            }
        };
        DataRequestCommand.prototype.onRemove = function () {
            uniLib.EventListener.getInstance().removeEventListener(DataRequestCommand.GAME_DATA, this.onEventHandle, this);
            uniLib.EventListener.getInstance().removeEventListener(DataRequestCommand.CONNECT_GAME_SERVER, this.onEventHandle, this);
            uniLib.EventListener.getInstance().removeEventListener(DataRequestCommand.LOGIN_OUT, this.onEventHandle, this);
        };
        DataRequestCommand.GAME_DATA = "game_data";
        DataRequestCommand.CONNECT_GAME_SERVER = "connect_game_server"; //连接服务器
        DataRequestCommand.LOGIN_OUT = "loginOut"; //退出登录
        return DataRequestCommand;
    }(uniLib.Command));
    uniLib.DataRequestCommand = DataRequestCommand;
    __reflect(DataRequestCommand.prototype, "uniLib.DataRequestCommand");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    /**
     * 移除命令
     */
    var RemoveCommand = (function (_super) {
        __extends(RemoveCommand, _super);
        function RemoveCommand() {
            return _super.call(this) || this;
        }
        RemoveCommand.prototype.init = function () {
            uniLib.EventListener.getInstance().addEventListener(uniLib.FacadeConsts.DESTORY, this.onEventHandle, this);
        };
        RemoveCommand.prototype.onEventHandle = function (evt) {
            this.removeController();
            this.removeMediator();
            this.removeProxy();
        };
        RemoveCommand.prototype.removeController = function () {
            uniLib.Facade.getInstance().removeCommand(uniLib.FacadeConsts.SEND_DATA);
            uniLib.Facade.getInstance().removeCommand(uniLib.FacadeConsts.DESTORY);
        };
        RemoveCommand.prototype.removeMediator = function () {
            if (uniLib.ViewConfig.mainMediator) {
                var mainMediator = uniLib.getDefinitionByName(uniLib.ViewConfig.mainMediatorName);
                uniLib.Facade.getInstance().removeMediator(mainMediator.NAME);
                uniLib.ViewConfig.mainMediator = null;
            }
        };
        RemoveCommand.prototype.removeProxy = function () {
            uniLib.Facade.getInstance().removeProxy(uniLib.ServerProxy.NAME);
        };
        RemoveCommand.prototype.onRemove = function () {
            uniLib.EventListener.getInstance().removeEventListener(uniLib.FacadeConsts.DESTORY, this.onEventHandle, this);
        };
        return RemoveCommand;
    }(uniLib.Command));
    uniLib.RemoveCommand = RemoveCommand;
    __reflect(RemoveCommand.prototype, "uniLib.RemoveCommand");
})(uniLib || (uniLib = {}));
var Cmd;
(function (Cmd) {
    function dispatch(cmd, obj, type) {
        uniLib.Facade.getInstance().sendNotification(cmd, obj, type);
    }
    Cmd.dispatch = dispatch;
    function trace(rev, str) {
        if (str === void 0) { str = ""; }
        uniLib.Console.log(str + " ", JSON.stringify(rev));
    }
    Cmd.trace = trace;
    function OnSysMessageCmd_S(rev) {
        if (null == rev.pos)
            rev.pos = 0;
        if (rev.pos == 0) {
            GX.Tips.showTips(rev.desc);
        }
        else {
            GX.Tips.showPopup(rev.desc);
        }
        dispatch(uniLib.FacadeConsts.SYSTEM_MESSAGE);
    }
    Cmd.OnSysMessageCmd_S = OnSysMessageCmd_S;
    function OnUserInfoSynCmd_S(rev) {
        uniLib.UIMgr.instance.hideLoading();
        uniLib.GameData.instance.myBaseInfo = rev.userInfo;
        dispatch(uniLib.FacadeConsts.JOIN_GAME);
    }
    Cmd.OnUserInfoSynCmd_S = OnUserInfoSynCmd_S;
    function OnUserInfoGetCmd_S(rev) {
        uniLib.GameData.instance.myBaseInfo = rev;
        dispatch(uniLib.FacadeConsts.USER_INFO, rev);
    }
    Cmd.OnUserInfoGetCmd_S = OnUserInfoGetCmd_S;
})(Cmd || (Cmd = {}));
var uniLib;
(function (uniLib) {
    /**
     * 启动命令
     */
    var StartUpCommand = (function (_super) {
        __extends(StartUpCommand, _super);
        function StartUpCommand() {
            return _super.call(this) || this;
        }
        StartUpCommand.prototype.init = function () {
            uniLib.EventListener.getInstance().addEventListener(uniLib.FacadeConsts.STARTUP, this.onEventHandle, this);
            uniLib.EventListener.getInstance().addEventListener(uniLib.FacadeConsts.JOIN_GAME, this.onEventHandle, this);
        };
        StartUpCommand.prototype.destory = function () {
            uniLib.EventListener.getInstance().removeEventListener(uniLib.FacadeConsts.STARTUP, this.onEventHandle, this);
            uniLib.EventListener.getInstance().removeEventListener(uniLib.FacadeConsts.JOIN_GAME, this.onEventHandle, this);
        };
        StartUpCommand.prototype.onEventHandle = function (evt) {
            switch (evt.type) {
                case uniLib.FacadeConsts.STARTUP:
                    this.initController();
                    if (uniLib.Global.standAlone) {
                        this.initMediator();
                    }
                    else {
                        this.initProxy();
                        if (uniLib.GameData.instance.myBaseInfo) {
                            this.initMediator();
                        }
                        this.sendNotification(uniLib.FacadeConsts.SEND_DATA, null, uniLib.DataRequestCommand.CONNECT_GAME_SERVER);
                    }
                    break;
                case uniLib.FacadeConsts.JOIN_GAME:
                    this.initMediator();
                    break;
            }
        };
        StartUpCommand.prototype.execute = function (notification) {
            var rootView = notification.getBody();
            this.initController();
            if (uniLib.Global.standAlone) {
                this.initMediator();
            }
            else {
                this.initProxy();
                this.initMediator();
            }
        };
        StartUpCommand.prototype.initController = function () {
            uniLib.Facade.getInstance().registerCommand(uniLib.FacadeConsts.SEND_DATA, new uniLib.DataRequestCommand());
            uniLib.Facade.getInstance().registerCommand(uniLib.FacadeConsts.DESTORY, new uniLib.RemoveCommand());
        };
        StartUpCommand.prototype.initMediator = function () {
            var mainMediator = uniLib.getDefinitionByName(uniLib.ViewConfig.mainMediatorName);
            uniLib.ViewConfig.mainMediator = new mainMediator();
            uniLib.Facade.getInstance().registerMediator(uniLib.ViewConfig.mainMediator);
        };
        StartUpCommand.prototype.initProxy = function () {
            uniLib.Facade.getInstance().registerProxy(new uniLib.ServerProxy());
        };
        return StartUpCommand;
    }(uniLib.Command));
    uniLib.StartUpCommand = StartUpCommand;
    __reflect(StartUpCommand.prototype, "uniLib.StartUpCommand");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    /**
     * 网络图片加载器
     */
    var RemoteImageLoader = (function () {
        function RemoteImageLoader() {
        }
        RemoteImageLoader.prototype.load = function (url, callback, thisObj) {
            // console.log("启动加载图片", url);
            this.url = url;
            this.loadCallback = callback;
            this.thisObj = thisObj;
            // RES.getResByUrl(this.url, this.onLoadCallbackHandler, this);
            this.loadImpl = new egret.ImageLoader();
            this.loadImpl.addEventListener(egret.Event.COMPLETE, this.onLoadCallbackHandler, this);
            this.loadImpl.load(url);
        };
        RemoteImageLoader.prototype.destroy = function () {
            if (this.loadImpl) {
                this.loadImpl.removeEventListener(egret.Event.COMPLETE, this.onLoadCallbackHandler, this);
            }
            this.url = null;
            this.loadImpl = null;
            this.loadCallback = null;
            this.thisObj = null;
        };
        // private onLoadCallbackHandler(texture: egret.Texture, url:string)
        // {
        //     if(texture)
        //     {
        //         console.log("图片加载完成", url);
        //     }
        //     else
        //     {
        //         console.log("图片加载失败", url);
        //     }
        //     if(this.loadCallback)
        //     {
        // 		this.loadCallback.call(this.thisObj, this.url, texture);
        // 	}
        // }
        RemoteImageLoader.prototype.onLoadCallbackHandler = function (evt) {
            var loader = evt.currentTarget;
            if (loader != this.loadImpl) {
                console.error("图片监听回调错误");
                return;
            }
            this.loadImpl.removeEventListener(egret.Event.COMPLETE, this.onLoadCallbackHandler, this);
            var bitmapData = loader.data;
            var texture = null;
            if (null != bitmapData) {
                texture = new egret.Texture();
                texture.bitmapData = loader.data;
            }
            if (!texture) {
                console.log("图片加载失败", this.url);
            }
            if (this.loadCallback) {
                this.loadCallback.call(this.thisObj, this.url, texture);
            }
        };
        return RemoteImageLoader;
    }());
    uniLib.RemoteImageLoader = RemoteImageLoader;
    __reflect(RemoteImageLoader.prototype, "uniLib.RemoteImageLoader");
    /**
     * 资源管理器
     */
    var ResLoadMgr = (function (_super) {
        __extends(ResLoadMgr, _super);
        function ResLoadMgr() {
            var _this = _super.call(this) || this;
            /**
             * 加载进度界面
             */
            _this._loadingClass = null;
            _this._loadSucc = null;
            _this._loadError = null;
            _this._thisObj = null;
            _this._autoHide = false;
            _this._curLoadingId = 0;
            /**
             * 当前正在加载的资源组
             */
            _this.curLoadingGrp = "";
            _this.hasItemLoadErr = false;
            /**
             * 最后加载的资源组
             */
            _this.lastLoadGrp = "";
            _this._backGroundLoadDic = {};
            _this.cacheTextureMap = {};
            return _this;
        }
        ;
        Object.defineProperty(ResLoadMgr, "instance", {
            get: function () {
                if (null == ResLoadMgr._instance) {
                    ResLoadMgr._instance = new ResLoadMgr();
                    ResLoadMgr._instance.initLoadingUI();
                }
                return ResLoadMgr._instance;
            },
            enumerable: true,
            configurable: true
        });
        //-----------------------------------------------------------------------------
        ResLoadMgr.prototype.initLoadingUI = function () {
            this._thisObj = {};
            this._loadSucc = {};
            this._loadError = {};
        };
        //-----------------------------------------------------------------------------
        ResLoadMgr.prototype.loadConfig = function (url, resRoot, loadSucc, loadError, thisObj) {
            if (resRoot === void 0) {
                resRoot = "resource/";
            }
            if (uniLib.Utils.isNetUrl(url) && !uniLib.Utils.isNetUrl(resRoot)) {
                resRoot = url.substring(0, url.lastIndexOf("\/") + 1);
            }
            if (uniLib.Global.isWxgame && uniLib.Utils.isNetUrl(uniLib.Global.initOpt.wxgameResourceRemoteUrl) && !uniLib.Utils.isNetUrl(url)) {
                resRoot = uniLib.Global.initOpt.wxgameResourceRemoteUrl + "wxgame/" + resRoot;
                url = uniLib.Global.initOpt.wxgameResourceRemoteUrl + "wxgame/" + url;
            }
            RES.loadConfig(url, resRoot).then(function () {
                if (loadSucc)
                    loadSucc.call(thisObj, url, resRoot);
            }, function () {
                if (loadError)
                    loadError.call(thisObj, url, resRoot);
            }).catch(function () {
                if (loadError)
                    loadError.call(thisObj, url, resRoot);
            });
        };
        //-----------------------------------------------------------------------------
        ResLoadMgr.prototype.load = function (groupName, loadSucc, loadError, thisObj, loadIngClass, autoHideLoadUI, isprocess) {
            if (autoHideLoadUI === void 0) {
                autoHideLoadUI = true;
            }
            if (isprocess === void 0) {
                isprocess = true;
            }
            if (this.curLoadingGrp != "") {
                uniLib.Console.warn("资源组 [" + this.curLoadingGrp + "] 正在加载,请等待后台加载完成");
                if (this._backGroundLoadDic.indexOf(groupName) == -1 && RES.isGroupLoaded(groupName) == false) {
                    this._backGroundLoadDic.push(groupName);
                }
                return RES.loadGroup(groupName);
            }
            if (!isprocess || isprocess == null) {
                isprocess = true;
            }
            if (!loadSucc && !loadIngClass) {
                return RES.loadGroup(groupName);
            }
            if (loadIngClass || this._loadingClass) {
                if (loadIngClass)
                    this._loadingClass = loadIngClass;
                if (!this._loadingClass.prototype) {
                    if (isprocess) {
                        uniLib.UIMgr.instance.showProcessBar(loadIngClass);
                    }
                    else {
                        uniLib.UIMgr.instance.showLoadingTimeout(loadIngClass);
                    }
                }
            }
            else {
                this._loadingClass = uniLib.UIMgr.instance.commonLoadUI;
            }
            if (loadSucc)
                this._loadSucc[groupName] = loadSucc;
            if (loadError)
                this._loadError[groupName] = loadError;
            if (thisObj)
                this._thisObj[groupName] = thisObj;
            if (autoHideLoadUI != null) {
                this._autoHide = autoHideLoadUI;
            }
            else {
                this._autoHide = true;
            }
            this.curLoadingGrp = groupName;
            this.lastLoadGrp = groupName;
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onUniLibResLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onUniLibResLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onUniLibResProgress, this);
            uniLib.Console.log("RES.loadGroup [" + groupName + "] 开始加载");
            try {
                var proms = RES.loadGroup(groupName, 100);
                if (proms) {
                    return proms.then(function (val) {
                        // console.log(val);
                    }, function (res) {
                        // console.log(res);
                    });
                }
            }
            catch (e) {
                uniLib.Console.log("RES.loadGroup [" + groupName + "] Error " + e);
            }
        };
        //-----------------------------------------------------------------------------
        // 资源组加载完成
        //-----------------------------------------------------------------------------
        ResLoadMgr.prototype.onUniLibResLoadComplete = function (event) {
            if (this.curLoadingGrp != "" && event.groupName != this.curLoadingGrp)
                return;
            this.curLoadingGrp = "";
            var grpName = event.groupName;
            if (event.groupName) {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onUniLibResLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onUniLibResLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onUniLibResProgress, this);
            }
            if (this._loadingClass && this._autoHide == true && egret.is(this._loadingClass.prototype, "egret.DisplayObjectContainer")) {
                uniLib.UIMgr.instance.hideLoading(this._loadingClass);
            }
            if (this._loadingClass) {
                this._loadingClass = null;
            }
            if (this._loadSucc[grpName]) {
                this._loadSucc[grpName].call(this._thisObj[grpName], event);
            }
            this.removeLoadDic(grpName);
        };
        //-----------------------------------------------------------------------------
        // 资源组加载出错
        //-----------------------------------------------------------------------------
        ResLoadMgr.prototype.onUniLibResLoadError = function (event) {
            if (this.curLoadingGrp != "" && event.groupName != this.curLoadingGrp)
                return;
            this.curLoadingGrp = "";
            var grpName = event.groupName;
            uniLib.Console.warn("Group:" + event.groupName + " has failed to load");
            if (event.groupName) {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onUniLibResLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onUniLibResLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onUniLibResProgress, this);
                uniLib.Console.error("资源组[" + event.groupName + "]下载失败");
                this.removeLoadDic(grpName);
            }
        };
        //-----------------------------------------------------------------------------
        // 资源组加载进度
        //-----------------------------------------------------------------------------
        ResLoadMgr.prototype.onUniLibResProgress = function (event) {
            var self = this;
            if (this.curLoadingGrp != "" && event.groupName != this.curLoadingGrp)
                return;
            var grpName = event.groupName;
            if (this._loadingClass) {
                if (egret.is(this._loadingClass.prototype, "egret.DisplayObjectContainer")) {
                    uniLib.UIMgr.instance.showProcessBar(this._loadingClass, event.itemsLoaded, event.itemsTotal, "", event.groupName);
                }
                else {
                    this._loadingClass.call(this._thisObj[grpName], event);
                }
            }
            if (event.itemsLoaded == event.itemsTotal) {
                if (this.hasItemLoadErr == true && this._loadError[grpName]) {
                    this.hasItemLoadErr = false;
                    this.curLoadingGrp = "";
                    RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onUniLibResLoadComplete, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onUniLibResLoadError, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onUniLibResProgress, this);
                    uniLib.Console.error("资源组[" + event.groupName + "]加载失败");
                    this.removeLoadDic(grpName);
                }
            }
        };
        //-----------------------------------------------------------------------------
        ResLoadMgr.prototype.removeLoadDic = function (grpName) {
            this._loadError[grpName] = null;
            delete this._loadError[grpName];
            this._thisObj[grpName] = null;
            delete this._thisObj[grpName];
            this._loadSucc[grpName] = null;
            delete this._loadSucc[grpName];
            this.hasItemLoadErr = false;
        };
        //-----------------------------------------------------------------------------
        // 加载网络图片
        //-----------------------------------------------------------------------------
        ResLoadMgr.prototype.loadRemoteImage = function (url, callback, thisObj) {
            var texture = this.cacheTextureMap[url];
            if (null != texture) {
                if (callback)
                    callback.call(thisObj, url, texture);
                return;
            }
            if (null == this.remoteImageLoaderList) {
                this.remoteImageLoaderList = new Array();
            }
            var callbackList = null;
            var imageLoader = this.getRemoteImageLoader(url);
            if (null != imageLoader) {
                // console.log("重复请求图片，该图片正在加载中..." + "\n" + url);
                callbackList = imageLoader["callbackList"];
                callbackList.push({ callbackFunction: callback, callbackObj: thisObj });
                return;
            }
            imageLoader = new RemoteImageLoader();
            callbackList = new Array();
            callbackList.push({ callbackFunction: callback, callbackObj: thisObj });
            imageLoader["callbackList"] = callbackList;
            this.remoteImageLoaderList.push(imageLoader);
            imageLoader.load(url, this.onLoadRemoteImageCallback, this);
        };
        //-----------------------------------------------------------------------------
        ResLoadMgr.prototype.getRemoteImageLoader = function (url) {
            if (null == this.remoteImageLoaderList)
                return null;
            for (var i = 0; i < this.remoteImageLoaderList.length; i++) {
                var imageLoader = this.remoteImageLoaderList[i];
                if (imageLoader && imageLoader.url == url) {
                    return imageLoader;
                }
            }
            return null;
        };
        //-----------------------------------------------------------------------------
        ResLoadMgr.prototype.destroyRemoteImageLoader = function (url) {
            if (null == this.remoteImageLoaderList)
                return;
            for (var i = 0; i < this.remoteImageLoaderList.length; i++) {
                var imageLoader = this.remoteImageLoaderList[i];
                if (imageLoader && imageLoader.url == url) {
                    imageLoader.destroy();
                    this.remoteImageLoaderList.splice(i, 1);
                    return;
                }
            }
        };
        //-----------------------------------------------------------------------------
        ResLoadMgr.prototype.onLoadRemoteImageCallback = function (url, texture) {
            var imageLoader = this.getRemoteImageLoader(url);
            if (null == imageLoader)
                return;
            if (url && texture) {
                this.cacheTextureMap[url] = texture;
            }
            var callbackList = imageLoader["callbackList"];
            this.destroyRemoteImageLoader(url);
            if (callbackList) {
                for (var i = 0; i < callbackList.length; i++) {
                    var callback = callbackList[i]["callbackFunction"];
                    var thisObj = callbackList[i]["callbackObj"];
                    if (callback)
                        callback.call(thisObj, url, texture);
                }
            }
        };
        //-----------------------------------------------------------------------------
        ResLoadMgr.prototype.getCacheTexture = function (url) {
            return this.cacheTextureMap[url];
        };
        ResLoadMgr._instance = null;
        return ResLoadMgr;
    }(egret.EventDispatcher));
    uniLib.ResLoadMgr = ResLoadMgr;
    __reflect(ResLoadMgr.prototype, "uniLib.ResLoadMgr");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene(params) {
            var _this = _super.call(this) || this;
            _this.params = params;
            _this.backgroundLayer = new egret.DisplayObjectContainer();
            _this.gameLayer = new egret.DisplayObjectContainer();
            _this.effectLayer = new egret.DisplayObjectContainer();
            _this.uiLayer = new egret.DisplayObjectContainer();
            _this.topLayer = new egret.DisplayObjectContainer();
            _this.maskLayer = new egret.DisplayObjectContainer();
            _this.tipsLayer = new egret.DisplayObjectContainer();
            _this.initBaseLayers();
            _this.once(egret.Event.ADDED_TO_STAGE, _this.start, _this);
            return _this;
        }
        Scene.prototype.initBaseLayers = function () {
            this.addChild(this.backgroundLayer);
            this.addChild(this.gameLayer);
            this.addChild(this.uiLayer);
            this.addChild(this.effectLayer);
            this.addChild(this.topLayer);
            this.addChild(this.maskLayer);
            this.addChild(this.tipsLayer);
            this.awake();
        };
        /**
         * 场景构造完成
         */
        Scene.prototype.awake = function () {
        };
        /**
         * 场景初始化完成并添加到舞台
         */
        Scene.prototype.start = function (e) {
        };
        /**
         * 大小变化时
         */
        Scene.prototype.resize = function () {
        };
        /**
        * 场景销毁时
        */
        Scene.prototype.destroy = function () {
        };
        Scene.prototype.onEnter = function () {
        };
        Scene.prototype.onExit = function () {
        };
        return Scene;
    }(egret.DisplayObjectContainer));
    uniLib.Scene = Scene;
    __reflect(Scene.prototype, "uniLib.Scene");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var SceneManager = (function () {
        function SceneManager() {
            this.sceneLayer = null;
        }
        Object.defineProperty(SceneManager, "instance", {
            get: function () {
                if (null == SceneManager._instance) {
                    SceneManager._instance = new SceneManager();
                    SceneManager._instance.sceneLayer = new egret.DisplayObjectContainer();
                    egret.MainContext.instance.stage.addChild(SceneManager._instance.sceneLayer);
                }
                return SceneManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneManager.prototype, "currentScene", {
            get: function () {
                return this._currentScene;
            },
            enumerable: true,
            configurable: true
        });
        SceneManager.prototype.changeScene = function (sceneClass, params) {
            var self = this;
            var onAddToStage = function (e) {
                GX.PopUpManager.clearPopUps();
                if (self._lastScene && self._lastScene != self._currentScene) {
                    if (self._lastScene["destroy"]) {
                        self._lastScene.destroy();
                    }
                    if (self._lastScene.parent) {
                        self._lastScene.parent.removeChild(self._lastScene);
                    }
                    self._lastScene = null;
                    GX.GameLayerManager.sceneLayer = self.sceneLayer;
                    GX.GameLayerManager.mainLayer = self.sceneLayer;
                    GX.GameLayerManager.effectLayer = self.sceneLayer;
                    GX.GameLayerManager.popLayer = self.sceneLayer;
                    GX.GameLayerManager.maskLayer = self.sceneLayer;
                    GX.GameLayerManager.loadLayer = self.sceneLayer;
                }
                GX.GameLayerManager.sceneLayer = self._currentScene.gameLayer;
                GX.GameLayerManager.mainLayer = self._currentScene.uiLayer;
                GX.GameLayerManager.effectLayer = self._currentScene.topLayer;
                GX.GameLayerManager.popLayer = self._currentScene.topLayer;
                GX.GameLayerManager.maskLayer = self._currentScene.topLayer;
                GX.GameLayerManager.loadLayer = self._currentScene.tipsLayer;
                self._currentScene.onEnter();
            };
            this._lastScene = this._currentScene;
            if (this._lastScene) {
                this._lastScene.onExit();
            }
            var newScene = new sceneClass(params);
            this._currentScene = newScene;
            newScene.once(egret.Event.ADDED_TO_STAGE, onAddToStage, this);
            this.sceneLayer.addChild(this._currentScene);
            return newScene;
        };
        SceneManager.prototype.addUIToScene = function (ui) {
            if (this._currentScene) {
                this._currentScene.uiLayer.addChild(ui);
            }
        };
        SceneManager._instance = null;
        return SceneManager;
    }());
    uniLib.SceneManager = SceneManager;
    __reflect(SceneManager.prototype, "uniLib.SceneManager");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    /**
     * 音效加载
     */
    var Sound = (function () {
        function Sound() {
        }
        Sound.loadSoundGroup = function (name, bmg, callBack, thisobj) {
            Sound.callBack = callBack;
            Sound.thisobj = thisobj;
            Sound.soundGroupName = name;
            Sound.bgMusic = bmg;
            if (RES.isGroupLoaded(name)) {
                Sound.soundGroupLoadComplete();
                return;
            }
            RES.loadGroup(name, -100);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, Sound.onLoadComplete, null);
            // RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, Sound.onResourceProgress, null);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, Sound.onLoadError, null);
            this.loadingTimeOut();
        };
        Sound.loadingTimeOut = function () {
            if (Sound.delayedTimer) {
                egret.clearTimeout(Sound.delayedTimer);
                Sound.delayedTimer = null;
            }
            Sound.delayedTimer = egret.setTimeout(function () {
                egret.clearTimeout(Sound.delayedTimer);
                Sound.delayedTimer = null;
                Sound.soundGroupLoadComplete();
            }, this, 5000);
        };
        Sound.onLoadComplete = function (event) {
            if (event.groupName == Sound.soundGroupName) {
                console.error("soundGroup：" + event.groupName + "加载完成");
                Sound.soundGroupLoadComplete();
                if (Sound.delayedTimer) {
                    egret.clearTimeout(Sound.delayedTimer);
                    Sound.delayedTimer = null;
                }
            }
        };
        Sound.onResourceProgress = function (event) {
            // if (event.groupName == Sound.soundGroupName) {
            // 	if (uniLib.Global.isInGame) {
            // 		let cur = Math.floor(93 + 5 / event.itemsTotal * event.itemsLoaded);
            // 		uniLib.UIMgr.instance.showProcessBar(null, cur, 100, "正在加载游戏资源...");
            // 		if (event.itemsTotal != event.itemsLoaded)
            // 			Sound.loadingTimeOut();
            // 	}
            // }
        };
        Sound.onLoadError = function (event) {
            if (event.groupName == Sound.soundGroupName) {
                console.error("soundGroup：" + event.groupName + "加载失败");
                Sound.soundGroupLoadComplete();
                if (Sound.delayedTimer) {
                    egret.clearTimeout(Sound.delayedTimer);
                    Sound.delayedTimer = null;
                }
            }
        };
        Sound.soundGroupLoadComplete = function () {
            if (Sound.bgMusic) {
                uniLib.SoundMgr.instance.playBgMusic(Sound.bgMusic);
            }
            if (Sound.callBack) {
                Sound.callBack.call(Sound.thisobj);
            }
            Sound.clearLoadSoundData();
        };
        Sound.clearLoadSoundData = function () {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, Sound.onLoadComplete, null);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, Sound.onLoadError, null);
            Sound.soundGroupName = null;
            Sound.bgMusic = null;
        };
        Sound.destroyLoadSound = function () {
            Sound.clearLoadSoundData();
        };
        return Sound;
    }());
    uniLib.Sound = Sound;
    __reflect(Sound.prototype, "uniLib.Sound");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var MySoundChannel = (function () {
        function MySoundChannel() {
            this.isStopped = false;
            this.isMusic = false;
            this.name = "";
            this.position = 0;
            this.egret_channel = null;
            this.res = null;
        }
        MySoundChannel.prototype.stop = function () {
            if (null == this.egret_channel)
                return;
            if (this.egret_channel.position)
                this.position = this.egret_channel.position;
            this.egret_channel.stop();
            this.isStopped = true;
            this.egret_channel = null;
        };
        return MySoundChannel;
    }());
    uniLib.MySoundChannel = MySoundChannel;
    __reflect(MySoundChannel.prototype, "uniLib.MySoundChannel");
    /**
     * 音频管理
     */
    var SoundMgr = (function () {
        function SoundMgr() {
            this.currentMusicChanel = null;
            this.soundRes = new Array();
            this.activeSound = new Array();
            this.loadTimeDic = new Array();
            this._bgMusics = null;
            this.currentMusicIndex = -1;
            this._musicOpen = true;
            this._soundOpen = true;
            this._soundPause = false;
            this._musicVolume = 1;
            this._soundVolume = 1;
        }
        Object.defineProperty(SoundMgr, "instance", {
            get: function () {
                if (null == SoundMgr._instance) {
                    SoundMgr._instance = new SoundMgr();
                    var strMusicToggle = uniLib.Utils.getLocalStorage(SoundMgr.MUSIC_TOGGLE, "true");
                    var strSoundToggle = uniLib.Utils.getLocalStorage(SoundMgr.SOUND_TOGGLE, "true");
                    var strMusicVolume = uniLib.Utils.getLocalStorage(SoundMgr.MUSIC_VOLUME, "1");
                    var strSoundVolume = uniLib.Utils.getLocalStorage(SoundMgr.SOUND_VOLUME, "1");
                    SoundMgr._instance.musicOpen = Boolean(strMusicToggle);
                    SoundMgr._instance.soundOpen = Boolean(strSoundToggle);
                    SoundMgr._instance.musicVolume = Number(strMusicVolume);
                    SoundMgr._instance.soundVolume = Number(strSoundVolume);
                }
                return SoundMgr._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SoundMgr.prototype, "bgMusics", {
            //-----------------------------------------------------------------------------
            get: function () {
                return this._bgMusics;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SoundMgr.prototype, "musicOpen", {
            //-----------------------------------------------------------------------------
            get: function () {
                return this._musicOpen;
            },
            //-----------------------------------------------------------------------------
            set: function (value) {
                this._musicOpen = value;
                // if(value)
                // {
                //     this.resumeBgMusic();
                // }
                // else
                // {
                //     this.pauseBgMusic();
                // }
                uniLib.Utils.setLocalStorage(SoundMgr.MUSIC_TOGGLE, this._musicOpen ? "true" : "false");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SoundMgr.prototype, "soundOpen", {
            //-----------------------------------------------------------------------------
            get: function () {
                return this._soundOpen;
            },
            //-----------------------------------------------------------------------------
            set: function (value) {
                this._soundOpen = value;
                uniLib.Utils.setLocalStorage(SoundMgr.SOUND_TOGGLE, this._soundOpen ? "true" : "false");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SoundMgr.prototype, "musicVolume", {
            //-----------------------------------------------------------------------------
            get: function () {
                return this._musicVolume;
            },
            //-----------------------------------------------------------------------------
            set: function (value) {
                this._musicVolume = value;
                if (this.currentMusicChanel && this.currentMusicChanel.egret_channel) {
                    this.currentMusicChanel.egret_channel.volume = value;
                }
                uniLib.Utils.setLocalStorage(SoundMgr.MUSIC_VOLUME, this._musicVolume.toString());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SoundMgr.prototype, "soundVolume", {
            //-----------------------------------------------------------------------------
            get: function () {
                return this._soundVolume;
            },
            //-----------------------------------------------------------------------------
            set: function (value) {
                this._soundVolume = value;
                uniLib.Utils.setLocalStorage(SoundMgr.SOUND_VOLUME, this._soundVolume.toString());
            },
            enumerable: true,
            configurable: true
        });
        //-----------------------------------------------------------------------------
        SoundMgr.prototype.play = function (soundName, loops, position, asyn, isMusic) {
            if (loops === void 0) {
                loops = 1;
            }
            if (position === void 0) {
                position = 0;
            }
            if (isMusic === void 0) {
                isMusic = true;
            }
            var self = this;
            var callSoundBack = null;
            if (asyn && asyn.length > 0) {
                callSoundBack = function (e) {
                    var endChanel = e.currentTarget;
                    if (endChanel != null && endChanel != undefined) {
                        endChanel.removeEventListener(egret.Event.SOUND_COMPLETE, callSoundBack, self);
                        if (asyn != null && asyn != undefined) {
                            if (asyn.length > 1)
                                asyn[0].call(asyn[1], soundName, endChanel);
                            else
                                asyn[0](soundName, endChanel);
                        }
                    }
                };
            }
            var onLoadSound = function (data) {
                if (data) {
                    self.soundRes[soundName] = data;
                    if (isMusic == true) {
                        var reset = true;
                        if (self.currentMusicChanel && self.loadTimeDic[self.currentMusicChanel.name] != null && self.loadTimeDic[soundName] != null && self.loadTimeDic[self.currentMusicChanel.name] > self.loadTimeDic[soundName]) {
                            reset = false;
                        }
                        if (reset == true) {
                            var channel = self.play(soundName, loops, position, asyn, isMusic);
                            self.resetCurrentMusic(channel, soundName);
                        }
                    }
                    else {
                        if (new Date().getTime() - self.loadTimeDic[soundName] <= 1000) {
                            self.loadTimeDic[soundName] = 0;
                            self.activeSound[soundName] = self.play(soundName, loops, position, asyn, isMusic);
                        }
                    }
                }
            };
            var lastTime = 0;
            if (this.loadTimeDic[soundName] != null) {
                lastTime = this.loadTimeDic[soundName];
            }
            this.loadTimeDic[soundName] = new Date().getTime();
            if (this.soundRes[soundName] == null || this.soundRes[soundName] == undefined) {
                RES.getResAsync(soundName, onLoadSound, this);
                return null;
            }
            else {
                // if (isMusic == false && new Date().getTime() - lastTime < 125)
                // {
                //     this.loadTimeDic[soundName] = lastTime;
                //     return null;
                // }
                var channel = this.soundRes[soundName].play(position, loops);
                if (null != channel) {
                    if (null != callSoundBack) {
                        channel.addEventListener(egret.Event.SOUND_COMPLETE, callSoundBack, this);
                    }
                    var volume = (isMusic == true ? this._musicVolume : this._soundVolume);
                    channel.volume = volume;
                    return channel;
                }
            }
            return null;
        };
        //-----------------------------------------------------------------------------
        SoundMgr.prototype.resetCurrentMusic = function (channel, musicName) {
            if (channel == null || channel == undefined)
                return;
            var mychannel = new MySoundChannel();
            mychannel.name = musicName;
            mychannel.isMusic = true;
            mychannel.egret_channel = channel;
            mychannel.res = this.soundRes[musicName];
            if (this.currentMusicChanel != null && this.currentMusicChanel != mychannel && this.currentMusicChanel.name != mychannel.name) {
                this.stopBgMusic();
            }
            this.currentMusicChanel = mychannel;
            this.currentMusicChanel.isStopped = false;
            if (this.currentMusicChanel.egret_channel && this.currentMusicChanel.egret_channel.volume)
                this.currentMusicChanel.egret_channel.volume = this._musicVolume;
        };
        //-----------------------------------------------------------------------------
        SoundMgr.prototype.onMusicEnd = function (e) {
            this.currentMusicIndex++;
            if (this.currentMusicIndex == this._bgMusics.length) {
                this.currentMusicIndex = 0;
            }
            if (!this._musicOpen)
                return;
            if (this._bgMusics.length > 0) {
                var channel = this.play(this._bgMusics[this.currentMusicIndex], 1, 0, [this.onMusicEnd, this]);
                this.resetCurrentMusic(channel, this._bgMusics[this.currentMusicIndex]);
            }
        };
        //-----------------------------------------------------------------------------
        SoundMgr.prototype.playBgMusic = function (musics, position) {
            this.stopBgMusic();
            this._bgMusics = musics;
            this.currentMusicIndex = 0;
            if (!this._musicOpen)
                return;
            if (this._bgMusics.length > 0) {
                if (this.currentMusicIndex >= this._bgMusics.length) {
                    this.currentMusicIndex = 0;
                }
                if (null == this.currentMusicChanel || this._bgMusics[this.currentMusicIndex] != this.currentMusicChanel.name) {
                    var channel = this.play(this._bgMusics[this.currentMusicIndex], 1, position, [this.onMusicEnd, this]);
                    this.resetCurrentMusic(channel, this._bgMusics[this.currentMusicIndex]);
                }
            }
        };
        //-----------------------------------------------------------------------------
        SoundMgr.prototype.playSound = function (soundName, allowMultiple, loops, position, playEndBack, thisObj) {
            if (loops === void 0) {
                loops = 1;
            }
            if (!this._soundOpen || this._soundPause == true)
                return null;
            if (!allowMultiple && this.activeSound[soundName]) {
                this.stopSound(soundName);
            }
            var self = this;
            var onSoundEnd = function (soundName, channel) {
                self.stopSound(soundName);
                if (playEndBack)
                    playEndBack.call(thisObj);
            };
            var channel = this.play(soundName, loops, position, [onSoundEnd], false);
            if (channel != null)
                this.activeSound[soundName] = channel;
            return channel;
        };
        //-----------------------------------------------------------------------------
        SoundMgr.prototype.pauseBgMusic = function () {
            if (this.currentMusicChanel) {
                this.currentMusicChanel.stop();
            }
        };
        //-----------------------------------------------------------------------------
        SoundMgr.prototype.resumeBgMusic = function () {
            if (!this._musicOpen || (this.currentMusicChanel && !this.currentMusicChanel.isStopped))
                return;
            var position = 0;
            if (this.currentMusicChanel) {
                position = this.currentMusicChanel.position;
            }
            if (this._bgMusics && this._bgMusics.length > 0) {
                var channel = this.play(this._bgMusics[this.currentMusicIndex], 1, position, [this.onMusicEnd, this]);
                this.resetCurrentMusic(channel, this._bgMusics[this.currentMusicIndex]);
            }
        };
        //-----------------------------------------------------------------------------
        SoundMgr.prototype.isPlayingBgMusic = function () {
            if (this.currentMusicChanel && this.currentMusicChanel.isStopped == false)
                return true;
            return false;
        };
        //-----------------------------------------------------------------------------
        SoundMgr.prototype.isSoundPlaying = function (soundName) {
            if (this.activeSound[soundName] && this.activeSound[soundName].position)
                return true;
            return false;
        };
        //-----------------------------------------------------------------------------
        SoundMgr.prototype.stopBgMusic = function (mscName) {
            if (mscName && this.currentMusicChanel) {
                if (typeof (mscName) == "string") {
                    if (mscName == this.currentMusicChanel.name) {
                        this.currentMusicChanel.stop();
                        this.loadTimeDic[this.currentMusicChanel.name] = 0;
                        this.currentMusicChanel = null;
                    }
                }
                else {
                    if (mscName.indexOf(this.currentMusicChanel.name) >= 0) {
                        this.currentMusicChanel.stop();
                        this.loadTimeDic[this.currentMusicChanel.name] = 0;
                        this.currentMusicChanel = null;
                    }
                }
            }
            else {
                if (this.currentMusicChanel) {
                    this.currentMusicChanel.stop();
                    this.loadTimeDic[this.currentMusicChanel.name] = 0;
                    this.currentMusicChanel = null;
                }
            }
        };
        //-----------------------------------------------------------------------------
        SoundMgr.prototype.stopSound = function (soundName) {
            if (this.activeSound[soundName] != null && this.activeSound[soundName] != undefined) {
                if (this.activeSound[soundName]["stop"]) {
                    this.activeSound[soundName].stop();
                }
                this.activeSound[soundName] = null;
                delete this.activeSound[soundName];
            }
        };
        //-----------------------------------------------------------------------------
        SoundMgr.prototype.stopSounds = function () {
            if (null == this.activeSound)
                return;
            for (var i in this.activeSound) {
                this.stopSound(i);
            }
        };
        SoundMgr._instance = null;
        SoundMgr.MUSIC_TOGGLE = "MUSIC_TOGGLE";
        SoundMgr.SOUND_TOGGLE = "SOUND_TOGGLE";
        SoundMgr.MUSIC_VOLUME = "MUSIC_VOLUME";
        SoundMgr.SOUND_VOLUME = "SOUND_VOLUME";
        return SoundMgr;
    }());
    uniLib.SoundMgr = SoundMgr;
    __reflect(SoundMgr.prototype, "uniLib.SoundMgr");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    /**
     * UI管理
     */
    var UIMgr = (function () {
        function UIMgr() {
            this._commonLoadUI = null;
            this._tipsLoadUI = null;
            /**
            * ui字典
            */
            this._loadings = {};
            this._effects = {};
        }
        Object.defineProperty(UIMgr, "instance", {
            get: function () {
                if (null == UIMgr._instance) {
                    UIMgr._instance = new UIMgr();
                }
                return UIMgr._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIMgr.prototype, "commonLoadUI", {
            //-----------------------------------------------------------------------------
            get: function () {
                return this._commonLoadUI;
            },
            //-----------------------------------------------------------------------------
            set: function (value) {
                this._commonLoadUI = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIMgr.prototype, "tipsLoadUI", {
            //-----------------------------------------------------------------------------
            get: function () {
                return this._tipsLoadUI;
            },
            //-----------------------------------------------------------------------------
            set: function (value) {
                this._tipsLoadUI = value;
            },
            enumerable: true,
            configurable: true
        });
        //-----------------------------------------------------------------------------
        // 显示Loading
        //-----------------------------------------------------------------------------
        UIMgr.prototype.showProcessBar = function (loadClass, loaded, total, desc, resourceName, force, container) {
            if (force === void 0) {
                force = false;
            }
            return this.showLoading(loadClass, loaded, total, desc, resourceName, force, "", container);
        };
        //-----------------------------------------------------------------------------
        UIMgr.prototype.showLoadingTimeout = function (loadClass, key, timeout_msec, desc) {
            if (key === void 0) {
                key = "";
            }
            if (timeout_msec === void 0) {
                timeout_msec = 20000;
            }
            if (desc === void 0) {
                desc = "";
            }
            this.showLoading(loadClass ? loadClass : this._tipsLoadUI, null, null, desc, null, false, key);
            var self = this;
            if (timeout_msec) {
                setTimeout(function () {
                    self.hideLoading(loadClass, key);
                }, timeout_msec);
            }
        };
        //-----------------------------------------------------------------------------
        // 隐藏Loading
        //-----------------------------------------------------------------------------
        UIMgr.prototype.hideLoading = function (loadClass, uiName, destroy, rm_now) {
            if (uiName === void 0) {
                uiName = "";
            }
            if (destroy === void 0) {
                destroy = true;
            }
            if (rm_now === void 0) {
                rm_now = true;
            }
            if (uiName == "") {
                if (loadClass && loadClass != null) {
                    uiName = egret.getQualifiedClassName(loadClass);
                }
                else {
                    uiName = egret.getQualifiedClassName(this._commonLoadUI);
                    loadClass = this._commonLoadUI;
                }
            }
            if (this._loadings[uiName] != null) {
                if (rm_now == true) {
                    if (this._loadings[uiName].parent) {
                        this._loadings[uiName].parent.removeChild(this._loadings[uiName]);
                    }
                    try {
                        if (this._loadings[uiName]["destroy"]) {
                            this._loadings[uiName]["destroy"]();
                        }
                    }
                    catch (e) {
                    }
                }
                else {
                    if (this._loadings[uiName]["destroy"]) {
                        this._loadings[uiName]["destroy"]();
                    }
                    else {
                        if (this._loadings[uiName].parent) {
                            this._loadings[uiName].parent.removeChild(this._loadings[uiName]);
                        }
                    }
                }
                if (destroy) {
                    this._loadings[uiName] = null;
                    delete this._loadings[uiName];
                }
            }
        };
        //-----------------------------------------------------------------------------
        UIMgr.prototype.showLoading = function (loadClass, loaded, total, desc, resourceName, force, uiName, container, loadingParam) {
            if (force === void 0) {
                force = false;
            }
            if (uiName === void 0) {
                uiName = "";
            }
            if (uiName == "") {
                if (loadClass && loadClass != null) {
                    uiName = egret.getQualifiedClassName(loadClass);
                }
                else {
                    uiName = egret.getQualifiedClassName(this._commonLoadUI);
                    loadClass = this._commonLoadUI;
                }
            }
            else {
                if (loadClass == null) {
                    uiName = egret.getQualifiedClassName(this._tipsLoadUI);
                    loadClass = this._tipsLoadUI;
                }
            }
            if (uniLib.Utils.stringIsNullOrEmpty(uiName) || loadClass == null)
                return;
            if (this._loadings[uiName] == null) {
                this._loadings[uiName] = new loadClass(loadingParam);
            }
            else {
                if (this._loadings[uiName]["update"] && typeof (this._loadings[uiName]["update"]) == "function" && loadingParam) {
                    this._loadings[uiName].update(loadingParam);
                }
            }
            if (this._loadings[uiName].stage == null) {
                if (this._loadings[uiName]["setProgress"]) {
                    this._loadings[uiName].setProgress(2, 100);
                }
                if (container) {
                    container.addChild(this._loadings[uiName]);
                }
                else if (uniLib.SceneManager.instance.currentScene) {
                    if (uniLib.SceneManager.instance.currentScene.tipsLayer) {
                        uniLib.SceneManager.instance.currentScene.tipsLayer.addChild(this._loadings[uiName]);
                    }
                    else {
                        egret.MainContext.instance.stage.addChild(this._loadings[uiName]);
                    }
                }
                else {
                    egret.MainContext.instance.stage.addChild(this._loadings[uiName]);
                }
            }
            if (this._loadings[uiName] && this._loadings[uiName]["setProgress"]) {
                this._loadings[uiName].setProgress(loaded, total, desc, resourceName, force);
            }
        };
        UIMgr._instance = null;
        return UIMgr;
    }());
    uniLib.UIMgr = UIMgr;
    __reflect(UIMgr.prototype, "uniLib.UIMgr");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var Facade = (function (_super) {
        __extends(Facade, _super);
        function Facade() {
            var _this = _super.call(this) || this;
            Facade._commandArr = {};
            Facade._mediatorArr = [];
            Facade._proxyArr = [];
            _this.initializeController();
            return _this;
        }
        Facade.getInstance = function () {
            if (this._instance == null)
                this._instance = new Facade();
            return (this._instance);
        };
        Facade.prototype.initializeController = function () {
            this.registerCommand(uniLib.FacadeConsts.STARTUP, new uniLib.StartUpCommand());
        };
        /**
         * 启动PureMVC，在应用程序中调用此方法，并传递应用程序本身的引用
         * @param	rootView	-	PureMVC应用程序的根视图root，包含其它所有的View Componet
         */
        Facade.prototype.startUp = function (rootView) {
            Facade._commandArr = {};
            Facade._mediatorArr = [];
            Facade._proxyArr = [];
            this.sendNotification(uniLib.FacadeConsts.STARTUP, rootView);
        };
        Facade.prototype.registerCommand = function (cmd, command) {
            command.init();
            Facade._commandArr[cmd] = command;
        };
        Facade.prototype.removeCommand = function (cmd) {
            if (Facade._commandArr[cmd]) {
                Facade._commandArr[cmd].onRemove();
                Facade._commandArr[cmd] = null;
            }
        };
        Facade.prototype.registerMediator = function (mediator) {
            if (Facade._mediatorArr.indexOf(mediator) == -1) {
                Facade._mediatorArr.push(mediator);
            }
        };
        Facade.prototype.retrieveMediator = function (name) {
            for (var i = 0; i < Facade._mediatorArr.length; i++) {
                if (Facade._mediatorArr[i].name == name) {
                    return Facade._mediatorArr[i];
                }
            }
        };
        Facade.prototype.removeMediator = function (name) {
            for (var i = 0; i < Facade._mediatorArr.length; i++) {
                if (Facade._mediatorArr[i].name == name) {
                    Facade._mediatorArr[i].onRemove();
                    Facade._mediatorArr.splice(i, 1);
                    break;
                }
            }
        };
        Facade.prototype.registerProxy = function (proxy) {
            if (Facade._proxyArr.indexOf(proxy) == -1) {
                Facade._proxyArr.push(proxy);
            }
        };
        Facade.prototype.removeProxy = function (name) {
            for (var i = 0; i < Facade._proxyArr.length; i++) {
                if (Facade._proxyArr[i].name == name) {
                    Facade._proxyArr[i].onRemove();
                    Facade._proxyArr.splice(i, 1);
                    break;
                }
            }
        };
        return Facade;
    }(uniLib.MvcSender));
    uniLib.Facade = Facade;
    __reflect(Facade.prototype, "uniLib.Facade");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var Mediator = (function (_super) {
        __extends(Mediator, _super);
        function Mediator(name, viewComponent) {
            var _this = _super.call(this) || this;
            _this._name = name;
            _this._viewComponent = viewComponent;
            _this.$addEventListener();
            return _this;
        }
        Mediator.prototype.$addEventListener = function () {
            var arr = this.listNotificationInterests();
            for (var i = 0; i < arr.length; i++) {
                uniLib.EventListener.getInstance().addEventListener(arr[i], this.onHandle, this);
            }
        };
        Object.defineProperty(Mediator.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Mediator.prototype.onHandle = function (evt) {
            var data = new uniLib.MvcData(evt);
            this.handleNotification(data);
        };
        Mediator.prototype.listNotificationInterests = function () {
            return [];
        };
        Mediator.prototype.handleNotification = function (evt) {
            return;
        };
        Mediator.prototype.onRemove = function () {
            var arr = this.listNotificationInterests();
            for (var i = 0; i < arr.length; i++) {
                uniLib.EventListener.getInstance().removeEventListener(arr[i], this.onHandle, this);
            }
        };
        Mediator.prototype.getViewComponent = function () {
            return this._viewComponent;
        };
        Mediator.prototype.setViewComponent = function (viewComponent) {
            this._viewComponent = viewComponent;
        };
        return Mediator;
    }(uniLib.MvcSender));
    uniLib.Mediator = Mediator;
    __reflect(Mediator.prototype, "uniLib.Mediator");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var MvcData = (function () {
        function MvcData(evt) {
            this._evt = evt;
        }
        MvcData.prototype.getName = function () {
            return this._evt.type;
        };
        MvcData.prototype.getBody = function () {
            return this._evt.data;
        };
        return MvcData;
    }());
    uniLib.MvcData = MvcData;
    __reflect(MvcData.prototype, "uniLib.MvcData");
})(uniLib || (uniLib = {}));
var ui;
(function (ui) {
    var AdClickMisleadView = (function (_super) {
        __extends(AdClickMisleadView, _super);
        function AdClickMisleadView(callback, thisObj, params, autoNavigateToMiniprogram) {
            var _this = _super.call(this) || this;
            _this.autoNavigateToMiniprogram = false;
            _this.skinName = "AdClickMisleadViewSkin";
            _this.adaptationWidth();
            _this.adaptationHeight();
            _this.callback = callback;
            _this.thisObj = thisObj;
            _this.cbParams = params;
            _this.autoNavigateToMiniprogram = false;
            if (uniLib.AdConfig.gameConfig["clickMislead"]) {
                _this.autoNavigateToMiniprogram = autoNavigateToMiniprogram ? true : false;
            }
            _this.init();
            return _this;
        }
        AdClickMisleadView.prototype.destroy = function () {
            if (this.movieClip) {
                egret.Tween.removeTweens(this.movieClip);
                this.movieClip.stop();
                if (this.movieClip.parent) {
                    this.movieClip.parent.removeChild(this.movieClip);
                }
                this.movieClip = null;
            }
            if (this.circle) {
                egret.Tween.removeTweens(this.circle);
                if (this.circle.parent) {
                    this.circle.parent.removeChild(this.circle);
                }
                this.circle = null;
            }
            if (this.timerHandler) {
                egret.clearInterval(this.timerHandler);
                this.timerHandler = null;
            }
            egret.Tween.removeTweens(this.continueBtn);
            if (this.returnBtn)
                egret.Tween.removeTweens(this.returnBtn);
            if (this.itemRenderList && this.itemRenderList.length > 0) {
                for (var i = 0; i < this.itemRenderList.length; i++) {
                    var itemRender = this.itemRenderList[i];
                    itemRender.destroy();
                    if (itemRender.parent)
                        itemRender.parent.removeChild(itemRender);
                }
            }
            this.itemRenderList = [];
            _super.prototype.destroy.call(this);
        };
        AdClickMisleadView.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        AdClickMisleadView.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        AdClickMisleadView.prototype.init = function () {
            var self = this;
            this.continueBtn.visible = false;
            if (this.returnBtn)
                this.returnBtn.visible = false;
            if (this.autoNavigateToMiniprogram) {
                var timeout_4 = egret.setTimeout(function () {
                    egret.clearTimeout(timeout_4);
                    self.randomNavigateToMiniProgram();
                }, this, 200);
            }
            else {
                var timeout_5 = egret.setTimeout(function () {
                    egret.clearTimeout(timeout_5);
                    self.continueBtn.visible = true;
                    if (self.returnBtn)
                        self.returnBtn.visible = true;
                }, this, 3000);
            }
            this.onUpdateTime();
        };
        //-----------------------------------------------------------------------------
        AdClickMisleadView.prototype.onLoad = function () {
            var adDataList = uniLib.AdConfig.itemDataList;
            if (null == adDataList) {
                return;
            }
            if (this.itemRenderList && this.itemRenderList.length > 0) {
                for (var i = 0; i < this.itemRenderList.length; i++) {
                    var itemRender = this.itemRenderList[i];
                    itemRender.destroy();
                    if (itemRender.parent)
                        itemRender.parent.removeChild(itemRender);
                }
                this.itemRenderList = [];
            }
            // adDataList = uniLib.MathUtil.randArray(adDataList);
            var needTitle = true;
            var stroke = 0;
            this.itemRenderList = new Array();
            this.adGroup.removeChildren();
            for (var i = 0; i < 10; i++) {
                if (i >= adDataList.length)
                    break;
                var data = adDataList[i];
                var itemRender = new ui.AdItemDataRender(data, "AdFullScreenItemSkin", true, needTitle, stroke, false);
                this.adGroup.addChildAt(itemRender, 0);
                this.itemRenderList.push(itemRender);
            }
            if (null == this.timerHandler) {
                this.timerHandler = egret.setInterval(this.onUpdateTime, this, 3000);
            }
        };
        AdClickMisleadView.prototype.onUpdateTime = function () {
            this.onLoad();
            if (this.movieClip) {
                egret.Tween.removeTweens(this.movieClip);
                this.movieClip.stop();
                if (this.movieClip.parent) {
                    this.movieClip.parent.removeChild(this.movieClip);
                }
                this.movieClip = null;
            }
            if (this.circle) {
                egret.Tween.removeTweens(this.circle);
                if (this.circle.parent) {
                    this.circle.parent.removeChild(this.circle);
                }
                this.circle = null;
            }
            if (this.itemRenderList.length < 0)
                return;
            if (!uniLib.AdConfig.gameConfig["clickMislead"])
                return;
            var minValue = 0;
            var maxValue = this.itemRenderList.length - 1;
            var index = uniLib.MathUtil.RandomNumBoth(0, maxValue);
            var itemRender = this.itemRenderList[index];
            this.circle = new eui.Image("ad-guide-circle");
            this.circle.touchEnabled = false;
            itemRender.addChild(this.circle);
            this.circle.x = itemRender.width * 0.5;
            this.circle.y = itemRender.height * 0.5;
            this.circle.anchorOffsetX = 39.5;
            this.circle.anchorOffsetY = 39.5;
            this.movieClip = uniLib.Utils.creatMovieClip("finger_effect_json", "finger_effect_png", "finger", -1);
            this.movieClip.x = itemRender.width * 0.5;
            this.movieClip.y = itemRender.height * 0.5;
            this.movieClip.touchEnabled = false;
            itemRender.addChild(this.movieClip);
            this.movieClip.gotoAndPlay(0, -1);
            this.circle.scaleX = this.circle.scaleY = 1;
            // egret.Tween.get(this.circle, {loop:true}).to({scaleX:1, scaleY:1}, 100).to({scaleX:0.5, scaleY:0.5}, 100);
            egret.Tween.get(this.circle, { loop: true }).to({ scaleX: 1, scaleY: 1 }, 300).to({ scaleX: 0.5, scaleY: 0.5 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
        };
        AdClickMisleadView.prototype.onReturn = function () {
            uniLib.AdPlat.instance.hideBanner();
            if (this.callback) {
                this.callback.call(this.thisObj, this.cbParams);
            }
            this.callback = null;
            this.thisObj = null;
            this.cbParams = null;
            egret.Tween.removeTweens(this.continueBtn);
            GX.PopUpManager.removePopUp(this);
            window.platform.customInterface("showGameClubButton");
        };
        AdClickMisleadView.prototype.randomNavigateToMiniProgram = function () {
            var _this = this;
            if (uniLib.AdConfig.itemDataList.length <= 0)
                return;
            var minIndex = 0;
            var maxIndex = uniLib.AdConfig.itemDataList.length;
            var curIndex = uniLib.MathUtil.random(minIndex, maxIndex);
            if (curIndex < 0)
                curIndex = 0;
            else if (curIndex >= uniLib.AdConfig.itemDataList.length)
                curIndex = uniLib.AdConfig.itemDataList.length - 1;
            var adData = uniLib.AdConfig.itemDataList[curIndex];
            var self = this;
            window.platform.customInterface("navigateToMiniProgram", adData, function (result, userData) {
                if (result == true) {
                    uniLib.Global.reportAldEvent("导出小游戏" + userData.title);
                    uniLib.Global.reportUmaEvent("导出小游戏" + userData.title);
                }
                var timeout = egret.setTimeout(function () {
                    egret.clearTimeout(timeout);
                    self.continueBtn.visible = true;
                    if (self.returnBtn)
                        self.returnBtn.visible = true;
                }, _this, 3000);
            }, this);
        };
        AdClickMisleadView.prototype.onNavigateToMiniProgramCallback = function (result, userData) {
            if (result == true) {
                uniLib.Global.reportAldEvent("导出小游戏" + userData.title);
                uniLib.Global.reportUmaEvent("导出小游戏" + userData.title);
            }
            this.onReturn();
        };
        AdClickMisleadView.prototype.onClickTap = function (e) {
            if (e.target == this.continueBtn) {
                if (this.autoNavigateToMiniprogram) {
                    this.onReturn();
                }
                else {
                    var index = 0;
                    if (uniLib.AdConfig.gameConfig["clickMislead"]) {
                        index = uniLib.MathUtil.randomProbability([50, 50]);
                    }
                    if (index == 0) {
                        this.onReturn();
                    }
                    else {
                        var minIndex = 0;
                        var maxIndex = uniLib.AdConfig.itemDataList.length;
                        var curIndex = uniLib.MathUtil.random(minIndex, maxIndex);
                        if (curIndex < 0)
                            curIndex = 0;
                        else if (curIndex >= uniLib.AdConfig.itemDataList.length)
                            curIndex = uniLib.AdConfig.itemDataList.length - 1;
                        var adData = uniLib.AdConfig.itemDataList[curIndex];
                        window.platform.customInterface("navigateToMiniProgram", adData, this.onNavigateToMiniProgramCallback, this);
                    }
                }
            }
            else if (this.returnBtn && e.target == this.returnBtn) {
                this.onReturn();
            }
        };
        return AdClickMisleadView;
    }(ui.BaseUI));
    ui.AdClickMisleadView = AdClickMisleadView;
    __reflect(AdClickMisleadView.prototype, "ui.AdClickMisleadView");
})(ui || (ui = {}));
var uniLib;
(function (uniLib) {
    var ViewConfig = (function () {
        function ViewConfig() {
        }
        return ViewConfig;
    }());
    uniLib.ViewConfig = ViewConfig;
    __reflect(ViewConfig.prototype, "uniLib.ViewConfig");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var HttpClient = (function () {
        function HttpClient(url) {
            this.loginUrl = url;
        }
        /**
         * 平台登陆
         */
        HttpClient.prototype.platLogin = function (callBack, loginFail, thisObj) {
            this.loginCallBackFunction = callBack;
            this.loginFailFunction = loginFail;
            this.loginCallBackObj = thisObj;
            var platInfo = uniLib.Plat.initPlatInfo();
            if (!uniLib.Utils.stringIsNullOrEmpty(uniLib.BrowersUtils.GetRequest("uid"))) {
                platInfo.uid = uniLib.BrowersUtils.GetRequest("uid");
            }
            this.login(platInfo);
        };
        /**
         * 登陆
         */
        HttpClient.prototype.login = function (platInfo) {
            if (uniLib.Plat.platTokenInfo && uniLib.Plat.platTokenInfo["gatewayurl"] && uniLib.Plat.platTokenInfo["gatewayurl"].length > 0) {
                uniLib.Plat.UID = Number(uniLib.Plat.platTokenInfo.uid);
                this.gatewayUrl = uniLib.Plat.platTokenInfo["gatewayurl"];
                if (this.loginCallBackFunction) {
                    this.loginCallBackFunction.call(this.loginCallBackObj, uniLib.Plat.platTokenInfo.platinfo);
                }
            }
            else {
                var platLogin = new Cmd.PlatTokenLogin();
                platLogin.platinfo = platInfo;
                this.initLogin(platLogin);
            }
        };
        HttpClient.prototype.initLogin = function (msg) {
            var _this = this;
            var self = this;
            var platLogin = uniLib.Plat.getPlatToken();
            if (platLogin && uniLib.Plat.isCacheToken) {
                if (platLogin["gatewayurl"] && platLogin["gatewayurl"].length > 0) {
                    this.gatewayUrl = platLogin["gatewayurl"];
                    this.loginSuccess(platLogin.platinfo);
                }
                else {
                    // 选区
                    this.selectZone(uniLib.Plat.zoneId, function () {
                        self.loginSuccess(uniLib.Plat.platTokenInfo.platinfo);
                    }, this);
                }
            }
            else {
                this.sendTo(this.loginUrl, "plat-token-login", msg, function (recv) {
                    self.cacheLoginInfo(recv.data);
                    // 选区
                    self.selectZone(uniLib.Plat.zoneId, function () {
                        self.loginSuccess(uniLib.Plat.platTokenInfo.platinfo);
                    }, _this);
                }, this);
            }
        };
        /**
         * 登陆成功回调
         */
        HttpClient.prototype.loginSuccess = function (data) {
            if (this.loginCallBackFunction) {
                this.loginCallBackFunction.call(this.loginCallBackObj, data);
            }
            this.loginCallBackFunction = null;
            this.loginFailFunction = null;
            this.loginCallBackObj = null;
        };
        /**
         * 缓存登陆信息
         */
        HttpClient.prototype.cacheLoginInfo = function (info) {
            if (null == info)
                return false;
            uniLib.Plat.UID = Number(info.uid);
            uniLib.Plat.platTokenInfo = info;
            uniLib.Plat.setPlatToken(info);
            return true;
        };
        /**
         * 选区
         */
        HttpClient.prototype.selectZone = function (zoneId, callback, thisObj) {
            var self = this;
            var cmd = new Cmd.RequestSelectZone();
            this.sendTo(this.loginUrl, "request-select-zone", cmd, function (recv) {
                if (uniLib.checkServerReturnCodeError(recv)) {
                    console.error("request-select-zone error...");
                    uniLib.doServerReturnCodeError(recv);
                    return;
                }
                if (recv.data && recv.data.gatewayurl) {
                    self.gatewayUrl = recv.data.gatewayurl;
                    uniLib.Plat.platTokenInfo["gatewayurl"] = self.gatewayUrl;
                    uniLib.Plat.setPlatToken(uniLib.Plat.platTokenInfo);
                }
                if (callback)
                    callback.call(thisObj);
            }, this);
        };
        /**
         * 发送数据
         */
        HttpClient.prototype.send = function (url, message, callback, thisObj) {
            var method = null;
            if (message["GetType"]) {
                method = message["GetType"]();
            }
            if (null == method) {
                method = message["do"] || message["cmd_name"];
            }
            delete message['do'];
            delete message['cmd_name'];
            this.sendTo(url, method, message, callback, thisObj);
        };
        /**
         * 发送数据
         */
        HttpClient.prototype.sendTo = function (url, method, message, callback, thisObj) {
            var time;
            var cmd = new Cmd.HttpPackage();
            cmd.do = method;
            cmd.data = message;
            if (null != uniLib.Plat.UID && uniLib.Plat.UID > 0) {
                cmd.uid = uniLib.Plat.UID.toString();
            }
            if (null != uniLib.Plat.gameId) {
                cmd.gameid = uniLib.Plat.gameId;
            }
            if (null != uniLib.Plat.zoneId) {
                cmd.zoneid = uniLib.Plat.zoneId;
            }
            if (!uniLib.Utils.stringIsNullOrEmpty(uniLib.Plat.PlatToken)) {
                cmd.unigame_plat_login = uniLib.Plat.PlatToken;
                time = Math.floor(new Date().getTime() / 1000);
                cmd.unigame_plat_timestamp = time;
            }
            var str = JSON.stringify(cmd);
            var sliceStr = "?";
            if (!uniLib.Utils.stringIsNullOrEmpty(uniLib.Plat.PlatKey)) {
                url += sliceStr + "unigame_plat_sign=" + uniLib.Utils.MD5(str + (time ? time.toString() : "") + uniLib.Plat.PlatKey) + "&do=" + cmd.do;
            }
            if (uniLib.Console.isDevMode) {
                uniLib.Console.log("[HTTP SEND] " + str + "\n" + url);
            }
            var self = this;
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.POST);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send(str);
            request.addEventListener(egret.Event.COMPLETE, function (event) {
                var request = event.currentTarget;
                console.log("http recv: ", request.response);
                var response = JSON.parse(request.response);
                self.onHttpComplete(url, response, callback, thisObj);
            }, this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (event) {
                self.onHttpError(url, null);
            }, this);
        };
        /**
         * HTTP 回调
         */
        HttpClient.prototype.onHttpComplete = function (url, response, callback, thisObj) {
            var recv = response;
            if (uniLib.Console.isDevMode) {
                uniLib.Console.log("[HTTP RECV] " + JSON.stringify(recv) + "\n" + url);
            }
            if (uniLib.checkServerReturnCodeError(recv)) {
                if (recv.do == "Cmd.MobileRegeristReturnCreateAccountFailLoginUserCmd_S" || recv.do == "Cmd.UserRequestPlatTokenLoginFailLoginUserCmd_S" || recv.do == "plat-token-login" || recv.do == "request-select-zone" || recv.do == "Cmd.EmailRegeristReturnCreateAccountFailLoginUserCmd_S") {
                    uniLib.Utils.clearLocalStorage("platToken|" + uniLib.Plat.gameId + "|" + uniLib.Plat.zoneId + "|" + uniLib.Plat.platId);
                    if (Number(recv.errno) == Cmd.HttpReturnCode.HttpReturnCode_NeedBind) {
                        uniLib.Plat.platInfo = null;
                    }
                    if (this.onHttpError(url, recv) == true) {
                        console.log("-----------已经处理过了..........");
                        return;
                    }
                }
                else if (recv.do == "Cmd.MobileRegistReturnRandCodeLoginUserCmd_S" || recv.do == "Cmd.EmailRegistRequestRandCodeLoginUserCmd_S" || recv.do == "Cmd.MobileRegeristReturnRandCodeLoginUserCmd_S" || recv.do == "Cmd.MobileRegistRequestRandCodeLoginUserCmd_C") {
                    if (callback) {
                        if (callback.call(thisObj, recv) == true)
                            return;
                    }
                }
                uniLib.Console.error("[HTTP RECV ERROR] " + JSON.stringify(recv) + "\n" + url);
                uniLib.doServerReturnCodeError(recv);
                return;
            }
            if (callback) {
                callback.call(thisObj, recv);
            }
        };
        HttpClient.prototype.onHttpError = function (url, response) {
            if (this.loginFailFunction) {
                var ret = this.loginFailFunction.call(this.loginCallBackObj, response);
                this.loginCallBackFunction = null;
                this.loginFailFunction = null;
                this.loginCallBackObj = null;
                if (ret == true) {
                    return true;
                }
            }
            return false;
        };
        return HttpClient;
    }());
    uniLib.HttpClient = HttpClient;
    __reflect(HttpClient.prototype, "uniLib.HttpClient");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var JsonSocket = (function () {
        function JsonSocket(url, plat) {
            this.isConnected = 0;
            this.isConnecting = false;
            this.needReconnect = true;
            this.reconnectTimes = 0;
            this.maxCeconnectTimes = 2;
            this.lastRecvTime = 0;
            this.connectingTimeout = null;
            this.socketLoginSuc = null;
            this.socketLoginFail = null;
            this.socketLoginObj = null;
            this.socket = null;
            this.sendCache = null;
            this.timerActive = null;
            this.timerPing = null;
            this.loginData = null;
            this.wsurl = url;
            this.plat = plat;
        }
        JsonSocket.prototype.getSocket = function () {
            return this.socket;
        };
        JsonSocket.prototype.login = function (onLogin, onLoginFail, thisObj) {
            this.socketLoginSuc = onLogin;
            this.socketLoginFail = onLoginFail;
            this.socketLoginObj = thisObj;
            this.connect();
        };
        JsonSocket.prototype.connect = function () {
            uniLib.Console.log("[WS OPENING NEW1] " + this.wsurl);
            if (this.socket) {
                this.socket.close();
            }
            this.isConnecting = true;
            this.socket = new WebSocket(this.wsurl);
            this.socket.onopen = this.onSocketOpen.bind(this);
            this.socket.onmessage = this.onReceiveMessage.bind(this);
            this.socket.onclose = this.onSocketClose.bind(this);
            this.socket.onerror = this.onSocketError.bind(this);
            if (null != this.connectingTimeout) {
                clearTimeout(this.connectingTimeout);
                this.connectingTimeout = null;
            }
            var self = this;
            this.connectingTimeout = setTimeout(function () {
                if (self.isConnecting == true) {
                    self.isConnecting = false;
                    self.onCloseConnect();
                    self.connectingTimeout = null;
                }
            }, 3000);
        };
        JsonSocket.prototype.reConnect = function () {
            if (this.isConnecting == true || this.isConnected == 2 || this.needReconnect == false) {
                uniLib.Console.warn("[WS CLOSING reConnect cancel] isConnecting:" + this.isConnecting + " , isConnected:" + this.isConnected);
                return false;
            }
            var cmd = {};
            cmd['do'] = "Cmd.UserLoginReconnectLoginUserCmd_C";
            cmd['accountid'] = uniLib.Plat.UID;
            cmd['timestamp'] = new Date().getTime();
            cmd['tokenmd5'] = uniLib.Utils.MD5("" + cmd['accountid'] + "" + cmd['timestamp'] + "" + uniLib.Plat.PlatKey);
            cmd['url'] = this.wsurl;
            this.loginData = cmd;
            this.connect();
            this.isConnected = 2;
            return true;
        };
        JsonSocket.prototype.onCloseConnect = function () {
            if (this.isConnected == 2) {
                uniLib.Console.warn("[WS CLOSING onCloseConnect]");
                return;
            }
            this.isConnected = 0;
            if (this.reconnectTimes < this.maxCeconnectTimes) {
                if (this.reConnect()) {
                    this.reconnectTimes++;
                }
            }
            else {
                this.close(false);
                uniLib.UIMgr.instance.hideLoading(uniLib.UIMgr.instance.tipsLoadUI, "reconnect");
                // -- 玩家手工重连
                uniLib.Console.warn("onCloseConnect 网络不稳定,需要重新连接");
                var self_1 = this;
                GX.Tips.showPopup("网络不稳定,需要重新连接", function () {
                    self_1.reconnectTimes = 0;
                    self_1.needReconnect = true;
                    self_1.reConnect();
                }, function () {
                    if (self_1.socketLoginFail) {
                        self_1.reconnectTimes = 0;
                        self_1.socketLoginFail.call(self_1.socketLoginObj);
                        self_1.socketLoginFail = null;
                        self_1.socketLoginSuc = null;
                        self_1.socketLoginObj = null;
                    }
                }, this, true, "温馨提示", null, null, GX.PopUpEffect.CENTER, true, null, egret.MainContext.instance.stage);
            }
        };
        JsonSocket.prototype.close = function (needreconnect) {
            if (null == needreconnect)
                needreconnect = true;
            if (this.socket) {
                this.socket.close();
            }
            if (null != this.connectingTimeout) {
                clearTimeout(this.connectingTimeout);
                this.connectingTimeout = null;
            }
            if (null != this.timerPing) {
                clearInterval(this.timerPing);
                this.timerPing = null;
            }
            if (null != this.timerActive) {
                clearInterval(this.timerActive);
                this.timerActive = null;
            }
            this.loginData = null;
            this.sendCache = null;
            this.socket = null;
            this.isConnected = 0;
            this.needReconnect = needreconnect;
            this.isConnecting = false;
            this.reconnectTimes = 0;
        };
        JsonSocket.prototype.sendPlat = function (message) {
            if (null == message)
                return;
            var method = null;
            if (message["GetType"]) {
                method = message["GetType"]();
            }
            if (null == method) {
                method = message["do"] || message["cmd_name"];
            }
            delete message['do'];
            delete message['cmd_name'];
            var wrapper = {};
            wrapper['cmd_name'] = method;
            wrapper['data'] = message;
            wrapper['gameid'] = uniLib.Plat.gameId;
            wrapper['zoneid'] = uniLib.Plat.zoneId;
            var str = JSON.stringify(wrapper);
            if (this.sockSend(str) == true) {
                uniLib.Console.log("[WS SEND sendPlat] " + str);
            }
            else {
                uniLib.Console.warn("[WS SEND sendPlat Error] " + str);
            }
        };
        JsonSocket.prototype.send = function (message) {
            if (null == message)
                return;
            var method = null;
            if (message["GetType"]) {
                method = message["GetType"]();
            }
            if (null == method) {
                method = message["do"] || message["cmd_name"];
            }
            delete message['do'];
            delete message['cmd_name'];
            var wrapper = {};
            wrapper['do'] = method;
            wrapper['data'] = message;
            var str = JSON.stringify(wrapper);
            if (this.sockSend(str) == true) {
                uniLib.Console.log("[WS SEND] " + str);
            }
            else {
                uniLib.Console.warn("[WS SEND Error] " + str);
            }
        };
        JsonSocket.prototype.sockSend = function (data) {
            if (this.isConnected == 0 || null == this.socket) {
                if (this.isConnecting == false && null == this.connectingTimeout) {
                    this.reConnect();
                }
                uniLib.Console.warn("[WS SEND ERROR] can't send message when websocket closed: " + data + ":" + this.isConnected);
                if (this.sendCache && this.sendCache.length == 0) {
                    this.sendCache.push(data);
                    uniLib.Console.log("[WS CACHE sockSend0]:" + data);
                }
                return false;
            }
            if (this.isConnected != 1) {
                uniLib.Console.warn("[WS SEND ERROR] wait for connecting: " + this.isConnected + ":" + data);
                if (this.sendCache && this.sendCache.length == 0) {
                    this.sendCache.push(data);
                    uniLib.Console.log("[WS CACHE sockSend1]:" + data);
                }
                return false;
            }
            this.socket.send(data);
            return true;
        };
        JsonSocket.prototype.parseData = function (data) {
            var message = null;
            try {
                message = JSON.parse(data);
            }
            catch (e) {
                message = null;
                uniLib.Console.error(e.message);
                uniLib.Console.error("parseData error: " + data);
            }
            if (null == message)
                return;
            if (message instanceof Array) {
                for (var i = 0; i < message.length; i++) {
                    this.dispatch(message[i]);
                }
            }
            else {
                this.dispatch(message);
            }
        };
        JsonSocket.prototype.dispatch = function (message) {
            var self = this;
            if (null == this.timerPing && this.socket) {
                this.timerPing = setInterval(function () {
                    self.sendPing();
                }, 30000);
            }
            if (null == this.timerActive && this.socket) {
                var self_2 = this;
                this.timerActive = setInterval(function () {
                    self_2.onTickActive();
                }, 3000);
            }
            var cmd_name = message["cmd_name"];
            var msg = null;
            if (null == cmd_name) {
                msg = message;
            }
            if (null != msg) {
                if (uniLib.checkServerReturnCodeError(message)) {
                    uniLib.Console.warn("[WS RUN ERROR] server error0: " + JSON.stringify(message));
                    return false;
                }
                cmd_name = msg["do"];
            }
            if (uniLib.checkServerReturnCodeError(message)) {
                uniLib.Console.warn("[WS RUN ERROR] server error1: " + JSON.stringify(message));
                return false;
            }
            if (null == cmd_name || cmd_name == "") {
                uniLib.Console.error("cmd_name error :" + JSON.stringify(message));
                return false;
            }
            // 查找响应函数
            var segments = cmd_name.split(".");
            segments[segments.length - 1] = "On" + segments[segments.length - 1];
            var defineName = "";
            for (var i = 0; i < segments.length; i++) {
                defineName += segments[i] + (i == segments.length - 1 ? "" : ".");
            }
            if (defineName == "Cmd.OnUserLoginReconnectOkLoginUserCmd_S") {
                return true;
            }
            var f = null;
            if (uniLib.getDefinitionByName(defineName) != null) {
                f = uniLib.getDefinitionByName(defineName);
            }
            if (f != null) {
                uniLib.Console.log("[WS RECV] " + defineName + ":" + JSON.stringify(message));
                this.reconnectTimes = 0;
                f(message["data"]);
                return true;
            }
            if (defineName === "Cmd.OnTickPingCmd_CS") {
                return true;
            }
            else if (defineName === "Cmd.OnUserLoginReturnOkLoginUserCmd_S") {
                uniLib.Console.log("[WS] login to gateway success #");
                if (this.socketLoginSuc) {
                    this.socketLoginSuc.call(this.socketLoginObj ? this.socketLoginObj : this);
                    this.socketLoginSuc = null;
                }
                return true;
            }
            else if (defineName === "Cmd.OnUserLoginReturnFailLoginUserCmd_S") {
                uniLib.Console.warn("[WS socketLoginFail] ");
                if (this.socketLoginFail) {
                    this.socketLoginFail.call(this.socketLoginObj ? this.socketLoginObj : message);
                }
                this.socketLoginFail = null;
                this.socketLoginSuc = null;
                this.socketLoginObj = null;
                return true;
            }
            else if (defineName === "Cmd.OnReconnectKickoutLoginUserCmd_S") {
                uniLib.EventListener.getInstance().dispatchEventWith(uniLib.DataRequestCommand.LOGIN_OUT, false, message);
                return true;
            }
            uniLib.Console.warn("[WS RUN unprocess] [" + defineName + "]\n" + JSON.stringify(message));
            return false;
        };
        JsonSocket.prototype.sendPing = function () {
            var cmd = {};
            cmd['do'] = "Cmd.TickPingCmd_CS";
            this.sendPlat(cmd);
        };
        JsonSocket.prototype.onTickActive = function () {
            var now = new Date().getTime();
            var diff = now - this.lastRecvTime;
            if (diff >= 60000) {
                this.checkNeedReconnect();
            }
            else if (diff >= 40000) {
                this.reConnect();
            }
        };
        JsonSocket.prototype.checkNeedReconnect = function () {
            if (this.isConnected == 1) {
                var need_reconnect = false;
                if (this.socket) {
                    if (this.socket.readyState != 1) {
                        need_reconnect = true;
                    }
                }
                else {
                    need_reconnect = true;
                }
                if (need_reconnect == true) {
                    this.reConnect();
                }
            }
            else {
                uniLib.Console.log("checkNeedReconnect3:" + this.isConnected);
            }
        };
        JsonSocket.prototype.onSocketOpen = function () {
            if (null != this.connectingTimeout) {
                clearTimeout(this.connectingTimeout);
                this.connectingTimeout = null;
            }
            this.isConnected = 1;
            this.isConnecting = false;
            var cache = this.sendCache;
            this.sendCache = null;
            if (this.loginData) {
                this.sendPlat(this.loginData);
                this.loginData = null;
            }
            if (cache) {
                for (var i = 0; i < cache.length; i++) {
                    var data = cache[i];
                    if (this.sockSend(data)) {
                        uniLib.Console.log("[WS SEND CACHE] " + data);
                    }
                }
            }
            if (null != this.timerPing) {
                clearInterval(this.timerPing);
                this.timerPing = null;
            }
            if (null != this.timerActive) {
                clearInterval(this.timerActive);
                this.timerActive = null;
            }
        };
        JsonSocket.prototype.onReceiveMessage = function (event) {
            this.lastRecvTime = new Date().getTime();
            if (null == this.socket)
                return;
            var data = event.data;
            if (data && data != "") {
                if (data != "{}") {
                    this.parseData(data);
                }
            }
            else {
                uniLib.Console.warn("[WS RUN ERROR] server request colose socket");
            }
        };
        JsonSocket.prototype.onSocketClose = function () {
            this.isConnected = 0;
            this.isConnecting = false;
            if (null != this.socket) {
                uniLib.Console.warn("[WS CLOSING onSocketClose0]");
            }
            else {
                uniLib.Console.warn("[WS CLOSING onSocketClose1]");
            }
            if (null != this.connectingTimeout) {
                clearTimeout(this.connectingTimeout);
                this.connectingTimeout = null;
            }
            var self = this;
            this.connectingTimeout = setTimeout(function () {
                if (self.isConnected == 0) {
                    self.onCloseConnect();
                }
                else {
                    uniLib.Console.warn("[WS CLOSING onSocketClose] isConnected:" + self.isConnected);
                }
                self.connectingTimeout = null;
            }, 3000);
        };
        JsonSocket.prototype.onSocketError = function () {
            this.isConnected = 0;
            this.isConnecting = false;
            uniLib.Console.warn("[WS Error]");
            if (null != this.connectingTimeout) {
                clearTimeout(this.connectingTimeout);
                this.connectingTimeout = null;
            }
            var self = this;
            this.connectingTimeout = setTimeout(function () {
                if (self.isConnected == 0) {
                    self.onCloseConnect();
                }
                else {
                    uniLib.Console.warn("[WS CLOSING onSocketError] isConnected:" + self.isConnected);
                }
                self.connectingTimeout = null;
            }, 3000);
        };
        return JsonSocket;
    }());
    uniLib.JsonSocket = JsonSocket;
    __reflect(JsonSocket.prototype, "uniLib.JsonSocket");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var Plat = (function () {
        function Plat() {
        }
        Object.defineProperty(Plat, "instance", {
            get: function () {
                if (null == Plat._instance)
                    Plat._instance = new Plat();
                return Plat._instance;
            },
            enumerable: true,
            configurable: true
        });
        Plat.setPlatToken = function (info) {
            var key = "platToken|" + uniLib.Plat.gameId + "|" + uniLib.Plat.zoneId + "|" + uniLib.Plat.platId;
            var vale = JSON.stringify(info);
            uniLib.Utils.setLocalStorage(key, encodeURIComponent(vale));
            uniLib.Console.log("cache_platinfo[" + key + "]:" + vale);
        };
        Plat.getPlatToken = function () {
            var key = "platToken|" + uniLib.Plat.gameId + "|" + uniLib.Plat.zoneId + "|" + uniLib.Plat.platId;
            var value = uniLib.Utils.getLocalStorage(key);
            uniLib.Console.log("get_platinfo[" + key + "]:" + value);
            if (null == value || value == "")
                return null;
            Plat.platTokenInfo = JSON.parse(value);
            if (Plat.platTokenInfo.unigame_plat_key && Plat.platTokenInfo.unigame_plat_login) {
                if (Plat.platTokenInfo.uid)
                    Plat.UID = Number(Plat.platTokenInfo.uid);
                Plat.PlatKey = Plat.platTokenInfo.unigame_plat_key;
                Plat.PlatToken = Plat.platTokenInfo.unigame_plat_login;
            }
            else {
                Plat.platTokenInfo = null;
            }
            return Plat.platTokenInfo;
        };
        //------------------------------------------------------------
        Plat.initPlatInfo = function (platInfo) {
            if (null == Plat.platInfo) {
                Plat.platInfo = new Cmd.PlatInfo();
                if (null != platInfo) {
                    Plat.platInfo = platInfo;
                }
            }
            return Plat.platInfo;
        };
        /**
         * 初始化平台网络
         */
        Plat.prototype.init = function (url, callBack, loginFail, thisObj) {
            this.loginUrl = url;
            if (null == this.http || this.http.loginUrl != this.loginUrl) {
                this.http = new uniLib.HttpClient(url);
                this.http.platLogin(callBack, loginFail, thisObj);
            }
            else {
                if (callBack) {
                    callBack.call(thisObj);
                }
            }
        };
        Plat.prototype.initSocket = function (sockSucc, sockFail, thisObj) {
            var gatewayurl = Plat.platTokenInfo["gatewayurl"];
            this.ws = new uniLib.JsonSocket(gatewayurl, this);
            var cmd = {};
            cmd['do'] = "Cmd.UserLoginTokenLoginUserCmd_C";
            cmd['accountid'] = Plat.UID;
            cmd['timestamp'] = new Date().getTime();
            cmd['tokenmd5'] = uniLib.Utils.MD5("" + cmd['accountid'] + "" + cmd['timestamp'] + "" + Plat.PlatKey);
            cmd['url'] = gatewayurl;
            this.ws.loginData = cmd;
            this.ws.login(sockSucc, sockFail, thisObj);
        };
        Plat.prototype.closeSocket = function () {
            if (null == this.ws)
                return;
            this.ws.close(false);
            this.ws = null;
        };
        Plat.prototype.logout = function (kickoutMssage) {
            uniLib.Utils.clearLocalStorage("platToken|" + uniLib.Plat.gameId + "|" + uniLib.Plat.zoneId + "|" + uniLib.Plat.platId);
            this.closeSocket();
            this.loginUrl = null;
            this.http = null;
            this.ws = null;
            uniLib.Plat.platTokenInfo = null;
            uniLib.Plat.gameId = null;
            uniLib.Plat.zoneId = null;
            uniLib.Plat.platId = null;
            uniLib.Plat.UID = null;
            uniLib.Plat.PlatKey = null;
            uniLib.Plat.PlatToken = null;
            uniLib.GameData.instance.myBaseInfo = null;
            var loginPanel = uniLib.getDefinitionByName(uniLib.ViewConfig.loginPanelName);
            uniLib.SceneManager.instance.changeScene(loginPanel);
            if (kickoutMssage) {
                var msg = kickoutMssage["msg"] ? kickoutMssage["msg"] : "重复登陆，被踢下线！";
                GX.Tips.showPopup(msg);
            }
        };
        Plat.prototype.httpSend = function (message, callback, thisObj) {
            this.http.send(this.loginUrl, message, callback, thisObj);
        };
        Plat.prototype.tcpSend = function (message) {
            if (null == this.ws) {
                uniLib.Console.warn("tcpSend:网络不可用,请检查网络:" + JSON.stringify(message));
                return;
            }
            var method = null;
            if (message["GetType"]) {
                method = message["GetType"]();
            }
            if (null == method) {
                method = message["do"] || message["cmd_name"];
            }
            if (method != "UserLoginTokenLoginUserCmd_C") {
                this.ws.send(message);
            }
        };
        Plat.isCacheToken = true;
        Plat.platInfo = null;
        Plat.platTokenInfo = null;
        return Plat;
    }());
    uniLib.Plat = Plat;
    __reflect(Plat.prototype, "uniLib.Plat");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var AdConfig = (function () {
        function AdConfig() {
        }
        // 导出数据列表
        AdConfig.itemDataList = [];
        AdConfig.firstEnterMisTouch = false; // 首次进入是否触发狂点误触?
        AdConfig.checkBoxMistouch = false; // 勾选框误触？
        AdConfig.checkBoxProbabilitys = []; // 取消勾选框概率
        AdConfig.autoBannerShowTime = 0; // 自动banner显示时长
        AdConfig.autoBannerLimit = 0; // 自动banner刷新时长
        AdConfig.gameConfig = {};
        return AdConfig;
    }());
    uniLib.AdConfig = AdConfig;
    __reflect(AdConfig.prototype, "uniLib.AdConfig");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var ServerProxy = (function (_super) {
        __extends(ServerProxy, _super);
        function ServerProxy() {
            return _super.call(this, ServerProxy.NAME) || this;
        }
        ServerProxy.getInstance = function () {
            if (!this._instance) {
                this._instance = new ServerProxy();
            }
            return this._instance;
        };
        ServerProxy.prototype.initServer = function () {
            uniLib.UIMgr.instance.showProcessBar(null, 94, 100, "正在连接服务器...", "", true);
            uniLib.Plat.gameId = uniLib.Global.gameConfig.gameid;
            uniLib.Plat.platId = uniLib.Global.gameConfig.platid;
            uniLib.Plat.zoneId = uniLib.Global.gameConfig.zoneid;
            if (uniLib.BrowersUtils.GetRequest("cacheToken") == "false") {
                uniLib.Plat.isCacheToken = false;
            }
            else if (uniLib.BrowersUtils.GetRequest("cacheToken") == "true") {
                uniLib.Plat.isCacheToken = true;
            }
            if (!uniLib.Utils.stringIsNullOrEmpty(uniLib.BrowersUtils.GetRequest("gameid"))) {
                uniLib.Plat.gameId = Number(uniLib.BrowersUtils.GetRequest("gameid"));
            }
            if (!uniLib.Utils.stringIsNullOrEmpty(uniLib.BrowersUtils.GetRequest("zoneid"))) {
                uniLib.Plat.zoneId = Number(uniLib.BrowersUtils.GetRequest("zoneid"));
            }
            if (!uniLib.Utils.stringIsNullOrEmpty(uniLib.BrowersUtils.GetRequest("platid"))) {
                uniLib.Plat.platId = Number(uniLib.BrowersUtils.GetRequest("platid"));
            }
            uniLib.Plat.instance.init(uniLib.Global.gameConfig.login_url, this.onHttpInitSucc, this.onHttpInitFail, this);
        };
        ServerProxy.prototype.loginOut = function (kickoutMssage) {
            uniLib.Plat.instance.logout(kickoutMssage);
        };
        /**
         * http平台登录完成
         */
        ServerProxy.prototype.onHttpInitSucc = function (obj) {
            uniLib.UIMgr.instance.showProcessBar(null, 95, 100, "正在验证登录信息...", "", true);
            uniLib.Plat.instance.initSocket(this.onSockInitSucc, this.onSockInitFail, this); //初始化平台socket
        };
        ServerProxy.prototype.onHttpInitFail = function (rev) {
            uniLib.Console.error("## onHttpInitFail ##");
            uniLib.Plat.instance.logout();
            return this.onConnectFail();
        };
        /**
         * socket连接完成
         */
        ServerProxy.prototype.onSockInitSucc = function () {
            this.onLoginServer();
        };
        ServerProxy.prototype.sendData = function (obj) {
            uniLib.Plat.instance.tcpSend(obj);
        };
        ServerProxy.prototype.onSockInitFail = function () {
            uniLib.Plat.instance.logout();
            return this.onConnectFail();
        };
        ServerProxy.prototype.onConnectFail = function () {
            uniLib.Console.error("请检查网络状况");
            return false;
        };
        ServerProxy.prototype.onRemove = function () {
            _super.prototype.onRemove.call(this);
        };
        ServerProxy.prototype.onLoginServer = function () {
            uniLib.UIMgr.instance.showProcessBar(null, 96, 100, "正在进入游戏服务器...", "", true);
            var login = {};
            login["do"] = "Cmd.UserInfoSynCmd_C";
            this.sendData(login);
        };
        ServerProxy.prototype.onLogin = function (msg) {
            this.initServer();
        };
        ServerProxy.NAME = "ServerProxy";
        return ServerProxy;
    }(uniLib.Proxy));
    uniLib.ServerProxy = ServerProxy;
    __reflect(ServerProxy.prototype, "uniLib.ServerProxy");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var PhysicsTool = (function () {
        // public static measureVertices(verticesList:number[][][]) : number[]
        // {
        //     let minX = 999999999;
        //     let minY = 999999999;
        //     let maxX = -999999999;
        //     let maxY = -999999999;
        //     for(let k = 0; k < verticesList.length; k++)
        //     {
        //         let vertices:number[][] = verticesList[k];
        //         for(let i = 0; i < vertices.length; i++)
        //         {
        //             let p = vertices[i];
        //             if(minX > p[0]) minX = p[0];
        //             if(minY > p[1]) minY = p[1];
        //             if(maxX < p[0]) maxX = p[0];
        //             if(maxY < p[1]) maxY = p[1];
        //         }
        //     }
        //     let width = maxX - minX;
        //     let height = maxY - minY;
        //     return [width, height];
        // }
        function PhysicsTool() {
            this.DEBUG_COLOR_D_SLEEP = 0x999999;
            this.DEBUG_COLOR_D_WAKE = 0xe5b2b2;
            this.DEBUG_COLOR_K = 0x7f7fe5;
            this.DEBUG_COLOR_S = 0x7fe57f;
        }
        Object.defineProperty(PhysicsTool, "instance", {
            get: function () {
                return PhysicsTool._instance;
            },
            set: function (value) {
                PhysicsTool._instance = value;
            },
            enumerable: true,
            configurable: true
        });
        PhysicsTool.init = function (debugLayer) {
            if (PhysicsTool._instance)
                return;
            PhysicsTool.AUTO_INCREMENT_BODY_ID = 0;
            PhysicsTool._instance = new PhysicsTool();
            PhysicsTool._instance.init(debugLayer);
            return PhysicsTool.world;
        };
        PhysicsTool.destroy = function () {
            if (PhysicsTool._instance) {
                PhysicsTool._instance.release();
            }
            PhysicsTool._instance = null;
        };
        Object.defineProperty(PhysicsTool, "world", {
            get: function () {
                return PhysicsTool.instance._world;
            },
            set: function (value) {
                PhysicsTool.instance._world = value;
            },
            enumerable: true,
            configurable: true
        });
        PhysicsTool.measureVertices = function (vertices) {
            var minX = 999999999;
            var minY = 999999999;
            var maxX = -999999999;
            var maxY = -999999999;
            for (var i = 0; i < vertices.length; i++) {
                var p = vertices[i];
                if (minX > p[0])
                    minX = p[0];
                if (minY > p[1])
                    minY = p[1];
                if (maxX < p[0])
                    maxX = p[0];
                if (maxY < p[1])
                    maxY = p[1];
            }
            var width = maxX - minX;
            var height = maxY - minY;
            return [minX, minY, width, height];
        };
        PhysicsTool.prototype.init = function (debugLayer) {
            this._world = new p2.World();
            this._world.gravity = [0, 9.82];
            this._world.sleepMode = p2.World.BODY_SLEEPING;
            if (uniLib.Global.isDebug) {
                this.debugSprite = new egret.Sprite();
                this.debugSprite.touchChildren = false;
                this.debugSprite.touchEnabled = false;
                if (null == debugLayer) {
                    debugLayer = egret.MainContext.instance.stage;
                }
                debugLayer.addChild(this.debugSprite);
            }
        };
        PhysicsTool.prototype.release = function () {
            if (this.debugSprite && this.debugSprite.parent) {
                this.debugSprite.parent.removeChild(this.debugSprite);
            }
            this.debugSprite = null;
            if (this._world) {
                var count = this._world.bodies.length;
                for (var i = 0; i < count; i++) {
                    var body = this._world.bodies[i];
                    if (body.displays && body.displays.length > 0) {
                        for (var j = 0; j < body.displays.length; j++) {
                            var display = body.displays[j];
                            if (display && display.parent) {
                                display.parent.removeChild(display);
                            }
                        }
                        body.displays = [];
                    }
                }
                this._world.clear();
            }
            this._world = null;
        };
        PhysicsTool.prototype.createBody = function (options) {
            PhysicsTool.AUTO_INCREMENT_BODY_ID++;
            var body = new p2.Body(options);
            body.id = PhysicsTool.AUTO_INCREMENT_BODY_ID;
            this._world.addBody(body);
            return body;
        };
        PhysicsTool.prototype.createPlanes = function (left, right, top, bottom) {
            var result = [null, null, null, null];
            if (null != left) {
                var plane = new p2.Plane();
                var body = this.createBody();
                body.position[0] = left;
                body.angle = -Math.PI / 2;
                body.addShape(plane);
                result[0] = body;
            }
            if (null != right) {
                var plane = new p2.Plane();
                var body = this.createBody();
                body.position[0] = right;
                body.angle = Math.PI / 2;
                body.addShape(plane);
                result[1] = body;
            }
            if (null != top) {
                var plane = new p2.Plane();
                var body = this.createBody();
                body.position[1] = top;
                body.angle = 0;
                body.addShape(plane);
                result[2] = body;
            }
            if (null != bottom) {
                var plane = new p2.Plane();
                var body = this.createBody();
                body.position[1] = bottom;
                body.angle = Math.PI;
                body.addShape(plane);
                result[3] = body;
            }
            return result;
        };
        PhysicsTool.prototype.createBoxBody = function (resName, container, options, defaultWidth, defaultHeight, anchor, touchEnabled) {
            if (touchEnabled === void 0) {
                touchEnabled = false;
            }
            if (null == anchor) {
                anchor = [0.5, 0.5];
            }
            if (anchor[0] < 0)
                anchor[0] = 0;
            else if (anchor[0] > 1)
                anchor[0] = 1;
            if (anchor[1] < 0)
                anchor[1] = 0;
            else if (anchor[1] > 1)
                anchor[1] = 1;
            var body = this.createBody(options);
            var display = null;
            var width = defaultWidth ? defaultWidth : 50;
            var height = defaultHeight ? defaultHeight : 50;
            if (container && resName && resName.length > 0) {
                var texture = RES.getRes(resName);
                if (texture) {
                    if (defaultWidth)
                        width = defaultWidth;
                    else
                        width = texture.textureWidth;
                    if (defaultHeight)
                        height = defaultHeight;
                    else
                        height = texture.textureHeight;
                    display = new egret.Bitmap(texture);
                    display.width = width;
                    display.height = height;
                    display.anchorOffsetX = display.width * anchor[0];
                    display.anchorOffsetY = display.height * anchor[1];
                    display.x = body.position[0];
                    display.y = body.position[1];
                    display.rotation = body.angle * 180 / Math.PI;
                    display.touchEnabled = touchEnabled;
                    display["bodyId"] = body.id;
                    container.addChild(display);
                }
            }
            var shape = new p2.Box({ width: width, height: height });
            body.displays = [];
            if (display)
                body.displays.push(display);
            body.addShape(shape);
            return body;
        };
        PhysicsTool.prototype.createCircleBody = function (resName, container, options, defaultRadius, anchor, touchEnabled) {
            if (touchEnabled === void 0) {
                touchEnabled = false;
            }
            if (null == anchor) {
                anchor = [0.5, 0.5];
            }
            if (anchor[0] < 0)
                anchor[0] = 0;
            else if (anchor[0] > 1)
                anchor[0] = 1;
            if (anchor[1] < 0)
                anchor[1] = 0;
            else if (anchor[1] > 1)
                anchor[1] = 1;
            var body = this.createBody(options);
            var display = null;
            var radius = defaultRadius ? defaultRadius : 25;
            if (container && resName && resName.length > 0) {
                var texture = RES.getRes(resName);
                if (texture) {
                    if (defaultRadius)
                        radius = defaultRadius;
                    else
                        radius = texture.textureWidth * 0.5;
                    display = new egret.Bitmap(texture);
                    display.width = texture.textureWidth; //radius * 2;
                    display.height = texture.textureHeight; //radius * 2;
                    display.anchorOffsetX = display.width * anchor[0];
                    display.anchorOffsetY = display.height * anchor[1];
                    display.x = body.position[0];
                    display.y = body.position[1];
                    display.rotation = body.angle * 180 / Math.PI;
                    display.touchEnabled = touchEnabled;
                    display["bodyId"] = body.id;
                    container.addChild(display);
                }
            }
            var shape = new p2.Circle({ radius: radius });
            body.displays = [];
            if (display)
                body.displays.push(display);
            body.addShape(shape);
            return body;
        };
        PhysicsTool.prototype.createCapsuleBody = function (resName, container, options, defaultRadius, defaultLength, anchor, touchEnabled) {
            if (touchEnabled === void 0) {
                touchEnabled = false;
            }
            if (null == anchor) {
                anchor = [0.5, 0.5];
            }
            if (anchor[0] < 0)
                anchor[0] = 0;
            else if (anchor[0] > 1)
                anchor[0] = 1;
            if (anchor[1] < 0)
                anchor[1] = 0;
            else if (anchor[1] > 1)
                anchor[1] = 1;
            var body = this.createBody(options);
            var display = null;
            var radius = defaultRadius ? defaultRadius : 25;
            var length = defaultLength ? defaultLength : 5;
            if (container && resName && resName.length > 0) {
                var texture = RES.getRes(resName);
                if (texture) {
                    if (defaultRadius)
                        radius = defaultRadius;
                    else
                        radius = texture.textureHeight;
                    if (defaultLength)
                        length = defaultLength;
                    else
                        length = texture.textureWidth * 0.8;
                    display = new egret.Bitmap(texture);
                    display.width = texture.textureWidth;
                    display.height = texture.textureHeight;
                    display.anchorOffsetX = display.width * anchor[0];
                    display.anchorOffsetY = display.height * anchor[1];
                    display.x = body.position[0];
                    display.y = body.position[1];
                    display.rotation = body.angle * 180 / Math.PI;
                    display.touchEnabled = touchEnabled;
                    display["bodyId"] = body.id;
                    container.addChild(display);
                }
            }
            var shape = new p2.Capsule({ length: length, radius: radius });
            body.displays = [];
            if (display)
                body.displays.push(display);
            body.addShape(shape);
            return body;
        };
        PhysicsTool.prototype.createConvexBody = function (vertices, keyPoint, resName, container, options, touchEnabled) {
            if (touchEnabled === void 0) {
                touchEnabled = false;
            }
            if (null == keyPoint) {
                var measure = PhysicsTool.measureVertices(vertices);
                var kpx = measure[0] + measure[2] * 0.5;
                var kpy = measure[1] + measure[3] * 0.5;
                keyPoint = [kpx, kpy];
            }
            var cloneVertices = [];
            for (var i = 0; i < vertices.length; i++) {
                var p = vertices[i];
                var x = p[0] - keyPoint[0];
                var y = p[1] - keyPoint[1];
                cloneVertices.push([x, y]);
            }
            if (cloneVertices.length <= 0)
                return null;
            var body = this.createBody(options);
            var shape = new p2.Convex({ vertices: cloneVertices });
            body.addShape(shape);
            var display = null;
            if (container && resName && resName.length > 0) {
                var texture = RES.getRes(resName);
                if (texture) {
                    display = new egret.Bitmap(texture);
                    display.width = texture.textureWidth;
                    display.height = texture.textureHeight;
                    display.anchorOffsetX = keyPoint[0];
                    display.anchorOffsetY = keyPoint[1];
                    display.x = body.position[0];
                    display.y = body.position[1];
                    display.rotation = body.angle * 180 / Math.PI;
                    display.touchEnabled = touchEnabled;
                    display["bodyId"] = body.id;
                    container.addChild(display);
                }
            }
            body.displays = [];
            if (display)
                body.displays.push(display);
            return body;
        };
        PhysicsTool.prototype.createConvexBodies = function (verticesList, keyPoint, resName, container, options, touchEnabled, touchSize) {
            if (touchEnabled === void 0) {
                touchEnabled = false;
            }
            if (touchSize === void 0) {
                touchSize = 0;
            }
            var body = this.createBody(options);
            for (var i = 0; i < verticesList.length; i++) {
                var vertices = verticesList[i];
                var cloneVertices = [];
                for (var i_1 = 0; i_1 < vertices.length; i_1++) {
                    var p = vertices[i_1];
                    var p0 = p[0];
                    var p1 = p[1];
                    var key0 = keyPoint[0];
                    var key1 = keyPoint[1];
                    var x = p0 - key0;
                    var y = p1 - key1;
                    cloneVertices.push([x, y]);
                }
                var shape = new p2.Convex({ vertices: cloneVertices });
                body.addShape(shape);
            }
            var keyPointX = keyPoint[0];
            var keyPointY = keyPoint[1];
            var display = null;
            // let touchRect:egret.DisplayObjectContainer = null;
            var touchRect = null;
            if (container && resName && resName.length > 0) {
                var texture = RES.getRes(resName);
                if (texture) {
                    display = new egret.Bitmap(texture);
                    display.width = texture.textureWidth;
                    display.height = texture.textureHeight;
                    display.anchorOffsetX = keyPointX;
                    display.anchorOffsetY = keyPointY;
                    display.x = body.position[0];
                    display.y = body.position[1];
                    display.rotation = body.angle * 180 / Math.PI;
                    display.touchEnabled = touchEnabled;
                    display["bodyId"] = body.id;
                    container.addChild(display);
                    if (touchEnabled && touchSize > 0) {
                        // touchRect = new egret.DisplayObjectContainer();
                        touchRect = new eui.Rect();
                        touchRect.alpha = 0;
                        touchRect.fillColor = 0xff0000;
                        touchRect.width = display.width + touchSize + touchSize;
                        touchRect.height = display.height + touchSize + touchSize;
                        touchRect.anchorOffsetX = display.anchorOffsetX + touchSize;
                        touchRect.anchorOffsetY = display.anchorOffsetY + touchSize;
                        touchRect.x = display.x;
                        touchRect.y = display.y;
                        touchRect.rotation = display.rotation;
                        touchRect.touchEnabled = touchEnabled;
                        touchRect.touchEnabled = display.touchEnabled;
                        touchRect["bodyId"] = body.id;
                        container.addChild(touchRect);
                    }
                }
            }
            body.displays = [];
            if (display)
                body.displays.push(display);
            if (touchRect)
                body.displays.push(touchRect);
            return body;
        };
        PhysicsTool.prototype.destroyBody = function (body) {
            if (null == body)
                return;
            if (null != body.displays) {
                for (var i = 0; i < body.displays.length; i++) {
                    var display = body.displays[i];
                    if (display && display.parent) {
                        egret.Tween.removeTweens(display);
                        display.parent.removeChild(display);
                    }
                }
                body.displays = [];
            }
            this._world.removeBody(body);
        };
        PhysicsTool.prototype.findBody = function (id) {
            var count = this._world.bodies.length;
            for (var i = 0; i < count; i++) {
                var boxBody = this._world.bodies[i];
                if (boxBody.id == id) {
                    return boxBody;
                }
            }
            return null;
        };
        PhysicsTool.prototype.update = function (dt) {
            if (null == this._world)
                return;
            this._world.step(dt);
            this.draw();
        };
        PhysicsTool.prototype.draw = function () {
            if (uniLib.Global.isDebug) {
                this.drawDebug();
            }
            var count = this._world.bodies.length;
            for (var i = 0; i < count; i++) {
                var body = this._world.bodies[i];
                if (body.displays && body.displays.length > 0) {
                    for (var k = 0; k < body.displays.length; k++) {
                        var display = body.displays[k];
                        if (display) {
                            var offset = display["offset"];
                            if (null == offset) {
                                offset = [0, 0];
                            }
                            display.x = body.position[0] + offset[0];
                            display.y = body.position[1] + offset[1];
                            display.rotation = body.angle * 180 / Math.PI;
                        }
                    }
                    // for (var j: number = 0; j < body.shapes.length; j++) 
                    // {
                    //     let shape: p2.Shape = body.shapes[j];
                    //     if (shape instanceof p2.Convex) 
                    //     {
                    //         let display: egret.DisplayObject = body.displays[0];
                    //         if(display && shape.vertices.length > 0)
                    //         {
                    //             let vertices:number[][] = [];
                    //             for(let k = 0; k < shape.vertices.length; k++)
                    //             {
                    //                 let worldPoint: number[] = new Array();
                    //                 body.toWorldFrame(worldPoint, shape.vertices[k]);
                    //                 vertices.push(worldPoint);
                    //             }
                    //             let measure = this.measureVertices(vertices, body.position);
                    //             display.anchorOffsetX = measure[0];
                    //             display.anchorOffsetY = measure[1];
                    //             display.x = body.position[0];
                    //             display.y = body.position[1];
                    //             display.rotation = 360 - (body.angle + shape.angle) * 180 / Math.PI;
                    //         }
                    //     }
                    //     else
                    //     {
                    //         let display: egret.DisplayObject = body.displays[0];
                    //         if(display)
                    //         {
                    //             display.x = body.position[0];
                    //             display.y = body.position[1];
                    //             display.rotation = 360 - (body.angle + shape.angle) * 180 / Math.PI;
                    //         }
                    //     }
                    // }
                }
            }
        };
        PhysicsTool.prototype.drawDebug = function () {
            if (null == this.debugSprite)
                return;
            this.debugSprite.graphics.clear();
            var l = this._world.bodies.length;
            for (var i = 0; i < l; i++) {
                var body = this._world.bodies[i];
                for (var j = 0; j < body.shapes.length; j++) {
                    var shape = body.shapes[j];
                    if (shape instanceof p2.Convex) {
                        this.drawDebugConvex(shape, body);
                    }
                    else if (shape instanceof p2.Circle) {
                        this.drawDebugCircle(shape, body);
                    }
                    else if (shape instanceof p2.Line) {
                        this.drawDebugLine(shape, body);
                    }
                    else if (shape instanceof p2.Particle) {
                        this.drawDebugParticle(shape, body);
                    }
                    else if (shape instanceof p2.Plane) {
                        this.drawDebugPlane(shape, body);
                    }
                    else if (shape instanceof p2.Capsule) {
                        this.drawDebugCapsule(shape, body);
                    }
                    else if (shape instanceof p2.Heightfield) {
                        this.drawDebugHeightfield(shape, body);
                    }
                }
            }
        };
        PhysicsTool.prototype.drawDebugCircle = function (shape, b) {
            var color = this.getDebugColor(b);
            var g = this.debugSprite.graphics;
            g.lineStyle(1, color);
            g.beginFill(color, 0.5);
            g.drawCircle(b.position[0], b.position[1], shape.radius);
            var edge = new Array();
            b.toWorldFrame(edge, [shape.radius, 0]);
            g.moveTo(b.position[0], b.position[1]);
            g.lineTo(edge[0], edge[1]);
            g.endFill();
        };
        PhysicsTool.prototype.drawDebugCapsule = function (shape, b) {
            var color = this.getDebugColor(b);
            var len = shape.length;
            var radius = shape.radius;
            var p1 = new Array(), p2 = new Array(), p3 = new Array(), p4 = new Array();
            var a1 = new Array(), a2 = new Array();
            b.toWorldFrame(p1, [-len / 2, -radius]);
            b.toWorldFrame(p2, [len / 2, -radius]);
            b.toWorldFrame(p3, [len / 2, radius]);
            b.toWorldFrame(p4, [-len / 2, radius]);
            b.toWorldFrame(a1, [len / 2, 0]);
            b.toWorldFrame(a2, [-len / 2, 0]);
            var g = this.debugSprite.graphics;
            g.lineStyle(1, color);
            g.beginFill(color, 0.5);
            g.drawCircle(a1[0], a1[1], radius);
            g.endFill();
            g.lineStyle(1, color);
            g.beginFill(color, 0.5);
            g.drawCircle(a2[0], a2[1], radius);
            g.endFill();
            g.lineStyle(1, color);
            g.beginFill(color, 0.5);
            g.moveTo(p1[0], p1[1]);
            g.lineTo(p2[0], p2[1]);
            g.lineTo(p3[0], p3[1]);
            g.lineTo(p4[0], p4[1]);
            g.endFill();
        };
        PhysicsTool.prototype.drawDebugLine = function (shape, b) {
            var color = this.getDebugColor(b);
            var len = shape.length;
            var p1 = new Array(), p2 = new Array();
            b.toWorldFrame(p1, [-len / 2, 0]);
            b.toWorldFrame(p2, [len / 2, 0]);
            var g = this.debugSprite.graphics;
            g.lineStyle(1, color);
            g.moveTo(p1[0], p1[1]);
            g.lineTo(p2[0], p2[1]);
            g.endFill();
        };
        PhysicsTool.prototype.drawDebugParticle = function (shape, b) {
            var color = this.getDebugColor(b);
            var g = this.debugSprite.graphics;
            g.lineStyle(1, color);
            g.beginFill(color, 0.5);
            g.drawCircle(b.position[0], b.position[1], 1);
            g.endFill();
            g.lineStyle(1, color);
            g.drawCircle(b.position[0], b.position[1], 5);
            g.endFill();
        };
        PhysicsTool.prototype.drawDebugConvex = function (shape, b) {
            var color = this.getDebugColor(b);
            var l = shape.vertices.length;
            var g = this.debugSprite.graphics;
            g.lineStyle(1, color);
            g.beginFill(color, 0.5);
            var worldPoint = new Array();
            b.toWorldFrame(worldPoint, shape.vertices[0]);
            g.moveTo(b.position[0], b.position[1]);
            g.lineTo(worldPoint[0], worldPoint[1]);
            for (var i = 1; i <= l; i++) {
                b.toWorldFrame(worldPoint, shape.vertices[i % l]);
                g.lineTo(worldPoint[0], worldPoint[1]);
            }
            g.endFill();
        };
        PhysicsTool.prototype.drawDebugPlane = function (shape, b) {
            var color = this.DEBUG_COLOR_D_SLEEP;
            var g = this.debugSprite.graphics;
            g.lineStyle(1, color);
            g.beginFill(color, 1);
            var start = new Array();
            var end = new Array();
            b.toWorldFrame(start, [-1280, 0]);
            g.moveTo(start[0], start[1]);
            b.toWorldFrame(end, [1280, 0]);
            g.lineTo(end[0], end[1]);
            b.toWorldFrame(end, [1280, -1280]);
            g.lineTo(end[0], end[1]);
            b.toWorldFrame(end, [-1280, -1280]);
            g.lineTo(end[0], end[1]);
            b.toWorldFrame(end, [-1280, -0]);
            g.lineTo(end[0], end[1]);
            g.endFill();
        };
        PhysicsTool.prototype.drawDebugHeightfield = function (shape, b) {
            var color = this.getDebugColor(b);
            var heights = shape.heights;
            var len = heights.length;
            var elementWidth = shape.elementWidth;
            if (len > 0) {
                //支持复合刚体
                var x = shape.position[0];
                var y = shape.position[1];
                var p = [];
                var initP = [];
                var initX = 0;
                var g = this.debugSprite.graphics;
                g.lineStyle(1, color);
                g.beginFill(color, 0.5);
                //底部的左侧起点
                b.toWorldFrame(initP, [x + initX, y - 100]);
                g.moveTo(initP[0], initP[1]);
                //遍历上部的每个点
                for (var i = 0; i < len; i++) {
                    var tmpY = heights[i];
                    b.toWorldFrame(p, [x + initX + i * elementWidth, y + tmpY]);
                    g.lineTo(p[0], p[1]);
                }
                //底部右侧的最后一个点
                b.toWorldFrame(p, [x + initX + len * elementWidth, y - 100]);
                g.lineTo(p[0], p[1]);
                //填充形成闭合的块
                g.endFill();
            }
        };
        PhysicsTool.prototype.getDebugColor = function (b) {
            var color = this.DEBUG_COLOR_D_SLEEP;
            if (b.type == p2.Body.KINEMATIC) {
                color = this.DEBUG_COLOR_K;
            }
            else if (b.type == p2.Body.STATIC) {
                color = this.DEBUG_COLOR_S;
            }
            else if (b.sleepState == p2.Body.AWAKE) {
                color = this.DEBUG_COLOR_D_WAKE;
            }
            return color;
        };
        PhysicsTool._instance = null;
        PhysicsTool.AUTO_INCREMENT_BODY_ID = 0;
        return PhysicsTool;
    }());
    uniLib.PhysicsTool = PhysicsTool;
    __reflect(PhysicsTool.prototype, "uniLib.PhysicsTool");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var NativeObject = (function () {
        function NativeObject() {
        }
        return NativeObject;
    }());
    uniLib.NativeObject = NativeObject;
    __reflect(NativeObject.prototype, "uniLib.NativeObject");
    var NativeGameSdk = (function () {
        function NativeGameSdk() {
        }
        //-------------------------------------------------------------------------
        NativeGameSdk.callNative = function (data) {
            egret.ExternalInterface.call(NativeGameSdk.SENDTONATIVE, JSON.stringify(data));
        };
        //-------------------------------------------------------------------------
        NativeGameSdk.onNativeMessage = function (value) {
            var msg = null;
            if (typeof (value) == "string") {
                msg = JSON.parse(value);
            }
            else {
                msg = value;
            }
            if (msg.cmd) {
                if (this._callBacks[msg.cmd]) {
                    if (this._callBacks[msg.cmd][1] && this._callBacks[msg.cmd][1] != null) {
                        this._callBacks[msg.cmd][0].call(this._callBacks[msg.cmd][1], msg);
                    }
                    else {
                        if (this._callBacks[msg.cmd][0])
                            this._callBacks[msg.cmd][0](msg);
                    }
                }
            }
        };
        //-------------------------------------------------------------------------
        NativeGameSdk.init = function (callback, thisObj) {
            if (this.isInited)
                return;
            this.isInited = true;
            egret.ExternalInterface.addCallback(NativeGameSdk.SENDTOJS, function (message) {
                uniLib.Console.log("message form native : " + message);
                NativeGameSdk.onNativeMessage(message);
            });
            var data = new NativeObject();
            data.cmd = NativeGameSdk.INIT;
            NativeGameSdk.callNative(data);
        };
        //-------------------------------------------------------------------------
        NativeGameSdk.login = function (callback, thisObj, loginData) {
            if (callback) {
                this._callBacks[NativeGameSdk.LOGIN] = [callback, thisObj];
            }
            var ret = new NativeObject();
            ret.cmd = NativeGameSdk.LOGIN;
            ret.code = 0;
            ret.data = loginData;
            // ret.data.platid = 0;
            NativeGameSdk.callNative(ret);
        };
        //-------------------------------------------------------------------------
        NativeGameSdk.logout = function () {
            var data = new NativeObject();
            data.cmd = NativeGameSdk.LOGOUT;
            NativeGameSdk.callNative(data);
        };
        //-------------------------------------------------------------------------
        NativeGameSdk.exit = function () {
            var data = new NativeObject();
            data.cmd = NativeGameSdk.EXITGAME;
            NativeGameSdk.callNative(data);
        };
        //-------------------------------------------------------------------------
        NativeGameSdk.getNaviveBoard = function (callback, thisObj) {
            if (callback && callback != null) {
                this._callBacks[this.GETNATIVEBOARD] = [callback, thisObj];
            }
            var msg = new NativeObject();
            msg.cmd = NativeGameSdk.GETNATIVEBOARD;
            NativeGameSdk.callNative(msg);
        };
        //-------------------------------------------------------------------------
        NativeGameSdk.nativeCopyStr = function (str) {
            var msg = new NativeObject();
            msg.cmd = NativeGameSdk.NATIVECOPY;
            msg.data = {};
            msg.data.copyStr = str;
            NativeGameSdk.callNative(msg);
        };
        //-------------------------------------------------------------------------
        NativeGameSdk.openWeb = function (webUrl) {
            var msg = new NativeObject();
            msg.cmd = NativeGameSdk.OPENWEB;
            msg.data = {};
            msg.data.webUrl = webUrl;
            msg.data.model = 0;
            NativeGameSdk.callNative(msg);
        };
        //-------------------------------------------------------------------------
        // 显示插页广告
        //-------------------------------------------------------------------------
        NativeGameSdk.showInterstitialAd = function (action, callback, thisObj) {
            if (callback && callback != null) {
                this._callBacks[this.CLOSE_INTERSTITIALAD] = [callback, thisObj];
            }
            var msg = new NativeObject();
            msg.cmd = NativeGameSdk.SHOW_INTERSTITIALAD;
            msg["action"] = action;
            NativeGameSdk.callNative(msg);
        };
        NativeGameSdk.SENDTONATIVE = "sendToNative";
        NativeGameSdk.SENDTOJS = "sendToJs";
        NativeGameSdk.INIT = "init";
        NativeGameSdk.LOGIN = "login";
        NativeGameSdk.LOGOUT = "logout";
        NativeGameSdk.SHARE = "share";
        NativeGameSdk.EXITGAME = "exitGame";
        NativeGameSdk.OPENWEB = "openWeb";
        NativeGameSdk.NATIVECOPY = "nativeCopy";
        NativeGameSdk.GETNATIVEBOARD = "getNativeBoard";
        NativeGameSdk.NETSTATE = "netState";
        NativeGameSdk.SHOW_INTERSTITIALAD = "showInterstitialAd";
        NativeGameSdk.CLOSE_INTERSTITIALAD = "closeInterstitialAd";
        //-------------------------------------------------------------------------
        NativeGameSdk._callBacks = new Array();
        NativeGameSdk.isInited = false;
        return NativeGameSdk;
    }());
    uniLib.NativeGameSdk = NativeGameSdk;
    __reflect(NativeGameSdk.prototype, "uniLib.NativeGameSdk");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var NativePlatform = (function () {
        function NativePlatform() {
        }
        //---------------------------------------------------------------------------------------------------
        // 平台初始化
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.init = function (callback, thisObj) {
            console.log("NativePlatform.init");
            uniLib.NativeGameSdk.init(callback, thisObj);
        };
        //---------------------------------------------------------------------------------------------------
        // 平台登陆
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.login = function (userData, callback, thisObj) {
            console.log("NativePlatform.login");
        };
        //---------------------------------------------------------------------------------------------------
        // 平台登出
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.logout = function (callback, thisObj) {
            console.log("NativePlatform.logout");
        };
        //---------------------------------------------------------------------------------------------------
        // 打开系统web页面
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.openWeb = function (webUrl) {
            console.log("NativePlatform.openWeb", webUrl);
        };
        //---------------------------------------------------------------------------------------------------
        // 微信平台 自动刷banner，为了提高曝光量，减少点击率，防止被封杀
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.showAutoBanner = function (callback, thisObj) { };
        //---------------------------------------------------------------------------------------------------
        // 显示横幅广告
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.showBannerAdvertisement = function (userData, callback, thisObj) {
            console.log("NativePlatform.showBannerAdvertisement");
        };
        //---------------------------------------------------------------------------------------------------
        // 隐藏横幅广告
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.hideBannerAdvertisement = function (userData) {
            console.log("NativePlatform.hideBannerAdvertisement");
        };
        //---------------------------------------------------------------------------------------------------
        // 显示插页广告
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.showInterstitialAdvertisement = function (userData, callback, thisObj) {
            console.log("NativePlatform.showInterstitialAdvertisement");
        };
        //---------------------------------------------------------------------------------------------------
        // 显示原生广告
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.showNativeAdvertisement = function (userData, callback, thisObj) {
        };
        //---------------------------------------------------------------------------------------------------
        // 显示视频广告
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.showVideoAdvertisement = function (userData, callback, thisObj) {
            console.log("NativePlatform.showVideoAdvertisement");
        };
        //---------------------------------------------------------------------------------------------------
        // 显示App盒子广告
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.showAppBoxAdvertisement = function (userData, callback, thisObj) {
            console.log("NativePlatform.showAppBoxAdvertisement");
        };
        //---------------------------------------------------------------------------------------------------
        // 热更资源接口
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.downloadResource = function (url, name, callback, callbackProgress, thisObj) {
            if (callback)
                callback.call(thisObj, true);
        };
        //---------------------------------------------------------------------------------------------------
        // 清空资源缓存
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.clearResCache = function () {
        };
        //---------------------------------------------------------------------------------------------------
        // 退出应用程序
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.exitApp = function () {
            console.log("NativePlatform.exitApp");
        };
        //---------------------------------------------------------------------------------------------------
        // 自定义通用接口
        //---------------------------------------------------------------------------------------------------
        NativePlatform.prototype.customInterface = function (funcName, userData, callback, thisObj) {
            if (callback)
                callback.call(thisObj);
        };
        return NativePlatform;
    }());
    uniLib.NativePlatform = NativePlatform;
    __reflect(NativePlatform.prototype, "uniLib.NativePlatform", ["uniLib.Platform"]);
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var WebPlatform = (function () {
        function WebPlatform() {
        }
        //---------------------------------------------------------------------------------------------------
        // 平台初始化
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.init = function (callback, thisObj) {
            console.log("WebPlatform.init");
            var cmd = {};
            if (callback)
                callback.call(thisObj, cmd);
        };
        //---------------------------------------------------------------------------------------------------
        // 平台登陆
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.login = function (userData, callback, thisObj) {
            console.log("WebPlatform.login");
        };
        //---------------------------------------------------------------------------------------------------
        // 平台登出
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.logout = function (callback, thisObj) {
            console.log("WebPlatform.logout");
        };
        //---------------------------------------------------------------------------------------------------
        // 打开系统web页面
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.openWeb = function (webUrl) {
            console.log("WebPlatform.openWeb", webUrl);
        };
        //---------------------------------------------------------------------------------------------------
        // 微信平台 自动刷banner，为了提高曝光量，减少点击率，防止被封杀
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.showAutoBanner = function (callback, thisObj) { };
        //---------------------------------------------------------------------------------------------------
        // 显示横幅广告
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.showBannerAdvertisement = function (userData, callback, thisObj) {
            console.log("WebPlatform.showBannerAdvertisement");
        };
        //---------------------------------------------------------------------------------------------------
        // 隐藏横幅广告
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.hideBannerAdvertisement = function (userData) {
            console.log("WebPlatform.hideBannerAdvertisement");
        };
        //---------------------------------------------------------------------------------------------------
        // 显示插页广告
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.showInterstitialAdvertisement = function (userData, callback, thisObj) {
            console.log("WebPlatform.showInterstitialAdvertisement");
        };
        //---------------------------------------------------------------------------------------------------
        // 显示原生广告
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.showNativeAdvertisement = function (userData, callback, thisObj) {
            console.log("WebPlatform.showNativeAdvertisement");
        };
        //---------------------------------------------------------------------------------------------------
        // 显示视频广告
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.showVideoAdvertisement = function (userData, callback, thisObj) {
            console.log("WebPlatform.showVideoAdvertisement");
        };
        //---------------------------------------------------------------------------------------------------
        // 显示App盒子广告
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.showAppBoxAdvertisement = function (userData, callback, thisObj) {
            console.log("WebPlatform.showAppBoxAdvertisement");
        };
        //---------------------------------------------------------------------------------------------------
        // 热更资源接口
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.downloadResource = function (url, name, callback, callbackProgress, thisObj) {
            if (callback)
                callback.call(thisObj, true);
        };
        //---------------------------------------------------------------------------------------------------
        // 清空资源缓存
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.clearResCache = function () {
        };
        //---------------------------------------------------------------------------------------------------
        // 退出应用程序
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.exitApp = function () {
            console.log("WebPlatform.exitApp");
        };
        //---------------------------------------------------------------------------------------------------
        // 自定义通用接口
        //---------------------------------------------------------------------------------------------------
        WebPlatform.prototype.customInterface = function (funcName, userData, callback, thisObj) {
            // if(callback) callback.call(thisObj);
            console.log("WebPlatform.customInterface", funcName, userData);
        };
        return WebPlatform;
    }());
    uniLib.WebPlatform = WebPlatform;
    __reflect(WebPlatform.prototype, "uniLib.WebPlatform", ["uniLib.Platform"]);
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var BrowersUtils = (function () {
        function BrowersUtils() {
        }
        BrowersUtils.reload = function () {
            window.location.reload();
        };
        BrowersUtils.redirect = function (url) {
            location.href = url;
        };
        /**
         * 是否在微信中打开
         */
        BrowersUtils.isWechat = function () {
            var agent = navigator.userAgent.toString();
            if (agent.match(/MicroMessenger/i) != null) {
                return "MicroMessenger" == agent.match(/MicroMessenger/i).toString() ? true : false;
            }
            return false;
        };
        BrowersUtils.isAndroid = function () {
            var agent = navigator.userAgent.toString();
            if (agent.indexOf('Android') > -1 || agent.indexOf('Linux') > -1) {
                return true;
            }
            return false;
        };
        BrowersUtils.GetRequest = function (name, str) {
            var value = null;
            var search;
            if (str != null && str != "") {
                search = str;
            }
            else {
                search = location.search;
            }
            var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "gi");
            var matcher = pattern.exec(search);
            if (null != matcher) {
                try {
                    value = decodeURIComponent(decodeURIComponent(matcher[1]));
                }
                catch (e) {
                    try {
                        value = decodeURIComponent(matcher[1]);
                    }
                    catch (e) {
                        value = matcher[1];
                    }
                }
            }
            return value;
        };
        BrowersUtils.GetRequests = function (s) {
            var str = null;
            if (s) {
                str = s;
            }
            else {
                str = location.search;
            }
            var theRequest = new Object();
            if (str) {
                if (str.indexOf("?") == 0) {
                    str = str.substr(1);
                }
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        };
        return BrowersUtils;
    }());
    uniLib.BrowersUtils = BrowersUtils;
    __reflect(BrowersUtils.prototype, "uniLib.BrowersUtils");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var LOGLEVEL;
    (function (LOGLEVEL) {
        LOGLEVEL[LOGLEVEL["DEBUG"] = 0] = "DEBUG";
        LOGLEVEL[LOGLEVEL["INFO"] = 1] = "INFO";
        LOGLEVEL[LOGLEVEL["WARN"] = 2] = "WARN";
        LOGLEVEL[LOGLEVEL["ERROR"] = 3] = "ERROR";
        LOGLEVEL[LOGLEVEL["OFF"] = 4] = "OFF";
    })(LOGLEVEL = uniLib.LOGLEVEL || (uniLib.LOGLEVEL = {}));
    var Console = (function () {
        function Console() {
        }
        Console.setLogLevel = function (level) {
            if (level === void 0) {
                level = LOGLEVEL.OFF;
            }
            if (this.isDevMode) {
                this.LogLevel = LOGLEVEL.DEBUG;
            }
            else {
                this.LogLevel = level;
            }
            if (this.LogLevel <= LOGLEVEL.DEBUG) {
                egret.Logger.logLevel = egret.Logger.ALL;
            }
            else if (this.LogLevel <= LOGLEVEL.INFO) {
                egret.Logger.logLevel = egret.Logger.INFO;
            }
            else if (this.LogLevel <= LOGLEVEL.WARN) {
                egret.Logger.logLevel = egret.Logger.WARN;
            }
            else if (this.LogLevel <= LOGLEVEL.ERROR) {
                egret.Logger.logLevel = egret.Logger.ERROR;
            }
            else {
                egret.Logger.logLevel = egret.Logger.OFF;
            }
        };
        Console.init = function (bDevMode, logLevel) {
            this.isDevMode = bDevMode;
            this.setLogLevel(logLevel);
        };
        Console.log = function (message) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var optionalParams = [];
            for (var i = 1; i < arguments.length; i++) {
                optionalParams[i - 1] = arguments[i];
            }
            var level = this.LogLevel;
            if (level <= LOGLEVEL.DEBUG) {
                if (message == null || message == undefined || (typeof (message) == "string" && message == "")) {
                    this.error("日志不能为空,请加标识头!");
                }
                console.log(new Date().toTimeString().split(" ")[0], "LOG", message, optionalParams);
            }
        };
        Console.debug = function (message) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var optionalParams = [];
            for (var i = 1; i < arguments.length; i++) {
                optionalParams[i - 1] = arguments[i];
            }
            var level = this.LogLevel;
            if (level <= LOGLEVEL.DEBUG) {
                if (message == null || message == undefined || (typeof (message) == "string" && message == "")) {
                    this.error("日志不能为空,请加标识头");
                }
                console.debug(new Date().toTimeString().split(" ")[0], "DEBUG", message, optionalParams);
            }
        };
        Console.info = function (message) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var optionalParams = [];
            for (var i = 1; i < arguments.length; i++) {
                optionalParams[i - 1] = arguments[i];
            }
            var level = this.LogLevel;
            if (level <= LOGLEVEL.INFO) {
                if (message == null || message == undefined || (typeof (message) == "string" && message == "")) {
                    this.error("日志不能为空,请加标识头");
                }
                console.info(new Date().toTimeString().split(" ")[0], "INFO", message, optionalParams);
            }
        };
        Console.warn = function (message) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var optionalParams = [];
            for (var i = 1; i < arguments.length; i++) {
                optionalParams[i - 1] = arguments[i];
            }
            var level = this.LogLevel;
            if (level <= LOGLEVEL.WARN) {
                if (message == null || message == undefined || (typeof (message) == "string" && message == "")) {
                    this.error("日志不能为空,请加标识头");
                }
                console.warn(new Date().toTimeString().split(" ")[0], "WARN", message, optionalParams);
            }
        };
        Console.error = function (message) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var optionalParams = [];
            for (var i = 1; i < arguments.length; i++) {
                optionalParams[i - 1] = arguments[i];
            }
            var level = this.LogLevel;
            if (level <= LOGLEVEL.ERROR) {
                if (message == null || message == undefined || (typeof (message) == "string" && message == "")) {
                    this.error("日志不能为空,请加标识头");
                }
                console.error(new Date().toTimeString().split(" ")[0], "ERROR", message, optionalParams);
            }
        };
        Console.isDevMode = false;
        return Console;
    }());
    uniLib.Console = Console;
    __reflect(Console.prototype, "uniLib.Console");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    /**
     * 计算类
    */
    var MathUtil = (function () {
        function MathUtil() {
        }
        MathUtil.pow = function (n) {
            if (n === void 0) { n = 0; }
            return n * n;
        };
        MathUtil.vectorRotation = function (p, n) {
            return new egret.Point(Math.cos(n) * Math.sqrt(p.x * p.x + p.y * p.y), Math.sin(n) * Math.sqrt(p.x * p.x + p.y * p.y));
        };
        MathUtil.disTest = function (p1, n1, p2, n2) {
            if (n2 === void 0) { n2 = 0; }
            return MathUtil.pow(p1.x - p2.x) + MathUtil.pow(p1.y - p2.y) <= MathUtil.pow(n1 + n2);
        };
        /**
         * 两个整数间随机随机数
         * @min: 最小数
         * @max: 最大数
         */
        MathUtil.random = function (min, max) {
            return Math.round(Math.random() * (max - min) + min);
        };
        /**
        * 两个整数间随机随机数,包含min和max
        * @min: 最小数
        * @max: 最大数
        */
        MathUtil.RandomNumBoth = function (Min, Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            var num = Min + Math.round(Rand * Range); //四舍五入
            return num;
        };
        /**
         * 从probList概率表中抽取一个概率返回抽中的probList索引
         */
        MathUtil.randomProbability = function (probList) {
            if (null == probList)
                probList = [];
            var sumProb = 0;
            for (var i = 0; i < probList.length; i++) {
                sumProb += probList[i];
            }
            for (var i = 0; i < probList.length; i++) {
                var randomValue = uniLib.MathUtil.RandomNumBoth(0, sumProb);
                if (randomValue < probList[i]) {
                    return i;
                }
                else {
                    sumProb = sumProb - probList[i];
                }
            }
            var maxProbIndex = -1;
            var maxProbValue = 0;
            for (var i = 0; i < probList.length; i++) {
                if (maxProbValue < probList[i]) {
                    maxProbValue = probList[i];
                    maxProbIndex = i;
                }
            }
            return maxProbIndex;
        };
        //----------------------------------------------------------------
        // 随机打乱数组
        //----------------------------------------------------------------
        MathUtil.randArray = function (array) {
            for (var i = 0; i < array.length; i++) {
                var iRand = parseInt((array.length * Math.random()).toString());
                var temp = array[i];
                array[i] = array[iRand];
                array[iRand] = temp;
            }
            return array;
        };
        /**
         * 检测一个点是否在圆内
         * centerX centerY radius 圆心以及半径
         * x y需要判断的x y 坐标
         */
        MathUtil.pointIsInRound = function (centerX, centerY, radius, x, y) {
            return MathUtil.pow(centerX - x) + MathUtil.pow(centerY - y) < MathUtil.pow(radius);
        };
        /**
         * 二分法从数组中找数据 indexOf
         */
        MathUtil.binary = function (find, arr, low, high) {
            if (low <= high) {
                if (arr[low] == find)
                    return low;
                if (arr[high] == find)
                    return high;
                var mid = Math.ceil((high + low) / 2);
                if (arr[mid] == find) {
                    return mid;
                }
                else if (arr[mid] > find) {
                    return MathUtil.binary(find, arr, low, mid - 1);
                }
                else {
                    return MathUtil.binary(find, arr, mid + 1, high);
                }
            }
            return -1;
        };
        /**
        * 获取字符串实际长度
        */
        MathUtil.getStrRealLength = function (str) {
            var jmz = { GetLength: null };
            jmz.GetLength = function (str) {
                return Number(str.replace(/[\u0391-\uFFE5]/g, "aa").length); //先把中文替换成两个字节的英文，在计算长度
            };
            return jmz.GetLength(str);
        };
        return MathUtil;
    }());
    uniLib.MathUtil = MathUtil;
    __reflect(MathUtil.prototype, "uniLib.MathUtil");
})(uniLib || (uniLib = {}));
var md5 = (function () {
    function md5() {
        this.hexcase = 0;
        this.b64pad = "";
    }
    /*
     * These are the privates you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    md5.prototype.hex_md5 = function (s) { return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s))); };
    md5.prototype.b64_md5 = function (s) { return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(s))); };
    md5.prototype.any_md5 = function (s, e) { return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(s)), e); };
    md5.prototype.hex_hmac_md5 = function (k, d) { return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
    md5.prototype.b64_hmac_md5 = function (k, d) { return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
    md5.prototype.any_hmac_md5 = function (k, d, e) { return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e); };
    /*
     * Perform a simple self-test to see if the VM is working
     */
    md5.prototype.md5_vm_test = function () { return this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"; };
    /*
     * Calculate the MD5 of a raw string
     */
    md5.prototype.rstr_md5 = function (s) { return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8)); };
    /*
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    md5.prototype.rstr_hmac_md5 = function (key, data) {
        var bkey = this.rstr2binl(key);
        if (bkey.length > 16)
            bkey = this.binl_md5(bkey, key.length * 8);
        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        var hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
        return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
    };
    /*
     * Convert a raw string to a hex string
     */
    md5.prototype.rstr2hex = function (input) {
        try {
            this.hexcase;
        }
        catch (e) {
            this.hexcase = 0;
        }
        var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var output = "";
        var x;
        for (var i = 0; i < input.length; i++) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F)
                + hex_tab.charAt(x & 0x0F);
        }
        return output;
    };
    /*
     * Convert a raw string to a base-64 string
     */
    md5.prototype.rstr2b64 = function (input) {
        try {
            this.b64pad;
        }
        catch (e) {
            this.b64pad = '';
        }
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var output = "";
        var len = input.length;
        for (var i = 0; i < len; i += 3) {
            var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > input.length * 8)
                    output += this.b64pad;
                else
                    output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
            }
        }
        return output;
    };
    /*
     * Convert a raw string to an arbitrary string encoding
     */
    md5.prototype.rstr2any = function (input, encoding) {
        var divisor = encoding.length;
        var i, j, q, x, quotient;
        /* Convert to an array of 16-bit big-endian values, forming the dividend */
        var dividend = Array(Math.ceil(input.length / 2));
        for (i = 0; i < dividend.length; i++) {
            dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
        }
        /*
         * Repeatedly perform a long division. The binary array forms the dividend,
         * the length of the encoding is the divisor. Once computed, the quotient
         * forms the dividend for the next step. All remainders are stored for later
         * use.
         */
        var full_length = Math.ceil(input.length * 8 /
            (Math.log(encoding.length) / Math.log(2)));
        var remainders = Array(full_length);
        for (j = 0; j < full_length; j++) {
            quotient = Array();
            x = 0;
            for (i = 0; i < dividend.length; i++) {
                x = (x << 16) + dividend[i];
                q = Math.floor(x / divisor);
                x -= q * divisor;
                if (quotient.length > 0 || q > 0)
                    quotient[quotient.length] = q;
            }
            remainders[j] = x;
            dividend = quotient;
        }
        /* Convert the remainders to the output string */
        var output = "";
        for (i = remainders.length - 1; i >= 0; i--)
            output += encoding.charAt(remainders[i]);
        return output;
    };
    /*
     * Encode a string as utf-8.
     * For efficiency, this assumes the input is valid utf-16.
     */
    md5.prototype.str2rstr_utf8 = function (input) {
        var output = "";
        var i = -1;
        var x, y;
        while (++i < input.length) {
            /* Decode utf-16 surrogate pairs */
            x = input.charCodeAt(i);
            y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
            if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                i++;
            }
            /* Encode output as utf-8 */
            if (x <= 0x7F)
                output += String.fromCharCode(x);
            else if (x <= 0x7FF)
                output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
            else if (x <= 0xFFFF)
                output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
            else if (x <= 0x1FFFFF)
                output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        }
        return output;
    };
    /*
     * Encode a string as utf-16
     */
    md5.prototype.str2rstr_utf16le = function (input) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
        return output;
    };
    md5.prototype.str2rstr_utf16be = function (input) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
        return output;
    };
    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    md5.prototype.rstr2binl = function (input) {
        var output = Array(input.length >> 2);
        for (var i = 0; i < output.length; i++)
            output[i] = 0;
        for (var i = 0; i < input.length * 8; i += 8)
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        return output;
    };
    /*
     * Convert an array of little-endian words to a string
     */
    md5.prototype.binl2rstr = function (input) {
        var output = "";
        for (var i = 0; i < input.length * 32; i += 8)
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        return output;
    };
    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    md5.prototype.binl_md5 = function (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
        }
        return [a, b, c, d];
    };
    /*
     * These privates implement the four basic operations the algorithm uses.
     */
    md5.prototype.md5_cmn = function (q, a, b, x, s, t) {
        return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
    };
    md5.prototype.md5_ff = function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    };
    md5.prototype.md5_gg = function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    };
    md5.prototype.md5_hh = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    };
    md5.prototype.md5_ii = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    };
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    md5.prototype.safe_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };
    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    md5.prototype.bit_rol = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };
    return md5;
}());
__reflect(md5.prototype, "md5");
var uniLib;
(function (uniLib) {
    /**
     * 屏幕工具类
     */
    var ScreenUtils = (function () {
        function ScreenUtils() {
        }
        ScreenUtils.init = function (scale) {
            this.scaleMode = scale;
            if (egret.MainContext.instance.stage.orientation == egret.OrientationMode.LANDSCAPE || egret.MainContext.instance.stage.orientation == egret.OrientationMode.LANDSCAPE_FLIPPED) {
                this.landscape = true;
            }
            else {
                this.landscape = false;
            }
            uniLib.Global.screenWidth = egret.MainContext.instance.stage.stageWidth;
            uniLib.Global.screenHeight = egret.MainContext.instance.stage.stageHeight;
            egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onResizeNotify, this);
            this.resetScaleMode();
            this.scaleFactor = uniLib.Global.screenHeight / uniLib.Global.designHeight;
        };
        ScreenUtils.onResizeNotify = function () {
            uniLib.Global.screenWidth = egret.MainContext.instance.stage.stageWidth;
            uniLib.Global.screenHeight = egret.MainContext.instance.stage.stageHeight;
            this.scaleFactor = uniLib.Global.screenHeight / uniLib.Global.designHeight;
            if (uniLib.SceneManager.instance.currentScene && uniLib.SceneManager.instance.currentScene.resize) {
                uniLib.SceneManager.instance.currentScene.resize();
            }
        };
        ScreenUtils.resetScaleMode = function () {
            if (this.scaleMode) {
                egret.MainContext.instance.stage.scaleMode = this.scaleMode;
            }
            else {
                if (egret.Capabilities.isMobile) {
                    egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
                }
                else {
                    egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
                }
            }
        };
        return ScreenUtils;
    }());
    uniLib.ScreenUtils = ScreenUtils;
    __reflect(ScreenUtils.prototype, "uniLib.ScreenUtils");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var ShakeTool = (function () {
        function ShakeTool() {
            this.checkForMinimumValues = true;
            this.minShakeValue = 0.001;
            this.minRotationValue = 0.001;
        }
        Object.defineProperty(ShakeTool, "instance", {
            //------------------------------------------------------------------------------
            get: function () {
                if (null == ShakeTool._instance) {
                    ShakeTool._instance = new ShakeTool();
                }
                return ShakeTool._instance;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 屏幕震动
         * @param camera 震动对象
         * @param numberOfShakes 震动次数
         * @param seed   x,y轴的震动系数[-1,1]
         * @param shakeAmount  x,y轴的震动量级
         * @param rotationAmount  旋转量级  如果小于0表示:不旋转
         * @param distance   震动x.y轴的最大偏移量
         * @param speed 如果速度越快，则振幅越剧烈
         * @param decay 振幅的递减系数
         * @param endCallBack 结束回调
         *
         */
        ShakeTool.prototype.shakeScreen = function (camera, numberOfShakes, seed, shakeAmount, rotationAmount, distance, speed, decay) {
            camera.x = 0;
            camera.y = 0;
            // 震动次数
            if (null == numberOfShakes)
                numberOfShakes = 2;
            //x,y轴的震动系数[-1,1]
            if (null == seed)
                seed = new egret.Point(0.5, 0.5);
            //x,y轴的震动量级
            if (null == shakeAmount)
                shakeAmount = new egret.Point(1, 1);
            //旋转量级 
            if (null == rotationAmount)
                rotationAmount = 0;
            //震动x.y轴的最大偏移量
            if (null == distance)
                distance = 10;
            //如果速度越快，则振幅越剧烈
            if (null == speed)
                speed = 50;
            //振幅的递减系数
            if (null == decay)
                decay = 0.1;
            ShakeTool.instance.doShake_Internal(camera, numberOfShakes, seed, shakeAmount, rotationAmount, distance, speed, decay);
        };
        /**
         * 屏幕震动
         * @param camera 震动对象
         * @param numberOfShakes 震动次数
         * @param seed   x,y轴的震动系数[-1,1]
         * @param shakeAmount  x,y轴的震动量级
         * @param rotationAmount  旋转量级  如果小于0表示:不旋转
         * @param distance   震动x.y轴的最大偏移量
         * @param speed 如果速度越快，则振幅越剧烈
         * @param decay 振幅的递减系数
         * @param endCallBack 结束回调
         *
         */
        ShakeTool.prototype.doShake_Internal = function (cam, numberOfShakes, seed, shakeAmount, rotationAmount, distance, speed, decay, endCallBack) {
            var _this = this;
            if (endCallBack === void 0) { endCallBack = null; }
            if (cam == null)
                return;
            var defaultPointY = cam.x;
            var defaultPointX = cam.y;
            var defaultRotation = cam.rotation;
            // Set random values
            var mod1 = seed.x > 0.5 ? 1 : -1;
            var mod2 = seed.y > 0.5 ? 1 : -1;
            var currentShakes = numberOfShakes;
            var shakeDistance = distance;
            var shakePosition;
            var shakeRotation;
            var guiShakePosition;
            var rotationStrength = 1;
            var start1 = new egret.Point(0, 0);
            var startR = new egret.Point(0, 0);
            var startTime = 0;
            var timeOnEnterFrame = -1;
            var curTime = 0;
            var resetEvent = function () {
                cam.x = defaultPointY;
                cam.y = defaultPointY;
                cam.rotation = defaultRotation;
                cam.removeEventListener(egret.Event.ENTER_FRAME, updateEvent, _this);
                if (endCallBack != null) {
                    endCallBack();
                }
            };
            var updateEvent = function () {
                var now = egret.getTimer();
                var time = timeOnEnterFrame;
                var pass = (now - time) / 1000;
                if (timeOnEnterFrame == -1) {
                    timeOnEnterFrame = now;
                    return;
                }
                else {
                    timeOnEnterFrame = now;
                }
                curTime += pass;
                curTime = curTime * speed;
                if (_this.checkForMinimumValues) {
                    if (rotationStrength <= _this.minRotationValue) {
                        resetEvent();
                        return;
                    }
                    if (distance != 0 && shakeDistance <= _this.minShakeValue) {
                        resetEvent();
                        return;
                    }
                    if (currentShakes <= 0) {
                        resetEvent();
                        return;
                    }
                }
                if (cam == null) {
                    return;
                }
                cam.x = defaultPointY + mod1 * Math.sin(curTime) * (shakeAmount.x * shakeDistance);
                cam.y = defaultPointX + mod2 * Math.cos(curTime) * (shakeAmount.y * shakeDistance);
                if (rotationAmount > 0) {
                    cam.rotation = defaultRotation + Math.cos(curTime) * (rotationAmount * rotationStrength);
                }
                if (curTime > Math.PI * 2) {
                    curTime = 0;
                    shakeDistance *= (1 - decay);
                    rotationStrength *= (1 - decay);
                    currentShakes--;
                }
            };
            cam.addEventListener(egret.Event.ENTER_FRAME, updateEvent, this);
        };
        ShakeTool._instance = null;
        return ShakeTool;
    }());
    uniLib.ShakeTool = ShakeTool;
    __reflect(ShakeTool.prototype, "uniLib.ShakeTool");
})(uniLib || (uniLib = {}));
var uniLib;
(function (uniLib) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.stringIsNullOrEmpty = function (value) {
            return value == null || value.length == 0;
        };
        Utils.MD5 = function (message) {
            return new md5().hex_md5(message);
        };
        Utils.ltrim = function (s) {
            return s.replace(/(^\s*)/g, "");
        };
        Utils.rtrim = function (s) {
            return s.replace(/(\s*$)/g, "");
        };
        Utils.trim = function (s) {
            return s.replace(/(^\s*)|(\s*$)/g, "");
        };
        Utils.sTrim = function (str) {
            return str.replace(/\s/g, '');
        };
        /**
         * 是否网络地址
         */
        Utils.isNetUrl = function (url) {
            if (null == url || url.length <= 0)
                return false;
            var reg = /^(http|https|HTTP|HTTPS):/;
            return reg.test(url);
        };
        Utils.checkPhone = function (tel) {
            if (!(/^1[34578]\d{9}$/.test(tel))) {
                return false;
            }
            return true;
        };
        Utils.checkEmail = function (email) {
            if (!(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(email))) {
                return false;
            }
            return true;
        };
        //----------------------------------------------------------------
        Utils.setLocalStorage = function (key, value) {
            egret.localStorage.setItem(key, value);
        };
        //----------------------------------------------------------------
        Utils.getLocalStorage = function (key, defaultValue) {
            var value = localStorage.getItem(key);
            if (value) {
                value = decodeURIComponent(value);
            }
            else {
                value = defaultValue;
            }
            return value;
        };
        //----------------------------------------------------------------
        Utils.clearLocalStorage = function (key) {
            egret.localStorage.removeItem(key);
        };
        /**
         * 创建影片剪辑
         */
        Utils.creatMovieClip = function (jsonStr, pngStr, action, frameRate) {
            if (action === void 0) { action = "action"; }
            if (frameRate === void 0) { frameRate = -1; }
            var data = RES.getRes(jsonStr);
            var txtr = RES.getRes(pngStr);
            var mcFactory = new egret.MovieClipDataFactory(data, txtr);
            var mov = new egret.MovieClip(mcFactory.generateMovieClipData(action));
            if (frameRate != -1) {
                mov.frameRate = frameRate;
            }
            return mov;
        };
        Utils.lerp = function (fromNum, toNum, prop) {
            return fromNum + (toNum - fromNum) * prop;
        };
        //数组滚动，从fromNum到toNum，持续时间 totalTm;
        Utils.scrollNumber = function (label, fromNum, toNum, totalTm, isThousandFormat, scaleProp, cb, intervalTime, delayCBTime) {
            var _this = this;
            if (isThousandFormat === void 0) { isThousandFormat = false; }
            if (scaleProp === void 0) { scaleProp = 1.0; }
            if (cb === void 0) { cb = null; }
            if (intervalTime === void 0) { intervalTime = 50; }
            if (delayCBTime === void 0) { delayCBTime = 0; }
            var oldScaleX = label.scaleX;
            var oldScaleY = label.scaleY;
            var isBitmapFont = egret.is(label, "egret.BitmapFont");
            if (fromNum == toNum) {
                egret.setTimeout(cb, null, 0);
                label.text = GX.GoldFormat(fromNum, isBitmapFont, true, true);
                return { stopCB: function () { } };
            }
            var dstLabel = label;
            var lElapseTm = 0;
            var lTotalTm = totalTm;
            if (lTotalTm < 0.001) {
                lTotalTm = 0.1;
            }
            var intervalID = 0;
            var lastNum = fromNum;
            var scaleTm = 100;
            if (totalTm * 1000 < scaleTm * 2) {
                scaleTm = totalTm * 1000 * 0.4;
            }
            if (scaleProp != 1) {
                egret.Tween.get(dstLabel).to({ scaleX: oldScaleX * scaleProp, scaleY: oldScaleY * scaleProp }, scaleTm).call(function () { egret.Tween.removeTweens(dstLabel); });
            }
            dstLabel.text = isThousandFormat ? GX.GoldFormat(lastNum, isBitmapFont, true, true) : GX.GoldFormat(lastNum, isBitmapFont, true, false);
            var lastTime = egret.getTimer();
            var onTick = function () {
                var curTime = egret.getTimer();
                var elapseTm = curTime - lastTime;
                lastTime = curTime;
                lElapseTm = lElapseTm + elapseTm / 1000.0;
                if (lElapseTm > lTotalTm) {
                    lElapseTm = lTotalTm;
                    egret.clearInterval(intervalID);
                    intervalID = 0;
                    egret.Tween.get(dstLabel).to({ scaleX: oldScaleX, scaleY: oldScaleY }, scaleTm).wait(delayCBTime).call(function () {
                        egret.Tween.removeTweens(dstLabel);
                        if (intervalID == 0 && cb != null) {
                            cb.call(null);
                        }
                    });
                }
                var curNum = Math.floor(_this.lerp(fromNum, toNum, lElapseTm / lTotalTm));
                if (curNum != lastNum) {
                    lastNum = curNum;
                    if (isNaN(lastNum) == true) {
                        uniLib.Console.log("label txt is NAN fromNum:" + fromNum + " toNum:" + toNum + " totalTm:" + totalTm);
                    }
                    dstLabel.text = isThousandFormat ? GX.GoldFormat(lastNum, isBitmapFont, true, true) : GX.GoldFormat(lastNum, isBitmapFont, true, false);
                }
            };
            intervalID = egret.setInterval(onTick, null, intervalTime);
            var stopCB = function () {
                // console.log("call Utils.scroll, stopCB, intervalID:"+intervalID);
                if (intervalID != 0) {
                    egret.clearInterval(intervalID);
                    dstLabel.text = isThousandFormat ? GX.GoldFormat(toNum, isBitmapFont, true, true) : GX.GoldFormat(toNum, isBitmapFont);
                    // console.log("call Utils.scroll, dstLabel.text:"+toNum+" fromNum:"+fromNum);
                    if (scaleProp != 1) {
                        egret.Tween.removeTweens(dstLabel);
                        egret.Tween.get(dstLabel).to({ scaleX: oldScaleX, scaleY: oldScaleY }, scaleTm).call(function () { egret.Tween.removeTweens(dstLabel); });
                    }
                    intervalID = 0;
                    if (cb != null) {
                        cb.call(null);
                    }
                    label.text = GX.GoldFormat(toNum, true, true);
                }
            };
            return { stopCB: stopCB };
        };
        return Utils;
    }());
    uniLib.Utils = Utils;
    __reflect(Utils.prototype, "uniLib.Utils");
})(uniLib || (uniLib = {}));
