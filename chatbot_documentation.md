
# Documentation for Chatbot and Route Retrieval System

---

## 1. Flask Backend for Route and Fare Retrieval
**File Name:** `route_and_fare_api.py`

### Description:
This Flask API handles requests to retrieve metro route information, fare details, and zone information between two stations. It queries a MySQL database for the required information.

### Key Functionalities:
1. **Database Connection:**
   - Establishes a connection to a MySQL database using `mysql.connector`.

2. **API Endpoint:**
   - `/get_route_and_fare` (GET): Accepts `from_station` and `to_station` as query parameters to return:
     - Complete route between the stations.
     - Total fare.
     - Distinct zones.

3. **Logic:**
   - First attempts to fetch data from the database for the route in "top-to-bottom" direction.
   - If not found, it queries for the "bottom-to-top" direction.
   - Returns error if no route is available.

4. **Error Handling:**
   - Catches exceptions and provides a user-friendly error message in the JSON response.

### Dependencies:
- `Flask`, `mysql.connector`

### How to Run:
1. Ensure MySQL database is set up with the required schema.
2. Install Python dependencies using `pip install flask mysql-connector-python`.
3. Run the script: `python route_and_fare_api.py`.

---

## 2. Flask Backend for Chatbot Query Handling
**File Name:** `chatbot_api.py`

### Description:
This Flask API handles natural language queries from a user and provides responses based on:
1. FAQs
2. Intent classification.
3. Metro route and fare information.

### Key Functionalities:
1. **Database Integration:**
   - Logs user queries and chatbot responses into a MySQL database.

2. **Query Handling:**
   - Detects whether the query relates to FAQs, intents, or metro routes.
   - Uses external APIs to fetch relevant data:
     - FAQs (`FAQ_API_URL`)
     - Intents (`INTENT_API_URL`)
     - Route and fare (`ROUTE_API_URL`).

3. **Natural Language Processing (NLP):**
   - Leverages `SentenceTransformer` for sentence embeddings.
   - Uses a fine-tuned BERT model for Named Entity Recognition (NER).

4. **Error Handling:**
   - Gracefully handles API failures or database errors.

### Dependencies:
- `Flask`, `torch`, `sentence-transformers`, `transformers`, `mysql.connector`, `framer-motion`.

### How to Run:
1. Install required Python libraries.
2. Start the API: `python chatbot_api.py`.
3. API is hosted on port `5001`.

---

## 3. React Frontend for Chat Application
**File Name:** `App.js`

### Description:
This React application serves as the front-end interface for the chatbot. It allows users to interact with the chatbot via a chat interface.

### Key Functionalities:
1. **Chat Interface:**
   - Displays user and bot messages with a clean UI.
   - Implements animations using `framer-motion`.

2. **API Integration:**
   - Sends user queries to the Flask backend at `http://localhost:5001/query`.
   - Displays chatbot responses.

3. **Error Handling:**
   - Displays fallback messages for failed API calls.

4. **Dynamic Features:**
   - Real-time message updates.
   - Input field handling with "Enter" key submission.

### Dependencies:
- `react`, `framer-motion`

### How to Run:
1. Install dependencies using `npm install`.
2. Start the app with `npm run dev`.

---

## 4. SQL Script for Database Schema
**File Name:** `chatbot_schema.sql`

### Description:
This SQL script creates and sets up the MySQL database schema for the chatbot project.

### Database Name: `chatbot_1`

### Key Components:
1. **Tables:**
   - `stations`: Stores metro station information (`station_id`, `station_name`, `zone`).
   - `routes`: Represents connectivity between stations.
   - `fares`: Contains fare information between stations.
   - `chatbot_conversations`: Logs user queries and bot responses.

2. **Relationships:**
   - Foreign keys for station IDs in `routes` and `fares` tables.

3. **Sample Queries:**
   - Insert data into the schema.
   - Join queries to fetch route and fare details.

### How to Use:
1. Run the script in a MySQL client to create the schema.
2. Populate tables with required data.

---

## Setup and Integration Guide
1. **Backend APIs:**
   - Run both Flask servers (`route_and_fare_api.py` and `chatbot_api.py`).
   - Ensure the database is configured correctly and running.

2. **Frontend Application:**
   - Start the React app using `npm run dev`.

3. **Database Setup:**
   - Execute `chatbot_schema.sql` in the MySQL database.

4. **Testing:**
   - Use the React interface to send queries and view responses.
   - Test different scenarios to ensure error handling works.

---
