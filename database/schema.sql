CREATE DATABASE CampusEventManagement;
GO

USE CampusEventManagement;
GO

/* =========================================================
   ROLES
   ========================================================= */

CREATE TABLE dbo.Roles
(
    RoleID       INT IDENTITY(1,1) NOT NULL,
    RoleName     VARCHAR(20) NOT NULL,

    CONSTRAINT PK_Roles
        PRIMARY KEY CLUSTERED (RoleID),

    CONSTRAINT UQ_Roles_RoleName
        UNIQUE (RoleName),

    CONSTRAINT CK_Roles_RoleName
        CHECK (RoleName IN ('Student', 'Admin'))
);
GO


/* =========================================================
   USERS
   ========================================================= */

CREATE TABLE dbo.Users
(
    UserID        BIGINT IDENTITY(1,1) NOT NULL,
    RoleID        INT NOT NULL,
    FirstName     VARCHAR(100) NOT NULL,
    LastName      VARCHAR(100) NOT NULL,
    Email         VARCHAR(255) NOT NULL,
    PasswordHash  VARCHAR(255) NOT NULL,
    CreatedAt     DATETIME2(0) NOT NULL
        CONSTRAINT DF_Users_CreatedAt DEFAULT (SYSUTCDATETIME()),
    IsActive      BIT NOT NULL
        CONSTRAINT DF_Users_IsActive DEFAULT (1),

    CONSTRAINT PK_Users
        PRIMARY KEY CLUSTERED (UserID),

    CONSTRAINT FK_Users_Roles
        FOREIGN KEY (RoleID)
        REFERENCES dbo.Roles(RoleID)
        ON DELETE NO ACTION,

    CONSTRAINT UQ_Users_Email
        UNIQUE (Email),

    CONSTRAINT CK_Users_FirstName
        CHECK (LEN(LTRIM(RTRIM(FirstName))) > 0),

    CONSTRAINT CK_Users_LastName
        CHECK (LEN(LTRIM(RTRIM(LastName))) > 0),

    CONSTRAINT CK_Users_Email
        CHECK
        (
            Email LIKE '%_@_%._%'
            AND Email NOT LIKE '% %'
            AND Email NOT LIKE '%@%@%'
        )
);
GO

CREATE NONCLUSTERED INDEX IX_Users_RoleID
    ON dbo.Users(RoleID);
GO


/* =========================================================
   VENUES
   ========================================================= */

CREATE TABLE dbo.Venues
(
    VenueID       INT IDENTITY(1,1) NOT NULL,
    VenueName     VARCHAR(150) NOT NULL,
    Building      VARCHAR(150) NOT NULL,
    RoomName      VARCHAR(100) NOT NULL,
    Capacity      INT NOT NULL,

    CONSTRAINT PK_Venues
        PRIMARY KEY CLUSTERED (VenueID),

    CONSTRAINT UQ_Venues_Name
        UNIQUE (VenueName),

    CONSTRAINT CK_Venues_Capacity
        CHECK (Capacity > 0),

    CONSTRAINT CK_Venues_Name
        CHECK (LEN(LTRIM(RTRIM(VenueName))) > 0)
);
GO


/* =========================================================
   EVENTS
   ========================================================= */

CREATE TABLE dbo.Events
(
    EventID         BIGINT IDENTITY(1,1) NOT NULL,
    VenueID         INT NOT NULL,
    EventName       VARCHAR(200) NOT NULL,
    Description     VARCHAR(MAX) NULL,
    StartDateTime   DATETIME2(0) NOT NULL,
    EndDateTime     DATETIME2(0) NOT NULL,
    Capacity        INT NOT NULL,
    CreatedAt       DATETIME2(0) NOT NULL
        CONSTRAINT DF_Events_CreatedAt DEFAULT (SYSUTCDATETIME()),

    CONSTRAINT PK_Events
        PRIMARY KEY CLUSTERED (EventID),

    CONSTRAINT FK_Events_Venues
        FOREIGN KEY (VenueID)
        REFERENCES dbo.Venues(VenueID)
        ON DELETE NO ACTION,

    CONSTRAINT CK_Events_Capacity
        CHECK (Capacity > 0),

    CONSTRAINT CK_Events_DateTime
        CHECK (EndDateTime > StartDateTime),

    CONSTRAINT CK_Events_Name
        CHECK (LEN(LTRIM(RTRIM(EventName))) > 0)
);
GO

CREATE NONCLUSTERED INDEX IX_Events_VenueID
    ON dbo.Events(VenueID);
GO

CREATE NONCLUSTERED INDEX IX_Events_StartDateTime
    ON dbo.Events(StartDateTime);
GO


/* =========================================================
   REGISTRATIONS
   ========================================================= */

CREATE TABLE dbo.Registrations
(
    RegistrationID    BIGINT IDENTITY(1,1) NOT NULL,
    UserID            BIGINT NOT NULL,
    EventID           BIGINT NOT NULL,
    RegisteredAt      DATETIME2(0) NOT NULL
        CONSTRAINT DF_Registrations_RegisteredAt
        DEFAULT (SYSUTCDATETIME()),
    RegistrationStatus VARCHAR(20) NOT NULL
        CONSTRAINT DF_Registrations_Status
        DEFAULT ('Registered'),

    CONSTRAINT PK_Registrations
        PRIMARY KEY CLUSTERED (RegistrationID),

    CONSTRAINT FK_Registrations_Users
        FOREIGN KEY (UserID)
        REFERENCES dbo.Users(UserID)
        ON DELETE NO ACTION,

    CONSTRAINT FK_Registrations_Events
        FOREIGN KEY (EventID)
        REFERENCES dbo.Events(EventID)
        ON DELETE NO ACTION,

    CONSTRAINT UQ_Registrations_User_Event
        UNIQUE (UserID, EventID),

    CONSTRAINT CK_Registrations_Status
        CHECK
        (
            RegistrationStatus IN
            ('Registered', 'Cancelled')
        )
);
GO

CREATE NONCLUSTERED INDEX IX_Registrations_UserID
    ON dbo.Registrations(UserID);
GO

CREATE NONCLUSTERED INDEX IX_Registrations_EventID
    ON dbo.Registrations(EventID);
GO