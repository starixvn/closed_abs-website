using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using DNAide.Data;
using Fanex.ABS.Entities;
using Fanex.ABS.Infrastructure.Extensions;
using Fanex.Data;
using Nexcel.ABS.DataAccess.Interface;

namespace Fanex.ABS.DataAccess.Impl
{
    public class HelperDataAccess : IHelperDataAccess
    {
        public List<ExchangeRate> GetAllCurrency()
        {
            var param = new Hashtable();
            var listExchangeRate = new List<ExchangeRate>();
            try
            {
                var dsResult = new DataSet();
                using (ObjectDb objDB = new ObjectDb("ExchangeSel"))
                {
                    objDB.AssignParamValues(param);
                    dsResult = objDB.ExecuteDataSet();

                    if (dsResult.Tables.Count <= 0) return listExchangeRate;
                    foreach (DataRow row in dsResult.Tables[0].Rows)
                    {
                        listExchangeRate.Add(new ExchangeRate
                            {
                                ExchangeId = DNAide.Core.CastAide.AsInt32(row["ExchangeID"]),
                                Currency = DNAide.Core.CastAide.AsString(row["Currency"])
                            });
                    }
                }
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return listExchangeRate;
        }

        public DataSet GetBalanceUpDay()
        {
            using (ObjectDb objDB = new ObjectDb("SelBalanceUpDay"))
            {
                return objDB.ExecuteDataSet();
            }
        }
    }
}