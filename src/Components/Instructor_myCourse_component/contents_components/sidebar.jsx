const UnitSidebar = ({
  units,
  selectedUnitId,
  selectedTopicId,
  setSelectedUnitId,
  setSelectedTopicId,
  deleteUnit,
  deleteTopic,
  onAddUnitClick,
  onAddTopicClick,
  closeSidebar,
}) => {
  return (
    <div className="border-r-2 bg-[#f9f5f5] pt-4 h-full overflow-y-auto rounded-[11px]">
      <div className="h-6 sm:h-4 px-4 flex justify-end items-center lg:hidden">
        <button
          onClick={closeSidebar}
          className="text-gray-600 hover:text-black text-xl cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="sidebar-header text-blue-900 px-4 flex gap-3">
        <button onClick={onAddUnitClick} className="cursor-pointer">
          + Unit
        </button>
        <button
          onClick={onAddTopicClick}
          disabled={!selectedUnitId}
          className={`cursor-pointer ${!selectedUnitId ? "opacity-50" : ""}`}
        >
          + Lecture
        </button>
      </div>

      <div className="unit-list py-[5px] px-[10px]">
        {units.map((unit) => (
          <div key={unit.id} className="unit-item">
            <div
              className={`unit-title font-bold flex justify-between items-center py-[5px] px-[7px] cursor-pointer ${
                unit.id === selectedUnitId ? "bg-gray-300 rounded px-2" : ""
              }`}
              onClick={() => {
                setSelectedUnitId(unit.id === selectedUnitId ? null : unit.id);
                setSelectedTopicId(null);
              }}
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">
                  {unit.id === selectedUnitId ? "▾" : "▸"}
                </span>
                {unit.name}
              </span>
              <button onClick={() => deleteUnit(unit.id)}>🗑</button>
            </div>

            {unit.id === selectedUnitId &&
              unit.topics.map((topic) => (
                <div
                  key={topic.id}
                  className={`topic-item pl-[2rem] py-[3px] px-[7px] flex justify-between items-center cursor-pointer ${
                    topic.id === selectedTopicId ? "bg-gray-300 rounded px-2" : ""
                  }`}
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                  }}
                >
                  <span>{topic.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTopic(unit.id, topic.id);
                    }}
                  >
                    🗑
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitSidebar;