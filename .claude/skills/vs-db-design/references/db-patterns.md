# Database Design Patterns Reference

## SQLite vs SQL Server

| Feature | SQLite | SQL Server |
|---------|--------|------------|
| Use case | Local, single-user, prototyping, small apps | Multi-user, production, enterprise |
| Auto-increment | `INTEGER PRIMARY KEY AUTOINCREMENT` | `INT IDENTITY(1,1)` |
| Boolean | INTEGER (0/1) | BIT |
| Date/Time | TEXT (ISO 8601) or INTEGER (Unix) | DATETIME2, DATE, TIME |
| UUID | TEXT | UNIQUEIDENTIFIER |
| JSON | TEXT (with json functions) | NVARCHAR(MAX) with JSON functions |
| Max DB size | ~281 TB (practical: < 1GB recommended) | 524 PB |
| Concurrency | Single writer, multiple readers | Full ACID, row-level locking |
| Migrations | Manual or Alembic | EF Migrations, Alembic, Flyway |

## Common Patterns

### Audit Columns
```sql
created_at  DATETIME2 NOT NULL DEFAULT GETDATE(),
updated_at  DATETIME2 NOT NULL DEFAULT GETDATE(),
created_by  NVARCHAR(100),
updated_by  NVARCHAR(100)
```
- Add to every table by default
- SQLite: use `DATETIME DEFAULT (datetime('now'))`

### Soft Deletes
```sql
is_deleted  BIT NOT NULL DEFAULT 0,
deleted_at  DATETIME2 NULL,
deleted_by  NVARCHAR(100) NULL
```
- Use when: data retention is required, undo functionality needed
- Always filter with `WHERE is_deleted = 0` in queries
- Consider a view for "active" records

### Many-to-Many (Junction Table)
```sql
CREATE TABLE user_roles (
    user_id     INT NOT NULL REFERENCES users(id),
    role_id     INT NOT NULL REFERENCES roles(id),
    assigned_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (user_id, role_id)
);
```

### Polymorphic Associations (avoid when possible)
- Prefer: separate join tables per type
- If needed: use `entity_type` + `entity_id` columns with CHECK constraints

## Indexing Strategy

### When to Index
- Foreign keys (always)
- Columns used in WHERE clauses frequently
- Columns used in ORDER BY
- Columns used in JOIN conditions

### When NOT to Index
- Small tables (< 1000 rows)
- Columns with very low cardinality (e.g., boolean)
- Columns that are rarely queried

### Composite Indexes
- Column order matters: most selective first
- Consider covering indexes for frequent queries

## Naming Conventions
- Tables: `snake_case`, plural (`users`, `order_items`)
- Columns: `snake_case`, singular (`user_id`, `created_at`)
- Primary keys: `id` (simple) or `{table}_id` (explicit)
- Foreign keys: `{referenced_table}_id`
- Indexes: `ix_{table}_{columns}`
- Unique constraints: `uq_{table}_{columns}`

## Migration Best Practices
- One migration per logical change
- Always include both up and down migrations
- Never modify a migration that's been applied to production
- Test migrations on a copy of production data
- Use transactions for DDL when the database supports it (SQL Server does, SQLite doesn't for some operations)
