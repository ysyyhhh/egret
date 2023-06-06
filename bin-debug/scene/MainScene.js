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
    var MainScene = (function (_super) {
        __extends(MainScene, _super);
        function MainScene() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MainScene.prototype.awake = function () {
            uniLib.Global.isInGame = false;
        };
        MainScene.prototype.start = function (e) {
            uniLib.UIMgr.instance.hideLoading();
            this.width = uniLib.Global.screenWidth;
            this.height = uniLib.Global.screenHeight;
            this.mainView = new game.MainView();
            this.uiLayer.addChild(this.mainView);
        };
        //------------------------------------------------------------------------------
        MainScene.prototype.askEnterGame = function () {
            var isInquiry = this.params;
            if (isInquiry) {
                GX.PopUpManager.addPopUp(new game.InquiryEnterGameView(), true, 0.8, GX.PopUpEffect.CENTER);
            }
        };
        //------------------------------------------------------------------------------
        MainScene.prototype.onEnter = function () {
            var _this = this;
            var self = this;
            var timeout = egret.setTimeout(function () {
                egret.clearTimeout(timeout);
                if (game.GameInfo.instance.querySigninTime()) {
                    GX.PopUpManager.addPopUp(new game.SiginView(self.askEnterGame, self), true, 0.8, GX.PopUpEffect.CENTER);
                }
                else {
                    _this.askEnterGame();
                }
            }, this, 500);
        };
        //------------------------------------------------------------------------------
        MainScene.prototype.onExit = function () {
            if (this.mainView) {
                if (this.mainView.parent) {
                    this.mainView.parent.removeChild(this.mainView);
                }
                this.mainView = null;
            }
        };
        //------------------------------------------------------------------------------
        MainScene.prototype.destroy = function () {
        };
        return MainScene;
    }(uniLib.Scene));
    game.MainScene = MainScene;
    __reflect(MainScene.prototype, "game.MainScene");
})(game || (game = {}));
//# sourceMappingURL=MainScene.js.map