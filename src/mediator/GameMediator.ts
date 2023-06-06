module game 
{
    export class GameMediator extends uniLib.Mediator 
    {
        private static NAME = "GameMediator";

        public constructor() 
        {
            console.log("GameMediator.constructor");
            super(GameMediator.NAME);

            uniLib.UIMgr.instance.hideLoading();

            GX.GameLayerManager.addUIToScene(new GameView);
        }
    }
}