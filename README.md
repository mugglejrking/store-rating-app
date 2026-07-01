# 🏪 Store Rating & Review Ecosystem 

### 📌 Project Overview
This repository contains a full-stack, production-ready Store Rating & Review Platform built using the **PERN stack** (PostgreSQL, Express.js, React via Vite, and Node.js) paired with **Tailwind CSS**. 

> 🛠️ **Assessment Submission:** This project was specifically designed, developed, and optimized as part of the technical evaluation for the **Full-Stack Intern** position at **Roxiler Systems**. It strictly fulfills all operational, architecture, and validation requirements outlined in the assessment brief.

---

## 🔐 Role-Based Access Control (RBAC) & Architecture

The application implements a secure, tier-based ecosystem accommodating three distinct user archetypes:

1. **System Administrator (Admin)**  
   * Pre-configured System Admin: **Akhilesh Prasad Bajpai** (Address: *Bhagya Nagar Old Ausa Road Latur*).
   * Holds universal metrics access, user management capabilities, and platform oversight.
2. **Store Owner**  
   * Can create, read, and update their respective localized store profiles.
   * Access to custom dashboards detailing aggregate metrics and specific consumer ratings/reviews.
3. **Normal User**  
   * Interactive search portal to discover, filter, and review marketplace listings.
   * Capability to seamlessly add ratings and narrative feedback.

---

## ✨ Core Features & Technical Highlights

* **Universal Password Management:** A dedicated, secure account portal accessible seamlessly across **all three user roles** for instant password modifications.
* **Strict Validation Pipeline:** Hard-coded backend controllers and frontend state-checks guarding strict database constraints:
  * *Name constraints:* 20 to 60 characters (e.g., Administrator name meticulously verified at 23 characters).
  * *Address limits:* Strict upper bound of 400 characters max.
  * *Password Entropy:* Mandatory mixed-case strings with alphabetic, numerical, and structural special character rules.
* **Database-Driven Query Engine:** Advanced pagination, dynamic search-matching, and multi-tier sorting/filtering engineered natively at the PostgreSQL database level instead of filtering inside memory.
* **Pre-Seeded Regional Datasets:** Features automated localized database initializations utilizing realistic Indian retail businesses (e.g., *Balaji Woodlands Restaurant*, *Vijay Electronic Hub*) and user names.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19 (Vite Build System), Tailwind CSS v4, React Router Dom v6, Axios |
| **Backend** | Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js |
| **Database** | PostgreSQL (Relational Mapping, Foreign Key Integrity Constraints) |

---

## 🚀 Installation & Local Environment Setup

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **PostgreSQL (v14+)** actively running on your local machine.

### 2. Database Initialization
Access your PostgreSQL CLI (`psql`) or open **pgAdmin**, and execute the following query to initialize the application database layer:
```sql
CREATE DATABASE store_rating_db;
