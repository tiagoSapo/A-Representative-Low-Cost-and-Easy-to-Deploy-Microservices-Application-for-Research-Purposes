using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Grpc.Net.Client;
using Proto;
using System;

namespace ClientGRPC
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Starting ...");

            // Ask for store-users address
            Console.Write("Enter the STORE-USERS microservice address (HTTP only!) (e.g., http://store-users.eu-north-1.elasticbeanstalk.com:5000): ");
            string serverAddress = "";
            serverAddress = Console.ReadLine();

            // Check if it is not empty
            if (string.IsNullOrWhiteSpace(serverAddress))
            {
                Console.WriteLine("Invalid server address. Exiting...");
                return;
            }

            var channel = GrpcChannel.ForAddress(serverAddress);
            var client = new UserService.UserServiceClient(channel);

            try
            {
                client.addCountry(new Country { Id = 1, Name = "Portugal" });
                client.addCountry(new Country { Id = 2, Name = "Spain" });
                client.addCountry(new Country { Id = 3, Name = "France" });
                client.addCountry(new Country { Id = 4, Name = "United Kingdom (UK)" });
                client.addCountry(new Country { Id = 5, Name = "Italy" });
                client.addCountry(new Country { Id = 6, Name = "Germany" });
                client.addCountry(new Country { Id = 7, Name = "Switzerland" });

                Console.WriteLine("List of Countries -> = " + client.getCountries(new Proto.Empty()));
                Console.WriteLine("[SUCCESS] Countries added to the Store");
            }
            catch (Grpc.Core.RpcException ex)
            {
                Console.WriteLine("The URI doesn't exist [Make user you use HTTP and not HTTPS]: {0}", ex);
            }
        }
    }
}
