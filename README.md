# 1fit Management System

## Overview
This project is a gym and sports management system where users can register, view gyms, and explore sports offered by various gyms. An admin can manage gyms, sports, and user data. It supports user authentication via Passport.js, with admin-specific routes for management.

## Features

### User Management
- **User Routes**:
  - `/register`: User registration using Passport.js.
  - `/login`: User login using Passport.js.
  - `/get-me`: Retrieve information about the user, including their associated gym and sports.
  
  A static admin user is pre-configured in the database. Only the admin has access to non-GET routes.

### Gym Management
- **Gym Routes**:
  - `/get-all`: Retrieve a list of all gyms.
  - `/get-by-id`: Retrieve details of a gym by its ID, including the sports offered.
  - `/create`: Create a new gym (admin only).
  - `/update`: Update gym details (admin only).
  - `/delete`: Delete a gym (admin only).
  - `/search`: Search for gyms by name or other criteria.
  - `/add-sport`: Add a sport to a gym (admin only).

### Sport Management
- **Sport Routes**:
  - `/get-all`: Retrieve a list of all sports.
  - `/get-by-id`: Retrieve details of a sport by its ID, including the gyms where it's available.
  - `/create`: Create a new sport (admin only).
  - `/update`: Update sport details (admin only).
  - `/delete`: Delete a sport (admin only).
  - `/search`: Search for sports by name or other criteria.

## Relationships
- **Many-to-Many Relationship**:
  - Gyms and sports have a many-to-many relationship. A gym can offer multiple sports, and a sport can be available in multiple gyms.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/1fit-management-system.git
   cd 1fit-management-system
