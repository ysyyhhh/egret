module game 
{
    export class MenuBar extends ui.BaseUI
    {
        private settingBtn:eui.Button;
        private chipsLabel:eui.BitmapLabel;
        
        constructor()
        {
            super();
            this.skinName = new MenuBarSkin();
            this.adaptationWidth();
            this.init();
        }

        addUIListener(): void
        {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            uniLib.EventListener.getInstance().addEventListener(EventConsts.EVENT_UPDATE_GAME_INFO, this.updateGameInfo, this);
        }

        removeUIListener(): void
        {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            uniLib.EventListener.getInstance().removeEventListener(EventConsts.EVENT_UPDATE_GAME_INFO, this.updateGameInfo, this);
        }

        public destroy()
        {
            super.destroy();
        }

        private updateGameInfo()
        {
            this.chipsLabel.text = GameInfo.instance.curChips.toString();
        }

        private init()
        {
            this.updateGameInfo();
        }

        private onClickTap(e: egret.TouchEvent)
        {
            if(e.target == this.settingBtn)
            {
                GX.PopUpManager.addPopUp(new SettingView(), true, 0.8);
            }

        }

    }
}