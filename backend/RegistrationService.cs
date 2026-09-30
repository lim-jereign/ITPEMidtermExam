using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;

public sealed class RegistrationService
{
    private readonly string _connectionString;

    public RegistrationService(string connectionString)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new ArgumentException("A connection string is required.", nameof(connectionString));
        }

        _connectionString = connectionString;
    }

    public List<RegistrationRecord> GetUserRegistration(string inputEmail)
    {
        if (inputEmail == null)
        {
            throw new ArgumentNullException(nameof(inputEmail));
        }

        const string query = @"
            SELECT r.RegistrationID,
                   r.UserID,
                   r.EventID,
                   r.RegisteredAt,
                   r.RegistrationStatus
            FROM dbo.Registrations AS r
            INNER JOIN dbo.Users AS u ON u.UserID = r.UserID
            WHERE u.Email = @Email;";

        var registrations = new List<RegistrationRecord>();

        using (var connection = new SqlConnection(_connectionString))
        using (var command = new SqlCommand(query, connection))
        {
            command.Parameters.Add("@Email", SqlDbType.VarChar, 255).Value = inputEmail;
            connection.Open();

            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    registrations.Add(new RegistrationRecord
                    {
                        RegistrationID = reader.GetInt64(0),
                        UserID = reader.GetInt64(1),
                        EventID = reader.GetInt64(2),
                        RegisteredAt = reader.GetDateTime(3),
                        RegistrationStatus = reader.GetString(4)
                    });
                }
            }
        }

        return registrations;
    }
}

public sealed class RegistrationRecord
{
    public long RegistrationID { get; set; }
    public long UserID { get; set; }
    public long EventID { get; set; }
    public DateTime RegisteredAt { get; set; }
    public string RegistrationStatus { get; set; }
}