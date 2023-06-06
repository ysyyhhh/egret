module game 
{
    //------------------------------------------------------------------------------
    export class MainScene extends uniLib.Scene
    {
        mainView:MainView;
        awake(): void 
        {
            uniLib.Global.isInGame = false;
        }

        start(e?: egret.Event): void 
        {
            uniLib.UIMgr.instance.hideLoading();
            this.width = uniLib.Global.screenWidth;
            this.height = uniLib.Global.screenHeight;
            this.mainView = new MainView();
            this.uiLayer.addChild(this.mainView);
        }

        //------------------------------------------------------------------------------
        private askEnterGame()
        {
            let isInquiry:boolean = this.params;

            if(isInquiry)
            {
                GX.PopUpManager.addPopUp(new InquiryEnterGameView(), true, 0.8, GX.PopUpEffect.CENTER);
            }
            
        }

        //------------------------------------------------------------------------------
        onEnter()
        {
            let self = this;

            let timeout = egret.setTimeout(() => {
                egret.clearTimeout(timeout);
                if(GameInfo.instance.querySigninTime())
                {
                    GX.PopUpManager.addPopUp(new SiginView(self.askEnterGame, self), true, 0.8, GX.PopUpEffect.CENTER);
                }
                else
                {
                    this.askEnterGame();
                }
            }, this, 500);

        }

        //------------------------------------------------------------------------------
        onExit(): void
        {
            if(this.mainView)
            {
                if(this.mainView.parent)
                {
                    this.mainView.parent.removeChild(this.mainView);
                }
                this.mainView = null;
            }
        }

        //------------------------------------------------------------------------------
        destroy()
        {
            
        }


        //------------------------------------------------------------------------------

    }
}