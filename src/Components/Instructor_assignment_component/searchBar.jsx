export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by assessment title or student name..."
        className="w-full border border-gray-300 outline-none p-3 rounded focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition"
      />
    </div>
  );
}