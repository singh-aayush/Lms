import React, { useState } from "react";
import UnitSidebar from "./sidebar";
import TopicEditor from "./contentEditor";
import { Menu } from "lucide-react";

const Contents = () => {
  const [units, setUnits] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [unitName, setUnitName] = useState("");
  const [topicName, setTopicName] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const addUnit = () => {
    if (!unitName.trim()) return;
    const newUnit = {
      id: Date.now().toString(),
      name: unitName,
      topics: [],
    };
    setUnits([...units, newUnit]);
    setUnitName("");
    setIsUnitModalOpen(false);
  };

  const addTopic = () => {
    if (!selectedUnitId || !topicName.trim()) return;
    setUnits((prev) =>
      prev.map((unit) =>
        unit.id === selectedUnitId
          ? {
              ...unit,
              topics: [
                ...unit.topics,
                {
                  id: Date.now().toString(),
                  name: topicName,
                  title: "",
                  type: "Theory",
                  description: "",
                  resources: [],
                },
              ],
            }
          : unit
      )
    );
    setTopicName("");
    setIsTopicModalOpen(false);
  };

  const deleteUnit = (unitId) => {
    setUnits((prev) => prev.filter((unit) => unit.id !== unitId));
    if (selectedUnitId === unitId) {
      setSelectedUnitId(null);
      setSelectedTopicId(null);
    }
  };

  const deleteTopic = (unitId, topicId) => {
    setUnits((prev) =>
      prev.map((unit) =>
        unit.id === unitId
          ? {
              ...unit,
              topics: unit.topics.filter((topic) => topic.id !== topicId),
            }
          : unit
      )
    );
    if (selectedTopicId === topicId) {
      setSelectedTopicId(null);
    }
  };

  const updateTopic = (unitId, topicId, updatedData) => {
    setUnits((prev) =>
      prev.map((unit) =>
        unit.id === unitId
          ? {
              ...unit,
              topics: unit.topics.map((topic) =>
                topic.id === topicId ? { ...topic, ...updatedData } : topic
              ),
            }
          : unit
      )
    );
  };

  const selectedUnit = units.find((u) => u.id === selectedUnitId);
  const selectedTopic =
    selectedUnit?.topics.find((t) => t.id === selectedTopicId) || null;

  return (
    <div className="relative flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex justify-between items-center pt-2 bg-white z-20">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-[#49BBBD] rounded hover:bg-[#49BBBD]"
        >
          <Menu />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transform bg-white w-64 shadow-lg transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:shadow-none`}
      >
        <UnitSidebar
          units={units}
          selectedUnitId={selectedUnitId}
          selectedTopicId={selectedTopicId}
          setSelectedUnitId={setSelectedUnitId}
          setSelectedTopicId={setSelectedTopicId}
          deleteUnit={deleteUnit}
          deleteTopic={deleteTopic}
          onAddUnitClick={() => {
            setIsUnitModalOpen(true);
            setIsSidebarOpen(false);
          }}
          onAddTopicClick={() => {
            setIsTopicModalOpen(true);
            setIsSidebarOpen(false);
          }}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
        {/* <div className="lg:hidden absolute top-2 right-2">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div> */}
      </div>

      {/* Right Content */}
      <div className="flex-1 overflow-y-auto py-0 px-4">
        {selectedTopic ? (
          <TopicEditor
            topic={selectedTopic}
            updateTopic={(data) =>
              updateTopic(selectedUnitId, selectedTopicId, data)
            }
          />
        ) : (
          <div className="text-center text-gray-500 mt-10">
            Select a topic to start editing
          </div>
        )}
      </div>

      {/* Modals */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-[90%] max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Add Unit</h3>
            <input
              className="w-full border border-black outline-none p-2 rounded mb-4"
              placeholder="Enter Unit Name"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={addUnit}
                className="py-2 px-4 rounded bg-[#49BBBD] text-white hover:bg-[#49BBBD] transition cursor-pointer"
              >
                Add
              </button>
              <button
                onClick={() => setIsUnitModalOpen(false)}
                className="py-2 px-4 rounded bg-[#49BBBD] text-black hover:bg-[#49BBBD] transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isTopicModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-[90%] max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Add Topic</h3>
            <input
              className="w-full border border-black outline-none p-2 rounded mb-4"
              placeholder="Enter Topic Name"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={addTopic}
                className="py-2 px-4 rounded bg-[#49BBBD] text-white hover:bg-[#49BBBD] transition cursor-pointer"
              >
                Add
              </button>
              <button
                onClick={() => setIsTopicModalOpen(false)}
                className="py-2 px-4 rounded bg-[#49BBBD] text-black hover:bg-[#49BBBD] transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contents;
