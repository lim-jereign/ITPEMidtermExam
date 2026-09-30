using System;

namespace CampusEvents.Backend
{
    public interface IEventRepository
    {
        int GetCapacity(long eventId);
        int GetRegisteredCount(long eventId); // dapat hindi kasama ang 'Cancelled'
    }

    public class RegistrationValidator
    {
        private const string AllowedDomain = "@univ.edu.ph";
        private readonly IEventRepository _events;

        public RegistrationValidator(IEventRepository events) => _events = events;

        public bool IsValidStudentEmail(string? email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;
            var e = email.Trim();
            return !e.Contains(' ')
                && e.Length > AllowedDomain.Length
                && e.EndsWith(AllowedDomain, StringComparison.OrdinalIgnoreCase);
        }

        public bool HasAvailableSeat(long eventId) =>
            _events.GetRegisteredCount(eventId) < _events.GetCapacity(eventId);
    }
}