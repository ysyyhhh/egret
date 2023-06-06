module game 
{
    export class InquiryEnterGameView extends ui.BaseUI
    {
        private confirmButton:eui.Button;
        private cancelButton:eui.Button;
        private closeBtn:eui.Button;

        constructor()
        {
            super();
            this.skinName = new InquiryEnterGameSkin();
            this.adaptationWidth();
            this.adaptationHeight();
            this.init();
        }

        addUIListener(): void
        {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        }

        removeUIListener(): void
        {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        }

        //-----------------------------------------------------------------------------
        private init()
        {
        }

        //-----------------------------------------------------------------------------
        public destroy()
        {
            super.destroy();
        }

        //-----------------------------------------------------------------------------
        private onClickTap(e: egret.TouchEvent)
        {
            if(e.target == this.confirmButton)
            {
                GX.PopUpManager.removePopUp(this);

                let maxSceneLevel = game.GameInfo.instance.maxSceneLevel;
                let enterLevel = maxSceneLevel+1;
                if(enterLevel > 1)
                {
                    Main.instance.loadGameScene(enterLevel);
                }
            }
            else if(e.target == this.cancelButton)
            {
                GX.PopUpManager.removePopUp(this);

                GameInfo.instance.curChips = GameInfo.instance.curChips + GameInfo.instance.winChips;
                GameInfo.instance.winChips = 0;
                GameInfo.instance.needGuide = false;
                GameInfo.instance.sceneLevel = 0;
                GameInfo.instance.maxSceneLevel = 0;
                if(GameInfo.instance.maxScore < GameInfo.instance.curScore)
                {
                    GameInfo.instance.maxScore = GameInfo.instance.curScore;
                }
                GameInfo.instance.curScore = 0;
                GameInfo.save();
                uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_GAME_INFO);
                Main.instance.loadGameScene(1);
            }
            else if(e.target == this.closeBtn)
            {
                GX.PopUpManager.removePopUp(this);
            }
        }
    }
}