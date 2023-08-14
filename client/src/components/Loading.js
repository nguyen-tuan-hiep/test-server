import CircularProgress from "@mui/joy/CircularProgress";

export default function Loading() {
  return (
    <div className="mt-16 w-full flex justify-center items-center">
      <CircularProgress size="lg" color="primary" />
    </div>
  );
}
