// Example: EditModal.js
import React from "react";
import { Button, Modal } from "react-bootstrap";

const MessageModal = ({ onClose, show, title, message }) => {
  return (
    <>
      <Modal
        size="sm"
        show={show}
        onHide={onClose}
        className="modal-style-edit modal-style-del"
        centered
      >
        <Modal.Header
          className="bg-transparent border-0 rounded-0 text-center p-1 pb-0 align-items-center"
          closeButton
        >
          <p className="bg-transparent mb-0 w-100">{title}</p>
        </Modal.Header>
        <Modal.Body className="bg-secondry">
          <div className="w-100 p-5 d-flex justify-content-center align-items-center">
            <p className="m-0">{message}</p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MessageModal;
