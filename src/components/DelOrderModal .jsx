// Example: EditModal.js
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { calculateProfit } from "../helper/helpers";
import { toast } from "react-toastify";

const DelOrderModal = ({
  onClose,
  show,
  selectedOrder,
  symbols,
  currentUserId,
}) => {
  const [isPartial, setIsPartial] = useState(false);
  const newVolume = parseInt(selectedOrder.volume);
  const [volume, setVolume] = useState(newVolume);
  const [isLoading, setIsLoading] = useState(false);

  const currentPrice = symbols?.find(
    (el) => el.symbol == selectedOrder?.symbol
  );
  const calculateUpdatedProfit = () => {
    if (selectedOrder.status === "Pending") {
      const newPrice = symbols?.find(
        (item) => item.symbol === selectedOrder.symbol
      );
      return calculateProfit(
        selectedOrder.type,
        newPrice?.price,
        selectedOrder.symbolValue,
        selectedOrder.volume
      );
    } else {
      return selectedOrder.profit;
    }
  };

  const profit = calculateUpdatedProfit();

  const newOrder = async () => {
    if (isPartial) {
      if (!volume || parseFloat(volume) >= parseFloat(selectedOrder.volume)) {
        toast.error(
          "Please add a volume which is less than the current volume"
        );
      } else {
        try {
          setIsLoading(true);
          const formattedDate = new Date().toLocaleDateString("en-US");
          const newOrder = {
            symbol: selectedOrder.symbol,
            symbolValue: selectedOrder.symbolValue,
            volume: parseFloat(selectedOrder.volume) - parseFloat(volume),
            sl: selectedOrder.sl,
            tp: selectedOrder.tp,
            profit: 0,
            createdTime: serverTimestamp(),
            type: selectedOrder.type,
            createdAt: formattedDate,
            status: "Pending",
            userId: currentUserId,
          };
          const orderRef = collection(db, "orders");

          await addDoc(orderRef, newOrder);

          await updateOrderStatus(selectedOrder.orderId, "Closed", volume);
          await updateUserBalance(selectedOrder.sum);
          onClose();
        } catch (error) {
          toast.error(error.message);
          console.log(error);
        }
        setIsLoading(false);
      }
    } else {
      await updateOrderStatus(selectedOrder.orderId, "Closed");
      await updateUserBalance(selectedOrder.sum);
      onClose();
    }
  };

  const updateOrderStatus = async (orderId, newStatus, volume1) => {
    try {
      const orderRef = doc(db, "orders", orderId);

      const docSnapshot = await getDoc(orderRef);
      let newData = {};
      if (volume1) {
        newData = {
          status: newStatus,
          closedDate: serverTimestamp(),
          closedPrice: currentPrice?.price,
          profit: profit,
          volume: volume1,
        };
      } else {
        newData = {
          status: newStatus,
          closedDate: serverTimestamp(),
          closedPrice: currentPrice?.price,
          profit: profit,
        };
      }
      if (docSnapshot.exists()) {
        // Update the order status
        await updateDoc(orderRef, newData);
        toast.success("Order status updated successfully");
      } else {
        throw new Error("Order does not exist");
      }
    } catch (error) {
      toast.error(error.message);
      throw new Error(error);
    }
  };
  const updateUserBalance = async (orderPrice) => {
    try {
      const userRef = doc(db, "users", currentUserId);
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
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

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
            <span className={`ms-2 text-success`}>{currentPrice?.price}</span>
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
