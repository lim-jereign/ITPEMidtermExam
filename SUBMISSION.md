## Task 3

### Prompt used
(paste your exact prompt here)

### AI explanation of 3NF
(paste the AI's "Why this is in 3NF" section here)

### ERD (Mermaid.js)
```mermaid
erDiagram
    ROLES ||--o{ USERS : "assigned to"
    VENUES ||--o{ EVENTS : hosts
    USERS ||--o{ REGISTRATIONS : makes
    EVENTS ||--o{ REGISTRATIONS : receives

    ROLES {
        int RoleID PK
        varchar RoleName UK
    }
    USERS {
        bigint UserID PK
        int RoleID FK
        varchar FirstName
        varchar LastName
        varchar Email UK
        varchar PasswordHash
        datetime2 CreatedAt
        bit IsActive
    }
    VENUES {
        int VenueID PK
        varchar VenueName UK
        varchar Building
        varchar RoomName
        int Capacity
    }
    EVENTS {
        bigint EventID PK
        int VenueID FK
        varchar EventName
        varchar Description
        datetime2 StartDateTime
        datetime2 EndDateTime
        int Capacity
        datetime2 CreatedAt
    }
    REGISTRATIONS {
        bigint RegistrationID PK
        bigint UserID FK
        bigint EventID FK
        datetime2 RegisteredAt
        varchar RegistrationStatus
    }
```

### Database script
See `/database/schema.sql`.