---
title: "Scaling and Load Balancing"
tags: ["AWS", "EC2", "Auto Scaling", "Load Balancer"]
sidebar_position: 4
---

# AWS Scaling & Load Balancing

## 1. Vertical vs Horizontal Scaling

| Aspect             | Vertical Scaling                  | Horizontal Scaling                           |
| ------------------ | --------------------------------- | -------------------------------------------- |
| Definition         | Increase instance size (CPU, RAM) | Increase number of instances                 |
| Example            | EC2 t3.medium → m5.large          | Add EC2s via Auto Scaling Group              |
| Downtime           | Likely required                   | No downtime (if architected properly)        |
| Scalability        | Limited by instance type          | Virtually unlimited                          |
| Cost Optimization  | Can be costlier long-term         | Pay-as-you-go with granular scale            |
| Resilience         | Single point of failure           | High availability via redundancy             |
| Operational Impact | Simple to implement               | Requires LB, health checks, and architecture |

---

## 2. Load Balancer Types in AWS

### 2.1 Classic Load Balancer (CLB)

* Legacy ELB option that operates at both **Layer 4 (TCP)** and **Layer 7 (HTTP/HTTPS)**.
* **Basic features only**, not suitable for modern app architecture.
* Limited protocol support, no content-based routing.
* Supports connection draining and basic sticky sessions via duration-based cookies.
* Uses EC2 instance health checks.

### 2.2 Application Load Balancer (ALB)

* Operates at **Layer 7** for intelligent HTTP/HTTPS/gRPC traffic routing.
* Supports:

  * **Path-based routing**: `/api/*` → one service, `/auth/*` → another.
  * **Host-based routing**: `api.example.com`, `auth.example.com`
  * **WebSockets** and **HTTP/2**
  * **Lambda** functions as targets
  * Advanced routing with listener rules and priority
* Sticky sessions supported via **AWSALB cookie** or **app-defined cookie**.
* Works with Target Groups for modular scaling.

### 2.3 Network Load Balancer (NLB)

* Works at **Layer 4 (TCP/UDP/TLS)**.
* High performance: handles **millions of connections per second**.
* Assign **Elastic IPs** and use **static IPs** per AZ.
* TLS termination supported (bring your own certs or use ACM).
* Ideal for extreme performance or low-latency needs.

### 2.4 Gateway Load Balancer (GLB)

* Transparent Layer 3 load balancing for **security appliances**.
* Use cases:

  * Deploying third-party firewall, intrusion detection, or deep packet inspection.
* Traffic is encapsulated using **GENEVE** protocol.
* Works in tandem with autoscaling of appliances.

---

## 3. Sticky Sessions (Session Affinity)

* Ensures a client is bound to a specific target for the duration of a session.
* Useful when the backend is stateful (e.g., user session in memory).

| Load Balancer | Sticky Sessions | Mechanism                          |
| ------------- | --------------- | ---------------------------------- |
| ALB           | ✅ Yes           | Cookie-based: AWSALB or app cookie |
| CLB           | ✅ Yes           | Duration-based cookies             |
| NLB           | ❌ No            | Not supported                      |
| GLB           | ❌ No            | Not applicable                     |

* ALB: You can configure stickiness on the target group level.
* Avoid using sticky sessions for **stateless** apps or microservices.

---

## 4. Auto Scaling Group (ASG)

* Automatically adjusts EC2 instances based on load, policies, or schedules.
* Ensures high availability and optimized cost.
* Monitors instances and replaces unhealthy ones.
* Uses EC2 or ELB health checks.

### Key Components:

* **Launch Template** or **Launch Configuration** (template preferred)
* **Min/Max/Desired Capacity**
* **Scaling Policies** (Target Tracking, Step, Scheduled)
* **Cooldown Periods**
* **Instance Refresh** feature for rolling updates

### 4.1 Launch Templates vs Launch Configurations

| Feature                 | Launch Configuration | Launch Template                      |
| ----------------------- | -------------------- | ------------------------------------ |
| Versioning Support      | ❌ No                 | ✅ Yes                                |
| Multiple Instance Types | ❌ No                 | ✅ Yes                                |
| EBS and Network Support | Basic                | Full control (user data, tags, etc.) |
| Supported Features      | Legacy only          | All current & future ASG features    |
| Recommendation          | ❌ Deprecated         | ✅ Use this                           |

---

## 5. Types of Scaling

### 5.1 Dynamic Scaling

* Reacts to changing load based on metrics.

#### Target Tracking Scaling

* Tracks a specific metric like CPU utilization.
* Example: Keep average CPU utilization at 50%
* Auto adjusts instance count to maintain that level.
* Simplest and recommended for most scenarios.

#### Step/Policy-Based Scaling

* Uses CloudWatch alarms with thresholds.
* Allows scaling in **steps**.
* Example:

  * CPU > 60% → add 1 instance
  * CPU > 80% → add 2 instances

#### Scheduled Scaling

* Scales to a specified number of instances at a specific time.
* Use for predictable load patterns (e.g., business hours).

### Summary Table

| Scaling Type      | Trigger                 | Use Case                              |
| ----------------- | ----------------------- | ------------------------------------- |
| Target Tracking   | Metric value (e.g. CPU) | General workloads                     |
| Step/Policy-Based | CloudWatch alarms       | Granular thresholds, bursty workloads |
| Scheduled         | Time-based              | Predictable usage windows             |

---

## 6. Connection Draining (Deregistration Delay)

* Allows in-flight requests to complete before instance termination or deregistration.
* Prevents 5xx errors during scale-in, deployment, or manual removal.
* Default timeout: **300 seconds** (configurable per target group).
* During draining:

  * **No new connections** are routed
  * Existing connections complete

---

## 7. Cross-Zone Load Balancing

* Ensures even traffic distribution across AZs.

| Load Balancer | Default State | Configurable | Notes                                           |
| ------------- | ------------- | ------------ | ----------------------------------------------- |
| ALB           | ✅ Enabled     | Yes          | No additional cost                              |
| NLB           | ❌ Disabled    | Yes          | May incur cross-AZ data charges                 |
| CLB           | ❌ Disabled    | Yes          | Needed for even traffic distribution across AZs |

* If disabled, each AZ only serves traffic for its registered targets.
* Can lead to uneven usage if targets are unbalanced.

---

## 8. Public IPs, Elastic IPs, and DNS Behavior

### Do Load Balancers have Public IPs?

| Load Balancer | Static IP | Elastic IP | Notes                         |
| ------------- | --------- | ---------- | ----------------------------- |
| ALB           | ❌ No      | ❌ No       | Use DNS (provided by AWS)     |
| CLB           | ❌ No      | ❌ No       | DNS-only                      |
| NLB           | ✅ Yes     | ✅ Yes      | Can assign Elastic IPs per AZ |

### DNS Considerations

* ELBs expose **DNS names** like `my-alb-123.region.elb.amazonaws.com`
* Use **Route 53 CNAME or Alias** to map custom domain
* IPs may change; always use DNS instead of hardcoded IP

### DNS Resolution

* DNS TTL usually 60 seconds
* Multiple A-records (multi-AZ setup)
* DNS load balancing helps distribute across AZs
* Some clients may cache longer — configure TTL-aware clients

---

## 9. TLS/SSL in Load Balancers

* Use **TLS (Transport Layer Security)** for secure data in transit
* Managed via **AWS Certificate Manager (ACM)**

  * Provides free public certs (for ALB, NLB, CloudFront)
  * Can import custom certs
* TLS Termination:

  * **At ALB or NLB**
  * Can re-encrypt to backend with end-to-end encryption
* SNI support allows multiple domains on the same listener

---

## 10. SNI (Server Name Indication)

* Part of TLS protocol that allows client to specify domain during handshake
* Required for **multi-domain HTTPS** on same IP or listener
* Used by **ALB**, **CloudFront**, and custom NLB TLS
* Enables hosting multiple TLS certs on same listener
* **Legacy clients (pre-2010)** may not support SNI

---

## Final Notes

* ✅ Use **Launch Templates** instead of Launch Configs
* ✅ Enable **cross-zone LB** for even distribution
* ✅ Prefer **DNS name** over static IPs unless using NLB with EIP
* ✅ Use **target tracking scaling** for general needs; step/scheduled for control
* ✅ Configure **connection draining** to avoid user-impact during scale-down or deploy
* ✅ SNI and TLS termination help scale secure multi-tenant services
