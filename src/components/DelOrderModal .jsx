// Example: EditModal.js
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { calculateProfit } from "../helper/helpers";
import { toast } from "react-toastify";

const DelOrderModal = ({ onClose, show, selectedOrder, symbols }) => {
  const [isPartial, setIsPartial] = useState(false);
  const [volume, setVolume] = useState(selectedOrder.volume);
  const [isLoading, setIsLoading] = useState(false);

  const price = symbols?.find((el) => el.symbol == selectedOrder?.symbol);

  const updateOrderStatus = async (orderId, newStatus, newVolume) => {
    const orderRef = doc(db, "orders", orderId);
    const docSnapshot = await getDoc(orderRef);

    const profit = calculateProfit(
      selectedOrder.type,
      price?.price,
      selectedOrder?.symbolValue,
      selectedOrder?.volume
    );

    const newData = {
      status: newStatus,
      closedDate: serverTimestamp(),
      closedPrice: price?.price,
      profit: profit,
    };

    if (newVolume) {
      newData.volume = newVolume;
      newData.sum = newVolume * selectedOrder.symbolValue;
    }

    if (docSnapshot.exists()) {
      await updateDoc(orderRef, newData);
      toast.success("Order status updated successfully");
    } else {
      toast.error("Order does not exist");
    }
  };

  const updateUserBalance = async (orderPrice) => {
    const userRef = doc(db, "users", selectedOrder.userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      await updateDoc(userRef, {
        totalBalance: userData?.totalBalance - orderPrice,
      });
      toast.success("Balance updated successfully");
    } else {
      toast.error("User not found");
    }
  };

  const createNewOrder = async () => {
    const formattedDate = new Date().toLocaleDateString("en-US");
    const newVolume = parseFloat(selectedOrder.volume) - parseFloat(volume);
    const newOrder1 = {
      ...selectedOrder,
      volume: newVolume,
      sum: newVolume * selectedOrder.symbolValue,
      profit: 0,
      createdTime: serverTimestamp(),
      createdAt: formattedDate,
      status: "Pending",
    };
    delete newOrder1.id;
    delete newOrder1.sltp;
    const orderRef = collection(db, "orders");
    await addDoc(orderRef, newOrder1);
  };

  const newOrder = async () => {
    if (isPartial) {
      if (parseFloat(volume) >= parseFloat(selectedOrder.volume)) {
        toast.error(
          "Please add a volume which is less than the current volume"
        );
      } else {
        setIsLoading(true);
        try {
          await createNewOrder();
          await updateOrderStatus(selectedOrder.id, "Closed", volume);
          const orderPrice = volume * selectedOrder.symbolValue;
          await updateUserBalance(orderPrice);
          onClose();
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      try {
        await updateOrderStatus(selectedOrder.id, "Closed");
        await updateUserBalance(selectedOrder.sum);
        onClose();
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        className="modal-style-edit modal-style-del"
        centered
      >
        <Modal.Header
          className="bg-transparent border-0 rounded-0 text-center p-1 pb-0 align-items-center"
          closeButton
        >
          <p className="bg-transparent mb-0 w-100">
            Close order -- {selectedOrder?.id} + {selectedOrder?.symbol}
          </p>
        </Modal.Header>
        <Modal.Body className="bg-secondry d-flex flex-column gap-3 p-3 pt-0">
          <div className="d-flex flex-column justify-content-start align-items-start gap-2">
            <label
              className="form-check-label fs-6 mb-2 ms-2"
              for="flexRadioDefault1"
            >
              Closing type:
            </label>
            <div className="d-flex gap-4 fs-6 ">
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  checked={!isPartial}
                  onChange={(e) => {
                    if (isPartial) setIsPartial(false);
                  }}
                />
                <label class="form-check-label" for="inlineRadio1">
                  Full
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio2"
                  checked={isPartial}
                  onChange={(e) => {
                    if (!isPartial) setIsPartial(true);
                  }}
                />
                <label class="form-check-label" for="inlineRadio2">
                  Partial
                </label>
              </div>
            </div>
          </div>
          {isPartial && (
            <div className="row my-2">
              <label for="staticEmail" class="col-sm-4 col-form-label">
                Volume
              </label>
              <div class="col-sm-8">
                <input
                  type="number"
                  className="form-control border-1 border-black rounded-0 input-number"
                  id="staticEmail"
                  value={volume}
                  onChange={(e) => {
                    setVolume(e.target.value);
                  }}
                />
              </div>
            </div>
          )}
          <div className="ps-3 fs-5">
            Current Price:{" "}
            <span className={`ms-2 text-success`}>{price?.price}</span>
          </div>
          <div className="w-100 text-center my-2">
            <button
              className="modal-close-btn btn btn-success fs-5 rounded-4 mx-auto"
              onClick={() => {
                newOrder();
              }}
              disabled={isLoading}
            >
              Close position
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DelOrderModal;
