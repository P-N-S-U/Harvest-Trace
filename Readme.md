# 🌾 Harvest Trace

Harvest Trace is a full-stack MERN application that bridges the gap between **farmers** and **consumers**, offering a transparent and traceable agricultural marketplace. It uses **QR-based verification**, real-time **geolocation maps**, and **secure role-based access** to provide a seamless experience.

---

## 🚀 Features

### 🛒 For Consumers
- Browse and purchase fresh farm products
- Add items to cart with real-time quantity updates
- View product details, prices, and seller trust badges
- **QR code-based** product traceability
- **Map view** of farmer's location for transparency

### 👨‍🌾 For Farmers
- Upload products with images and QR codes
- View buyers and manage listings

### 📍 Maps & Traceability
- Integrated **Leaflet.js** for interactive maps
- Uses **OpenStreetMap API** to display:
  - Farmer's location
  - Product source traceability
- QR codes scan to show **origin and product details**

### 🔐 Authentication
- Separate login/signup for Consumer and Farmer roles
- JWT token-based secure session management

---

## 🧱 Tech Stack

| Layer         | Technologies                     |
|---------------|----------------------------------|
| **Frontend**  | React.js, Bootstrap, Axios, Leaflet.js |
| **Backend**   | Node.js, Express.js              |
| **Database**  | MongoDB, Mongoose                |
| **Auth**      | JWT, bcrypt                      |
| **QR Code**   | `qrcode` npm package             |
| **Maps**      | Leaflet.js + OpenStreetMap       |

---

## 📁 Project Structure

```
harvest-trace/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
└── README.md
```

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/harvest-trace.git
cd harvest-trace
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Start the backend server:
```bash
npm start
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🌍 Maps Integration

The application uses `react-leaflet` for embedding dynamic maps that display farmer locations and enable product traceability. Data is fetched via the OpenStreetMap API.

### Example Implementation
```jsx
// FarmerLocationMap.js
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

<MapContainer center={[latitude, longitude]} zoom={13}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[latitude, longitude]}>
    <Popup>Farmer's Location</Popup>
  </Marker>
</MapContainer>
```

---

## 📷 Product Model Example (MongoDB)

```javascript
{
  name: "Organic Tomatoes",
  price: 80,
  location: {
    latitude: 18.5214,
    longitude: 73.857,
    address: "Pune, Maharashtra"
  },
  qrCodeUrl: "generated_qr_code_url",
  farmer: ObjectId("linked_farmer_id")
}
```

---

## 📌 Key Functionalities

- ✅ Cart system with backend synchronization
- ✅ JWT-based authentication for Consumers, Farmers & Admins
- ✅ Leaflet + OpenStreetMap integration
- ✅ QR code scanning and generation
- ✅ Responsive design for mobile and desktop
- ✅ Admin approval system for farmer verification
- ✅ Digital certificate generation and delivery
- ✅ Real-time analytics dashboard for admins
- ✅ Document upload and management system
- ✅ Multi-role authentication with role-based access control

---

## 📦 Future Improvements

- **Route tracing** on map via delivery agents
- **Admin dashboard** for reporting and analytics
- **Payment gateway** integration (Razorpay or Stripe)
- **Image hosting** via Cloudinary
- **Map clustering** for dense farmer regions

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

---

## 📞 Contact

For questions or support, please reach out:
- GitHub: [@your-username](https://github.com/your-username)
- Email: your.email@example.com