import React from 'react'
import { useState } from 'react'
import { LuPaperclip } from 'react-icons/lu'
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2'
const AddAttachmentsInput = ({ attachments, setAttachments }) => {
    const [options, setOptions] = useState("");

    const handleAddOption = () => {
        if (options.trim()) {
            setAttachments([...attachments, options.trim()]);
            setOptions("");
        }
    }
    const handleRemoveOption = (index) => {
        const updatedArr = attachments.filter((_, idx) => idx !== index);
        setAttachments(updatedArr);
    }

    return (
        <div>
            {attachments.map((item, index) => (
                <div
                    key={item}
                    className="flex items-center justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
                >
                    <div className="flex items-center gap-2">
                        <LuPaperclip className="text-gray-500" />
                        <p className="text-xs text-black">{item}</p>
                    </div>
                    <button
                        className='cursor-pointer'
                        onClick={() => handleRemoveOption(index)}
                    >
                        <HiOutlineTrash className="text-red-500 text-lg hover:text-red-700" />
                    </button>
                </div>
            ))}
            <div className="flex items-center gap-5 mt-4">
                <div className="flex-1">
                    <LuPaperclip className="absolute ml-3 mt-2.5 text-lg text-gray-400" />
                    <input
                        type="text"
                        placeholder='Add File link'
                        value={options}
                        onChange={(e) => setOptions(e.target.value)}
                        className="w-full pl-10 text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
                    />
                </div>
                <button
                    onClick={handleAddOption}
                    className="card-btn"
                >
                    <HiMiniPlus className="" /> Add
                </button>
            </div>
        </div>
    )
}

export default AddAttachmentsInput