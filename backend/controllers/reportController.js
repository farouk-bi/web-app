const Task = require('../models/Task');
const User = require('../models/User');
const excelJS = require('exceljs');


// Export tasks report
const exportTasksReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email');
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tasks Report');
        worksheet.columns = [
            { header: 'Task ID', key: '_id', width: 25 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'priority', key: 'priority', width: 15},
            { header: 'Status', key: 'status', width: 15 },
            { header: 'dueDate', key: 'dueDate', width: 20 },
            { header: 'Assigned To', key: 'assignedTo', width: 30 },
        ];
        tasks.forEach((task) => {
            const assignedTo = task.assignedTo.map(user => `${user.name} (${user.email})`).join(', ');
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toISOString().split('T')[0],
                assignedTo: assignedTo || "Unassigned",
            });
        });


        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'tasks_report.xlsx'
        );
        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    } catch (error) {
        console.error('Error exporting tasks report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Export users report
const exportUsersReport = async (req, res) => {
    try {
        const users = await User.lean();
        const userTasks = await Task.populate(
            "assignedTo",
            "name email _id"
        );
        const userTaskMap = {};
        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });



        userTasks.forEach((task) => {
            if (task.assignedTo) {
                task.assignedTo.forEach((AssignedUser) => {
                    if (userTaskMap[AssignedUser._id]) {
                        userTaskMap[AssignedUser._id].taskCount += 1;
                        if (task.status === 'Pending') {
                            userTaskMap[AssignedUser._id].pendingTasks += 1;
                        } else if (task.status === 'In Progress') {
                            userTaskMap[AssignedUser._id].inProgressTasks += 1;
                        } else if (task.status === 'Completed') {
                            userTaskMap[AssignedUser._id].completedTasks += 1;
                        }
                    }
                });
            }
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('User Task Report');
        worksheet.columns = [
            { header: 'User Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 40 },
            { header: 'Total Assigned Tasks', key: 'taskCount', width: 20 },
            { header: 'Pending Tasks', key: 'pendingTasks', width: 20 },
            { header: 'In Progress Tasks', key: 'inProgressTasks', width: 20 },
            { header: 'Completed Tasks', key: 'completedTasks', width: 20 },
        ];
        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user);
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'users_report.xlsx'
        );
        return workbook.xlsx.write(res).then(() => {
            res.end();
        });
    } catch (error) {
        console.error('Error exporting users report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    exportTasksReport,
    exportUsersReport,
};