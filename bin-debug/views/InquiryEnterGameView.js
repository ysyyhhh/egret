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
    var InquiryEnterGameView = (function (_super) {
        __extends(InquiryEnterGameView, _super);
        function InquiryEnterGameView() {
            var _this = _super.call(this) || this;
            _this.skinName = new InquiryEnterGameSkin();
            _this.adaptationWidth();
            _this.adaptationHeight();
            _this.init();
            return _this;
        }
        InquiryEnterGameView.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        InquiryEnterGameView.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        //-----------------------------------------------------------------------------
        InquiryEnterGameView.prototype.init = function () {
        };
        //-----------------------------------------------------------------------------
        InquiryEnterGameView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        //-----------------------------------------------------------------------------
        InquiryEnterGameView.prototype.onClickTap = function (e) {
            if (e.target == this.confirmButton) {
                GX.PopUpManager.removePopUp(this);
                var maxSceneLevel = game.GameInfo.instance.maxSceneLevel;
                var enterLevel = maxSceneLevel + 1;
                if (enterLevel > 1) {
                    Main.instance.loadGameScene(enterLevel);
                }
            }
            else if (e.target == this.cancelButton) {
                GX.PopUpManager.removePopUp(this);
                game.GameInfo.instance.curChips = game.GameInfo.instance.curChips + game.GameInfo.instance.winChips;
                game.GameInfo.instance.winChips = 0;
                game.GameInfo.instance.needGuide = false;
                game.GameInfo.instance.sceneLevel = 0;
                game.GameInfo.instance.maxSceneLevel = 0;
                if (game.GameInfo.instance.maxScore < game.GameInfo.instance.curScore) {
                    game.GameInfo.instance.maxScore = game.GameInfo.instance.curScore;
                }
                game.GameInfo.instance.curScore = 0;
                game.GameInfo.save();
                uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_UPDATE_GAME_INFO);
                Main.instance.loadGameScene(1);
            }
            else if (e.target == this.closeBtn) {
                GX.PopUpManager.removePopUp(this);
            }
        };
        return InquiryEnterGameView;
    }(ui.BaseUI));
    game.InquiryEnterGameView = InquiryEnterGameView;
    __reflect(InquiryEnterGameView.prototype, "game.InquiryEnterGameView");
})(game || (game = {}));
//# sourceMappingURL=InquiryEnterGameView.js.map