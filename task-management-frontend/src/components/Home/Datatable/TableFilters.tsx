import React from "react";

interface TableFiltersProps {
    search: string;
    setSearch: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
}

const TableFilters: React.FC<TableFiltersProps> = ({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
}) => {
    return (
        <div className="flex flex-wrap mb-4 justify-between">
            <div className="flex flex-wrap gap-2">
                <input
                    type="text"
                    placeholder="Search by title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-2 border-teal-600 px-3 py-2 rounded w-full md:w-64"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border-2 border-teal-600 px-3 py-2 rounded cursor-pointer"
                >
                    <option value="">All Statuses</option>
                    <option value="to-do">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border-2 border-teal-600 px-3 py-2 rounded cursor-pointer"
                >
                    <option value="created_at">Sort by Date</option>
                    <option value="title">Sort by Title</option>
                </select>
            </div>
        </div>
    );
};

export default TableFilters;
