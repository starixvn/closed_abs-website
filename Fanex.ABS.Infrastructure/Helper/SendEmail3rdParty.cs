// ----------------------------------------------------------------------
// <copyright file="SendEmail3rdParty.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Sunplus.Accounting.Core.Helper
{
    using System.Net;
    using System.Net.Mail;
    using System.Text;

    public class SendEmail3rdParty
    {
        #region Public Methods and Operators

        /// <summary>
        /// This function only used for local testing with smtp gmail
        /// </summary>
        /// <param name="subject"></param>
        /// <param name="title"></param>
        /// <param name="mailContent"></param>
        /// <param name="filePathAttach"></param>
        /// <param name="tomail">the email you want to receive</param>
        /// <param name="frommail">your gmail</param>
        /// <param name="pwd">your pwd gmail</param>
        /// <returns></returns>
        public static bool SendMail(
            string subject,
            string title,
            string mailContent,
            string filePathAttach,
            string tomail,
            string ccMail,
            string bccMail,
            string frommail,
            string pwd)
        {
            var msg = new MailMessage();

            tomail = tomail.Replace(";", ",");
            ccMail = ccMail.Replace(";", ",");
            bccMail = bccMail.Replace(";", ",");

            msg.To.Add(tomail);
            if (ccMail.Length > 0)
            {
                msg.CC.Add(ccMail);
            }
            if (bccMail.Length > 0)
            {
                msg.Bcc.Add(bccMail);
            }

            msg.From = new MailAddress(frommail, title, Encoding.UTF8);
            msg.Subject = subject;
            msg.SubjectEncoding = Encoding.UTF8;

            msg.IsBodyHtml = true;
            msg.Body = mailContent;
            msg.BodyEncoding = Encoding.UTF8;

            if (filePathAttach.Length > 0)
            {
                var attachFile = new Attachment(filePathAttach);
                msg.Attachments.Add(attachFile);
            }

            msg.Priority = MailPriority.High;

            var client = new SmtpClient();
            client.Credentials = new NetworkCredential(frommail, pwd);
            client.Port = 587;
            client.Host = "smtp.gmail.com";
            client.EnableSsl = true;
            try
            {
                client.Send(msg);
                return true;
            }
            catch
            {
                return false;
            }
        }

        #endregion
    }
}