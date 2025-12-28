import axios from "axios";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apipaths";
import { LuUsers } from "react-icons/lu";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";
import { getInitials } from "../../utils/helper";


const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

            if (response.data?.length > 0) {
                setAllUsers(response.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const toggleUserSelection = (userId) => {
        setTempSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleAssign = () => {
        if (Array.isArray(tempSelectedUsers)) {
            setSelectedUsers(tempSelectedUsers);
        } else {
            setSelectedUsers([]);
        }
        setIsModalOpen(false);
    };

    const selectedUsersList = Array.isArray(selectedUsers) 
        ? allUsers.filter((user) => selectedUsers.includes(user._id))
        : [];

    useEffect(() => {
        getAllUsers();
    }, []);
    useEffect(() => {
        if (isModalOpen) {
            setTempSelectedUsers(Array.isArray(selectedUsers) ? [...selectedUsers] : []);
        }
    }, [isModalOpen, selectedUsers]);

    return (
        <div className="space-y-4 mt-2">
            {selectedUsersList.length === 0 && (
                <button className="card-btn"
                    onClick={() => setIsModalOpen(true)}
                >
                    <LuUsers className="text-sm" />
                    Add Members
                </button>
            )}
            {selectedUsersList.length > 0 && (
                <div className="cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    <AvatarGroup users={selectedUsersList} maxVisible={3} />
                </div>
            )}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Select Users"
            >
                <div className="space-y-4 h-[60vh] overflow-y-auto">
                    {allUsers.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center gap-4 p-3 border-b border-gray-200"
                        >
                            {user.profileImageUrl ? (
                                <>
                                    <img
                                        src={user.profileImageUrl}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            const initialsDiv = e.target.nextElementSibling;
                                            if (initialsDiv) {
                                                initialsDiv.style.display = 'flex';
                                            }
                                        }}
                                    />
                                    <div className="w-10 h-10 rounded-full items-center justify-center bg-gray-200 text-gray-600 text-sm font-medium" style={{ display: 'none' }}>
                                        {getInitials(user.name)}
                                    </div>
                                </>
                            ) : (
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 text-sm font-medium">
                                    {getInitials(user.name)}
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                                <p className="text-[13px] text-gray-500">{user.email}</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={Array.isArray(tempSelectedUsers) && tempSelectedUsers.includes(user._id)}
                                onChange={() => toggleUserSelection(user._id)}
                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-b-sm outline-none"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button className="card-btn" onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </button>
                    <button className="card-btn-fill" onClick={handleAssign}>
                        Assign Selected
                    </button>
                </div>
            </Modal>
        </div>
    );
};
export default SelectUsers;