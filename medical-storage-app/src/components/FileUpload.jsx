import React, { useState } from 'react';
import { Form, Button, Alert, ProgressBar, Card } from 'react-bootstrap';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [patientId, setPatientId] = useState('');
  const [disease, setDisease] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !patientId.trim() || !disease.trim()) {
      setError('Please fill in all fields and select a file');
      return;
    }
    
    // Reset states
    setError(null);
    setMessage(null);
    setUploading(true);
    setUploadProgress(0);
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId);
    formData.append('disease', disease);
    
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      
      setMessage('File uploaded successfully!');
      setFile(null);
      setPatientId('');
      setDisease('');
      
      // Reset file input
      document.getElementById('fileInput').value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header as="h5">Upload Medical File</Card.Header>
      <Card.Body>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Patient ID</Form.Label>
            <Form.Control
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient ID"
              disabled={uploading}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Disease Category</Form.Label>
            <Form.Control
              as="select"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              disabled={uploading}
            >
              <option value="">Select disease category</option>
              <option value="diabetes">Diabetes</option>
              <option value="hypertension">Hypertension</option>
              <option value="cancer">Cancer</option>
              <option value="respiratory">Respiratory Diseases</option>
              <option value="cardiac">Cardiac Conditions</option>
              <option value="other">Other</option>
            </Form.Control>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Medical File</Form.Label>
            <Form.Control
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <Form.Text className="text-muted">
              Accepted formats: PDF, JPEG, PNG, DICOM
            </Form.Text>
          </Form.Group>
          
          {uploading && (
            <div className="mb-3">
              <ProgressBar 
                now={uploadProgress} 
                label={`${uploadProgress}%`} 
                animated
              />
            </div>
          )}
          
          <Button 
            variant="primary" 
            type="submit" 
            disabled={uploading || !file}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FileUpload;