import Button from "../ui/Button";

const Pagination = ({ page, totalPages, setPage }) => (
  <div className="flex justify-center gap-4 mt-6">
    <Button variant="ghost" disabled={page === 1} onClick={() => setPage(page - 1)}>
      Prev
    </Button>
    <span className="text-gray-400 text-sm">Page {page} / {totalPages}</span>
    <Button variant="ghost" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
      Next
    </Button>
  </div>
);

export default Pagination;
