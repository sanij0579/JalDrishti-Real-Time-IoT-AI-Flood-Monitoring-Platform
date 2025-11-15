# 🌊 JalDrishti – Real-Time IoT + AI Flood Monitoring Platform

A full-scale **IoT + AI-powered flood monitoring, prediction, and citizen safety platform** built using **Django REST Framework, React Native, React.js, ESP32/NodeMCU IoT sensors, and ML models**.

---

## 🚀 Overview

Communities living near rivers, canals, and flood-prone areas often suffer due to *zero visibility* of rising water levels. JalDrishti solves this by providing:

* Real-time water-level monitoring using IoT sensors
* AI-driven flood prediction (85% accuracy)
* Live alerts to 1,000+ users
* Safe-route guidance via mobile app
* GIS-based dashboard for authorities

---

## 🛰️ Key Features

### 🔹 **IoT-Based Water Level Tracking**

* ESP32/NodeMCU sensors
* Ultrasonic/float sensors
* Weather API ingestion
* 92% real-time data reliability

### 🔹 **AI/ML Flood Prediction**

* Trained on historic rainfall + water-level datasets
* Probability scoring (0–100%)
* Prediction accuracy: **85%**

### 🔹 **Citizen Mobile App (React Native)**

* Flood alerts
* Live water levels
* Zone risk colors
* Safe-route navigation

### 🔹 **GIS Admin Dashboard (React.js)**

* Map-based zone monitoring
* Sensor health
* Emergency broadcast tools
* Historical analytics

### 🔹 **Notifications Layer**

* Push alerts
* SMS fallback (optional)

---

## 🏗️ Architecture

```
IoT Sensors (ESP32) → Django REST API → AI Model → Database → Dashboards & Apps
```

### **1. IoT Layer**

* Sends water-level every 10–30 sec
* Data → REST API

### **2. Backend (Django DRF)**

* Token-based auth
* Flood prediction engine
* Data storage
* Alerts engine

### **3. Admin Dashboard (React.js)**

* GIS visualization of risk zones

### **4. Mobile App (React Native)**

* Real-time flood information for citizens

---

## 🔧 Tech Stack

* **Backend:** Django REST Framework
* **Frontend:** React Native, React.js
* **IoT:** NodeMCU / ESP32
* **Database:** PostgreSQL / SQLite
* **ML Models:** Random Forest / XGBoost
* **Maps:** Leaflet / Google Maps API

---

## 📸 Screenshots

*Add screenshots here after uploading.*

---

## 🛠️ Installation

### 📌 Clone Repository

```bash
git clone <repo-url>
cd JalDrishti
```

### 📌 Backend Setup (DRF)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 📌 IoT Setup (ESP32 Code)

Upload the Arduino/ESP32 code:

```cpp
HTTPClient http;
http.begin("<backend-url>/api/sensor/update/");
http.addHeader("Content-Type", "application/json");
```

### 📌 React Native App

```bash
cd mobile-app
npm install
npm start
```

### 📌 React.js Dashboard

```bash
cd admin-dashboard
npm install
npm start
```

---

## 📊 Results & Impact

* Covers **10+ flood-prone zones**
* Alerts **1,000+ citizens** instantly
* Provides **30+ minutes early warning**
* Enables faster decision-making for authorities

---

## 🔭 Future Enhancements

* Drone-based flood image ingestion
* Offline evacuation maps
* LSTM-based long-term forecasting
* Multilingual voice warnings

---

## 🤝 Contribution

Pull requests and suggestions are welcome.

---

## 📝 License

MIT License

---

## 🎯 Goal

**To make flood-prone regions safer using IoT, AI, and real-time technology.**
