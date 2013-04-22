// ----------------------------------------------------------------------
// <copyright file="UnityBootStrapper.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl.BootStrappers
{
    using System;


    using Microsoft.Practices.ServiceLocation;
    using Microsoft.Practices.Unity;
    using Fanex.ABS.Infrastructure.Cache;
    using Nexcel.ABS.DataAccess.Interface;
    using Fanex.ABS.DataAccess.Impl;

    /// <summary>
    /// Summary description for UnityBootStrapper
    /// </summary>
    public class UnityBootStrapper : CommonBootStrapper
    {
        #region Methods

        protected override IServiceLocator CreateServiceLocator()
        {
            IUnityContainer container = new UnityContainer();
            Register(container);
            return new UnityServiceLocator(container);
        }

        /// <summary>
        /// Register all type to resolve 
        /// </summary>
        /// <param name="container"></param>
        private static void Register(IUnityContainer container)
        {
            container.RegisterType<ICacheFactory, MemCache>();

            RegisterReport(container);

            RegisterUser(container);

            RegisterCustomer(container);
        }

        private static void RegisterCustomer(IUnityContainer container)
        {
            container.RegisterType<ICustomerDataAccess, CustomerDataAccess>();
        }

        private static void RegisterReport(IUnityContainer container)
        {
            container.RegisterType<IHelperDataAccess, HelperDataAccess>();
            container.RegisterType<IInstantReportDataAccess, InstantReportDataAccess>();
            container.RegisterType<ISummaryReportDataAccess, SummaryReportDataAccess>();
            container.RegisterType<ISettleResultDataAccess, SettleResultDataAccess>();
        }

        private static void RegisterType<T1, T2>()
        {
            throw new NotImplementedException();
        }

        private static void RegisterUser(IUnityContainer container)
        {
            container.RegisterType<IUserDataAccess, UserDataAccess>();
        }

        #endregion
    }
}