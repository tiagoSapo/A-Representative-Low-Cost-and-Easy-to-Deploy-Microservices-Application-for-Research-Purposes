using System;
using BankFrontend.Utils;

namespace BankFrontend.Models
{
    public class Message
    {
        public long? ibanSender { get; set; } /* sender's id (who's sending the money)*/
        public long ibanReceiver { get; set; } /* receiver's id (who will receive the money)*/
        public double amount { get; set; } /* sum of money */
        public string date { get; set; } /* date of the transaction */

        /* Optinal fields */
        public int? orderId { get; set; } /* store's order id [OPTINAL!]*/
        public string? confirmationTopic { get; set; } /* store's confirmation topic [OPTINAL!]*/

        public Message()
        {
            date = DateUtils.GetCurrentTime().ToString();
        }
    }
}

