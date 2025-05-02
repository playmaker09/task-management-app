import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface TableInfo {
    from: number;
    to: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface TablePrevNextButtonsProps {
    tableInfo: TableInfo;
    page: number;
    setPage: (value: number) => void;
}

const TablePrevNextButtons: React.FC<TablePrevNextButtonsProps> = ({
    tableInfo,
    page,
    setPage,
}) => {
    return (
        <div className="mt-8 flex justify-between">
            <p>
                Showing Entries {tableInfo.from} to {tableInfo.to} of{" "}
                {tableInfo.total} Entries
            </p>
            <div className="flex gap-4">
                <button
                    disabled={!tableInfo.prev_page_url}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-teal-600 text-white rounded cursor-pointer disabled:opacity-50"
                >
                    <span className="flex items-center gap-1">
                        <FaAngleLeft /> Prev
                    </span>
                </button>
                <button
                    disabled={!tableInfo.next_page_url}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-teal-600 text-white rounded cursor-pointer disabled:opacity-50"
                >
                    <span className="flex items-center gap-1">
                        Next <FaAngleRight />
                    </span>
                </button>
            </div>
        </div>
    );
};

export default TablePrevNextButtons;
