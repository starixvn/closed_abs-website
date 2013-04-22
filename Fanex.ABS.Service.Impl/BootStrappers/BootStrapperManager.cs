// ----------------------------------------------------------------------
// <copyright file="BootStrapperManager.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl.BootStrappers
{
    /// <summary>
    /// Summary description for BootStrapperManager
    /// </summary>
    public class BootStrapperManager
    {
        #region Constants and Fields

        private static CommonBootStrapper _bootStrapper;

        #endregion

        #region Public Properties

        public static CommonBootStrapper BootStrapper
        {
            get
            {
                return _bootStrapper;
            }
        }

        #endregion

        #region Public Methods and Operators

        public static void Initialize(CommonBootStrapper bootStrapper)
        {
            _bootStrapper = bootStrapper;
        }

        #endregion
    }
}