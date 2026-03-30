-- Enable pgvector in public schema
create extension if not exists vector with schema public;