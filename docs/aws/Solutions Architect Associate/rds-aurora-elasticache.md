---
title: "RDS, Aurora, and ElastiCache"
tags: ["AWS", "RDS", "Aurora", "ElastiCache"]
sidebar_position: 5
---

# Amazon RDS, Aurora, and ElastiCache Overview

---

## Amazon RDS (Relational Database Service)

### ✅ Features

* Managed relational database service
* Supports multiple engines: MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server
* Automated backups, software patching, and monitoring
* Read Replicas (except SQL Server)
* Multi-AZ deployments for HA
* Encryption at rest and in transit

### 🌍 AZ / Region Setup

* **Single AZ**: Basic deployments
* **Multi-AZ**: Synchronous standby in a second AZ (high availability)
* Cross-Region Read Replicas (for MySQL/PostgreSQL/MariaDB): Disaster recovery & performance

### 📦 Backup & Restore

* Automated daily backups retained for up to 35 days
* Manual snapshots can be retained indefinitely
* **Point-in-time restore** supported within retention period
* **Restore Options**:

  * Restore to new DB instance
  * Cross-region snapshot restore
  * Snapshot sharing across AWS accounts
  * AWS Backup service integration

### 🌐 Network & Connectivity

* RDS runs in a VPC
* Can assign Public or Private IP (via subnet group)
* Security groups to control inbound/outbound traffic
* **No built-in public IP unless explicitly assigned**

### 💵 Network Charges

* Data transfer **within the same AZ**: free
* **Between AZs or Regions**: incurs cost
* Snapshot copy across regions: charged

### 🔁 Restore Options

* Restore from automated backup/snapshot
* Restore across regions
* Restore from S3 (for PostgreSQL & MySQL): Must be formatted correctly
* **AWS Backup** can restore RDS snapshots with compliance tracking

### 🔒 Oracle & SQL Server Support

* Oracle and Microsoft SQL Server are available under:

  * **License Included** (managed by AWS)
  * **Bring Your Own License (BYOL)**
* Supports Oracle features like Data Guard (for Multi-AZ), Transparent Data Encryption
* SQL Server: Only Multi-AZ via Always On or Mirroring depending on edition

### 🛠️ Custom RDS

* Set custom parameter groups & option groups
* Choose instance size, storage type (gp3/io1/magnetic)
* Custom maintenance windows
* IAM authentication support (for MySQL/PostgreSQL)

### 📶 Auto Scaling

* **Storage Auto Scaling**:

  * Enabled for MySQL, PostgreSQL, MariaDB, SQL Server, Oracle
  * Automatically increase storage when capacity is exceeded
* Aurora has compute auto-scaling (serverless) which differs from RDS's storage-only scaling

### 💰 Pricing

* Pay per hour based on instance type and size
* Separate charges for:

  * Provisioned IOPS
  * Storage (GB-month)
  * Backup (beyond free quota)
  * Data transfer
* Reserved Instances and Savings Plans available

### 📌 Pros

* Easy to set up and manage
* Automated backups & patches
* Multi-AZ support = High availability
* Security & compliance features (encryption, IAM)

### ⚠️ Cons

* Limited fine-grained tuning vs self-managed DBs
* Some features vary across engines
* No access to OS-level customization

## RDS Read Replicas

* **Supported by MySQL, MariaDB, PostgreSQL, Oracle (limited)**
* **Used to scale reads and offload reporting/analytics workloads**
* **Cross-region Read Replicas**:

  * Allow asynchronous replication of data to a different AWS region
  * Enhance Disaster Recovery (DR) by ensuring a backup database instance in another region
  * Can be promoted to standalone DB instance during failover
  * Useful in latency-sensitive multi-region applications
* Read replicas are created from a source DB instance and use asynchronous replication
* Can be manually promoted to standalone DB
* Used in conjunction with Multi-AZ for better HA and DR coverage
* **Supported Engines**: MySQL, PostgreSQL, MariaDB, Aurora
* Used for:

  * Read scaling
  * Disaster recovery
* **Cross-Region** supported
* Up to 5 replicas per instance (up to 15 for Aurora)
* Can promote a replica to standalone
* Adds minor replication lag

### 🔁 Cross-Region Use Case

* Disaster recovery
* Global apps with geo-distributed reads

## RDS Proxy

* Improves database scalability by pooling connections
* Works with MySQL and PostgreSQL (Aurora + RDS)
* IAM-based authentication
* High availability (Multi-AZ)
* Reduces failover time
* Ideal for Lambda or serverless apps

---

## Amazon Aurora

### 🔍 What is Aurora?

* AWS's proprietary engine compatible with MySQL & PostgreSQL
* Up to **5x faster than MySQL**, **3x faster than PostgreSQL**
* Decouples storage and compute

### 🔧 Architecture

* **Storage**:

  * Auto-scaling up to 128 TB
  * 6-way replication across 3 AZs
* **Compute**:

  * 1 primary + up to 15 replicas
  * Failover in &lt; 30 seconds

### 📶 Aurora Serverless

* **v1**:

  * Suitable for infrequent, unpredictable workloads
  * Scales between min-max ACUs
  * Limited features, cold-starts
* **v2**:

  * Supports fine-grained (fractional) scaling
  * Multi-AZ, faster scaling
  * Supports more workloads (even production-grade)

### 🔒 Security

* Encryption at rest (KMS)
* TLS in-transit
* VPC isolation
* IAM + Secrets Manager integration

### 💵 Pricing

* On-demand or reserved
* Charged based on:

  * Aurora capacity units (ACUs)
  * Storage
  * I/O operations

### 📌 Pros

* High performance and availability
* Multi-AZ built-in
* Fast failover
* Scales compute and storage independently
* Serverless option for variable workloads

### ⚠️ Cons

* More expensive than standard RDS
* Not all features from RDS engines supported
* Less transparent (proprietary system)

---

## Amazon ElastiCache Overview

### 🧠 What is ElastiCache?

* In-memory data store/cache
* Supports:

  * Redis (persistent + pub/sub + streams)
  * Memcached (pure caching, no persistence)

### 💡 Use Cases

* Caching (DB/query results)
* Session store
* Leaderboards (gaming)
* Pub/Sub
* Rate limiting, throttling

### 🔁 Redis vs Memcached

| Feature         | Redis                | Memcached        |
| --------------- | -------------------- | ---------------- |
| Persistence     | Yes (AOF, RDB)       | No               |
| Data structures | Strings, Lists, Sets | Strings only     |
| Pub/Sub         | Yes                  | No               |
| Clustering      | Yes                  | Yes (basic)      |
| Multi-threaded  | No                   | Yes              |
| Use case        | Complex, persistent  | Simple, volatile |

### 🌍 AZ / Region Setup

* Deployed in VPC
* Supports Multi-AZ for Redis (with automatic failover)
* Memcached is single-AZ only

### 📀 Backup & Restore

* Available only for Redis
* Daily snapshots
* Manual backups
* Restore to new cluster

### 🌐 Network

* Connects via endpoint (private DNS)
* Security groups for control
* Not exposed publicly

### 💵 Network Charges

* No cost for in-AZ traffic
* Inter-AZ or cross-region replication: charged

### 🔄 Global Datastore (Redis only)

* Replication across regions
* Low-latency reads globally
* Use case: globally distributed apps, disaster recovery

### 📶 Auto Scaling

* Not native
* Requires custom logic with CloudWatch + Lambda
* Redis Cluster allows scale-out by sharding

### 💰 Pricing

* Based on:

  * Node type (memory optimized)
  * Hours used
  * Data transfer
  * Backup storage (Redis)
* Reserved pricing available

### 📌 Pros

* Microsecond latency
* Offloads DB workloads
* Horizontal scaling with Redis Cluster
* Supports complex data types (Redis)

### ⚠️ Cons

* Redis single-threaded (CPU-bound for some workloads)
* No built-in auto-scaling
* Requires careful memory eviction configuration

---
