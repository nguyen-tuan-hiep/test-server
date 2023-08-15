import TableFull from "./TableFull";
import TableMini from "./TableMini";

const cols = [
  { field: "name", headerName: "NAME" },
  { field: "gender", headerName: "GENDER" },
  { field: "phone", headerName: "PHONE" },
  { field: "address", headerName: "ADDRESS"},
  { field: "point", headerName: "POINT" },
  { field: "memtype", headerName: "MEMBERSHIP" },
  { field: "action", headerName: "" },
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
