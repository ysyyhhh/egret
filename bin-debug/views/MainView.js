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
    var MainView = (function (_super) {
        __extends(MainView, _super);
        function MainView() {
            var _this = _super.call(this) || this;
            _this.skinName = new MainViewSkin();
            _this.adaptationWidth();
            _this.adaptationHeight();
            if (uniLib.Global.isVivogame)
                window.platform.showBannerAdvertisement();
            _this.init();
            return _this;
        }
        //------------------------------------------------------------------------------
        MainView.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            uniLib.EventListener.getInstance().addEventListener(uniLib.FacadeConsts.ADPLAT_INIT_COMPLETED, this.onLoadAds, this);
        };
        //------------------------------------------------------------------------------
        MainView.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            uniLib.EventListener.getInstance().removeEventListener(uniLib.FacadeConsts.ADPLAT_INIT_COMPLETED, this.onLoadAds, this);
        };
        //------------------------------------------------------------------------------
        MainView.prototype.destroy = function () {
            if (null != this.adScrollView) {
                this.adScrollView.unload();
                this.adScrollView = null;
            }
            if (null != this.adScrollViewEx) {
                this.adScrollViewEx.unload();
                this.adScrollViewEx = null;
            }
            _super.prototype.destroy.call(this);
        };
        //------------------------------------------------------------------------------
        MainView.prototype.init = function () {
            this.menuBar = new game.MenuBar();
            this.menuLayer.addChild(this.menuBar);
            if (game.GameConsts.is_iPhoneX)
                this.menuLayer.top = 80;
            else
                this.menuLayer.top = 20;
            if (uniLib.Global.isVivogame) {
                this.shopBtn.parent.removeChild(this.shopBtn);
                this.shareBtn.parent.removeChild(this.shareBtn);
                this.shopBtn = null;
                this.shareBtn = null;
            }
            this.skin["adScrollGroup"].visible = false;
            this.skin["adScrollGroupEx"].visible = false;
            this.onLoadAds();
        };
        //------------------------------------------------------------------------------
        MainView.prototype.onLoadAds = function () {
            if (this.skin["adScrollGroupEx"].visible == true || this.skin["adScrollGroup"].visible == true)
                return;
            if (uniLib.AdConfig.itemDataList && uniLib.AdConfig.itemDataList.length > 0) {
                if (game.GameConsts.is_iPhoneX) {
                    this.skin["adScrollGroupEx"].visible = true;
                    this.adScrollViewEx.load(1, true, 0, "AdResultItemSkin", true, true);
                }
                else {
                    this.skin["adScrollGroup"].visible = true;
                    this.adScrollView.load(1, false, 0, "AdItemNotTitleSkin", true, true);
                }
            }
        };
        //------------------------------------------------------------------------------
        MainView.prototype.onClickTap = function (e) {
            if (e.target == this.startBtn) {
                var maxSceneLevel = game.GameInfo.instance.maxSceneLevel;
                Main.instance.loadGameScene(maxSceneLevel + 1);
            }
            else if (e.target == this.shopBtn) {
                GX.PopUpManager.addPopUp(new game.GameSkinView(), true, 0.8, GX.PopUpEffect.CENTER);
            }
            else if (e.target == this.rankBtn) {
                if (uniLib.Global.isVivogame) {
                    GX.PopUpManager.addPopUp(new game.SiginView(), true, 0.8, GX.PopUpEffect.CENTER);
                }
                else {
                    GX.PopUpManager.addPopUp(new game.GameRankView(), true, 0.8, GX.PopUpEffect.CENTER);
                }
            }
            else if (e.target == this.shareBtn) {
                uniLib.AdPlat.instance.share();
            }
        };
        return MainView;
    }(ui.BaseUI));
    game.MainView = MainView;
    __reflect(MainView.prototype, "game.MainView");
})(game || (game = {}));
//# sourceMappingURL=MainView.js.map