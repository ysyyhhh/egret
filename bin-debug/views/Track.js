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
    var Track = (function (_super) {
        __extends(Track, _super);
        function Track(roundItem, score, x, y) {
            var _this = this;
            var name = "track_effect_" + roundItem.colorValue + "_png";
            var texture = RES.getRes(name);
            var config = RES.getRes("tracks_json");
            _this = _super.call(this, texture, config) || this;
            _this.target = roundItem;
            _this.score = score;
            _this.p0 = new egret.Point(x, y);
            _this.p1 = new egret.Point();
            _this.p2 = new egret.Point();
            _this.target.localToGlobal(roundItem.width * 0.5, roundItem.height * 0.5, _this.p2);
            _this.p1.x = _this.p0.x;
            _this.p1.y = _this.p2.y - 150;
            _this.emitterX = x;
            _this.emitterY = y;
            _super.prototype.start.call(_this);
            return _this;
        }
        //------------------------------------------------------------------------------
        Track.prototype.destroy = function () {
            this.stop(true);
            if (this.parent) {
                this.parent.removeChild(this);
            }
            this.target = null;
        };
        //------------------------------------------------------------------------------
        Track.prototype.startTrack = function (callback, thisObj) {
            var _this = this;
            var self = this;
            egret.Tween.get(this).to({ factor: 1 }, 500).call(function () {
                callback.call(thisObj, self, _this.score);
            });
        };
        Object.defineProperty(Track.prototype, "factor", {
            //------------------------------------------------------------------------------
            get: function () {
                return 0;
            },
            //------------------------------------------------------------------------------
            set: function (t) {
                this.emitterX = (1 - t) * (1 - t) * this.p0.x + 2 * t * (1 - t) * this.p1.x + t * t * this.p2.x;
                this.emitterY = (1 - t) * (1 - t) * this.p0.y + 2 * t * (1 - t) * this.p1.y + t * t * this.p2.y;
            },
            enumerable: true,
            configurable: true
        });
        return Track;
    }(particle.GravityParticleSystem));
    game.Track = Track;
    __reflect(Track.prototype, "game.Track");
})(game || (game = {}));
//# sourceMappingURL=Track.js.map