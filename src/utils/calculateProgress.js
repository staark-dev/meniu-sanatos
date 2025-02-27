export const calculateWeeklyProgress = (plan, selectedWeek) => {
    if (!plan || !selectedWeek || !plan[selectedWeek] || !plan[selectedWeek].days) return 0;
    
    let totalTasks = 0;
    let completedTasksTotal = 0;
    
    Object.values(plan[selectedWeek].days).forEach(day => {
        if (day.tasks) {
            totalTasks += day.tasks.length;
            completedTasksTotal += day.tasks.filter(task => task.completed).length;
        }
    });
    
    console.log(`📊 Progres calculat: ${completedTasksTotal}/${totalTasks} -> ${totalTasks > 0 ? (completedTasksTotal / totalTasks) * 100 : 100}%`);
    
    return totalTasks > 0 ? (completedTasksTotal / totalTasks) * 100 : 100;
};