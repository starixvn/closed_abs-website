using System;
using System.Collections.Generic;
using System.Data;
using Fanex.ABS.Entities;

namespace Nexcel.ABS.DataAccess.Interface
{
    public interface IHelperDataAccess
    {
        List<ExchangeRate> GetAllCurrency();

        DataSet GetBalanceUpDay();
    }
}