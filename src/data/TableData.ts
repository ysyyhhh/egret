module game 
{
    export class TableData
    {
        public static tableGameConfig:table.TableGameConfig;
        public static tableSceneLevelConfig:table.TableSceneLevelConfig[];
        public static tableBackgroundConfig:table.TableBackgroundConfig[];
        public static tableSkinConfig:table.TableSkinConfig[];

        //-----------------------------------------------------------------------------------
        public static init()
        {
            TableData.tableGameConfig = RES.getRes("TableGameConfig_json")[0];
            TableData.tableSceneLevelConfig = RES.getRes("TableSceneLevelConfig_json");
            TableData.tableBackgroundConfig = RES.getRes("TableBackgroundConfig_json");
            TableData.tableSkinConfig = RES.getRes("TableSkinConfig_json");
        }

        //-----------------------------------------------------------------------------------
        public static getSceneLevelConfig(level:number) : table.TableSceneLevelConfig
        {
            for(let i = 0; i < TableData.tableSceneLevelConfig.length; i++)
            {
                let config:table.TableSceneLevelConfig = TableData.tableSceneLevelConfig[i];
                if(config.level == level)
                {
                    return config;
                }
            }
            return null;
        }

        public static getBackgroundConfig(id:number) : table.TableBackgroundConfig
        {
            for(let i = 0; i < TableData.tableBackgroundConfig.length; i++)
            {
                let config:table.TableBackgroundConfig = TableData.tableBackgroundConfig[i];
                if(config.id == id)
                {
                    return config;
                }
            }
            return null;
        }
        
        
        public static getSkinConfig(id:number) : table.TableSkinConfig
        {
            for(let i = 0; i < TableData.tableSkinConfig.length; i++)
            {
                let config:table.TableSkinConfig = TableData.tableSkinConfig[i];
                if(config.id == id)
                {
                    return config;
                }
            }
            return null;
        }

    }
}
