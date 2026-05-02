import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDeleting = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <p className="text-gray-700 font-medium mb-6">{message}</p>
        
        <div className="flex w-full gap-3">
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            fullWidth 
            onClick={onConfirm}
            isLoading={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
