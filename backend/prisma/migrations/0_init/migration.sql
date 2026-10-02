create extension if not exists pgcrypto;

create type "Role" as enum ('USER', 'ADMIN');
create type "PaymentMethod" as enum ('CASH','CARD','BANK_TRANSFER','MOBILE_MONEY','OTHER');

create table "User" (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  "passwordHash" text not null,
  role "Role" not null default 'USER',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create index "User_createdAt_idx" on "User" ("createdAt");

create table "Category" (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  "isDefault" boolean not null default false,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table "Expense" (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  amount numeric(12,2) not null,
  date timestamptz not null,
  "paymentMethod" "PaymentMethod" not null,
  notes text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "userId" uuid not null references "User"(id) on delete cascade,
  "categoryId" uuid not null references "Category"(id)
);
create index "Expense_userId_date_idx" on "Expense" ("userId","date");
create index "Expense_userId_categoryId_idx" on "Expense" ("userId","categoryId");
create index "Expense_userId_paymentMethod_idx" on "Expense" ("userId","paymentMethod");

create table "Budget" (
  id uuid primary key default gen_random_uuid(),
  month int not null,
  year int not null,
  amount numeric(12,2) not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "userId" uuid not null references "User"(id) on delete cascade,
  unique ("userId","year","month")
);

alter table "User" enable row level security;
alter table "Category" enable row level security;
alter table "Expense" enable row level security;
alter table "Budget" enable row level security;
