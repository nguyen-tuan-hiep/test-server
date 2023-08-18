import TableFull from "./TableFull";
import TableMini from "./TableMini";

const cols = [
  { field: "phone", headerName: "PHONE" },
  { field: "table_id", headerName: "TABLE" },
  { field: "res_date", headerName: "RESERVED DATE" },
  { field: "res_time_start", headerName: "RESERVED START TIME" },
  { field: "res_time_end", headerName: "RESERVED END TIME" },
  { field: "action", headerName: "ACTION" },
];

export const rankColors = [
  { mem_type: 'Bronze', color: "primary" },
  { mem_type: 'Silver', color: "success" },
  { mem_type: 'Gold', color: "warning" },
  { mem_type: 'Diamond', color: "danger" },
];

export default function TableView({ data, setLoading, fetchData }) {
  return (
    <>
      <TableMini rows={data} setLoading={setLoading} fetchData={fetchData} />
      <TableFull
        rows={data}
        cols={cols}
        setLoading={setLoading}
        fetchData={fetchData}
      />
    </>
  );
}
