# MySQL Command Essentials Cheatsheet

## Connecting to MySQL
```sh
mysql -u username -p
```

## Show Databases
```sql
SHOW DATABASES;
```

## Create Database
```sql
CREATE DATABASE dbname;
```

## Use Database
```sql
USE dbname;
```

## Show Tables
```sql
SHOW TABLES;
```

## Create Table
```sql
CREATE TABLE tablename (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)
);
```

## Describe Table Structure
```sql
DESCRIBE tablename;
```

## Insert Data
```sql
INSERT INTO tablename (name) VALUES ('Alice');
```

## Select Data
```sql
SELECT * FROM tablename;
```

## Update Data
```sql
UPDATE tablename SET name = 'Bob' WHERE id = 1;
```

## Delete Data
```sql
DELETE FROM tablename WHERE id = 1;
```

## Drop Table
```sql
DROP TABLE tablename;
```

## Drop Database
```sql
DROP DATABASE dbname;
```

## Exit MySQL
```sql
EXIT;
```