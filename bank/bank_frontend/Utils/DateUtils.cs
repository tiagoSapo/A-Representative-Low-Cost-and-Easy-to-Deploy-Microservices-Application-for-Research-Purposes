using System;
namespace BankFrontend.Utils
{
	public class DateUtils
	{
		public static string GetCurrentTime()
		{
            DateTime currentTime = DateTime.Now;

            // Convert the time to a string
            string timeString = currentTime.ToString("yyyy-MM-dd HH:mm:ss");
			return timeString;
        }
	}
}

