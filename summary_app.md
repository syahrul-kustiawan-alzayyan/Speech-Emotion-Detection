Aplikasi ini merupakan sistem deteksi emosi berbasis audio dengan dua fungsi besar: pendeteksian emosi realtime melalui mikrofon dan pendeteksian berbasis file rekaman. Model klasifikasi emosi wanita telah tersedia dalam format Keras, dan backend akan memuat model tersebut untuk melakukan inferensi.

1. Tujuan Utama Aplikasi

Menyediakan layanan analisis emosi wanita berbasis suara secara instan.

Mengelola dua mode pendeteksian:

Realtime melalui mikrofon.

Upload file audio rekaman.

Menyediakan hasil prediksi yang cepat, akurat, dan dapat digunakan untuk analisis mandiri atau riset.

2. Fitur Utama
a. Deteksi Emosi Realtime

Menggunakan input mikrofon melalui browser (getUserMedia).

Mengirim audio dalam bentuk potongan (chunk PCM) melalui WebSocket ke backend.

Backend menganalisis setiap window audio dan mengirim prediksi secara kontinu.

UI menampilkan label emosi, confidence, grafik waveform, serta riwayat prediksi.

b. Deteksi Emosi dari File Rekaman

Pengguna dapat mengunggah file audio (WAV/MP3).

File dikirim ke backend menggunakan endpoint REST (POST /predict-file).

Backend mengekstrak audio, melakukan preprocessing, dan mengirim hasil prediksi dalam bentuk JSON.

UI menampilkan emosi utama, confidence, serta visualisasi sederhana.

c. Visualisasi & UI

Halaman Realtime:

Tombol Start/Stop.

Indikator koneksi.

Grafik waveform/live audio level.

Hasil prediksi realtime.

Halaman Upload:

Drag & drop file.

Validasi format & ukuran.

Preview waveform audio.

Tombol Analisis.

Hasil prediksi terstruktur.

d. Backend

FastAPI menjalankan inferensi menggunakan model Keras yang sudah tersedia.

Menggunakan WebSocket untuk koneksi realtime dan REST endpoint untuk upload file.

Melakukan preprocessing audio sesuai konfigurasi model (sampling rate, normalisasi, fitur).

Mengembalikan output berupa JSON berisi label emosi & probabilitas.

3. Alur Kerja Sistem

Pengguna membuka halaman web.

Memilih mode:

Realtime → browser meminta akses mikrofon → audio dikirim ke backend → backend memproses setiap potongan → hasil tampil.

Upload file → file dipilih → dikirim ke backend → backend memproses → hasil tampil.

Backend melakukan:

Validasi audio.

Preprocessing audio.

Prediksi menggunakan Keras.

Mengirim label + confidence ke frontend.

Frontend menampilkan hasil dan memperbarui UI secara dinamis.

4. Spesifikasi Backend

Framework: FastAPI

Model: Keras SavedModel / H5

Protokol:

POST /predict-file — analisis file rekaman

WS /ws/realtime — audio realtime

GET /health — status server

Preprocessing:

Konversi mono

Resampling

Normalisasi

Ekstraksi fitur

Scaling sesuai model

Hasil prediksi berupa:

{
  "label": "happy",
  "confidence": 0.87,
  "class_probs": { "neutral":0.02, ... }
}

5. Spesifikasi Frontend (React Vite Tailwind)

Menggunakan routing untuk dua halaman utama:

/realtime

/upload

Menggunakan WebSocket untuk mode realtime.

Menggunakan API biasa untuk upload file.

Tailwind sebagai styling utama.

Komponen wajib:

Navbar

AudioRecorder

WebsocketConnectionHandler

FileUploader

ResultCard

WaveformVisualizer

6. Keamanan & Privasi

Seluruh komunikasi harus menggunakan HTTPS.

Audio tidak disimpan di server kecuali pengguna ingin (opsional).

Validasi ukuran dan format file untuk keamanan.

Pembatasan durasi realtime untuk menghindari spam input.

7. STRUKTUR FOLDER FRONTEND & BACKEND
A. Struktur Folder Frontend (React + Vite + Tailwind)
emotion-web/
│
├── index.html
├── vite.config.js
├── package.json
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   │
│   ├── assets/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── WaveformVisualizer.jsx
│   │   ├── ResultCard.jsx
│   │   ├── AudioRecorder.jsx
│   │   ├── FileUploader.jsx
│   │   └── LoadingSpinner.jsx
│   │
│   ├── pages/
│   │   ├── RealtimeDetection.jsx
│   │   ├── FileDetection.jsx
│   │   └── Home.jsx
│   │
│   ├── hooks/
│   │   ├── useWebSocket.js
│   │   ├── useAudioRecorder.js
│   │   └── useFileUpload.js
│   │
│   ├── utils/
│   │   ├── audioUtils.js
│   │   └── formatUtils.js
│   │
│   └── styles/
│       └── global.css
│
└── public/

B. Struktur Folder Backend (FastAPI + Keras)
emotion-backend/
│
├── main.py
├── requirements.txt
├── config.py
│
├── models/
│   ├── keras_model/        # jika SavedModel (folder)
│   └── model.h5            # jika H5
│
├── preprocessing/
│   ├── audio_processing.py
│   ├── feature_extraction.py
│   ├── scaler.joblib
│   └── feature_config.json
│
├── routes/
│   ├── predict_file.py
│   ├── predict_realtime.py
│   └── health_check.py
│
├── services/
│   ├── prediction_service.py
│   └── websocket_service.py
│
└── utils/
    ├── audio_utils.py
    ├── converters.py
    └── response_formatter.py

8. Checklist Implementasi

Frontend dan backend dapat saling terhubung melalui WebSocket + REST.

Preprocessing backend sesuai format input model.

Model Keras dapat di-load tanpa error.

Prediksi endpoint dan realtime WebSocket berfungsi stabil.

UI lengkap tanpa error dan mendukung mobile-friendly.