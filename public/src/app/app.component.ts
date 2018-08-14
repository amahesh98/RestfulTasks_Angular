import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Restful Tasks';
  tasks=[]
  lastTask=''
  viewTask=''
  viewTaskClicked=false
  newTask:any;
  taskData:any;
  showEdit=false
  constructor(private _httpService:HttpService){
    
  }
  
  ngOnInit(){
    // this.getAllTasks()
    this.newTask = {name: '', description:''}
    this.taskData={name:'', description:'', completed:false, task_id:''}
  }

  getAllTasks(){
    console.log("Clicked")
    let tasksObservable=this._httpService.getAllTasks()
    tasksObservable.subscribe(data => {
      console.log("Got our data", data)
      this.tasks=data['tasks']
      this.lastTask=this.tasks[this.tasks.length-1]
    })
  }

  getSingleTask(_id: String){
    console.log("Clicked")
    let taskObservable=this._httpService.getSingleTask(_id)
    taskObservable.subscribe(data=>{
      console.log("Got data", data)
      this.viewTaskClicked=true
      this.viewTask=data['task']
      return data['task']
    })
  }

  createTask(){
    console.log("Creating task")
    let taskObservable=this._httpService.createTask(this.newTask)
    taskObservable.subscribe(data=>{
      console.log("Recieved response: ", data)
      this.getAllTasks()
    })
    this.newTask={name:'', description:''}
  }

  deleteTask(_id:String){
    console.log("Clicked delete")
    let taskObservable=this._httpService.deleteTask(_id)
    taskObservable.subscribe(data=>{
      console.log("Recieved response: ", data)
      this.getAllTasks()
    })
  }

  editTask(_id:String){
    console.log("Clicked edit")
    let taskObservable = this._httpService.editTask(_id, this.taskData)
    taskObservable.subscribe(data=>{
      console.log("Received response: ", data)
      if(data.success==1){
        this.showEdit=false
        this.getAllTasks()
        this.taskData={name:'', description:'', completed:false, task_id:''}
      }
    }) 
  }

  prepareForEdit(_id:String){
    this.taskData.task_id=_id
    let taskObservable=this._httpService.getSingleTask(_id)
    taskObservable.subscribe(data=>{
      console.log("Recieved data", data)
      if(data.success==1){
        this.showEdit=true
        this.taskData.name=data.task.name
        this.taskData.description=data.task.description
      }
    })
  }
}
