import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import {
  updateUserById,
  incrementLastAccountNo,
  getDocument,
} from "../helper/firebaseHelpers";
import { toast } from "react-toastify";

const AccountModal = ({ onClose, userProfile }) => {
  const [accountType, setAccountType] = useState("Standard");
  const [isLoading, setIsLoading] = useState(true);
  const [accountNo, setAccountNo] = useState("");

  useEffect(() => {
    const fetchLastAccount = async () => {
      const { lastAccountNo } = await getDocument(
        "configs",
        "8VaY8WzBNUl6Ca8KbpWD"
      );
      if (!lastAccountNo)
        return toast.error("Error fetching last account number");
      setAccountNo(+lastAccountNo + 1);
      setIsLoading(false);
    };
    fetchLastAccount();
  }, []);

  const createNewAccount = async () => {
    if (userProfile?.accounts?.length === 2)
      return toast.error("You have reached max account limit");
    try {
      setIsLoading(true);
      const accounts =
        userProfile?.accounts?.map((account) => ({
          ...account,
          isDefault: false,
        })) || [];
      accounts.push({
        account_type: accountType,
        account_no: accountNo,
        isDefault: true,
        totalBalance: 0,
        activeOrdersProfit: 0,
        activeOrdersSwap: 0,
        totalMargin: 0,
        bonus: 0,
        bonusSpent: 0,
      });
      await updateUserById(userProfile.id, { accounts });
      await incrementLastAccountNo();
      toast.success("Account created successfully");
      onClose();
    } catch (error) {
      toast.error("Error in creating account number");
      console.log("Error", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        show
        onHide={onClose}
        className="modal-style-edit modal-style-del"
        centered
      >
        <Modal.Header
          className="bg-transparent border-0 rounded-0 text-center p-1 pb-0 align-items-center"
          closeButton
        >
          <p className="bg-transparent mb-0 w-100">Create an account number:</p>
        </Modal.Header>
        <Modal.Body className="bg-secondry d-flex flex-column gap-3 p-3 pt-0">
          <div className="d-flex flex-column justify-content-start align-items-start gap-2">
            <label
              className="form-check-label fs-6 my-2 ms-2"
              htmlFor="flexRadioDefault1"
            >
              Type:
            </label>
            <div className="d-flex gap-4 fs-6">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  checked={accountType === "Standard"}
                  onChange={() => setAccountType("Standard")}
                />
                <label className="form-check-label" htmlFor="inlineRadio1">
                  Standard
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio2"
                  checked={accountType === "Islamic"}
                  onChange={() => setAccountType("Islamic")}
                />
                <label className="form-check-label" htmlFor="inlineRadio2">
                  Islamic
                </label>
              </div>
            </div>
          </div>
          <div className="ps-3 fs-5">
            Account Number:
            <span className={`ms-2 text-success`}>
              {accountNo || "Loading..."}
            </span>
          </div>
          <div className="w-100 text-center my-2">
            <button
              className="modal-close-btn btn btn-success fs-5 rounded-4 mx-auto"
              onClick={createNewAccount}
              disabled={isLoading}
            >
              Create
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AccountModal;
