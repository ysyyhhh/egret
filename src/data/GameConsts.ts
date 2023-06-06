module game 
{
    export class MatchupData
    {
        row:number;
        col:number;
        colorValue:number;
        digitValue:number;
    }

    export class GameConsts 
    {
        public static is_iPhoneX:boolean = false;

        public static LineSize:number = 16;

        public static LineColors:number[] = [
            0xff7a68,
            0xffb61c,
            0x53f1ff,
            0xd7ff32,
        ];

        public static GuideInitDataList:MatchupData[] = [
            {row:0, col:0, colorValue:3, digitValue:1},
            {row:0, col:1, colorValue:1, digitValue:1},
            {row:0, col:2, colorValue:3, digitValue:2},
            {row:0, col:3, colorValue:1, digitValue:2},
            {row:0, col:4, colorValue:2, digitValue:2},
            {row:0, col:5, colorValue:1, digitValue:3},

            {row:1, col:0, colorValue:1, digitValue:2},
            {row:1, col:1, colorValue:4, digitValue:3},
            {row:1, col:2, colorValue:1, digitValue:2},
            {row:1, col:3, colorValue:3, digitValue:3},
            {row:1, col:4, colorValue:1, digitValue:2},
            {row:1, col:5, colorValue:3, digitValue:1},

            {row:2, col:0, colorValue:3, digitValue:3},
            {row:2, col:1, colorValue:3, digitValue:3},
            {row:2, col:2, colorValue:3, digitValue:2},
            {row:2, col:3, colorValue:3, digitValue:1},
            {row:2, col:4, colorValue:1, digitValue:1},
            {row:2, col:5, colorValue:3, digitValue:1},

            {row:3, col:0, colorValue:1, digitValue:1},
            {row:3, col:1, colorValue:4, digitValue:1},
            {row:3, col:2, colorValue:3, digitValue:3},
            {row:3, col:3, colorValue:1, digitValue:1},
            {row:3, col:4, colorValue:3, digitValue:2},
            {row:3, col:5, colorValue:2, digitValue:3},

            {row:4, col:0, colorValue:1, digitValue:3},
            {row:4, col:1, colorValue:1, digitValue:2},
            {row:4, col:2, colorValue:1, digitValue:3},
            {row:4, col:3, colorValue:3, digitValue:1},
            {row:4, col:4, colorValue:2, digitValue:3},
            {row:4, col:5, colorValue:1, digitValue:1},

            {row:5, col:0, colorValue:1, digitValue:3},
            {row:5, col:1, colorValue:3, digitValue:2},
            {row:5, col:2, colorValue:3, digitValue:1},
            {row:5, col:3, colorValue:4, digitValue:3},
            {row:5, col:4, colorValue:3, digitValue:1},
            {row:5, col:5, colorValue:3, digitValue:3}
        ];

        public static GuideDropDataList:MatchupData[] = [
            {row:0, col:0, colorValue:3, digitValue:1},
            {row:0, col:1, colorValue:1, digitValue:1},
            {row:0, col:2, colorValue:3, digitValue:2},
            {row:0, col:3, colorValue:1, digitValue:2},
            {row:0, col:4, colorValue:3, digitValue:1},
            {row:0, col:5, colorValue:1, digitValue:3},

            {row:1, col:0, colorValue:1, digitValue:2},
            {row:1, col:1, colorValue:4, digitValue:3},
            {row:1, col:2, colorValue:1, digitValue:2},
            {row:1, col:3, colorValue:1, digitValue:2},
            {row:1, col:4, colorValue:2, digitValue:2},
            {row:1, col:5, colorValue:1, digitValue:3},

            {row:2, col:0, colorValue:3, digitValue:3},
            {row:2, col:1, colorValue:3, digitValue:3},
            {row:2, col:2, colorValue:3, digitValue:2},
            {row:2, col:3, colorValue:3, digitValue:3},
            {row:2, col:4, colorValue:1, digitValue:2},
            {row:2, col:5, colorValue:3, digitValue:1},

            {row:3, col:0, colorValue:1, digitValue:1},
            {row:3, col:1, colorValue:4, digitValue:1},
            {row:3, col:2, colorValue:3, digitValue:3},
            {row:3, col:3, colorValue:3, digitValue:1},
            {row:3, col:4, colorValue:1, digitValue:1},
            {row:3, col:5, colorValue:3, digitValue:1},

            {row:4, col:0, colorValue:1, digitValue:3},
            {row:4, col:1, colorValue:1, digitValue:2},
            {row:4, col:2, colorValue:1, digitValue:3},
            {row:4, col:3, colorValue:1, digitValue:1},
            {row:4, col:4, colorValue:3, digitValue:2},
            {row:4, col:5, colorValue:2, digitValue:3},

            {row:5, col:0, colorValue:1, digitValue:3},
            {row:5, col:1, colorValue:3, digitValue:2},
            {row:5, col:2, colorValue:3, digitValue:1},
            {row:5, col:3, colorValue:4, digitValue:3},
            {row:5, col:4, colorValue:2, digitValue:3},
            {row:5, col:5, colorValue:1, digitValue:1}
        ];
    }
}