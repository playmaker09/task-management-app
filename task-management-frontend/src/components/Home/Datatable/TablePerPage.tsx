interface TablePerPage {
    setPerPage: (value: number) => void;
}

const TablePerPage: React.FC<TablePerPage> = ({ setPerPage }) => {
    return (
        <>
            <div>
                Show{" "}
                <select
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                    {[5, 10, 25, 50, 75, 100].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>{" "}
                Entries
            </div>
        </>
    );
};

export default TablePerPage;
