import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faClose,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";

const dealsColumns = ({
  t = () => {},
  handleEditModal,
  handleCloseBtn,
  showColumns = {},
} = {}) => [
  // {
  //   name: "Id",
  //   selector: (row, i) => row && i + 1,
  //   grow: 0.5,
  //   omit: !showColumns.id,
  // },
  {
    name: t("date"), // Translate the header using your t function
    selector: (row) => row.createdTime && row.createdTime,
    sortable: true,
    compact: true,
    grow: 1.5,
    omit: !showColumns.date,
  },
  {
    name: t("symbol"),
    selector: (row) => row && row.symbol,
    sortable: true,
    omit: !showColumns.symbol,
  },
  {
    name: t("type"),
    selector: (row) =>
      row ? (
        row.type == "Buy" ? (
          <div className="order-column">
            <div className="custom-caret-up-icon">
              <FontAwesomeIcon icon={faCaretUp} />
              <div style={{ marginLeft: "3px" }}>{row.type}</div>
            </div>
          </div>
        ) : (
          <div className="order-column">
            <div className="custom-caret-down-icon">
              <FontAwesomeIcon icon={faCaretDown} />
              <div style={{ marginLeft: "3px" }}>{row.type}</div>
            </div>
          </div>
        )
      ) : (
        ""
      ),
    sortable: true,
    compact: true,
    omit: !showColumns.type,
  },
  {
    name: t("volume"),
    selector: (row) => row && row.volume,
    sortable: true,
    omit: !showColumns.volume,
  },
  {
    name: t("openPrice"),
    selector: (row) => row && +row.symbolValue,
    sortable: true,
    omit: !showColumns.openPrice,
  },
  {
    name: "SL / TP",
    selector: (row) => row && row.sltp,
    omit: !showColumns.sltp,
  },
  {
    name: "Additional parameters",
    selector: (row) =>
      row &&
      `Spread: ${+parseFloat(row.spread)?.toFixed(4)} / Swap: ${+parseFloat(
        row.swap
      )?.toFixed(4)} / Fee: ${+parseFloat(row.fee)?.toFixed(4)}`,
    grow: 2.5,
    compact: true,
    omit: !showColumns.additionalParameters,
  },
  {
    name: "Margin",
    selector: (row) => row && +parseFloat(row.sum)?.toFixed(4),
    sortable: true,
    compact: true,
    omit: !showColumns.margin,
  },
  {
    name: "Current Price",
    selector: (row) => row && row.currentPrice,
    sortable: true,
    compact: true,
    omit: !showColumns.currentPrice,
  },
  {
    name: t("profit"),
    selector: (row) =>
      row && (
        <div
          className={`"order-column" ${
            row.profit < 0
              ? "text-danger"
              : row.profit == 0
              ? "text-muted"
              : "text-success"
          }`}
        >
          {row.profit}
        </div>
      ),
    sortable: true,
    omit: !showColumns.profit,
  },
  {
    name: t("Action"),
    selector: (row) =>
      row && (
        <div>
          <FontAwesomeIcon
            icon={faEdit}
            size="lg"
            onClick={() => handleEditModal(row)}
          />
          <FontAwesomeIcon
            icon={faClose}
            size="lg"
            className="ms-3"
            onClick={() => handleCloseBtn(row)}
          />
        </div>
      ),
    omit: !showColumns.action,
  },
];

export default dealsColumns;
