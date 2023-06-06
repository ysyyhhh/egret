module game 
{
    export class EventConsts 
    {
        /**
         * 广告数据已加载完成
         */
        public static EVENT_ADDATA_LOADED: string = "ADDATA_LOADED";
        
        /**
        * GAME_OVER
         */
        public static EVENT_GAME_OVER: string = "GAME_OVER";

        /**
        * 闯关成功
        */
        public static EVENT_GAME_SUCCESS: string = "GAME_SUCCESS";

        /**
         * 更新游戏信息
         */
        public static EVENT_UPDATE_GAME_INFO: string = "UPDATE_GAME_INFO";

        /**
         * 更新游戏信息
         */
        public static EVENT_ADD_SCORE: string = "ADD_SCORE";

        /**
         * 步数不足
         */
        public static EVENT_STEP_NOTENOUGH: string = "STEP_NOTENOUGH";

        /**
         * 通告概率已经发生调整
         */
        public static EVENT_PROBABILITY_CHANGED: string = "PROBABILITY_CHANGED";

        public static EVENT_UPDATE_SKIN: string = "UPDATE_SKIN";

    }
}