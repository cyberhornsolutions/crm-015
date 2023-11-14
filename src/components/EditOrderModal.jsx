// Example: EditModal.js
import React from "react";
import { Button, Modal } from "react-bootstrap";

const EditOrderModal = ({ onClose, show }) => {
  return (
    <>
      <Modal
        size="md"
        show={show}
        onHide={onClose}
        className="modal-style-edit"
        centered
      >
        <Modal.Header
          className="bg-transparent border-0 rounded-0 text-center p-1 pb-0 align-items-center"
          closeButton
        >
          <p className="bg-transparent mb-0 w-100">
            Edit order -- order ID + order symbol
          </p>
        </Modal.Header>
        <Modal.Body className="bg-secondry d-flex flex-column gap-3 py-3 px-5">
          <div className="d-flex  justify-content-start align-items-center gap-3 my-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <label className="form-check-label" for="flexRadioDefault1">
                Take Profit:
              </label>
            </div>

            <div>
              <input
                type="number"
                className="form-control border-1 border-black rounded-0  input-number"
              />
            </div>

            <div>
              <input
                type="number"
                className="form-control border-1 border-black rounded-0  input-number"
              />
            </div>
            <span className=" text-success">+6</span>
          </div>
          <div className="d-flex  justify-content-start align-items-center gap-3 my-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <label className="form-check-label" for="flexRadioDefault1">
                Stop loss:
              </label>
            </div>

            <div>
              <input
                type="number"
                className="form-control border-1 border-black rounded-0  input-number"
              />
            </div>

            <div>
              <input
                type="number"
                className="form-control border-1 border-black rounded-0  input-number"
              />
            </div>
            <span className=" text-success">+6</span>
          </div>
          <div className="fs-4">
            Current market Price:{" "}
            <span className="ms-2  text-success">0.0546</span>
          </div>
          <div className="w-100 text-center my-2">
            <button
              className="modal-close-btn btn btn-success fs-4 rounded-0 mx-auto"
              onClick={onClose}
            >
              change
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditOrderModal;
