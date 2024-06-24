// Example: EditModal.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { db } from "../firebase";
import { toast } from "react-toastify";

const EditOrderModal = ({ onClose, selectedOrder, theme }) => {
  const [newSl, setNewSl] = useState(selectedOrder?.sl);
  const [newTp, setNewTp] = useState(selectedOrder?.tp);
  const [loading, setLoading] = useState(false);

  const updateOrder = async (e) => {
    e.preventDefault();
    try {
      const orderId = selectedOrder?.id;
      if (
        selectedOrder.type == "Buy" &&
        ((newSl && newSl >= selectedOrder.currentPrice) ||
          (newTp && newTp <= selectedOrder.currentMarketPrice))
      ) {
        toast.error(
          "To Buy SL should be less than the bid value and TP should be greater than the current value"
        );
      } else if (
        selectedOrder.type == "Sell" &&
        ((newSl && newSl <= selectedOrder.currentPrice) ||
          (newTp && newTp >= selectedOrder.currentMarketPrice))
      ) {
        toast.error(
          "To Sell SL should be greater than the ask value and TP should be less than the current value"
        );
      } else {
        setLoading(true);
        const orderRef = doc(db, "orders", orderId);
        const docSnapshot = await getDoc(orderRef);
        if (docSnapshot.exists()) {
          await updateDoc(orderRef, { sl: newSl, tp: newTp });
          toast.success("Order updated successfully");
          onClose();
        } else {
          toast.error("Order does not exist");
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  let potentialSL = 0,
    potentialTP = 0;
  if (selectedOrder.symbolValue) {
    if (newSl) {
      potentialSL =
        selectedOrder.volume * (newSl - selectedOrder.symbolValue) -
        selectedOrder.fee;
      if (selectedOrder.type === "Sell") potentialSL = -potentialSL;
    }
    if (newTp) {
      potentialTP =
        selectedOrder.volume * (newTp - selectedOrder.symbolValue) -
        selectedOrder.fee;
      if (selectedOrder.type === "Sell") potentialTP = -potentialTP;
    }
  }

  return (
    <>
      <Modal
        size="md"
        show
        onHide={onClose}
        className="modal-style-edit"
        centered
      >
        <Modal.Header
          className="bg-transparent rounded-0 border-0 p-1"
          closeButton
        >
          <Modal.Title
            as="h5"
            className={`bg-transparent mb-0 w-100 text-center ${theme}`}
          >
            Edit order - {selectedOrder?.orderId} - {selectedOrder?.symbol}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="my-2 row row-gap-3" onSubmit={updateOrder}>
            <Form.Group className="d-flex justify-content-around align-items-center">
              <Form.Label htmlFor="sl">Stop Loss:</Form.Label>
              <div>
                <Form.Control
                  id="sl"
                  type="number"
                  className="border-black rounded-0 h-100" //input-number
                  onChange={(e) => setNewSl(e.target.value)}
                  value={newSl}
                />
                <label className="mt-1">
                  Potential:{" "}
                  <label className="ms-2">
                    {+parseFloat(potentialSL)?.toFixed(2)}
                  </label>
                </label>
              </div>
            </Form.Group>
            <Form.Group className="d-flex justify-content-around align-items-center">
              <Form.Label htmlFor="tp">Take Profit:</Form.Label>
              <div>
                <Form.Control
                  id="tp"
                  type="number"
                  className="border-black rounded-0 h-100" //input-number
                  onChange={(e) => setNewTp(e.target.value)}
                  value={newTp}
                />
                <label className="mt-1">
                  Potential:{" "}
                  <label className="ms-2">
                    {+parseFloat(potentialTP)?.toFixed(2)}
                  </label>
                </label>
              </div>
            </Form.Group>
            <label className="text-center fs-5 mb-2">
              Current market Price:
              <span className="ms-2">{selectedOrder.currentMarketPrice}</span>
            </label>
            <button
              type="submit"
              className="btn btn-sm btn-success rounded-0 w-75 mx-auto"
              onClick={updateOrder}
              disabled={loading}
            >
              Change
            </button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditOrderModal;
