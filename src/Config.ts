module game 
{
    export class Config
    {
        // 微信小游戏远程资源URL地址
        public static WXGAME_RES_ROOT_URL:string = null;//"http://192.168.0.107/download/demo/";

        public static DEVELOP_API_SERVER:string = "http://192.168.101.100/ApiServer/index.php?service=";
        // public static DEVELOP_API_SERVER:string = "http://game.zerosgame.com/ApiServer/index.php?service=";

        // 资源版本
        public static CURRENT_RES_VERSION:string = "1003"; // 1.0.0

        // 数据版本
        public static CURRENT_GAMEINFO_VERSION:string = "1003"; // 1.0.0
    }
}
