// ----------------------------------------------------------------------
// <copyright file="CommonBootStrapper.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl.BootStrappers
{
    using Microsoft.Practices.ServiceLocation;

    /// <summary>
    /// Summary description for CommonBootStrapper
    /// </summary>
    public abstract class CommonBootStrapper
    {
        #region Constants and Fields

        public static IServiceLocator Locator;

        #endregion

        #region Constructors and Destructors

        public CommonBootStrapper()
        {
            Locator = this.CreateServiceLocator();
        }

        #endregion

        #region Methods

        protected abstract IServiceLocator CreateServiceLocator();

        #endregion
    }
}