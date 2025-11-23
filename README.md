# Emotion Detection AI 🧠🎵

<div align="center">
  <p align="center">
    <img src="https://img.shields.io/badge/Made%20with-React-blue?style=for-the-badge&logo=react" alt="React">
    <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI">
    <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow">
    <img src="https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  </p>

  **Real-time emotion detection from voice using advanced AI**
  
  [Live Demo](#) • [Documentation](#) • [Report Bug](issues) • [Request Feature](issues)

  [![License: MIT](https://img.shields.io/github/license/iqonic/dummy?color=green)](LICENSE)
  [![Stars](https://img.shields.io/github/stars/babang-kuliah/emotion-detection?style=social)](stars)
  [![Forks](https://img.shields.io/github/forks/babang-kuliah/emotion-detection?style=social)](forks)

</div>

---

## 🚀 Features

- **Real-time Emotion Detection** - Analyze emotions instantly from live microphone input
- **File-Based Analysis** - Upload audio files for detailed emotion breakdown
- **Multi-Emotion Recognition** - Detects happy, sad, angry, fear, surprise, and neutral emotions
- **Confidence Scoring** - Provides confidence levels for each emotion detected
- **Waveform Visualization** - Live audio waveform display for real-time feedback
- **Dark/Light Mode** - Modern UI with theme switching capability
- **Responsive Design** - Works seamlessly across desktop and mobile devices

## 🤖 Technical Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: FastAPI, Python 3.11+
- **Machine Learning**: TensorFlow, Keras, Librosa
- **Real-time Communication**: WebSocket protocol
- **Audio Processing**: Advanced signal processing with feature extraction
- **Styling**: Modern UI with Tailwind CSS and custom gradients

## 🛠️ Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn** (for frontend dependencies)
- **pip** (for Python dependencies)

## 📦 Installation

1. Clone the repo
```bash
git clone https://github.com/babang-kuliah/emotion-detection.git
cd emotion-detection
```

2. Navigate to the backend directory and install Python dependencies
```bash
cd emotion-backend
pip install -r requirements.txt
```

3. Navigate to the frontend directory and install Node.js dependencies
```bash
cd ../emotion-web  # Navigate back and then to the emotion-web directory
npm install
```

4. Place your trained Keras model in the designated folder:
```
emotion-backend/models/keras_model/model_klasifikasi_emosi_suara.keras
```

5. If you have a scaler file, place it in:
```
emotion-backend/models/keras_model/scaler.pkl
```

## 🔧 Configuration

The application uses the following environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Backend server host |
| `PORT` | `8000` | Backend server port |
| `MODEL_PATH` | `models/keras_model` | Path to your trained model |
| `SAMPLE_RATE` | `22050` | Audio sample rate for processing |

## 🚀 Running the Application

### Backend Server
```bash
cd emotion-backend
python main.py
```

### Frontend Development Server
```bash
cd emotion-web
npm run dev
```

### Production Build
```bash
# Build frontend
cd emotion-web
npm run build

# Serve the built application
npx serve -s dist
```

## 🧪 Usage

### Real-time Detection
1. Start the backend server
2. Start the frontend development server
3. Navigate to the "Real-time Detection" page
4. Allow microphone access when prompted
5. Speak into your microphone
6. Watch real-time emotion analysis results

### File Upload Detection
1. Prepare an audio file (WAV, MP3, M4A, or FLAC)
2. Navigate to the "File Analysis" page
3. Drag and drop or browse to select your file
4. Click "Analyze Emotion"
5. View detailed emotion breakdown with confidence scores

## 🏗️ Architecture

```
emotion-web/          # Frontend React application
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Application pages
│   ├── hooks/        # Custom React hooks
│   ├── services/     # API services
│   ├── styles/       # Global styles
│   └── utils/        # Utility functions
└── public/

emotion-backend/      # FastAPI backend
├── models/           # Trained machine learning models
│   └── keras_model/  # Keras model files
├── preprocessing/    # Audio preprocessing modules
├── routes/           # API route definitions
├── services/         # Business logic services
├── utils/            # Utility functions
└── main.py           # Main application entry point
```

## 🤖 Machine Learning Pipeline

The emotion detection model uses advanced signal processing techniques:
- **Feature Extraction**: MFCC, spectral centroid, spectral rolloff, ZCR, and chroma
- **Preprocessing**: Audio normalization, resampling, and scaling
- **Model Architecture**: Deep neural network trained on emotion-labeled voice samples
- **Real-time Processing**: Optimized for low-latency emotion detection

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health/` | Health check endpoint |
| `POST` | `/predict/file` | Process audio file for emotion detection |
| `WS` | `/ws/realtime/{client_id}` | Real-time emotion detection via WebSocket |

## 🧩 Components

### Frontend Components
- **Navbar**: Responsive navigation bar with theme support
- **AudioRecorder**: Interactive microphone control with visual feedback
- **FileUploader**: Drag-and-drop file upload with validation
- **ResultCard**: Detailed emotion analysis with confidence scoring
- **WaveformVisualizer**: Real-time audio waveform visualization

### Backend Services
- **PredictionService**: Handles model loading and inference
- **AudioProcessor**: Manages audio preprocessing and feature extraction
- **WebSocketService**: Real-time communication for live detection

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Project Link: [https://github.com/babang-kuliah/emotion-detection](https://github.com/babang-kuliah/emotion-detection)

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [TensorFlow](https://www.tensorflow.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Librosa](https://librosa.org/)

---

<div align="center">

#### Built with ❤️ for emotion detection enthusiasts

[![GitHub stars](https://img.shields.io/github/stars/babang-kuliah/emotion-detection?style=social)](https://github.com/babang-kuliah/emotion-detection/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/babang-kuliah/emotion-detection?style=social)](https://github.com/babang-kuliah/emotion-detection/network/members)

⭐ Star this repo if you find it helpful!

</div>