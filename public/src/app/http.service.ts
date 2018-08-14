import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  constructor(private _http:HttpClient) { 

  }
  getAllTasks(){
    return this._http.get('/tasks')
  }
  getSingleTask(_id){
    return this._http.get(`/tasks/${_id}`)
  }
  deleteTask(_id){
    return this._http.delete(`/tasks/${_id}`)
  }
  createTask(newTask){
    console.log("In http service")
    return this._http.post('/tasks', newTask)
  }
  editTask(_id, taskData){
    return this._http.put(`/tasks/${_id}`, taskData)
  }
}
