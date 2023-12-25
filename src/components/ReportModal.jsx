// Example: EditModal.js
import React from "react";
import { Button, Modal } from "react-bootstrap";
import ReportTabs from "./ReportTabs";

const ReportModal = ({ onClose, show, userId }) => {
  return (
    <>
      <Modal
        size="lg"
        fullscreen={true}
        show={show}
        onHide={onClose}
        className="modal-style-edit modal-style-del"
        centered
      >
        <Modal.Header
          className="bg-transparent border-0 rounded-0 text-center p-1 pb-0 align-items-center"
          closeButton
        >
          <p className="bg-transparent mb-0 w-100">Report</p>
        </Modal.Header>
        <Modal.Body className="bg-secondry d-flex flex-column gap-3 p-3 pt-0">
          <ReportTabs userId={userId} onClose={onClose} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReportModal;
