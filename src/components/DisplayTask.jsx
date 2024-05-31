import '../css/DisplayTask.css'
import React, { useEffect, useState } from 'react'
import { MdPendingActions } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { FaSort } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
function DisplayTask({ tasks, setTasks }) {
  const [displayTask, setDisplayTask] = useState(tasks)
  const [filterState, setFilterState] = useState("all")
  const sorting_criteria = localStorage.getItem("sorting_criteria");

  const updateTaskCompleteStatus = (taskId) => {
    setTasks(tasks.map((task) => {
      if (taskId === task.id) {
        task.isDone = true;
      }
      return task;
    }))
  }

  const deleteATask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const clearAllFilter = () => {
    const filterTask = tasks;
    const filterSortedTask = sorting_criteria ? sortTaskArray(sorting_criteria, filterTask) : filterTask;
    setDisplayTask(filterSortedTask);
    setFilterState("all")
  }

  const pendingTaskFilter = () => {
    const filterTask = tasks.filter((task) => task.isDone === false);
    const filterSortedTask = sorting_criteria ? sortTaskArray(sorting_criteria, filterTask) : filterTask;
    setDisplayTask(filterSortedTask);
    setFilterState("pending")
  }

  const completedTaskFilter = () => {
    const filterTask = tasks.filter((task) => task.isDone === true);
    const filterSortedTask = sorting_criteria ? sortTaskArray(sorting_criteria, filterTask) : filterTask;
    setDisplayTask(filterSortedTask);
    setFilterState("completed")
  }

  const todayTaskFilter = () => {
    const localDate = new Date().toLocaleDateString();
    const [month, day, year] = localDate.split('/');
    const todayDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const filterTask = tasks.filter((task) => task.dueDate.split("T")[0] === todayDate);
    const filterSortedTask = sorting_criteria ? sortTaskArray(sorting_criteria, filterTask) : filterTask;
    setDisplayTask(filterSortedTask);
    setFilterState("today")
  }

  const sortTaskArray = (sortBy = "dueDate", array = displayTask) => {
    let sortedArray = []
    if (sortBy === "dueDate") {
      sortedArray = [...array].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    return sortedArray;
  }
  const handelSearchTaskByName = (e) => {
    const searchValue = e.target.value.trim();
    // console.log(searchValue);
    setDisplayTask(tasks.filter((task) => task.taskName.includes(searchValue)))
  }
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      localStorage.setItem("sorting_criteria", selectedValue);
      const sortedArray = sortTaskArray(selectedValue);
      setDisplayTask(sortedArray);
    }
  }

  useEffect(() => {
    setDisplayTask(tasks)
    filterState === "all" && clearAllFilter()
    filterState === "pending" && pendingTaskFilter()
    filterState === "completed" && completedTaskFilter()
    filterState === "today" && todayTaskFilter()

  }, [tasks])
  useEffect(() => {
    if (sorting_criteria) {
      const sortedArray = sortTaskArray(sorting_criteria);
      setDisplayTask(sortedArray)
    }
  }, [])

  return (
    <div className='display-container'>
      <div className='filter-btn-container'>
        <button className={`${filterState === "all" ? "applied-filter-btn" : "filter-btn"}`} onClick={clearAllFilter}>All</button>
        <button className={`${filterState === "pending" ? "applied-filter-btn" : "filter-btn"}`} onClick={pendingTaskFilter}>Pending</button>
        <button className={`${filterState === "completed" ? "applied-filter-btn" : "filter-btn"}`} onClick={completedTaskFilter}>Completed</button>
        <button className={`${filterState === "today" ? "applied-filter-btn" : "filter-btn"}`} onClick={todayTaskFilter}>Today Task</button>
        <label>
          <span><FaSort /></span>
          <select className='sorted-criteria-select' defaultValue={sorting_criteria || "all"} onChange={handleSelectChange} >
            <option value="all" disabled >Select an option</option>
            <option value="dueDate" >Due Time</option>
          </select>
        </label>
        {/* //FIXME -  */}
        <div  className="search-bar">
          <input type="search" name="search" pattern=".*\S.*" onChange={handelSearchTaskByName} required/>
            <button className="search-btn" type="submit">
              <span>Search</span>
            </button>
        </div>
        {/* //FIXME -  */}
        {/* <input type='text' onChange={handelSearchTaskByName} /> */}
      </div>
      {
        displayTask && displayTask.map((task, index) => (
          <div key={task.id} className="task-container">
            {task.isTimeOver && <p className='time-over-cut'></p>}
            <p className='task-index'>{index + 1}</p>
            <p className='task-name'> {task.taskName}</p>
            <p className='due-date'>{task.dueDate.split("T")[0]}</p>
            <p className='due-time'>{task.dueDate.split("T")[1]}</p>
            <p className='is-done-icon-para'>{task.isDone ? <IoCheckmarkDoneCircle className='completed-icon' /> : <MdPendingActions className='pending-icon' />}</p>
            <button className='mark-complete-btn' disabled={task.isDone || task.isTimeOver} onClick={() => updateTaskCompleteStatus(task.id)} >{task.isDone ? "Completed" : "Marked as Complete"}</button>
            <p><MdDelete className='delete-btn' onClick={() => deleteATask(task.id)} /></p>
          </div>
        ))
      }
    </div>
  )
}

export default DisplayTask