var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var Config = (function () {
        function Config() {
        }
        // 微信小游戏远程资源URL地址
        Config.WXGAME_RES_ROOT_URL = null; //"http://192.168.0.107/download/demo/";
        Config.DEVELOP_API_SERVER = "http://192.168.101.100/ApiServer/index.php?service=";
        // public static DEVELOP_API_SERVER:string = "http://game.zerosgame.com/ApiServer/index.php?service=";
        // 资源版本
        Config.CURRENT_RES_VERSION = "1003"; // 1.0.0
        // 数据版本
        Config.CURRENT_GAMEINFO_VERSION = "1003"; // 1.0.0
        return Config;
    }());
    game.Config = Config;
    __reflect(Config.prototype, "game.Config");
})(game || (game = {}));
//# sourceMappingURL=Config.js.map