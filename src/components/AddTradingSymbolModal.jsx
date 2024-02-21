import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { addQuotesToUser } from "../helper/firebaseHelpers";

const groups = [
  {
    key: "Crypto",
    value: "crypto",
  },
  {
    key: "Currencies",
    value: "currencies",
  },
  {
    key: "Stocks",
    value: "stocks",
  },
  {
    key: "Commodities",
    value: "commodities",
  },
];

const AddTradingSymbol = ({
  show,
  symbols,
  handleCloseModal,
  userQuotes,
  userId,
}) => {
  const [formData, setFormData] = useState({ symbol: "" });
  const [group, setGroup] = useState("crypto");
  const { symbol } = formData;

  useEffect(() => {
    setFormData({
      symbol: symbols.find((s) => s?.settings?.group === group)?.id,
    });
  }, [group]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol) {
      toast.error("Please select symbol!");
    } else {
      let isExists = false;
      if (userQuotes?.length > 0) {
        isExists = userQuotes?.includes(symbol);
      }
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

  const filteredSymbols = symbols.filter((s) => s?.settings?.group === group);

  return (
    <div>
      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton={handleCloseModal}>Add Symbol</Modal.Header>
        <Modal.Body>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Group</label>
              <select
                name="group"
                className="form-control"
                onChange={(e) => setGroup(e.target.value)}
              >
                {groups?.map((el, idx) => (
                  <option key={idx} value={el.value}>
                    {el.key}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Select symbol</label>
              <select
                name="symbol"
                className="form-control"
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select symbol
                </option>
                {filteredSymbols?.map((el, idx) => (
                  <option key={idx} value={el?.id}>
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
