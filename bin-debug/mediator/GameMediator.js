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
    var GameMediator = (function (_super) {
        __extends(GameMediator, _super);
        function GameMediator() {
            var _this = this;
            console.log("GameMediator.constructor");
            _this = _super.call(this, GameMediator.NAME) || this;
            uniLib.UIMgr.instance.hideLoading();
            GX.GameLayerManager.addUIToScene(new game.GameView);
            return _this;
        }
        GameMediator.NAME = "GameMediator";
        return GameMediator;
    }(uniLib.Mediator));
    game.GameMediator = GameMediator;
    __reflect(GameMediator.prototype, "game.GameMediator");
})(game || (game = {}));
//# sourceMappingURL=GameMediator.js.map