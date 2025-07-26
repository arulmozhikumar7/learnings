---
title: "EC2 Fundamentals"
date: 2025-07-23
tags: ["AWS", "EC2"]
sidebar_position: 1
---

# AWS EC2 Fundamentals 

These are my personal notes while preparing for AWS Certified Solutions Architect – Associate (SAA-C03), based on Stéphane Maarek's course.

---

## What is EC2

EC2 (Elastic Compute Cloud) is one of the most popular services provided by AWS and represents Infrastructure as a Service (IaaS).

**Main capabilities of EC2:**

* Renting virtual machines (EC2)
* Storing data on virtual drives (EBS)
* Distributing load across machines (ELB)
* Scaling the services using an Auto Scaling Group (ASG)

> ⚠️ Knowing EC2 is fundamental to understanding how the cloud works.

---

## EC2 Sizing & Configuration Options

When launching an EC2 instance, you configure:

* Operating System (Linux, Windows, Mac OS)
* Compute power (CPU) and number of cores
* Memory (RAM)
* Storage options:

  * Network-attached: EBS or EFS
  * Hardware-attached: Instance Store
* Network settings: speed, Public IP, VPC, Subnet
* Firewall rules: Security Group
* Bootstrap script: EC2 User Data (for automation)

---

## AMI (Amazon Machine Image)

* A template used to launch EC2 instances
* Contains OS, software, configurations
* Types:

  * AWS provided
  * AWS Marketplace
  * Custom (user-created)

Use case: Easily replicate environments.

---

## Instance Types

EC2 instance types are grouped into families based on performance characteristics:

### General Purpose

* Balanced between compute, memory, and networking
* Use cases: web servers, development, testing

### Compute Optimized

* High performance for compute-heavy workloads
* Use cases:

  * Batch processing
  * Media transcoding
  * High performance web servers
  * Scientific modeling, ML, gaming

### Memory Optimized

* High-speed performance for memory-intensive applications
* Use cases:

  * In-memory databases (Redis)
  * Real-time big data analytics
  * BI systems

### Storage Optimized

* High throughput for read/write-heavy apps
* Use cases:

  * OLTP systems
  * Data warehousing
  * NoSQL databases
  * Distributed file systems

More at: [https://aws.amazon.com/ec2/instance-types/](https://aws.amazon.com/ec2/instance-types/)

---

## Instance Lifecycle

1. **Pending** → provisioning
2. **Running** → active
3. **Stopping** → shutting down
4. **Stopped** → off but storage retained
5. **Terminated** → deleted permanently

> ⚠️ Terminated instances cannot be recovered.

---

## Key Pairs

* SSH (Linux) or RDP (Windows) access
* Public key stored in AWS
* Private key (.pem) is downloaded once

> ⚠️ Keep private keys secure. Cannot be re-downloaded.

---

## EC2 User Data

* Bootstrap script run on **first launch only**
* Script runs as **root user**
* Used to automate common tasks:

  * Installing updates
  * Installing packages
  * Downloading setup scripts/files

```bash
#!/bin/bash
yum update -y
yum install -y httpd
```

> ⚠️ Useful for launching pre-configured instances.

---

## Public IP vs Elastic IP

| Type       | Description                    |
| ---------- | ------------------------------ |
| Public IP  | Dynamic; changes on stop/start |
| Elastic IP | Static, reattachable public IP |

> ⚠️ Elastic IPs incur charges when unattached.

---

## Security Groups

* Acts as a **virtual firewall** at the instance level
* Controls **inbound and outbound** traffic
* **Only allow rules** are supported (no deny rules)
* Rules defined by:

  * IP range (IPv4/IPv6)
  * Port
  * Protocol
  * Reference to other security groups

### Key Details

* Stateful: return traffic is auto-allowed
* Applied to multiple instances
* Locked to Region + VPC
* Operates **outside EC2**

### Troubleshooting

* Timeout: security group issue
* Connection refused: app not running

### Recommended

* Create separate security group for SSH

---

## Common Ports to Know

| Port | Protocol | Usage                 |
| ---- | -------- | --------------------- |
| 22   | SSH      | Linux access          |
| 21   | FTP      | File upload           |
| 22   | SFTP     | Secure FTP            |
| 80   | HTTP     | Unsecured web traffic |
| 443  | HTTPS    | Secured web traffic   |
| 3389 | RDP      | Windows access        |

---

## Placement Groups

| Type      | Description                                      |
| --------- | ------------------------------------------------ |
| Cluster   | Same rack; low latency, high throughput          |
| Spread    | Each instance on different rack; fault tolerance |
| Partition | Groups of instances in isolated partitions       |

---

## Tenancy

| Tenancy            | Description                             |
| ------------------ | --------------------------------------- |
| Default            | Shared hardware                         |
| Dedicated Instance | Dedicated hardware (per instance level) |
| Dedicated Host     | Entire physical server reserved         |

> ⚠️ Dedicated Host = BYOL compliance (e.g. Windows Server licensing)

---

## Pricing Models

| Model              | Description                      | Use Case                        |
| ------------------ | -------------------------------- | ------------------------------- |
| On-Demand          | Pay per hour/second              | Dev, test, short-term workloads |
| Reserved           | 1/3-year term                    | Predictable workloads           |
| Spot               | Up to 90% cheaper, interruptible | Batch, fault-tolerant workloads |
| Dedicated Instance | Runs on dedicated hardware       | Isolation needed                |
| Dedicated Host     | Full server control              | Licensing/Compliance            |

---

## Spot Instances

* Spare EC2 capacity offered at discounted rates
* AWS can terminate with 2 minutes’ notice
* Use cases:

  * Machine Learning
  * CI/CD jobs
  * Data processing

---

## Spot Fleet

* Launch a group of Spot and On-Demand instances
* Specify:

  * Target capacity
  * Instance types
  * Pricing limits
* AWS manages allocation based on your strategy:

  * **lowestPrice**
  * **capacityOptimized**

---

## Termination Protection

* Prevents accidental termination of EC2 instance
* Must be **disabled** before deleting an instance

Set via:

* AWS Console
* CLI: `aws ec2 modify-instance-attribute`


## Key Points to Remember

* EC2 = foundational AWS service (IaaS)
* Security Groups are stateful and only allow traffic
* User Data script runs once at first boot
* Elastic IPs cost money if unattached
* Spot instances offer massive cost savings with risk of termination
* Dedicated Hosts support licensing compliance (e.g., BYOL)
* Terminated instances can't be recovered
