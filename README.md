# Online-Appointment-System

A web application for managing online appointments, allowing users to book slots and administrators to manage schedules efficiently.  
This project was developed as part of a team project using **Flask**, **PostgreSQL**, and **JavaScript**.

## Team: (24cs212g14) ธัญญาsigma boy  
### Project: 6 ระบบจองนัดหมาย
**Group ID:** 24cs212g14  
**Mentor:** รชต ธนัญชัย (พี่ตะ)

### Members:

#### 1. ไท้ทวารัติ ภักดีโต
- **Student ID:** 660510653  
- **GitHub ID:** [kaz-study](https://github.com/kaz-study)  
- **Role:** Frontend  

#### 2. ศิรประภา ครองราษฏร์
- **Student ID:** 660510678 
- **GitHub ID:** [siraprapa-k](https://github.com/siraprapa-k)  
- **Role:** Frontend  

#### 3. สุธนา กวาวหนึ่ง
- **Student ID:** 660510680 
- **GitHub ID:** [thanyakwaonueng](https://github.com/thanyakwaonueng)  
- **Role:** Frontend + Backend  

#### 4. ศศิวิมล มูลรังษี
- **Student ID:** 660510725  
- **GitHub ID:** [cheekkii](https://github.com/cheekkii)  
- **Role:** Frontend 
---

## Overview

The system provides:
- A user-friendly platform for booking appointments.
- Admin dashboard to manage appointments and schedules.
- Role-based access control for users and admins.
- Dynamic pages rendered using **Jinja templates** integrated with backend APIs.


## My Responsibilities (Frontend)

- **Frontend Development:** Built interactive pages using **HTML, CSS, JavaScript, jQuery**.  
- **Jinja Templates:** Implemented dynamic rendering of pages using **Flask + Jinja**, passing backend data to frontend.  
- **Form Handling:** Managed appointment forms, validation, and real-time updates.  
- **API Integration:** Connected frontend with backend endpoints to send and retrieve data.  
- **UI Debugging:** Identified and fixed layout and functional issues in the interface.  
- **Collaboration:** Coordinated with backend developers to ensure smooth data flow.


## Tech Stack

- **Frontend:** HTML, CSS, JavaScript, jQuery, Jinja2 (Flask templates)  
- **Backend:** Python, Flask (API integration)  
- **Database:** PostgreSQL (connected via backend APIs)  
- **Version Control:** Git / GitHub  
- **Tools & IDE:** VS Code, Docker (for development environment)

## 📦 How to Run

```bash
./run_docker_compose.sh
docker compose exec flask python manage.py create_db