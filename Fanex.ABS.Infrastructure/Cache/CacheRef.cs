// ----------------------------------------------------------------------
// <copyright file="CacheRef.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Cache
{
    using DNAide.Core;

    using RemotingRef;

    /// <summary>
    /// Summary description for CacheRef
    /// </summary>
    public static class CacheRef
    {
        #region Public Methods and Operators

        public static string GetBettype(object bettypeID)
        {
            return RefData.GetBetTypeName(bettypeID.ToString(), TWLang("en-US"), string.Empty);
        }

        public static string GetCombinationName(string betTeam)
        {
            string name = string.Empty;
            switch (betTeam)
            {
                case "110":
                    name = "Trixie";
                    break;
                case "1110":
                    name = "Yankee";
                    break;
                case "11110":
                    name = "Super Yankee";
                    break;
                case "111110":
                    name = "Heinz";
                    break;
                case "1111110":
                    name = "Super Heinz";
                    break;
                case "11111110":
                    name = "Goliath";
                    break;
            }
            return name;
        }

        public static string GetFncIndexName(object indexId)
        {
            return RefData.GetFncIndexName(CastAide.AsString(indexId), TWLang("en-US"));
        }

        public static string GetHorseTeamName(object codeID)
        {
            return RefData.GetHorseTeamName(CastAide.AsString(codeID), TWLang("en-US"));
        }

        public static string GetLeagueName(object leagueID)
        {
            return RefData.GetLeagueName(leagueID.ToString(), TWLang("en-US"), string.Empty);
        }

        public static string GetOddsTypeName(object oddsType)
        {
            return RefData.GetOddsTypeName(CastAide.AsString(oddsType), TWLang("en-US"));
        }

        public static string GetSportName(object sportID)
        {
            return RefData.GetSportName(sportID.ToString(), TWLang("en-US"), string.Empty);
        }

        public static string GetTeamName(object teamID)
        {
            return RefData.GetTeamName(teamID.ToString(), TWLang("en-US"), string.Empty);
        }

        #endregion

        #region Methods

        private static string TWLang(string lang)
        {
            switch (lang)
            {
                case "en-US":
                    return "en";
                case "zh-TW":
                    return "ch"; // Traditional
                case "zh-CN":
                    return "cs"; // Simplified
                case "ja-JP":
                    return "jp";
                case "th-TH":
                    return "th"; // Thai
                default:
                    return "en";
            }
        }

        #endregion
    }
}