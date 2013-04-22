// ----------------------------------------------------------------------
// <copyright file="ExchangeRate.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Service.Impl.Helper
{
    using System.Collections.Generic;
    using Fanex.ABS.DataAccess.Impl;
    using Nexcel.ABS.DataAccess.Interface;

    public class ExchangeRate
    {
        #region Constants and Fields

        private readonly IHelperDataAccess _helperProvider;

        #endregion Constants and Fields

        #region Constructors and Destructors

        public ExchangeRate()
        {
            this._helperProvider = new HelperDataAccess();
        }

        #endregion Constructors and Destructors

        #region Public Methods and Operators

        public List<Entities.ExchangeRate> GetAllCurrency()
        {
            return this._helperProvider.GetAllCurrency();
        }

        #endregion Public Methods and Operators
    }
}