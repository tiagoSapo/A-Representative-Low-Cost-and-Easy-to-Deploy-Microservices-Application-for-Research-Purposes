using Grpc.Net.Client;
using StoreFrontendFinal.Models;
using System.Xml.Linq;
using Proto;
using Grpc.Core;

namespace StoreFrontendFinal.Models.Utils
{
    public class UserServices
    {
        public static readonly string HOST = Environment.GetEnvironmentVariable("STORE_USERS_URL") != null ?
            Environment.GetEnvironmentVariable("STORE_USERS_URL") + "" :
            "store-users";
        public static readonly string PORT = Environment.GetEnvironmentVariable("STORE_USERS_URL") != null ?
            ":5000" : ":5000";

        private readonly GrpcChannel channel;
        private readonly UserService.UserServiceClient service;

        public UserServices()
        {
            string address = string.Format("http://{0}{1}", HOST, PORT);
            channel = GrpcChannel.ForAddress(address);
            service = new UserService.UserServiceClient(channel);
        }
        public bool IsValidUser(AuthViewModel auth)
        {
            try
            {
                var response = service.authenticate(new Auth { Email = auth.Email, Password = auth.Password });
                return response.Ok_;
            }
            catch (RpcException ex)
            {
                throw ex;
            }
        }
        public List<Country> GetCountries()
        {
            try
            {
                var response = service.getCountries(new Empty());
                var countries = response.Country.ToList();
                return countries;
            }
            catch (RpcException ex)
            {
                throw ex;
            }
        }

        internal bool Register(User user)
        {
            try
            {
                var ok = service.register(user);
                return ok.Ok_;
            }
            catch (RpcException ex)
            {
                throw ex;
            }
        }

        internal User? GetUserByEmail(string? email)
        {
            if (email == null || email.Equals(""))
                return null;

            try
            {
                return service.getUserByEmail(new Email { Email_ = email });
            }
            catch (RpcException)
            {
                return null;
            }
        }

        internal User? GetUserById(int? clientId)
        {
            if (clientId == null)
                return null;

            return service.getUserById(new Id { Id_ = (int)clientId });
        }

        internal bool DeleteUser(int? clientId)
        {
            if (clientId == null)
                return false;

            return service.removeUser(new Id { Id_ = (int)clientId }).Ok_;
        }

        internal bool UpdateUser(User? user) 
        {

                if (user == null)
                    return false;

                return service.updateUser(user).Ok_;
            
        }
    }
}
