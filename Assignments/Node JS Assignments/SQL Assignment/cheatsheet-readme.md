# MySQL Command Essentials Cheatsheet

## Connecting to MySQL
```sh
mysql -u username -p           # Connect to MySQL as 'username'; the '-u' specifies the user, and '-p' prompts for your password. This command opens the MySQL command-line client for interactive use.
```

## Show Databases
```sql
SHOW DATABASES;                -- Lists all databases managed by the MySQL server, letting you see what databases are available to use or modify.
```

## Create Database
```sql
CREATE DATABASE dbname;        -- Creates a new database named 'dbname'. This is the first step before adding tables or data.
```

## Use Database
```sql
USE dbname;                    -- Switches the session to use the specified database 'dbname'. All subsequent commands will target this database until you change it.
```

## Show Tables
```sql
SHOW TABLES;                   -- Lists all tables within the currently selected database, helping you see the structure of your database.
```

## Create Table
```sql
CREATE TABLE tablename (
    id INT PRIMARY KEY AUTO_INCREMENT,   -- Defines an 'id' column as an integer that auto-increments for each new row, ensuring each row has a unique identifier.
    name VARCHAR(22)                     -- Defines a 'name' column as a variable-length string, up to 22 characters.
);                                       -- Only one PRIMARY KEY is allowed per table, which uniquely identifies each row.
```

## TINYINT Data Type
```sql
CREATE TABLE example (
    flag TINYINT(1)    -- The 'flag' column uses TINYINT, a very small integer type. Range is -128 to 127 (signed) or 0 to 255 (unsigned). Commonly used for boolean flags (0 or 1).
);
```
-- Use `TINYINT` for columns that only need to store small integer values, such as true/false or yes/no flags.

## Describe Table Structure
```sql
DESCRIBE tablename;             -- Shows the structure of 'tablename', including column names, data types, and key information. Useful for understanding table design.
```

## Insert Data
```sql
INSERT INTO tablename (name) VALUES ('Alice');   -- Inserts a new row into 'tablename', setting the 'name' column to 'Alice'. Other columns use their default values or NULL.
```

## Select Data
```sql
SELECT * FROM tablename;        -- Retrieves all rows and columns from 'tablename'. Useful for viewing the entire contents of a table.
```

## Update Data
```sql
UPDATE tablename SET name = 'Bob' WHERE id = 1;  -- Changes the 'name' to 'Bob' for the row where 'id' is 1. Only rows matching the WHERE condition are updated.
```

## Delete Data
```sql
DELETE FROM tablename WHERE id = 1;              -- Removes the row from 'tablename' where 'id' is 1. Only rows matching the condition are deleted.
```

## Drop Table
```sql
DROP TABLE tablename;            -- Permanently deletes 'tablename' and all its data from the database. This action cannot be undone.
```

## Drop Database
```sql
DROP DATABASE dbname;            -- Permanently deletes the entire database 'dbname' and all its tables. Use with caution, as all data will be lost.
```

## Exit MySQL
```sql
EXIT;                            -- Closes the MySQL command-line client and ends your session.
```