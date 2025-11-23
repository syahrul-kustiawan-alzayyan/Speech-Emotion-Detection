const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const predictFromFile = async (file) => {
  console.log('Sending file for analysis:', file.name, file.size, file.type);

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/predict/file`, {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Analysis result:', result);
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};