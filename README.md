# Doctor Listing Page Project

## 🩺 Overview
This project is a doctor listing web application that allows users to search for doctors, filter by consultation type and specialties, and sort results based on fees or experience. The app fetches doctor data from an API and performs all filtering operations on the client side. Users can also view detailed doctor profiles and book appointments seamlessly.

---

## ✨ Features Implemented

### 1. 🔍 Autocomplete Search Bar
- Real-time suggestions while typing doctor names
- Displays top 3 matching results
- Filters the doctor list when a suggestion is selected or Enter is pressed

### 2. 🎛️ Dynamic Filter Panel
- **Single Select Filters**:
  - Consultation type: Video Consult, In Clinic
- **Multi-Select Filters**:
  - Doctor specialties with checkboxes for multiple selections
- **Sort Options**:
  - Fees (Ascending)
  - Experience (Descending)

### 3. 👨‍⚕️ Doctor Listing
- Displays doctor cards with:
  - Name, specialties, qualification, and experience
  - Available consultation types
  - Clinic location (with map view)
  - Fees and booking functionality

### 4. 📅 Appointment Booking
- Multi-step booking process:
  - Select date, time, consultation type
  - Enter patient details
  - Review and confirm appointment
- Form validation included
- Confirmation page after successful booking

### 5. 🔗 URL Query Parameters
- Applied filters are reflected in the URL
- Browser navigation (back/forward) maintains filter state

---

## ⚙️ Technical Implementation

### 🛠️ API Integration
- Data fetched from:  
  [Doctor Data API](https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json)
- All search, filter, and sort operations are done **client-side** after the initial fetch

### ✅ Test Case Support
- Implemented `data-testid` attributes for automated testing
- Followed the required naming conventions as per specifications

### 📱 Responsive Design
- Fully mobile-friendly
- Clean, intuitive UI with proper layout and grid systems

---

## 🚀 Getting Started
1. **Clone the Repository**
   ```bash
   git clone https://github.com/Kanishk3813/Bajaj_Doctor_Listing_Page.git
   cd doctor-listing-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm start
   ```

4. **Open in Browser**
   ```
   http://localhost:3000
   ```

---

## 🔍 Features Prioritized
As per requirements, functionality has been given more weightage than UI. The application ensures:
- All filters work in combination
- Search and filter operations are performed client-side
- URL query parameters reflect applied filters
- Browser navigation maintains filter state

---

## 🔮 Future Enhancements
- Add pagination for large result sets
- Implement doctor ratings and reviews
- Enhance appointment booking with real-time availability
- Add user authentication for personalized experience
- Integrate payment gateway for booking confirmations
- Add multilingual support for wider accessibility
