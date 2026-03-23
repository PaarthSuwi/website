import { useState, useRef, useCallback } from 'react';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';

export default function FileUpload({ onFileSelect, accept, label, description }) {
    const [dragover, setDragover] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const inputRef = useRef();

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setDragover(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setDragover(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragover(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
            onFileSelect?.(file);
        }
    }, [onFileSelect]);

    const handleClick = () => inputRef.current?.click();

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            onFileSelect?.(file);
        }
    };

    const clearFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
        return (bytes / 1073741824).toFixed(2) + ' GB';
    };

    return (
        <div
            className={`upload-zone ${dragover ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                style={{ display: 'none' }}
            />

            {selectedFile ? (
                <div style={{ textAlign: 'center' }}>
                    <FiFile className="icon" style={{ animation: 'none' }} />
                    <h3>{selectedFile.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {formatSize(selectedFile.size)}
                    </p>
                    <button
                        className="btn small secondary"
                        onClick={clearFile}
                        style={{ marginTop: '0.75rem' }}
                    >
                        <FiX /> Remove
                    </button>
                </div>
            ) : (
                <div>
                    <FiUploadCloud className="icon" />
                    <h3>{label || 'Drop files here'}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {description || 'or click to browse'}
                    </p>
                </div>
            )}
        </div>
    );
}
