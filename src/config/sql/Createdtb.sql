CREATE DATABASE [benhvien]
Go
USE [benhvien]
Go
---1
create table [dbo].[user]
(
	[id] [int] identity(1,1) primary key not null,
	[email] [nvarchar](250) unique null,
	[avatar] [ntext] null,
	[full_name] [nvarchar](250) not null,
	[phone_number] [nvarchar](250) null,
	[gender] [bit] not null,
	[date_of_birth] [date] not null,
	[address] [nvarchar](50) null,
	[identification] [char](12) null
)
go
---2
create table [dbo].[security]
(
	[id] [int] identity(1,1) primary key not null,
	[userId] [int] null,
	[refreshToken] [ntext] null,
	[username] [nvarchar](50) unique not null,
	[password] [ntext] not null,
	[role] [int] not null
)
alter table [dbo].[security] add constraint FK_security_userId foreign key ([userId]) references [dbo].[user]([id]) on delete set null
go
---3
create table [dbo].[department] 
(
	[id] [int] identity(1,1) primary key not null,
	[name] [nvarchar](50) not null
)
go
---4
create table [dbo].[doctor]
(
	[id] [int] identity(1,1) primary key not null,
	[userId] [int] null,
	[departmentId] [int] null,
	[position] [tinyint] check(0 <= [position] and [position] <= 2) not null,
	[doctor_rank] [tinyint] check(0 <= [doctor_rank] and [doctor_rank] <= 4) not null
)
alter table [dbo].[doctor] add constraint FK_doctor_userId foreign key ([userId]) references [dbo].[user]([id]) on delete set null
alter table [dbo].[doctor] add constraint FK_doctor_departmentId foreign key ([departmentId]) references [dbo].[department]([id]) on delete set null
go
---5
create table [dbo].[patient]
(
	[id] [int] identity(1,1) primary key not null,
	[userId] [int] null,
	[insurance] [varchar] not null
)
alter table [dbo].[patient] add constraint FK_patient_userId foreign key ([userId]) references [dbo].[user]([id]) on delete set null
go
---6
create table [dbo].[onboarding]
(
	[id] [int] identity(1,1) primary key not null,
	[patientId] [int] null,
	[departmentId] [int] null,
	[boarding_status] [tinyint] check(0 <= [boarding_status] and [boarding_status] <= 2) not null 
)
alter table [dbo].[onboarding] add constraint FK_onboarding_patientId foreign key ([patientId]) references [dbo].[patient]([id]) on delete set null
alter table [dbo].[onboarding] add constraint FK_onboarding_departmentId foreign key ([departmentId]) references [dbo].[department]([id]) on delete set null
go
---7
create table [dbo].[medications]
(
	[id] [int] identity(1,1) primary key not null,
	[name] [nvarchar](50) not null,
	[designation] [ntext] not null,
	[usage] [ntext] not null,
	[price] [float] not null
)
go
---8
create table [dbo].[diseases]
(
	[id] [int] identity(1,1) primary key not null,
	[name] [nvarchar](50) not null,
	[symptom] [ntext] not null,
	[prevention] [ntext] not null,
	[departmentId] [int] null,
)
alter table [dbo].[diseases] add constraint FK_diseases_departmentId foreign key ([departmentId]) references [dbo].[department]([id]) on delete set null
go
---9
create table [dbo].[health]
(
	[id] [int] identity(1,1) primary key not null,
	[patientId] [int] null,
	[heart_rate] [int] not null,
	[temperature] [int] not null,
	[blood_pessure_systolic] [int] not null,
	[blood_pressure_diastolic] [int] not null,
	[glucose] [int] not null,
	[weight] [int] not null,
	[height] [int] not null
)
alter table [dbo].[health] add constraint FK_health_patientId foreign key ([patientId]) references [dbo].[patient]([id]) on delete set null
go
---10
create table [dbo].[health_diseases]
(
    [healthId] [int] not null,
    [diseaseId] [int] not null,
    PRIMARY KEY ([healthId], [diseaseId]),
    FOREIGN KEY ([healthId]) REFERENCES [dbo].[health]([id]),
    FOREIGN KEY ([diseaseId]) REFERENCES [dbo].[diseases]([id])
)
go
---11
create table [dbo].[appointment_schedule]
(
	[id] [int] identity(1,1) primary key not null,
	[doctorId] [int] null,
	[patientId] [int] null,
	[appointment_date] [datetime] default(getdate()),
	[approve] [bit] not null,
	[initialSymptom] [ntext] null,
	[status_appointment] [tinyint] check(0 <= [status_appointment] and [status_appointment] <= 3) default(0) not null,
	[type_appointment] [tinyint] check(0 <= [type_appointment] and [type_appointment] <= 3) not null
)
alter table [dbo].[appointment_schedule] add constraint FK_appointment_schedule_patientId foreign key ([patientId]) references [dbo].[patient]([id]) on delete set null
alter table [dbo].[appointment_schedule] add constraint FK_appointment_schedule_doctorId foreign key ([doctorId]) references [dbo].[doctor]([id]) on delete set null
go
---12
create table [dbo].[test_service]
(
	[id] [int] identity(1,1) primary key not null,
	[service] [tinyint] not null,
	[price] [float] not null
)
go
---13
create table [dbo].[test_result]
(
	[id] [int] identity(1,1) primary key not null,
	[doctorId] [int] null,
	[reason] [int] not null
)
alter table [dbo].[test_result] add constraint FK_test_result_doctorId foreign key ([doctorId]) references [dbo].[doctor]([id]) on delete set null
go

---14
create table [dbo].[history]
(
	[id] [int] identity(1,1) primary key not null,
	[appointmentscheduleId] [int] null,
	[diagnosis] [ntext] null,
)
alter table [dbo].[history] add constraint FK_history_appointmentscheduleId foreign key ([appointmentscheduleId]) references [dbo].[appointment_schedule]([id]) on delete set null
go

---15
create table [dbo].[prescription]
(
	[historyId] [int] not null,
	[medicationId] [int] null
)
alter table [dbo].[prescription] add constraint FK_prescription_historyId foreign key ([historyId]) references [dbo].[history]([id])
alter table [dbo].[prescription] add constraint FK_prescription_medicationId foreign key ([medicationId]) references [dbo].[medications]([id]) on delete set null
go
---16
create table [dbo].[tests]
(
    [resultId] [int] null,
    [serviceId] [int] null,
	[historyId] [int] null
)
alter table [dbo].[tests] add constraint FK_tests_historyId foreign key ([historyId]) references [dbo].[history]([id]) on delete set null
alter table [dbo].[tests] add constraint FK_tests_resultId foreign key ([resultId]) references [dbo].[test_result]([id]) on delete set null
alter table [dbo].[tests] add constraint FK_tests_serviceId foreign key ([serviceId]) references [dbo].[test_service]([id]) on delete set null
go
---17
create table [dbo].[posts]
(
	[id] [int] identity(1,1) primary key not null,
	[author] [int] null,
	[content] [ntext] not null,
	[title] [ntext] not null,
	[image] [ntext] null,
	[template] [tinyint] default(0) not null,
)
alter table [dbo].[posts] add constraint FK_posts_author foreign key ([author]) references [dbo].[user]([id]) on delete set null
go

