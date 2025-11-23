import { useState } from 'react';
import { predictFromFile } from '../services/api';

const useFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const selectFile = (file) => {
    setSelectedFile(file);
    setUploadError(null);
  };

  const uploadFile = async (url, additionalData = {}) => {
    if (!selectedFile) {
      setUploadError("No file selected");
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // In this case, we'll call the predictFromFile function directly
      const result = await predictFromFile(selectedFile);

      return result;
    } catch (error) {
      setUploadError(error.message);
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(100); // Set to 100% when complete
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadError(null);
  };

  return {
    selectedFile,
    uploadProgress,
    isUploading,
    uploadError,
    selectFile,
    uploadFile,
    reset
  };
};

export default useFileUpload;