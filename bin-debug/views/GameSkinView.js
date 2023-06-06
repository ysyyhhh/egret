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
    var GameSkinView = (function (_super) {
        __extends(GameSkinView, _super);
        function GameSkinView() {
            var _this = _super.call(this) || this;
            _this.curPage = 0; // 1:背景页面， 2：皮肤页面
            _this.curSelectedBgId = 0;
            _this.curSelectedMantleId = 0;
            _this.isVideoShowed = false;
            _this.skinName = new GameSkinViewSkin();
            _this.adaptationWidth();
            _this.adaptationHeight();
            uniLib.AdPlat.instance.showBanner();
            _this.init();
            return _this;
        }
        GameSkinView.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            this.bgList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelectedBgItem, this);
            this.mantleList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelectedMantleItem, this);
            uniLib.EventListener.getInstance().addEventListener("event_notify_bgitem_selected", this.notifySelectedBgItem, this);
            uniLib.EventListener.getInstance().addEventListener("event_notify_mantleitem_selected", this.notifySelectedMantleItem, this);
        };
        GameSkinView.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            this.bgList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelectedBgItem, this);
            this.mantleList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelectedMantleItem, this);
            uniLib.EventListener.getInstance().removeEventListener("removeEventListener", this.notifySelectedBgItem, this);
            uniLib.EventListener.getInstance().removeEventListener("event_notify_mantleitem_selected", this.notifySelectedMantleItem, this);
        };
        GameSkinView.prototype.destroy = function () {
            uniLib.AdPlat.instance.hideBanner();
            _super.prototype.destroy.call(this);
        };
        //-----------------------------------------------------------------------------
        GameSkinView.prototype.init = function () {
            this.clickCheckBoxTimes = 0;
            this.videoCheckBox.currentState = "up";
            this.videoCheckBox.skin["checkImage"].visible = true;
            this.checkBoxGroup.visible = true;
            this.bgItemListArrayCollection = new eui.ArrayCollection([]);
            this.bgItemListArrayCollection.replaceAll(game.TableData.tableBackgroundConfig);
            this.bgList.dataProvider = this.bgItemListArrayCollection;
            this.bgList.itemRenderer = BgItemRender;
            this.mantleItemListArrayCollection = new eui.ArrayCollection([]);
            this.mantleItemListArrayCollection.replaceAll(game.TableData.tableSkinConfig);
            this.mantleList.dataProvider = this.mantleItemListArrayCollection;
            this.mantleList.itemRenderer = MantleItemRender;
            this.chipsGetBtn.visible = false;
            this.freeGetBtn.visible = true;
            this.chipsGetBtn.skin["chipsLabel"].text = "200";
            this.switchPage(2);
        };
        //-----------------------------------------------------------------------------
        GameSkinView.prototype.switchPage = function (page) {
            this.bgStateOpenBtn.visible = false;
            this.skinStateCloseBtn.visible = false;
            this.bgScroller.visible = false;
            this.bgStateOpenBtn.touchEnabled = false;
            this.skinStateCloseBtn.touchEnabled = false;
            this.bgStateCloseBtn.visible = false;
            this.skinStateOpenBtn.visible = false;
            this.mantleScroller.visible = false;
            this.bgStateCloseBtn.touchEnabled = false;
            this.skinStateOpenBtn.touchEnabled = false;
            this.curPage = page;
            if (page == 1) {
                this.bgStateOpenBtn.visible = true;
                this.skinStateCloseBtn.visible = true;
                this.bgScroller.visible = true;
                this.skinStateCloseBtn.touchEnabled = true;
                var lockList = game.GameInfo.instance.getLockBackgroundList();
                if (lockList.length > 0) {
                    this.clickCheckBoxTimes = 0;
                    this.videoCheckBox.currentState = "up";
                    this.videoCheckBox.skin["checkImage"].visible = true;
                    this.checkBoxGroup.visible = true;
                    this.freeGetBtn.visible = true;
                }
                else {
                    this.checkBoxGroup.visible = false;
                    this.freeGetBtn.visible = false;
                }
            }
            else if (page == 2) {
                this.bgStateCloseBtn.visible = true;
                this.skinStateOpenBtn.visible = true;
                this.mantleScroller.visible = true;
                this.bgStateCloseBtn.touchEnabled = true;
                var lockList = game.GameInfo.instance.getLockSkinList();
                if (lockList.length > 0) {
                    this.clickCheckBoxTimes = 0;
                    this.videoCheckBox.currentState = "up";
                    this.videoCheckBox.skin["checkImage"].visible = true;
                    this.checkBoxGroup.visible = true;
                    this.freeGetBtn.visible = true;
                }
                else {
                    this.checkBoxGroup.visible = false;
                    this.freeGetBtn.visible = false;
                }
            }
        };
        GameSkinView.prototype.setInvalidCheckBox = function () {
            console.log("setInvalidCheckBox", uniLib.AdConfig.checkBoxMistouch, uniLib.AdConfig.checkBoxProbabilitys, this.clickCheckBoxTimes);
            if (uniLib.AdConfig.checkBoxMistouch) {
                if (this.videoCheckBox.currentState == "down") {
                    this.clickCheckBoxTimes = 0;
                    this.videoCheckBox.currentState = "up"; // 选中
                    this.videoCheckBox.skin["checkImage"].visible = true;
                    this.freeGetBtn.visible = true;
                    this.chipsGetBtn.visible = false;
                }
                else {
                    var resultIndex = uniLib.MathUtil.randomProbability(uniLib.AdConfig.checkBoxProbabilitys);
                    if (resultIndex == this.clickCheckBoxTimes) {
                        this.clickCheckBoxTimes = 0;
                        this.videoCheckBox.currentState = "down"; // 取消选中
                        this.videoCheckBox.skin["checkImage"].visible = false;
                        this.freeGetBtn.visible = false;
                        this.chipsGetBtn.visible = true;
                        if (uniLib.AdConfig["checkBoxForceAd"]) {
                            var self_1 = this;
                            if (!this.isVideoShowed) {
                                this.clickCheckBoxTimes = 0;
                                this.isVideoShowed = true;
                                uniLib.SoundMgr.instance.pauseBgMusic();
                                if (uniLib.Global.isVivogame)
                                    window.platform.showVideoAdvertisement(null, this.onVideoAdCallback, this);
                                else
                                    uniLib.AdPlat.instance.showRewardedVideo(this.onVideoAdCallback, this);
                                this.showVideoTimeout = egret.setTimeout(function () {
                                    self_1.isVideoShowed = false;
                                    if (self_1.showVideoTimeout) {
                                        egret.clearTimeout(self_1.showVideoTimeout);
                                        self_1.showVideoTimeout = null;
                                    }
                                }, this, 3000);
                            }
                        }
                        return;
                    }
                    ++this.clickCheckBoxTimes;
                }
            }
            else {
                this.clickCheckBoxTimes = 0;
                if (this.videoCheckBox.currentState == "up") {
                    this.videoCheckBox.currentState = "down";
                    this.videoCheckBox.skin["checkImage"].visible = false;
                    this.freeGetBtn.visible = false;
                    this.chipsGetBtn.visible = true;
                }
                else {
                    this.videoCheckBox.currentState = "up";
                    this.videoCheckBox.skin["checkImage"].visible = true;
                    this.freeGetBtn.visible = true;
                    this.chipsGetBtn.visible = false;
                }
            }
        };
        GameSkinView.prototype.onClickTap = function (e) {
            var _this = this;
            if (e.target == this.closeBtn || e.target == this.skin["touchLayer"]) {
                GX.PopUpManager.removePopUp(this);
            }
            else if (e.target == this.skinStateCloseBtn) {
                this.switchPage(2);
                for (var i = 0; i < this.mantleList.numElements; i++) {
                    var element = this.mantleList.getElementAt(i);
                    if (element && element.data.id == this.curSelectedMantleId) {
                        element.setSelected(true);
                        break;
                    }
                }
            }
            else if (e.target == this.bgStateCloseBtn) {
                this.switchPage(1);
                for (var i = 0; i < this.bgList.numElements; i++) {
                    var element = this.bgList.getElementAt(i);
                    if (element && element.data.id == this.curSelectedBgId) {
                        element.setSelected(true);
                        break;
                    }
                }
            }
            else if (e.target == this.chipsGetBtn) {
                // 金币获得皮肤
                var self_2 = this;
                if (this.curPage == 1) {
                    var lockList = game.GameInfo.instance.getLockBackgroundList();
                    if (lockList.length > 0) {
                        uniLib.MathUtil.randArray(lockList);
                        this.curSelectedBgId = lockList[0];
                        var config = game.TableData.getBackgroundConfig(this.curSelectedBgId);
                        if (config && config.unlockType == 1 && config.unlockValue > 0) {
                            var needChips = config.unlockValue;
                            needChips = 200;
                            if (needChips > game.GameInfo.instance.curChips) {
                                GX.Tips.showPopup("当前金币不足，是否确定观看一段视频免费获得皮肤？", function () {
                                    if (!self_2.isVideoShowed) {
                                        self_2.clickCheckBoxTimes = 0;
                                        self_2.isVideoShowed = true;
                                        uniLib.SoundMgr.instance.pauseBgMusic();
                                        if (uniLib.Global.isVivogame)
                                            window.platform.showVideoAdvertisement(null, _this.onVideoAdCallback, _this);
                                        else
                                            uniLib.AdPlat.instance.showRewardedVideo(self_2.onVideoAdCallback, self_2);
                                        self_2.showVideoTimeout = egret.setTimeout(function () {
                                            self_2.isVideoShowed = false;
                                            if (self_2.showVideoTimeout) {
                                                egret.clearTimeout(self_2.showVideoTimeout);
                                                self_2.showVideoTimeout = null;
                                            }
                                        }, self_2, 3000);
                                    }
                                }, function () { }, this, true);
                                return;
                            }
                            game.GameInfo.instance.curChips = game.GameInfo.instance.curChips - needChips;
                            if (game.GameInfo.instance.curChips < 0)
                                game.GameInfo.instance.curChips = 0;
                            game.GameInfo.save();
                            uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_UPDATE_GAME_INFO);
                            this.onGetBackgroundSkin();
                        }
                    }
                }
                else if (this.curPage == 2) {
                    var lockList = game.GameInfo.instance.getLockSkinList();
                    if (lockList.length > 0) {
                        uniLib.MathUtil.randArray(lockList);
                        this.curSelectedMantleId = lockList[0];
                        var config = game.TableData.getSkinConfig(this.curSelectedMantleId);
                        if (config && config.unlockType == 1 && config.unlockValue > 0) {
                            var needChips = config.unlockValue;
                            if (needChips > game.GameInfo.instance.curChips) {
                                GX.Tips.showPopup("当前金币不足，是否确定观看一段视频免费获得皮肤？", function () {
                                    if (!self_2.isVideoShowed) {
                                        self_2.clickCheckBoxTimes = 0;
                                        self_2.isVideoShowed = true;
                                        uniLib.SoundMgr.instance.pauseBgMusic();
                                        if (uniLib.Global.isVivogame)
                                            window.platform.showVideoAdvertisement(null, _this.onVideoAdCallback, _this);
                                        else
                                            uniLib.AdPlat.instance.showRewardedVideo(self_2.onVideoAdCallback, self_2);
                                        self_2.showVideoTimeout = egret.setTimeout(function () {
                                            self_2.isVideoShowed = false;
                                            if (self_2.showVideoTimeout) {
                                                egret.clearTimeout(self_2.showVideoTimeout);
                                                self_2.showVideoTimeout = null;
                                            }
                                        }, self_2, 3000);
                                    }
                                }, function () { }, this, true);
                                return;
                            }
                            game.GameInfo.instance.curChips = game.GameInfo.instance.curChips - needChips;
                            if (game.GameInfo.instance.curChips < 0)
                                game.GameInfo.instance.curChips = 0;
                            game.GameInfo.save();
                            uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_UPDATE_GAME_INFO);
                            this.onGetMantleSkin();
                        }
                    }
                }
            }
            else if (e.target == this.freeGetBtn) {
                var self_3 = this;
                if (!this.isVideoShowed) {
                    this.isVideoShowed = true;
                    uniLib.SoundMgr.instance.pauseBgMusic();
                    if (uniLib.Global.isVivogame)
                        window.platform.showVideoAdvertisement(null, this.onVideoAdCallback, this);
                    else
                        uniLib.AdPlat.instance.showRewardedVideo(this.onVideoAdCallback, this);
                    this.showVideoTimeout = egret.setTimeout(function () {
                        self_3.isVideoShowed = false;
                        if (self_3.showVideoTimeout) {
                            egret.clearTimeout(self_3.showVideoTimeout);
                            self_3.showVideoTimeout = null;
                        }
                    }, this, 3000);
                }
            }
            else if (e.target == this.checkBoxGroup || e.target == this.videoCheckBox) {
                this.setInvalidCheckBox();
            }
        };
        //-----------------------------------------------------------------------------
        GameSkinView.prototype.onSelectedBgItem = function (e) {
            var index = e.itemIndex;
            var unlockSkin = false;
            for (var i = 0; i < game.TableData.tableBackgroundConfig.length; i++) {
                if (i == index) {
                    var config = game.TableData.tableBackgroundConfig[i];
                    for (var j = 0; j < game.GameInfo.instance.openBackgroundIdList.length; j++) {
                        if (game.GameInfo.instance.openBackgroundIdList[j] == config.id) {
                            unlockSkin = true;
                            break;
                        }
                    }
                }
            }
            if (unlockSkin) {
                this.selectedBgByIndex(index);
            }
        };
        //-----------------------------------------------------------------------------
        GameSkinView.prototype.selectedBgByIndex = function (index) {
            var itemRender = this.bgList.getElementAt(index);
            if (itemRender) {
                for (var i = 0; i < this.bgList.numElements; i++) {
                    var element = this.bgList.getElementAt(i);
                    if (element) {
                        element.setSelected(false);
                    }
                }
                itemRender.setSelected(true);
            }
        };
        //-----------------------------------------------------------------------------
        GameSkinView.prototype.onSelectedMantleItem = function (e) {
            var index = e.itemIndex;
            var unlockSkin = false;
            for (var i = 0; i < game.TableData.tableSkinConfig.length; i++) {
                if (i == index) {
                    var config = game.TableData.tableSkinConfig[i];
                    for (var j = 0; j < game.GameInfo.instance.openSkinIdList.length; j++) {
                        if (game.GameInfo.instance.openSkinIdList[j] == config.id) {
                            unlockSkin = true;
                            break;
                        }
                    }
                }
            }
            if (unlockSkin) {
                this.selectedMantleByIndex(index);
            }
        };
        //-----------------------------------------------------------------------------
        GameSkinView.prototype.selectedMantleByIndex = function (index) {
            var itemRender = this.mantleList.getElementAt(index);
            if (itemRender) {
                for (var i = 0; i < this.mantleList.numElements; i++) {
                    var element = this.mantleList.getElementAt(i);
                    if (element) {
                        element.setSelected(false);
                    }
                }
                itemRender.setSelected(true);
            }
        };
        //-----------------------------------------------------------------------------
        GameSkinView.prototype.notifySelectedBgItem = function (evt) {
            var config = evt.data;
            this.curSelectedBgId = config.id;
            this.onApplyBackgroundSkin();
        };
        //-----------------------------------------------------------------------------
        GameSkinView.prototype.notifySelectedMantleItem = function (evt) {
            var config = evt.data;
            this.curSelectedMantleId = config.id;
            this.onApplyMantleSkin();
        };
        //-----------------------------------------------------------------------------
        GameSkinView.prototype.onGetBackgroundSkin = function () {
            if (this.curSelectedBgId <= 0)
                return;
            var index = -1;
            game.GameInfo.instance.unlockBackgroundId(this.curSelectedBgId, true);
            for (var i = 0; i < game.TableData.tableBackgroundConfig.length; i++) {
                if (game.TableData.tableBackgroundConfig[i].id == this.curSelectedBgId) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                this.selectedBgByIndex(index);
            }
        };
        //-----------------------------------------------------------------------------
        GameSkinView.prototype.onGetMantleSkin = function () {
            if (this.curSelectedMantleId <= 0)
                return;
            var index = -1;
            game.GameInfo.instance.unlockSkinId(this.curSelectedMantleId, true);
            for (var i = 0; i < game.TableData.tableSkinConfig.length; i++) {
                if (game.TableData.tableSkinConfig[i].id == this.curSelectedMantleId) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                this.selectedMantleByIndex(index);
            }
        };
        //-----------------------------------------------------------------------------
        GameSkinView.prototype.onApplyBackgroundSkin = function () {
            if (this.curSelectedBgId <= 0)
                return;
            game.GameInfo.instance.backgroundId = this.curSelectedBgId;
            uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_UPDATE_SKIN);
            game.GameInfo.save();
            var index = -1;
            for (var i = 0; i < game.TableData.tableBackgroundConfig.length; i++) {
                if (game.TableData.tableBackgroundConfig[i].id == this.curSelectedBgId) {
                    index = i;
                    break;
                }
            }
            // if(index != -1)
            // {
            //     this.selectedBgByIndex(index);
            // }
        };
        //-----------------------------------------------------------------------------
        GameSkinView.prototype.onApplyMantleSkin = function () {
            if (this.curSelectedMantleId <= 0)
                return;
            game.GameInfo.instance.skinId = this.curSelectedMantleId;
            game.GameInfo.save();
            var index = -1;
            for (var i = 0; i < game.TableData.tableSkinConfig.length; i++) {
                if (game.TableData.tableSkinConfig[i].id == this.curSelectedMantleId) {
                    index = i;
                    break;
                }
            }
            // if(index != -1)
            // {
            //     this.selectedMantleByIndex(index);
            // }
        };
        //-----------------------------------------------------------------------------
        GameSkinView.prototype.onVideoAdCallback = function (status) {
            uniLib.SoundMgr.instance.resumeBgMusic();
            if (this.showVideoTimeout) {
                egret.clearTimeout(this.showVideoTimeout);
                this.showVideoTimeout = null;
            }
            this.isVideoShowed = false;
            if (status == 1) {
                if (this.curPage == 1) {
                    uniLib.Global.reportAldEvent("获得背景-全程看完激励视频");
                    var lockList = game.GameInfo.instance.getLockBackgroundList();
                    if (lockList.length > 0) {
                        uniLib.MathUtil.randArray(lockList);
                        this.curSelectedBgId = lockList[0];
                        this.onGetBackgroundSkin();
                    }
                }
                else if (this.curPage == 2) {
                    uniLib.Global.reportAldEvent("获得皮肤-全程看完激励视频");
                    var lockList = game.GameInfo.instance.getLockSkinList();
                    if (lockList.length > 0) {
                        uniLib.MathUtil.randArray(lockList);
                        this.curSelectedMantleId = lockList[0];
                        this.onGetMantleSkin();
                    }
                }
            }
            else if (status == 0) {
                // 视频未看完
                GX.Tips.showTips("全程看完视频才能获得");
            }
            else {
                // GameInfo.sendAldEvent("激励视频加载失败");
                GX.Tips.showTips("获取视频广告失败:" + status);
            }
        };
        return GameSkinView;
    }(ui.BaseUI));
    game.GameSkinView = GameSkinView;
    __reflect(GameSkinView.prototype, "game.GameSkinView");
    /**
     * 背景皮肤 item render
     */
    var BgItemRender = (function (_super) {
        __extends(BgItemRender, _super);
        function BgItemRender() {
            return _super.call(this) || this;
        }
        BgItemRender.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        BgItemRender.prototype.dataChanged = function () {
        };
        BgItemRender.prototype.setSelected = function (selected) {
        };
        return BgItemRender;
    }(ui.ItemRenderer));
    __reflect(BgItemRender.prototype, "BgItemRender");
    /**
     * 皮肤 item render
     */
    var MantleItemRender = (function (_super) {
        __extends(MantleItemRender, _super);
        function MantleItemRender() {
            return _super.call(this) || this;
            // this.interactive = ui.UIInteractive.Bright;
        }
        MantleItemRender.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        MantleItemRender.prototype.dataChanged = function () {
            var config = this.data;
            if (config.id == game.GameInfo.instance.skinId) {
                this.setSelected(true);
            }
            else {
                this.setSelected(false);
            }
        };
        MantleItemRender.prototype.setSelected = function (selected) {
            var config = this.data;
            var unlockSkin = false;
            for (var i = 0; i < game.GameInfo.instance.openSkinIdList.length; i++) {
                if (game.GameInfo.instance.openSkinIdList[i] == config.id) {
                    unlockSkin = true;
                    break;
                }
            }
            if (unlockSkin) {
                this.maskImage.visible = false;
                this.lockImage.visible = false;
                this.selecteImage.visible = selected;
            }
            else {
                this.maskImage.visible = true;
                this.lockImage.visible = true;
                this.selecteImage.visible = false;
            }
            this.blockImage.source = "block_" + config.id + "_1";
            if (selected) {
                uniLib.EventListener.getInstance().dispatchEventWith("event_notify_mantleitem_selected", false, this.data);
            }
        };
        return MantleItemRender;
    }(ui.ItemRenderer));
    __reflect(MantleItemRender.prototype, "MantleItemRender");
})(game || (game = {}));
//# sourceMappingURL=GameSkinView.js.map