import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { addQuotesToUser } from "../helper/firebaseHelpers";

const AddTradingSymbol = ({
  show,
  symbols,
  handleCloseModal,
  userQuotes,
  userId,
}) => {
  const [formData, setFormData] = useState({ symbol: "" });
  console.log(userQuotes, 909090);
  const { symbol } = formData;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (symbol == "") {
      toast.error("Please select symbol!");
    } else {
      let isExists = false;
      if (userQuotes?.length > 0) {
        isExists = userQuotes?.includes(symbol);
      }
      console.log(isExists, 909090);
      if (isExists) {
        toast.error("Symbol already exists in your quotes");
      } else {
        let newQuotes = [];
        if (!userQuotes) {
          newQuotes = [symbol];
        } else {
          newQuotes = [...userQuotes, symbol];
        }
        await addQuotesToUser(userId, newQuotes);
        toast.success("Added Successfully");
        handleCloseModal();
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div>
      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton={handleCloseModal}>Add Symbol</Modal.Header>
        <Modal.Body>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select symbol</label>
              <select
                name="symbol"
                className="form-control"
                onChange={handleChange}
              >
                <option value="">Select symbol</option>
                {symbols?.map((el, idx) => (
                  <option key={idx} value={el?.symbol}>
                    {el?.symbol}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mt-3">
              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddTradingSymbol;
