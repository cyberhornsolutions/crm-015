// Example: EditModal.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { getAskValue, getBidValue } from "../helper/helpers";

const EditOrderModal = ({ onClose, show, selectedOrder }) => {
  const [newSl, setNewSl] = useState(selectedOrder?.sl);
  const [newTp, setNewTp] = useState(selectedOrder?.tp);

  const closedPrice =
    selectedOrder.type == "Buy"
      ? getBidValue(selectedOrder.currentPrice, selectedOrder.bidSpread)
      : getAskValue(selectedOrder.currentPrice, selectedOrder.askSpread);

  const updateOrder = async () => {
    try {
      const orderId = selectedOrder?.id;
      if (!newSl || !newTp) {
        toast.error("Make sure to fill both SL & TP values");
      } else if (
        selectedOrder.type == "Buy" &&
        (newSl >= closedPrice || newTp <= selectedOrder.currentPrice)
      ) {
        toast.error(
          "To Buy SL should be less than the bid value and TP should be greater than the current value"
        );
      } else if (
        selectedOrder.type == "Sell" &&
        (newSl <= closedPrice || newTp >= selectedOrder.currentPrice)
      ) {
        toast.error(
          "To Sell SL should be greater than the ask value and TP should be less than the current value"
        );
      } else {
        const orderRef = doc(db, "orders", orderId);
        const docSnapshot = await getDoc(orderRef);
        if (docSnapshot.exists()) {
          await updateDoc(orderRef, { sl: newSl, tp: newTp });
          toast.success("Order updated successfully");
          onClose();
        } else {
          toast.error("Order does not exist");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

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
            Edit order - {selectedOrder?.orderId} - {selectedOrder?.symbol}
          </p>
        </Modal.Header>
        <Modal.Body className="bg-secondry d-flex flex-column gap-3 py-3 px-5">
          <div className="d-flex  justify-content-start align-items-center gap-3 my-2">
            <div className="form-check">
              {/* <input
                className="form-check-input"
                type="checkbox"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              /> */}
              <label className="form-check-label" for="flexRadioDefault1">
                Stop Loss:
              </label>
            </div>

            <div>
              <input
                type="number"
                className="form-control border-1 border-black rounded-0  input-number"
                onChange={(e) => {
                  setNewSl(e.target.value);
                }}
                value={newSl}
              />
            </div>

            {/* <div>
              <input
                type="number"
                className="form-control border-1 border-black rounded-0  input-number"
              />
            </div> */}
            {/* <span className=" text-success">+6</span> */}
          </div>
          <div className="d-flex  justify-content-start align-items-center gap-3 my-2">
            <div className="form-check">
              {/* <input
                className="form-check-input"
                type="checkbox"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              /> */}
              <label className="form-check-label" for="flexRadioDefault1">
                Take Profit:
              </label>
            </div>

            <div>
              <input
                type="number"
                className="form-control border-1 border-black rounded-0  input-number"
                onChange={(e) => {
                  setNewTp(e.target.value);
                }}
                value={newTp}
              />
            </div>

            {/* <div>
              <input
                type="number"
                className="form-control border-1 border-black rounded-0  input-number"
              />
            </div> */}
            {/* <span className=" text-success">+6</span> */}
          </div>
          <div className="fs-4">
            Current market Price:
            <span className="ms-2  text-success">{closedPrice}</span>
          </div>
          <div className="w-100 text-center my-2">
            <button
              className="modal-close-btn btn btn-success fs-4 rounded-0 mx-auto"
              onClick={updateOrder}
            >
              Change
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditOrderModal;
