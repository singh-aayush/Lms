export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="mb-6">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search your student or assignment record by name/id..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full 
                     px-3 py-2 
                     sm:px-4 sm:py-3 
                     md:px-5 md:py-3 
                     pr-24 
                     border-2 border-gray-300 
                     rounded-md 
                     text-sm sm:text-base md:text-base lg:text-lg 
                     text-black 
                     focus:outline-none"
        />
        <button
          className="absolute right-0 top-0 h-full 
                     bg-cyan-500 text-white 
                     px-3 sm:px-4 md:px-5 
                     text-sm sm:text-base md:text-base lg:text-lg 
                     font-semibold 
                     rounded-r-md 
                     cursor-pointer"
        >
          Search
        </button>
      </div>
    </div>
  );
}
