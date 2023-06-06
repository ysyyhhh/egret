module game 
{
    export class GameRankView extends ui.BaseUI
    {
        private closeLayer:eui.Group;
        private dataLayer:eui.Group;
        private curPage:number = 0;

        private rankCanvas:egret.Bitmap;
        private rankBitmapData:egret.BitmapData;
        private rankTexture:egret.Texture;
        
        private shareBtn:eui.Button;

        constructor()
        {
            super();
            this.skinName = new GameRankViewSkin();
            this.adaptationWidth();
            this.adaptationHeight();
            uniLib.AdPlat.instance.showBanner();
            this.init();
        }

        //------------------------------------------------------------------------------
        public init()
        {
            this.shareBtn.visible = false;
            this.switchToPage(1);
        }

        //------------------------------------------------------------------------------
        private switchToPage(page:number)
        {
            if(this.curPage == page) return;
            this.curPage = page;
            this.shareBtn.visible = false;
            egret.Tween.removeTweens(this.shareBtn);

            let self = this;

            this.destroyRankCanvas();

            if(page == 1)
            {
                this.createRankCanvas({ command: "friendRank"});

                if(GameInfo.instance.maxScore > 0 || GameInfo.instance.curScore > 0)
                {
                    this.shareBtn.visible = true;
                    this.shareBtn.alpha = 0;
                    egret.Tween.get(this.shareBtn).wait(500).to({alpha:1},250);
                }
                else
                {
                    this.shareBtn.visible = false;
                }
                
            }
        }

        addUIListener(): void
        {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        }

        removeUIListener(): void
        {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        }


        public destroy()
        {
            uniLib.AdPlat.instance.hideBanner();
            super.destroy();
        }

        private onClickTap(e: egret.TouchEvent)
        {
            if(e.target == this.closeLayer || e.target == this.skin["closeBtn"])
            {
                this.destroyRankCanvas();
                GX.PopUpManager.removePopUp(this);
            }
            if(e.target == this.dataLayer)
            {
            }
            else if(e.target == this.shareBtn)
            {
                uniLib.AdPlat.instance.share();
            }
            
        }

        private getOpenDataContext() : any
        {
            if(window[uniLib.Global.platformName] && window[uniLib.Global.platformName].getOpenDataContext)
            {
                return window[uniLib.Global.platformName].getOpenDataContext();
            }

            return null;
        }

        private createRankCanvas(postData:any)
        {
            let sharedCanvas = window["sharedCanvas"];
            if(null == sharedCanvas) return;
            this.rankBitmapData = new egret.BitmapData(sharedCanvas);
            this.rankBitmapData.$deleteSource = false;

            this.rankTexture = new egret.Texture();
            this.rankTexture.bitmapData = this.rankBitmapData;

            this.rankCanvas = new egret.Bitmap(this.rankTexture);

            this.rankCanvas.width = uniLib.Global.screenWidth;
            this.rankCanvas.height = uniLib.Global.screenHeight;
            this.rankCanvas.touchEnabled = false;
            this.addChild(this.rankCanvas);

            egret.startTick(this.drawRankCanvas, this);

            console.log("postMessage", postData);
            let openDataContext = this.getOpenDataContext();
            if(openDataContext)
            {
                openDataContext.postMessage(postData);
            }
            
        }

        private destroyRankCanvas()
        {
            if(this.rankCanvas)
            {
                egret.stopTick(this.drawRankCanvas, this);

                let openDataContext = this.getOpenDataContext();
                openDataContext.postMessage({ command: "close" });

                this.rankCanvas.parent.removeChild(this.rankCanvas);

                this.rankCanvas = null;
                this.rankBitmapData = null;
                this.rankTexture = null;
            }
        }

        private drawRankCanvas(timeStarmp: number) : boolean
        {
            egret.WebGLUtils.deleteWebGLTexture(this.rankBitmapData.webGLTexture);
            this.rankBitmapData.webGLTexture = null;
            return false;
        }

    }
}