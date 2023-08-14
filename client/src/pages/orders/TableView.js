import TableFull from "./TableFull";

const cols = [
    { field: "reserved_time", headerName: "RESERVED TIME" },
    { field: "customer_name", headerName: "NAME" },
    { field: "phone", headerName: "PHONE" },
    { field: "table_id", headerName: "TABLE" },
    { field: "total_cost_after_discount", headerName: "TOTAL COST" },
    { field: "status", headerName: "STATUS" },
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
