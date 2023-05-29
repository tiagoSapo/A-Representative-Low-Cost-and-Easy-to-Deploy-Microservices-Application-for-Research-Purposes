using System;
using Grpc.Core;
using Microsoft.AspNetCore.Mvc;
using Proto;

namespace StoreFrontendFinal.Models.Utils
{
	public class AuthenticationHelper
	{
        
        internal static bool IsLoggedIn(HttpContext context)
        {
            var id = context.Session.GetInt32("id");
            if (id == null)
                return false;

            var name = context.Session.GetString("name");
            if (name == null)
                return false;

            var email = context.Session.GetString("email");
            if (email == null)
                return false;

            var password = context.Session.GetString("password");
            if (password == null)
                return false;

            return true;
        }

        internal static void Login(HttpContext context, User user)
        {
            context.Session.SetInt32("id", user.Id);
            context.Session.SetString("name", user.Name);
            context.Session.SetString("email", user.Email);
            context.Session.SetString("password", user.Password);
        }

        internal static void Logout(HttpContext context)
        {
            context.Session.Clear();
        }

        internal static User? GetUser(UserServices service, HttpContext context)
        {
            var loggedIn = IsLoggedIn(context);
            if (!loggedIn)
                return null;

            var email = context.Session.GetString("email");
            if (email == null)
                return null;

            return GetUserByEmail(service, context, email);
        }

        /**
         * Checks whether or not a user with a given email exists
         */
        private static User? GetUserByEmail(UserServices service, HttpContext context, string email)
        {
            try
            {
                return service.GetUserByEmail(email);
            }
            catch (RpcException)
            {
                return null;
            }
        }

        internal static bool DeleteUser(HttpContext context, UserServices service, int userId)
        {
            // Deleting user in user service
            var deleteOk = service.DeleteUser(userId);
            if (!deleteOk)
                return false;

            // Terminating user session
            Logout(context);
            return true;
        }

        internal static bool DeleteUser(HttpContext context, UserServices service, User user)
        {
            return DeleteUser(context, service, user.Id);
        }

        internal static bool UpdateUser(UserServices service, User user)
        {
            return service.UpdateUser(user);
        }
    }
}

