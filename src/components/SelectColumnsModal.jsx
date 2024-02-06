import { useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { updateShowColumnsById } from "../helper/firebaseHelpers";

const SelectColumnsModal = ({ userId, setModal, columns, setColumns }) => {
  const closeModal = () => setModal(false);

  useEffect(
    () => () => updateShowColumnsById(userId, { dealsColumns: columns }),
    [columns]
  );

  return (
    <Modal
      show
      onHide={closeModal}
      dialogClassName="position-absolute columns-modal"
      backdropClassName="opacity-0"
      animation
      keyboard
      size="sm"
    >
      <Modal.Header className="py-1 ">Show/Hide Columns</Modal.Header>
      <Modal.Body className="py-1">
        {Object.keys(columns).map((column) => {
          return (
            <Form.Check
              label={column.toUpperCase()}
              checked={columns[column]}
              onChange={(e) =>
                setColumns((p) => ({ ...p, [column]: e.target.checked }))
              }
            />
          );
        })}
      </Modal.Body>
    </Modal>
  );
};

export default SelectColumnsModal;
