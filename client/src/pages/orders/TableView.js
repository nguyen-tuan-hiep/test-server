import TableFull from "./TableFull";

const cols = [
  { field: "order_date", headerName: "ORDER DATE" },
  { field: "order_time", headerName: "ORDER TIME" },
  { field: "customer_name", headerName: "NAME" },
  { field: "phone", headerName: "PHONE" },
  { field: "total_price", headerName: "TOTAL PRICE" },
  { field: "final_price", headerName: "AFTER VAT" },
  { field: "action", headerName: "" },
];

export default function TableView({ data, setLoading, fetchData }) {
  return (
    <TableFull
      rows={data}
      cols={cols}
      setLoading={setLoading}
      fetchData={fetchData}
    />
  );
}
